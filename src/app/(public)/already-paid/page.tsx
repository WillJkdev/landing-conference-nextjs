import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pago ya realizado",
  description:
    "Ya hemos recibido tu pago correctamente. No es necesario volver a intentarlo.",
};

export default function AlreadyPaid() {
  return (
    <div className="bg-muted flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md border-green-500 text-center shadow-lg">
        <CardHeader>
          <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
          <CardTitle className="mt-4 text-xl font-semibold text-green-700">
            Pago ya realizado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Ya hemos recibido tu pago correctamente. No es necesario volver a
            intentarlo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
