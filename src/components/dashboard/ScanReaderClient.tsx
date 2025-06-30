"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import {
  Camera,
  CheckCircle,
  Loader2,
  QrCode,
  Ticket,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

type LastScan = {
  status: "valid" | "invalid";
  ticketId: string | null;
  userName: string;
  userEmail: string;
  alreadyCheckedIn: boolean;
  eventName: string | null;
  scanTime: string;
};

export default function ScanReaderClient() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [lastScan, setLastScan] = useState<LastScan | null>(null);
  const [stats, setStats] = useState<{
    totalTickets: number;
    totalCheckedIn: number;
    checkInsToday: number;
    totalInvalid: number;
    attendanceRate: number;
  } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    };
    fetchStats();
  }, []);

  const extractToken = (input: string): string | null => {
    try {
      if (input.startsWith("http")) {
        const url = new URL(input);
        return url.searchParams.get("token");
      }
      return input;
    } catch {
      return input;
    }
  };

  // Verificar escaneo
  const verifyScan = async (value: string, mode: "qr" | "manual") => {
    setLoading(true);
    try {
      const param = mode === "qr" ? "token" : "code";
      const res = await fetch(`/scan?${param}=${encodeURIComponent(value)}`);
      const json = await res.json();
      const now = new Date().toISOString();

      switch (json.status) {
        case "success":
          setMessage(`✅ Asistencia registrada: ${json.user.name}`);
          setIsSuccess(true);
          setLastScan({
            status: "valid",
            ticketId: json.ticket.id,
            userName: json.user.name,
            userEmail: json.user.email,
            alreadyCheckedIn: false,
            eventName: "Conferencia 2025",
            scanTime: now,
          });
          break;

        case "already_checked_in":
          setMessage(`⚠️ Ya registrado: ${json.user.name}`);
          setIsSuccess(null);
          setLastScan({
            status: "valid",
            ticketId: json.ticket.id,
            userName: json.user.name,
            userEmail: json.user.email,
            alreadyCheckedIn: true,
            eventName: "Conferencia 2025",
            scanTime: now,
          });
          break;

        case "invalid":
          setMessage("❌ Ticket inválido");
          setIsSuccess(false);
          setLastScan({
            status: "invalid",
            ticketId: null,
            userName: "-",
            userEmail: "-",
            alreadyCheckedIn: false,
            eventName: null,
            scanTime: now,
          });
          break;

        default:
          setMessage(json.message || "Error desconocido");
          setIsSuccess(false);
          setLastScan(null);
      }

      setPaused(true);
    } catch {
      setMessage("❌ No se pudo verificar el código");
      setIsSuccess(false);
      setLastScan(null);
    } finally {
      setLoading(false);
    }
  };

  // Modo QR
  const handleDecode = async (detected: IDetectedBarcode[]) => {
    const rawValue = detected[0]?.rawValue;
    if (!rawValue) return;

    const token = extractToken(rawValue);
    if (!token) {
      setMessage("Formato de QR no válido");
      setIsSuccess(false);
      return;
    }

    setPaused(true);
    await verifyScan(token, "qr");
  };

  // Modo manual
  const handleManualScan = async () => {
    if (!manualCode.trim().startsWith("TK-")) {
      setMessage("Formato de código manual no válido (TK-XXX)");
      setIsSuccess(false);
      return;
    }

    setPaused(true);
    await verifyScan(manualCode.trim(), "manual");
    setManualCode("");
  };

  const resetScan = () => {
    setMessage(null);
    setIsSuccess(null);
    setPaused(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
            Escáner de Asistencia
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
            Registra la asistencia escaneando códigos QR o ingresando códigos
            manualmente
          </p>
        </div>

        {/* Main Scanner Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Escáner con cámara */}
          <Card className="overflow-hidden border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-slate-800/80">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 py-6 text-white dark:from-blue-700 dark:to-blue-800">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="rounded-full bg-white/20 p-2">
                  <Camera className="h-6 w-6" />
                </div>
                Escáner QR
              </CardTitle>
              <CardDescription className="text-blue-100">
                Escanea un código QR para registrar asistencia automáticamente
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              <div className="relative aspect-square overflow-hidden rounded-xl border-4 border-slate-200 bg-slate-900 shadow-inner dark:border-slate-700">
                <Scanner
                  onScan={handleDecode}
                  onError={(err) => console.error(err)}
                  constraints={{ facingMode: "environment" }}
                  formats={["qr_code"]}
                  paused={paused}
                  sound
                  classNames={{
                    container: "w-full h-full",
                    video: "w-full h-full object-cover",
                  }}
                />
                {paused && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="rounded-lg bg-white p-4 text-center dark:bg-slate-800">
                      <QrCode className="mx-auto mb-2 h-12 w-12 text-slate-600 dark:text-slate-300" />
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Escáner pausado
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {loading && (
                <div className="flex items-center justify-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-blue-700 dark:text-blue-300">
                    Verificando código QR...
                  </span>
                </div>
              )}

              {message && (
                <Alert
                  variant={isSuccess ? "default" : "destructive"}
                  className="border-2"
                >
                  {isSuccess ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <AlertDescription className="text-base font-medium">
                    {message}
                  </AlertDescription>
                </Alert>
              )}

              {paused && (
                <Button
                  onClick={resetScan}
                  className="h-12 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-base font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900"
                  variant="default"
                >
                  <QrCode className="mr-2 h-5 w-5" />
                  Escanear otro código
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Manual Input & Instructions */}
          <div className="space-y-6">
            {/* Entrada Manual */}
            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-slate-800/80">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-6 text-white dark:from-emerald-700 dark:to-emerald-800">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="rounded-full bg-white/20 p-2">
                    <QrCode className="h-6 w-6" />
                  </div>
                  Entrada Manual
                </CardTitle>
                <CardDescription className="text-emerald-100">
                  Ingresa manualmente el código del ticket
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-3">
                  <Input
                    placeholder="Ingresa el código del ticket (ej: TK-001)"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleManualScan()}
                    className="h-12 border-2 border-slate-200 text-base focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                  <Button
                    onClick={handleManualScan}
                    className="h-12 w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-base font-semibold text-white shadow-lg hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-700 dark:to-emerald-800 dark:hover:from-emerald-800 dark:hover:to-emerald-900"
                  >
                    <Ticket className="mr-2 h-5 w-5" />
                    Verificar Ticket
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Instrucciones */}
            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-slate-800/80">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 py-6 text-white dark:from-purple-700 dark:to-purple-800">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="rounded-full bg-white/20 p-2">
                    <QrCode className="h-5 w-5" />
                  </div>
                  Instrucciones
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Cómo utilizar el escáner para registrar asistencia
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-purple-100 p-1 dark:bg-purple-900">
                      <div className="h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400"></div>
                    </div>
                    <span>Apunta la cámara al código QR del asistente.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-purple-100 p-1 dark:bg-purple-900">
                      <div className="h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400"></div>
                    </div>
                    <span>Espera la confirmación visual y sonora.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-purple-100 p-1 dark:bg-purple-900">
                      <div className="h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400"></div>
                    </div>
                    <span>
                      Si el código es válido, se registra la asistencia.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-purple-100 p-1 dark:bg-purple-900">
                      <div className="h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400"></div>
                    </div>
                    <span>
                      Puedes escanear otro código al presionar el botón.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Resultado del último escaneo */}
        {lastScan && (
          <Card className="overflow-hidden border-0 bg-white/90 shadow-xl backdrop-blur-sm dark:bg-slate-800/90">
            <CardHeader
              className={`text-white ${lastScan.status === "valid" ? "bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800" : "bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800"}`}
            >
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="rounded-full bg-white/20 p-2">
                  {lastScan.status === "valid" ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <XCircle className="h-6 w-6" />
                  )}
                </div>
                Resultado del Escaneo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
                    <div className="rounded-full bg-slate-200 p-2 dark:bg-slate-700">
                      <Ticket className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </div>
                    <div>
                      <span className="text-sm font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                        Ticket
                      </span>
                      <div className="mt-1">
                        <Badge
                          variant="outline"
                          className="border-slate-200 px-3 py-1 text-base dark:border-slate-700"
                        >
                          {lastScan.ticketId}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
                    <div className="rounded-full bg-slate-200 p-2 dark:bg-slate-700">
                      <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </div>
                    <div>
                      <span className="text-sm font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                        Asistente
                      </span>
                      <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                        {lastScan.userName}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {lastScan.userEmail}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
                    <div>
                      <span className="text-sm font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                        Estado
                      </span>
                      <div className="mt-2">
                        {lastScan.status === "valid" ? (
                          <Badge className="bg-green-100 px-4 py-2 text-base text-green-800 dark:bg-green-900 dark:text-green-200">
                            Válido
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 px-4 py-2 text-base text-red-800 dark:bg-red-900 dark:text-red-200">
                            Inválido
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
                    <div>
                      <span className="text-sm font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                        Check-in
                      </span>
                      <div className="mt-2">
                        {lastScan.alreadyCheckedIn ? (
                          <Badge className="bg-yellow-100 px-4 py-2 text-base text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Ya registrado
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-100 px-4 py-2 text-base text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Registrado ahora
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
                    <div>
                      <span className="text-sm font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                        Hora
                      </span>
                      <div className="mt-1 font-medium text-slate-700 dark:text-slate-300">
                        {new Date(lastScan.scanTime).toLocaleString("es")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {lastScan.status === "valid" && !lastScan.alreadyCheckedIn && (
                <div className="mt-8 rounded-xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6 dark:border-green-800 dark:from-green-900/20 dark:to-emerald-900/20">
                  <div className="mb-2 flex items-center gap-3 text-green-800 dark:text-green-200">
                    <CheckCircle className="h-6 w-6" />
                    <span className="text-lg font-bold">
                      ¡Check-in exitoso!
                    </span>
                  </div>
                  <p className="text-base text-green-700 dark:text-green-300">
                    {lastScan.userName} ha sido registrado correctamente para{" "}
                    {lastScan.eventName}
                  </p>
                </div>
              )}

              {lastScan.alreadyCheckedIn && (
                <div className="mt-8 rounded-xl border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-6 dark:border-yellow-800 dark:from-yellow-900/20 dark:to-orange-900/20">
                  <div className="mb-2 flex items-center gap-3 text-yellow-800 dark:text-yellow-200">
                    <XCircle className="h-6 w-6" />
                    <span className="text-lg font-bold">Ya registrado</span>
                  </div>
                  <p className="text-base text-yellow-700 dark:text-yellow-300">
                    Este ticket ya fue utilizado para el check-in anteriormente
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg transition-all duration-300 hover:shadow-xl dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-3 rounded-full bg-green-100 p-3 dark:bg-green-900">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="mb-1 text-3xl font-bold text-green-700 dark:text-green-300">
                {stats?.checkInsToday ?? "--"}
              </div>
              <div className="text-sm font-medium tracking-wide text-green-600 uppercase dark:text-green-400">
                Check-ins hoy
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg transition-all duration-300 hover:shadow-xl dark:from-blue-900/20 dark:to-cyan-900/20">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-3 rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                <Ticket className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="mb-1 text-3xl font-bold text-blue-700 dark:text-blue-300">
                {stats?.totalTickets ?? "--"}
              </div>
              <div className="text-sm font-medium tracking-wide text-blue-600 uppercase dark:text-blue-400">
                Tickets vendidos
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-red-50 to-pink-50 shadow-lg transition-all duration-300 hover:shadow-xl dark:from-red-900/20 dark:to-pink-900/20">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-3 rounded-full bg-red-100 p-3 dark:bg-red-900">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div className="mb-1 text-3xl font-bold text-red-700 dark:text-red-300">
                {stats?.totalInvalid ?? "--"}
              </div>
              <div className="text-sm font-medium tracking-wide text-red-600 uppercase dark:text-red-400">
                Tickets inválidos
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg transition-all duration-300 hover:shadow-xl dark:from-purple-900/20 dark:to-indigo-900/20">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-3 rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                <User className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="mb-1 text-3xl font-bold text-purple-700 dark:text-purple-300">
                {stats ? `${stats.attendanceRate}%` : "--"}
              </div>
              <div className="text-sm font-medium tracking-wide text-purple-600 uppercase dark:text-purple-400">
                Tasa asistencia
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
