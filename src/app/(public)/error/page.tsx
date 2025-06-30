import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Error en el pago",
  description:
    "Ocurrió un problema al procesar tu pago. Por favor, intenta nuevamente o contáctenos.",
};

export default function ErrorPage() {
  return (
    <div className="bg-muted flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md border-red-500 text-center shadow-lg">
        <CardHeader>
          <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
          <CardTitle className="mt-4 text-xl font-semibold text-red-700">
            Error en el pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Ocurrió un problema al procesar tu pago. Por favor, intenta
            nuevamente o contáctenos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
