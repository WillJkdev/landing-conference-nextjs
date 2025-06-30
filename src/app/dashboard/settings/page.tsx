import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Key, RefreshCw, Upload } from "lucide-react";

import { getSettings } from "@/lib/actions";

import AdminList from "@/components/dashboard/settings/AdminList";
import ApiKeysDashboard from "@/components/dashboard/settings/ApiKeyPanel";
import EmailSettingsForm from "@/components/dashboard/settings/EmailSettingsForm";
import EventSettingsForm from "@/components/dashboard/settings/EventSettingsForm";
import SecuritySettings from "@/components/dashboard/settings/SecuritySettings";
import UrlSettingsForm from "@/components/dashboard/settings/UrlSettingsForm";
import { SecureApiManager } from "@/lib/api-manager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuración",
  description: "Gestiona los parámetros de tu evento y plataforma",
};

export default async function SettingsPage() {
  const {
    eventSettings,
    urlSettings,
    emailSettings,
    securitySettings,
    admins,
  } = await getSettings();
  const apiKeys = await SecureApiManager.getApiKeysInfo();

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Configuración</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">
            Gestiona los parámetros de tu evento y plataforma
          </p>
        </div>

        <div className="grid gap-6">
          {/* Event Settings */}
          <EventSettingsForm eventSettings={eventSettings} />

          {/* URLs y Enlaces */}
          <UrlSettingsForm urlSettings={urlSettings} />

          {/* Configuración de Emails */}
          <EmailSettingsForm emailSettings={emailSettings} />

          {/* Seguridad */}
          <SecuritySettings securitySettings={securitySettings} />

          {/* Administradores */}
          <AdminList admins={admins} />

          {/* API Keys */}
          <ApiKeysDashboard apiKeys={apiKeys} />

          {/* Herramientas Avanzadas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Herramientas Avanzadas
              </CardTitle>
              <CardDescription>
                Opciones avanzadas y regeneración de claves
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Button variant="outline" type="button">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerar API Keys
                </Button>
                <Button variant="outline" type="button">
                  <Key className="mr-2 h-4 w-4" />
                  Regenerar Tokens QR
                </Button>
                <Button variant="outline" type="button">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Limpiar Cache
                </Button>
                <Button variant="outline" type="button">
                  <Upload className="mr-2 h-4 w-4" />
                  Exportar Configuración
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
}
