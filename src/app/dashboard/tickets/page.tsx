import TicketsContainer from "@/components/dashboard/tickets/TicketsContainer";
import TicketsTableSkeleton from "@/components/dashboard/tickets/TicketsTableSkeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tickets",
  description: "Gestiona todos los tickets generados",
};

interface TicketsPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function TicketsPage({ searchParams }: TicketsPageProps) {
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
              <BreadcrumbPage>Tickets</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tickets</h1>
            <p className="text-muted-foreground">
              Gestión detallada de todos los tickets generados
            </p>
          </div>
        </div>

        <Suspense fallback={<TicketsTableSkeleton />}>
          <TicketsContainer searchParams={searchParams} />
        </Suspense>
      </div>
    </SidebarInset>
  );
}
