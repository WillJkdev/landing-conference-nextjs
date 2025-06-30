"use client";

import {
  BarChart3,
  Building2,
  CreditCard,
  Home,
  Mail,
  QrCode,
  Settings,
  Ticket,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Logout from "@/components/LogoutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useEventSettings } from "@/hooks/use-event-settings";
import Image from "next/image";

const menuItems = [
  {
    title: "Panel General",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Usuarios",
    url: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Tickets",
    url: "/dashboard/tickets",
    icon: Ticket,
  },
  {
    title: "Pagos",
    url: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Correos",
    url: "/dashboard/emails",
    icon: Mail,
  },
  {
    title: "Configuración",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

const toolsItems = [
  {
    title: "Escáner QR",
    url: "/scan-reader",
    icon: QrCode,
  },
  {
    title: "Reportes",
    url: "/dashboard/reports",
    icon: BarChart3,
  },
];

export function AppSidebar({
  user,
}: {
  user: { name?: string; email?: string };
}) {
  const { settings, loading } = useEventSettings();
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-primary text-primary-foreground border-primary-foreground/20 relative flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg border">
                  {settings?.logoUrl ? (
                    <Image
                      src={settings.logoUrl}
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <Building2 className="size-4" />
                  )}
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {loading
                      ? "Cargando..."
                      : settings?.name || "ConferenceApp"}
                  </span>
                  <span className="truncate text-xs">Dashboard Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Gestión Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Herramientas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <ThemeToggle />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-muted flex flex-col items-start gap-2 border-t px-4 py-3">
        <div className="flex flex-col items-start gap-0.5">
          <p className="text-sm font-semibold">{user.name || "Usuario"}</p>
          <p className="text-muted-foreground text-xs">
            {user.email || "Correo"}
          </p>
        </div>
        <Logout />
      </SidebarFooter>
    </Sidebar>
  );
}
