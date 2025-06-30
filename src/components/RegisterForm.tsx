"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEventSettings } from "@/hooks/use-event-settings";
import { registerForm } from "@/lib/actions";
import { registerSchema } from "@/schemas/registerSchema";
import { useForm } from "@tanstack/react-form";
import { CheckCircle, CreditCard, Smartphone } from "lucide-react";
import { useState } from "react";

function getCurrencySymbol(code: string): string {
  switch (code.toUpperCase()) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "PEN":
      return "S/.";
    case "JPY":
      return "¥";
    default:
      return code;
  }
}

export default function RegisterForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const { settings } = useEventSettings();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      acceptTerms: false,
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await registerForm(value);
        if (res.success) {
          setIsSuccess(true);
          setCheckoutUrl(res.checkoutUrl ?? null);
          form.reset();
        } else {
          // Asignar errores a campos individuales
          Object.entries(res.error || {}).forEach(([key, messages]) => {
            form.setFieldMeta(key as keyof typeof value, (prev) => ({
              ...prev,
              errorMap: {
                ...prev.errorMap,
                onSubmit: [messages?.[0] ?? "Error de validación"],
              },
            }));
          });
        }
      } catch (error) {
        console.error("Registration error:", error);
        setFormError("Ocurrió un error al registrar. Inténtalo de nuevo.");
      }
    },
  });
  if (isSuccess && checkoutUrl) {
    return (
      <Card className="mx-auto max-w-md border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h3 className="mb-2 text-2xl font-bold text-gray-900">
            ¡Registro Exitoso!
          </h3>
          <p className="mb-6 text-gray-600">
            Te hemos enviado un email de confirmación con tu ticket digital y
            código QR.
          </p>
          <div className="mb-6 rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              <strong>Próximos pasos:</strong>
              <br />
              1. Revisa tu email para el ticket
              <br />
              2. Completa el pago para confirmar tu asistencia
              <br />
              3. ¡Nos vemos en el evento!
            </p>
          </div>
          {checkoutUrl && (
            <Button asChild className="mb-4 w-full" variant="default">
              <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
                Pagar Ahora
              </a>
            </Button>
          )}
          <Button
            onClick={() => setIsSuccess(false)}
            variant="outline"
            className="w-full"
          >
            Registrar Otro Asistente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Registration Form */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Información Personal</CardTitle>
            <CardDescription>
              Completa tus datos para registrarte al evento
            </CardDescription>
            {settings?.ticketPrice && (
              <div className="mt-2">
                <Badge variant="secondary" className="text-sm">
                  💰 Precio: {settings.ticketPrice} {settings.currency}
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void form.handleSubmit();
              }}
              className="space-y-6"
            >
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) => {
                    const result = registerSchema.shape.name.safeParse(value);
                    return result.success
                      ? undefined
                      : result.error.issues[0]?.message;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Nombre Completo *</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors ? (
                      <p className="text-sm text-red-500">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    ) : null}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    const result = registerSchema.shape.email.safeParse(value);
                    return result.success
                      ? undefined
                      : result.error.issues[0]?.message;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Email *</Label>
                    <Input
                      id={field.name}
                      type="email"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors ? (
                      <p className="text-sm text-red-500">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    ) : null}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="phone"
                validators={{
                  onChange: ({ value }) => {
                    const result = registerSchema.shape.phone.safeParse(value);
                    return result.success
                      ? undefined
                      : result.error.issues[0]?.message;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Teléfono *</Label>
                    <Input
                      id={field.name}
                      type="tel"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors ? (
                      <p className="text-sm text-red-500">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    ) : null}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="acceptTerms"
                validators={{
                  onChange: ({ value }) => {
                    const result =
                      registerSchema.shape.acceptTerms.safeParse(value);
                    return result.success
                      ? undefined
                      : result.error.issues[0]?.message;
                  },
                }}
              >
                {(field) => (
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id={field.name}
                      name={field.name}
                      checked={field.state.value}
                      onCheckedChange={(checked) => {
                        // CORREGIDO: Manejo más robusto del checkbox
                        const booleanValue = checked === true;
                        field.handleChange(booleanValue);
                      }}
                      onBlur={field.handleBlur}
                    />
                    <div className="space-y-1">
                      <Label htmlFor={field.name} className="text-sm">
                        Acepto los términos y condiciones del evento *
                      </Label>
                      {field.state.meta.errors ? (
                        <p className="text-sm text-red-500">
                          {field.state.meta.errors.join(", ")}
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}
              </form.Field>

              {formError && (
                <div className="text-sm text-red-500">{formError}</div>
              )}

              {/* Debug info - CORREGIDO para mostrar valores en tiempo real */}
              {/* <form.Subscribe
                selector={(state) => ({
                  values: state.values,
                  isSubmitting: state.isSubmitting,
                })}
              >
                {(state) => {
                  const validationResult = registerSchema.safeParse(
                    state.values,
                  );
                  const isValid = validationResult.success;

                  return (
                    <div className="rounded bg-gray-50 p-2 text-xs text-gray-500">
                      <div>Schema válido: {isValid ? "✅" : "❌"}</div>
                      <div>Valores actuales:</div>
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(state.values, null, 1)}
                      </pre>
                      <div>
                        Is Submitting: {state.isSubmitting ? "Sí" : "No"}
                      </div>
                      <div>Client Valid: {isValid ? "Sí" : "No"}</div>
                      <div>
                        Button Disabled:{" "}
                        {state.isSubmitting || !isValid ? "Sí" : "No"}
                      </div>
                      {!isValid && validationResult.error && (
                        <div>
                          Errores:{" "}
                          {validationResult.error.issues
                            .map((i) => i.message)
                            .join(", ")}
                        </div>
                      )}
                    </div>
                  );
                }}
              </form.Subscribe> */}

              <form.Subscribe
                selector={(state) => ({
                  values: state.values,
                  isSubmitting: state.isSubmitting,
                })}
              >
                {(state) => {
                  const validationResult = registerSchema.safeParse(
                    state.values,
                  );
                  const isValid = validationResult.success;

                  return (
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={state.isSubmitting || !isValid}
                    >
                      {state.isSubmitting
                        ? "Registrando..."
                        : "Registrarse Gratis"}
                    </Button>
                  );
                }}
              </form.Subscribe>

              <p className="text-center text-xs text-gray-500">
                Al registrarte, recibirás un email con tu ticket digital y
                código QR
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Pricing & Payment Info - Mismo contenido anterior */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Información del Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                  <div>
                    <h3 className="text-lg font-semibold">Entrada General</h3>
                    <p className="text-sm text-gray-600">
                      Acceso completo a ambos días
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {settings?.ticketPrice && (
                        <>
                          {getCurrencySymbol(settings.currency)}{" "}
                          {settings.ticketPrice}
                        </>
                      )}
                    </div>
                    <Badge variant="secondary">Early Bird</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Incluye:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Acceso a todas las charlas y workshops
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Almuerzo y coffee breaks
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Kit de bienvenida y merchandising
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Certificado de participación
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Acceso a networking exclusivo
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Métodos de Pago</CardTitle>
              <CardDescription>
                Después del registro, podrás completar tu pago
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 rounded-lg border p-3">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="font-medium">MercadoPago</div>
                    <div className="text-sm text-gray-500">
                      Tarjetas de crédito y débito
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 rounded-lg border p-3">
                  <Smartphone className="h-6 w-6 text-purple-600" />
                  <div>
                    <div className="font-medium">Yape</div>
                    <div className="text-sm text-gray-500">
                      Pago móvil instantáneo
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 rounded-lg border p-3">
                  <CreditCard className="h-6 w-6 text-green-600" />
                  <div>
                    <div className="font-medium">PagoEfectivo</div>
                    <div className="text-sm text-gray-500">
                      Pago en efectivo en agentes
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> Tu registro se guardará inmediatamente.
                  Tendrás 48 horas para completar el pago y confirmar tu
                  asistencia.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
