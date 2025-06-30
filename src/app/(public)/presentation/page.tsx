"use client";
import { useEventSettings } from "@/hooks/use-event-settings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Presentación",
  description: "Vista pública de la conferencia",
};

export default function PresentationPage() {
  const { settings, loading } = useEventSettings();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="mb-4 text-3xl font-bold">
        🎉 Bienvenido a {settings?.name || "la Conferencia"}
      </h1>
      {settings?.description && (
        <p className="mb-4 text-lg text-gray-200">{settings.description}</p>
      )}
      {settings?.date && settings?.time && (
        <p className="text-md mb-2 text-gray-300">
          {new Date(settings.date).toLocaleDateString()} a las {settings.time}
        </p>
      )}
      {settings?.location && (
        <p className="text-md mb-4 text-gray-300">{settings.location}</p>
      )}
      <p className="text-lg text-gray-400">
        Este QR es solo una vista pública. Si eres del staff, usa la app para
        escanear y registrar la asistencia.
      </p>
    </div>
  );
}
