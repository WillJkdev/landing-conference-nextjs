"use client";

import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";

export default function ScannerClient() {
  const [message, setMessage] = useState("");
  const [paused, setPaused] = useState(false);
  const extractToken = (input: string): string | null => {
    try {
      // Si es una URL completa, intenta extraer el parámetro 'token'
      if (input.startsWith("http")) {
        const url = new URL(input);
        return url.searchParams.get("token");
      }

      // Si es solo el token, devuélvelo directamente
      return input;
    } catch {
      return input;
    }
  };

  const handleDecode = async (detected: IDetectedBarcode[]) => {
    const rawValue = detected[0]?.rawValue;
    if (!rawValue) return;

    const token = extractToken(rawValue);
    if (!token) {
      setMessage("❌ Formato de QR no válido");
      return;
    }
    try {
      const res = await fetch(`/scan?token=${encodeURIComponent(token)}`);
      const json = await res.json();

      if (res.ok) {
        setMessage(`✅ Asistencia registrada: ${json.user}`);
        setPaused(true);
      } else {
        setMessage(`❌ ${json.error || "Error desconocido"}`);
      }
    } catch {
      setMessage("❌ No se pudo verificar el QR");
    }
  };

  return (
    <div className="p-4 text-center">
      <Scanner
        onScan={handleDecode}
        onError={(err) => console.error(err)}
        constraints={{ facingMode: "environment" }}
        formats={["qr_code"]}
        paused={paused}
        sound={true}
        classNames={{
          container: "rounded-xl overflow-hidden shadow-lg",
          video: "w-full h-auto",
        }}
      />

      {message && <p className="mt-4">{message}</p>}

      {paused && (
        <button
          onClick={() => {
            setMessage("");
            setPaused(false);
          }}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Escanear otro
        </button>
      )}
    </div>
  );
}
