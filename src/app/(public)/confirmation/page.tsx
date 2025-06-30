import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Confirmación de pago",
  description:
    "Gracias por tu compra. Tu ticket ha sido validado exitosamente.",
};

export default function ConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          ¡Pago confirmado!
        </h1>
        <p className="mb-4 text-gray-600">
          Gracias por tu compra. Tu ticket ha sido validado exitosamente.
        </p>
        <div className="mb-6 rounded-lg border border-green-100 bg-green-50 p-4 text-sm text-green-800">
          Revisa tu correo para descargar el ticket con tu código QR.
        </div>
        <Link href="/">
          <Button className="w-full">Volver al inicio</Button>
        </Link>
      </div>
    </div>
  );
}
