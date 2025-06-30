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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Mail,
  QrCode,
  RefreshCw,
  Search,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

type Ticket = {
  id: string;
  userEmail: string;
  userName: string;
  paymentMethod: string;
  paymentId: string;
  paymentStatus: string;
  attendanceStatus: string;
  purchaseDate: string;
  price: number;
};

type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalTickets: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  itemsPerPage: number;
};

type InitialFilters = {
  search: string;
  paymentStatus: string;
  attendanceStatus: string;
};

interface TicketsListProps {
  tickets: Ticket[];
  pagination: PaginationInfo;
  initialFilters: InitialFilters;
}

export function TicketsList({
  tickets,
  pagination,
  initialFilters,
}: TicketsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estados locales para filtros - solo para la UI
  const [searchInputValue, setSearchInputValue] = useState(
    initialFilters.search,
  );
  const [paymentFilter, setPaymentFilter] = useState(
    initialFilters.paymentStatus,
  );
  const [attendanceFilter, setAttendanceFilter] = useState(
    initialFilters.attendanceStatus,
  );

  // Función para actualizar URL con nuevos parámetros
  const updateURL = useCallback(
    (params: Record<string, string>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== "all") {
          current.set(key, value);
        } else {
          current.delete(key);
        }
      });

      // Mantener la página actual a menos que se especifique lo contrario
      if (!("page" in params)) {
        current.set("page", pagination.currentPage.toString());
      }

      const search = current.toString();
      const query = search ? `?${search}` : "";

      router.push(`/dashboard/tickets${query}`, { scroll: false });
    },
    [router, searchParams, pagination.currentPage],
  );
  // Debounce para el término de búsqueda
  const debouncedUpdateSearch = useDebouncedCallback((searchValue: string) => {
    const currentSearch = searchParams.get("search") || "";
    if (searchValue !== currentSearch) {
      updateURL({
        search: searchValue,
        page: "1", // Resetear a página 1 al buscar
      });
    }
  }, 500);

  // Efecto único para manejar la búsqueda
  useEffect(() => {
    // No hacer nada en el primer render
    if (searchInputValue === initialFilters.search) return;

    debouncedUpdateSearch(searchInputValue);

    return () => {
      debouncedUpdateSearch.cancel();
    };
  }, [searchInputValue, debouncedUpdateSearch, initialFilters.search]);

  // Efecto para otros filtros
  useEffect(() => {
    updateURL({ paymentStatus: paymentFilter });
  }, [paymentFilter, updateURL]);

  useEffect(() => {
    updateURL({ attendanceStatus: attendanceFilter });
  }, [attendanceFilter, updateURL]);

  // Sincronización con parámetros iniciales (simplificado)
  useEffect(() => {
    setSearchInputValue(initialFilters.search);
    setPaymentFilter(initialFilters.paymentStatus);
    setAttendanceFilter(initialFilters.attendanceStatus);
  }, [initialFilters]);

  // Función para cambiar página
  const handlePageChange = (newPage: number) => {
    updateURL({ page: newPage.toString() });
  };

  // Funciones de utilidad para badges y texto
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Aprobado</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
        );
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Fallido</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAttendanceStatusBadge = (status: string) => {
    if (status === "checked_in") {
      return <Badge className="bg-blue-100 text-blue-800">Check-in</Badge>;
    }
    return <Badge variant="outline">Pendiente</Badge>;
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Tarjeta de Crédito";
      case "debit_card":
        return "Tarjeta de Débito";
      case "bank_transfer":
        return "Transferencia";
      default:
        return method;
    }
  };

  // Funciones para acciones de tickets
  const handleCopyId = async (ticketId: string) => {
    try {
      await navigator.clipboard.writeText(ticketId);
      // Aquí podrías agregar un toast de confirmación
    } catch (err) {
      console.error("Error al copiar ID:", err);
    }
  };

  const handleResendEmail = (ticketId: string) => {
    // Implementar lógica para reenviar email
    console.log("Reenviar email para ticket:", ticketId);
  };

  const handleRegenerateTicket = (ticketId: string) => {
    // Implementar lógica para regenerar ticket
    console.log("Regenerar ticket:", ticketId);
  };

  const handleViewQR = (ticketId: string) => {
    // Implementar lógica para ver QR
    console.log("Ver QR para ticket:", ticketId);
  };

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const { currentPage, totalPages } = pagination;
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    if (start > 2) {
      pages.push("...");
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (end < totalPages - 1) {
      pages.push("...");
    }
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Tickets</CardTitle>
        <CardDescription>
          {pagination.totalTickets} tickets encontrados
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder="Buscar por ID, email o nombre..."
              value={searchInputValue}
              onChange={(e) => {
                setSearchInputValue(e.target.value);
              }}
              className="pl-8"
            />
          </div>
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado del pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los pagos</SelectItem>
              <SelectItem value="approved">Aprobados</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="failed">Fallidos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={attendanceFilter} onValueChange={setAttendanceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado asistencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="checked_in">Con check-in</SelectItem>
              <SelectItem value="pending">Sin check-in</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabla de tickets */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Ticket</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Método Pago</TableHead>
                <TableHead>ID Pago MP</TableHead>
                <TableHead>Estado Pago</TableHead>
                <TableHead>Asistencia</TableHead>
                <TableHead>Fecha Compra</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-muted-foreground py-8 text-center"
                  >
                    No se encontraron tickets que coincidan con los filtros
                    aplicados.
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono font-medium">
                      {ticket.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{ticket.userName}</div>
                        <div className="text-muted-foreground text-sm">
                          {ticket.userEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPaymentMethodText(ticket.paymentMethod)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {ticket.paymentId}
                    </TableCell>
                    <TableCell>
                      {getPaymentStatusBadge(ticket.paymentStatus)}
                    </TableCell>
                    <TableCell>
                      {getAttendanceStatusBadge(ticket.attendanceStatus)}
                    </TableCell>
                    <TableCell>
                      {new Date(ticket.purchaseDate).toLocaleDateString("es")}
                    </TableCell>
                    <TableCell>S/. {ticket.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Reenviar QR por email"
                          onClick={() => handleResendEmail(ticket.id)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Regenerar ticket"
                          onClick={() => handleRegenerateTicket(ticket.id)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Ver QR"
                          onClick={() => handleViewQR(ticket.id)}
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Copiar ID"
                          onClick={() => handleCopyId(ticket.id)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-muted-foreground text-sm">
            Página {pagination.currentPage} de {pagination.totalPages}
          </div>

          <div className="flex items-center space-x-1">
            {/* Botón Anterior */}
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage <= 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Números de página */}
            {getPageNumbers().map((pageNum, index) => (
              <div key={index}>
                {pageNum === "..." ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled
                    className="h-8 w-8 p-0"
                  >
                    <span className="text-lg">…</span>
                  </Button>
                ) : (
                  <Button
                    variant={
                      pageNum === pagination.currentPage ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handlePageChange(pageNum as number)}
                    className="h-8 w-8 p-0"
                  >
                    {pageNum}
                  </Button>
                )}
              </div>
            ))}

            {/* Botón Siguiente */}
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
