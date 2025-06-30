"use client";
import { SwitchField } from "@/components/dashboard/settings/SwitchField";
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
import { SecuritySettings as SecuritySettingsType } from "@/generated/prisma";
import { updateSecuritySettings } from "@/lib/actions";
import { UpdateSecuritySettingsState } from "@/types/SettingsType";
import { Loader2, Save, Shield } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
interface Props {
  securitySettings: SecuritySettingsType | null;
}

export default function SecuritySettings({ securitySettings }: Props) {
  const [state, formAction, isPending] = useActionState<
    UpdateSecuritySettingsState,
    FormData
  >(updateSecuritySettings, { success: false, message: "" });
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);
  const defaultSecuritySettings = {
    requireEmailVerification:
      securitySettings?.requireEmailVerification ?? true,
    enableTwoFactor: securitySettings?.enableTwoFactor ?? false,
    sessionTimeout: securitySettings?.sessionTimeout || 24,
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Seguridad y Acceso
        </CardTitle>
        <CardDescription>
          Configuración de seguridad del dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <SwitchField
            id="requireEmailVerification"
            name="requireEmailVerification"
            label="Requerir verificación de email"
            defaultChecked={defaultSecuritySettings.requireEmailVerification}
          />
          <SwitchField
            id="enableTwoFactor"
            name="enableTwoFactor"
            label="Autenticación de dos factores"
            defaultChecked={defaultSecuritySettings.enableTwoFactor}
          />
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Tiempo de sesión (horas)</Label>
            <Input
              id="sessionTimeout"
              name="sessionTimeout"
              type="number"
              defaultValue={defaultSecuritySettings.sessionTimeout}
              className="w-32"
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Guardar Seguridad
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
