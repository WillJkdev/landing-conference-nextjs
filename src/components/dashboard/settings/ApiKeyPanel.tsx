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
import {
  AlertTriangle,
  CheckCircle,
  Cloud,
  CreditCard,
  Eye,
  EyeOff,
  Key,
  Mail,
  Map,
  RefreshCw,
  Shield,
  Webhook,
  XCircle,
} from "lucide-react";

import { useState } from "react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  type: string;
  isActive: boolean;
  lastUsedAt: Date | null;
  expiresAt: Date | null;
  partialKey: string;
  status: "healthy" | "expired" | "inactive";
  icon?: React.ElementType;
}
const typeIcons: Record<string, React.ElementType> = {
  email: Mail,
  webhook: Webhook,
  payment: CreditCard,
  maps: Map,
  storage: Cloud,
  auth: Shield,
};

interface Props {
  apiKeys: ApiKey[];
}

export default function ApiKeysDashboard({ apiKeys }: Props) {
  const [showPartial, setShowPartial] = useState<Record<string, boolean>>({});

  const toggleShowPartial = (keyId: string) => {
    setShowPartial((prev) => ({
      ...prev,
      [keyId]: !prev[keyId],
    }));
  };

  const getStatusIcon = (status: ApiKey["status"]) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "expired":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "inactive":
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (
    status: ApiKey["status"],
  ): "default" | "secondary" | "destructive" | "outline" => {
    const variants: Record<
      ApiKey["status"],
      "default" | "secondary" | "destructive" | "outline"
    > = {
      healthy: "default",
      expired: "destructive",
      inactive: "outline",
    };
    return variants[status] ?? "outline";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Estado de API Keys
        </CardTitle>
        <CardDescription>
          Monitoreo de las claves API configuradas. Solo se muestra información
          parcial para identificación.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Seguridad:</strong> Las claves reales están protegidas en
            variables de entorno. Solo se muestran referencias parciales.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4">
          {apiKeys.map((apiKey) => {
            const IconComponent = typeIcons[apiKey.type] || Key;

            return (
              <div
                key={apiKey.id}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                {/* Icono + contenido */}
                <div className="flex flex-1 items-center gap-4">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <IconComponent className="text-primary h-5 w-5" />
                  </div>

                  {/* Contenido */}
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-medium">{apiKey.name}</span>
                      <Badge variant={apiKey.isActive ? "default" : "outline"}>
                        {apiKey.isActive ? "Activa" : "Inactiva"}
                      </Badge>
                      <Badge variant={getStatusBadge(apiKey.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(apiKey.status)}
                          {apiKey.status}
                        </span>
                      </Badge>
                    </div>

                    <div className="text-muted-foreground mb-2 text-sm">
                      {/* Puedes agregar descripción aquí si tienes */}
                      Clave para el servicio {apiKey.type}
                    </div>

                    <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <span>Referencia:</span>
                        <code className="bg-muted rounded px-1 py-0.5 text-xs">
                          {showPartial[apiKey.id]
                            ? apiKey.partialKey
                            : "****-****-****-****"}
                        </code>
                        <button
                          type="button"
                          onClick={() => toggleShowPartial(apiKey.id)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          {showPartial[apiKey.id] ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                      <span>Tipo: {apiKey.type}</span>
                      {apiKey.lastUsedAt && (
                        <span>
                          Último uso:{" "}
                          {new Date(apiKey.lastUsedAt).toLocaleDateString()}
                        </span>
                      )}
                      {apiKey.expiresAt && (
                        <span>
                          Expira:{" "}
                          {new Date(apiKey.expiresAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      alert(`Regenerar ${apiKey.name} en variables de entorno`)
                    }
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Regenerar
                  </Button>
                  <Button
                    onClick={() => alert(`Ver logs de ${apiKey.name}`)}
                    variant="outline"
                    size="sm"
                  >
                    Logs
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
          <h4 className="mb-2 font-medium text-blue-900 dark:text-blue-100">
            📋 Configuración de API Keys
          </h4>
          <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <p>
              <strong>Variables de entorno detectadas:</strong> {apiKeys.length}
            </p>
            <p>
              <strong>APIs activas:</strong>{" "}
              {apiKeys.filter((k) => k.isActive).length}
            </p>
            <p>
              <strong>Estado general:</strong>{" "}
              <span className="font-medium text-green-600">
                {apiKeys.every((k) => k.status === "healthy")
                  ? "Todas las APIs operativas"
                  : "Hay APIs con errores"}
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
