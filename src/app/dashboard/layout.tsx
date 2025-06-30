import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";
import { sanitizeUser } from "@/lib/helpers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | TechConf Admin",
  },
  description: "Gestión de conferencias y eventos",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = sanitizeUser(session?.user ?? null);
  return (
    <div className={inter.className}>
      <SidebarProvider>
        <AppSidebar user={user} />
        <main className="flex-1">{children}</main>
        <Toaster />
      </SidebarProvider>
    </div>
  );
}
