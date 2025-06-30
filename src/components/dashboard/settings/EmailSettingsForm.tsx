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
import { EmailSettings } from "@/generated/prisma";
import { updateEmailSettings } from "@/lib/actions";
import { UpdateEmailSettingsState } from "@/types/SettingsType";
import { Loader2, Mail, Save } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

interface Props {
  emailSettings: EmailSettings | null;
}

export default function EmailSettingsForm({ emailSettings }: Props) {
  const [state, formAction, isPending] = useActionState<
    UpdateEmailSettingsState,
    FormData
  >(updateEmailSettings, { success: false, message: "" });
  const defaultEmailSettings = {
    senderName: emailSettings?.senderName || "ConferenceApp Team",
    senderEmail: emailSettings?.senderEmail || "noreply@conferenceapp.com",
    replyToEmail: emailSettings?.replyToEmail || "support@conferenceapp.com",
    enableReminders: emailSettings?.enableReminders ?? true,
    reminderDays: emailSettings?.reminderDays || 1,
  };
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Configuración de Emails
        </CardTitle>
        <CardDescription>Personaliza los emails automáticos</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="senderName">Nombre del Remitente</Label>
              <Input
                id="senderName"
                name="senderName"
                defaultValue={defaultEmailSettings.senderName}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderEmail">Email del Remitente</Label>
              <Input
                id="senderEmail"
                name="senderEmail"
                type="email"
                defaultValue={defaultEmailSettings.senderEmail}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="replyToEmail">Email de Respuesta</Label>
              <Input
                id="replyToEmail"
                name="replyToEmail"
                type="email"
                defaultValue={defaultEmailSettings.replyToEmail}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminderDays">Días para Recordatorio</Label>
              <Input
                id="reminderDays"
                name="reminderDays"
                type="number"
                defaultValue={defaultEmailSettings.reminderDays}
                required
              />
            </div>
          </div>
          <SwitchField
            id="enableReminders"
            name="enableReminders"
            label="Enviar recordatorios automáticos"
            defaultChecked={defaultEmailSettings.enableReminders}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Guardar Emails
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
