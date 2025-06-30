import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { prisma } from "@/lib/prisma";
import { BarChart, FileText, Mail } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reportes",
  description: "Visualiza métricas importantes del sistema",
};

export default async function ReportsPage() {
  // Obtener estadísticas de emails
  const emailStats = await prisma.emailEvent.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  });

  // Obtener estadísticas de tickets
  const ticketStats = await prisma.ticket.aggregate({
    _count: {
      _all: true,
    },
  });

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
              <BreadcrumbPage>Reportes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Reportes y Estadísticas
          </h1>
          <p className="text-muted-foreground">
            Visualiza métricas importantes del sistema
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Resumen de Emails */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Emails
              </CardTitle>
              <CardDescription>Estado de envíos de correo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {emailStats.map((stat) => (
                  <div key={stat.status} className="flex justify-between">
                    <span className="capitalize">
                      {stat.status.replace("email.", "")}
                    </span>
                    <span className="font-medium">{stat._count.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resumen de Tickets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Tickets
              </CardTitle>
              <CardDescription>Resumen de tickets generados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span>Total de tickets</span>
                <span className="text-2xl font-bold">
                  {ticketStats._count._all}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Gráficos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Tendencias
              </CardTitle>
              <CardDescription>Visualización de métricas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Próximamente: Gráficos de tendencias
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
}
