import SalesChart from "@/components/SalesChart";
import { Badge } from "@/components/ui/badge";
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
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow, formatISO, startOfDay, subDays } from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarDays,
  DollarSign,
  QrCode,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react";

export default async function DashboardPage() {
  const settings = await prisma.eventSettings.findFirst();
  const today = startOfDay(new Date());
  const last7Days = Array.from({ length: 7 }).map((_, i) =>
    formatISO(subDays(today, 6 - i), { representation: "date" }),
  );

  const [
    totalTickets,
    registeredUsers,
    checkedIn,
    revenue,
    recentTickets,
    rawTickets,
  ] = await Promise.all([
    prisma.ticket.count(),
    prisma.user.count(),
    prisma.ticket.count({ where: { checkedIn: true } }),
    prisma.ticket.aggregate({
      _sum: { amount: true },
    }),
    prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: true },
    }),
    prisma.ticket.findMany({
      where: {
        createdAt: {
          gte: subDays(today, 6),
        },
      },
      select: {
        createdAt: true,
      },
    }),
  ]);

  const stats = {
    totalTickets,
    registeredUsers,
    checkedIn,
    revenue: revenue._sum.amount || 0,
    daysToEvent: 7, // puedes calcularlo si tienes la fecha del evento
  };

  const recentActivity = recentTickets.map((ticket) => {
    let action = "Nuevo registro";
    if (ticket.paid && ticket.paidAt) {
      action = "Pago confirmado";
    } else if (ticket.checkedIn) {
      action = "Check-in realizado";
    }
    return {
      id: ticket.id,
      action,
      user: ticket.user.name,
      time: formatDistanceToNow(ticket.createdAt, {
        addSuffix: true,
        locale: es,
      }),
    };
  });

  const salesByDay = last7Days.map((dateStr) => {
    const count = rawTickets.filter((ticket) =>
      ticket.createdAt.toISOString().startsWith(dateStr),
    ).length;

    return {
      date: dateStr,
      count,
    };
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
              <BreadcrumbPage>Panel General</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Panel General</h1>
            <p className="text-muted-foreground">
              Resumen del estado actual de tu evento
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              <CalendarDays className="mr-1 h-4 w-4" />
              {stats.daysToEvent} días restantes
            </Badge>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tickets Vendidos
              </CardTitle>
              <Ticket className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalTickets.toLocaleString()}
              </div>
              <p className="text-muted-foreground text-xs">
                <span className="text-green-600">+12%</span> desde ayer
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos Totales
              </CardTitle>
              <DollarSign className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.revenue.toLocaleString()}
              </div>
              <p className="text-muted-foreground text-xs">
                <span className="text-green-600">+8%</span> desde la semana
                pasada
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Usuarios Registrados
              </CardTitle>
              <Users className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.registeredUsers.toLocaleString()}
              </div>
              <p className="text-muted-foreground text-xs">
                <span className="text-blue-600">94.6%</span> de conversión
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Check-ins Realizados
              </CardTitle>
              <QrCode className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.checkedIn.toLocaleString()}
              </div>
              <p className="text-muted-foreground text-xs">
                <span className="text-orange-600">75.6%</span> de asistencia
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Gráfico de ventas */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Ventas por Día</CardTitle>
              <CardDescription>
                Evolución de las ventas en los últimos 7 días
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <SalesChart data={salesByDay} />
            </CardContent>
          </Card>

          {/* Actividad reciente */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                Últimas acciones en la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4"
                  >
                    <div className="bg-primary h-2 w-2 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm leading-none font-medium">
                        {activity.action}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {activity.user}
                      </p>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Herramientas frecuentemente utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">
                <QrCode className="mr-2 h-4 w-4" />
                Abrir Escáner QR
              </Button>
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Exportar Asistentes
              </Button>
              <Button variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Ver Reportes
              </Button>
              <Button variant="outline">
                <Ticket className="mr-2 h-4 w-4" />
                Generar Tickets
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Información del evento */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Evento</CardTitle>
            <CardDescription>Detalles del evento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <CalendarDays className="mr-2 h-4 w-4" />
                <span className="text-sm">
                  {settings?.date && settings?.time && (
                    <>
                      {new Date(settings.date).toLocaleDateString()} a las{" "}
                      {settings.time}
                    </>
                  )}
                </span>
              </div>
              {/* duración de evento */}
              <div className="flex items-center space-x-4">
                <CalendarDays className="mr-2 h-4 w-4" />
                <span className="text-sm">
                  {settings?.durationDays || "Duración del evento"}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <QrCode className="mr-2 h-4 w-4" />
                <span className="text-sm">
                  {settings?.location || "Ubicación del evento"}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Users className="mr-2 h-4 w-4" />
                <span className="text-sm">
                  {/* Capacidad máxima vs registrados actualmente */}
                  {settings?.maxAttendees || "Capacidad máxima"}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <DollarSign className="mr-2 h-4 w-4" />
                <span className="text-sm">
                  {settings?.ticketPrice && (
                    <>
                      {settings.ticketPrice} {settings.currency}
                    </>
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
