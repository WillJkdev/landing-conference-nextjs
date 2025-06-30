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
import { UrlSettings } from "@/generated/prisma";
import { updateUrlSettings } from "@/lib/actions";
import { UpdateUrlSettingsState } from "@/types/SettingsType";
import { Globe, Save } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  urlSettings: UrlSettings | null;
}

export default function UrlSettingsForm({ urlSettings }: Props) {
  const [state, formAction, isPending] = useActionState<
    UpdateUrlSettingsState,
    FormData
  >(updateUrlSettings, { success: false, message: "" });

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  // Estado local del website
  const [websiteUrl, setWebsiteUrl] = useState(
    urlSettings?.websiteUrl || "https://conferenceapp.com",
  );

  // Derivar las URLs dependientes
  const confirmationUrl = `${websiteUrl.replace(/\/$/, "")}/confirmation`;
  const presentationUrl = `${websiteUrl.replace(/\/$/, "")}/presentation`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          URLs y Enlaces
        </CardTitle>
        <CardDescription>
          Configura las URLs importantes de tu plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {/* Campo solo lectura: Confirmación */}
          <div className="space-y-2">
            <Label htmlFor="confirmationUrl">URL de Confirmación</Label>
            <Input
              id="confirmationUrl"
              name="confirmationUrl"
              type="url"
              value={confirmationUrl}
              readOnly
              required
            />
          </div>

          {/* Campo solo lectura: Presentación */}
          <div className="space-y-2">
            <Label htmlFor="presentationUrl">URL de Presentación</Label>
            <Input
              id="presentationUrl"
              name="presentationUrl"
              type="url"
              value={presentationUrl}
              readOnly
              required
            />
          </div>

          {/* Campo editable: Sitio web */}
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Sitio Web Principal</Label>
            <Input
              id="websiteUrl"
              name="websiteUrl"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              <Save className="mr-2 h-4 w-4" />
              {isPending ? "Guardando..." : "Guardar URLs"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
