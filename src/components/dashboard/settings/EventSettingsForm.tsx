"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, ImageIcon, Save, Upload } from "lucide-react";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventSettings } from "@/generated/prisma";
import { updateEventSettings } from "@/lib/actions";
import type { UpdateEventSettingsState } from "@/types/SettingsType";
import Image from "next/image";
import { useRef, useState } from "react";

type Props = {
  eventSettings: EventSettings | null;
};
const currencies = [
  { code: "USD", name: "Dólar estadounidense", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "PEN", name: "Sol peruano", symbol: "S/" },
  { code: "GBP", name: "Libra esterlina", symbol: "£" },
  { code: "JPY", name: "Yen japonés", symbol: "¥" },
  { code: "BRL", name: "Real brasileño", symbol: "R$" },
];
export default function EventSettingsForm({ eventSettings }: Props) {
  const [logoUrl, setLogoUrl] = useState(eventSettings?.logoUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [state, formAction, isPending] = useActionState<
    UpdateEventSettingsState,
    FormData
  >(updateEventSettings, { success: false, message: "" });

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  const defaultEventSettings = {
    name: eventSettings?.name || "ConferenceApp 2024",
    date: eventSettings?.date
      ? eventSettings.date.toISOString().split("T")[0]
      : "2024-02-15",
    time: eventSettings?.time || "09:00",
    location: eventSettings?.location || "Centro de Convenciones Madrid",
    description:
      eventSettings?.description ||
      "La conferencia más importante del año sobre tecnología y innovación.",
    maxAttendees: eventSettings?.maxAttendees || 1500,
    ticketPrice: eventSettings?.ticketPrice || 50,
    currency: eventSettings?.currency || "EUR",
    durationDays: eventSettings?.durationDays || 1,
  };

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir la imagen");

      const data = await res.json();
      console.log(data);
      setLogoUrl(data.url);
      toast.success("Logo subido correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al subir el logo");
    } finally {
      setIsUploading(false);
    }
  }

  const getCurrencySymbol = (currency: string) => {
    const currencyData = currencies.find((c) => c.code === currency);
    return currencyData ? currencyData.symbol : "";
  };
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Información del Evento
          </CardTitle>
          <CardDescription>
            Configuración básica de tu conferencia o evento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Evento</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={defaultEventSettings.name}
                  required
                  autoComplete="organization"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={defaultEventSettings.location}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={defaultEventSettings.date}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Hora</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  defaultValue={defaultEventSettings.time}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationDays">Duración del evento</Label>
                <Input
                  id="durationDays"
                  name="durationDays"
                  type="number"
                  defaultValue={defaultEventSettings.durationDays}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAttendees">Máximo Asistentes</Label>
                <Input
                  id="maxAttendees"
                  name="maxAttendees"
                  type="number"
                  defaultValue={defaultEventSettings.maxAttendees}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticketPrice">
                  Precio Ticket (
                  {getCurrencySymbol(defaultEventSettings.currency)})
                </Label>
                <Input
                  id="ticketPrice"
                  name="ticketPrice"
                  type="number"
                  step="0.01"
                  defaultValue={defaultEventSettings.ticketPrice}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={defaultEventSettings.description}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <span className="text-foreground text-sm font-medium">
                Moneda
              </span>
              <Select
                name="currency"
                defaultValue={defaultEventSettings.currency}
              >
                <SelectTrigger aria-label="Moneda">
                  <SelectValue placeholder="Selecciona una moneda" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name} ({curr.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                <Save className="mr-2 h-4 w-4" />
                {isPending ? "Guardando..." : "Guardar Evento"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Logo y Branding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Logo y Branding
          </CardTitle>
          <CardDescription>Personaliza la imagen de tu evento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="bg-muted flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt="Logo"
                  className="h-full w-full object-cover"
                  width={80}
                  height={80}
                  priority
                />
              ) : (
                <ImageIcon className="text-muted-foreground h-8 w-8" />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo-upload">Logo de la Conferencia</Label>
              <div className="flex gap-2">
                <input
                  id="logo-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <svg
                        className="text-muted-foreground mr-2 h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a10 10 0 00-10 10h4z"
                        />
                      </svg>
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Subir Logo
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/upload-image", {
                        method: "DELETE",
                      });

                      if (!res.ok) throw new Error("Error al eliminar el logo");

                      setLogoUrl("");
                      toast.success("Logo eliminado");
                    } catch (err) {
                      console.error(err);
                      toast.error("Error al eliminar el logo");
                    }
                  }}
                >
                  Eliminar
                </Button>
              </div>
              <p className="text-muted-foreground text-sm">
                Recomendado: 200x200px, formato PNG o JPG
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
