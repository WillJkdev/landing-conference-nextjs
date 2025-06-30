"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Mail,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Send,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

type Email = {
  id: string;
  recipient: string;
  recipientName: string;
  subject: string;
  status: string;
  sentDate: string;
  deliveredDate: string | null;
  type: string;
  ticketId: number | null;
  attempts: number;
};

type Stats = {
  total: number;
  delivered: number;
  failed: number;
  pending: number;
};

interface Props {
  emails: Email[];
  stats: Stats;
  pagination: {
    page: number;
    totalPages: number;
  };
  filters: {
    query: string;
    status: string;
    type: string;
  };
  totalFiltered: number;
}

export default function EmailList({ 
  emails, 
  stats, 
  pagination, 
  filters, 
  totalFiltered 
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estado para el debounce del buscador
  const [searchTerm, setSearchTerm] = useState(filters.query);

  const updateQuery = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.set("page", "1");
      router.push("?" + params.toString());
    },
    [searchParams, router]
  );

  // Reemplazar el useEffect manual con useDebouncedCallback
  const debouncedUpdateQuery = useDebouncedCallback((value: string) => {
    updateQuery("q", value);
  }, 300);

  // Reemplazar el useEffect manual
  useEffect(() => {
    debouncedUpdateQuery(searchTerm);
  }, [searchTerm, debouncedUpdateQuery]);

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      router.push("?" + params.toString());
    },
    [searchParams, router]
  );

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const { page, totalPages } = pagination;
    const pages: (number | string)[] = [];

    // Si hay pocas páginas, mostrar todas
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Siempre mostrar página 1
    pages.push(1);

    // Calcular rango alrededor de la página actual
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    // Agregar puntos suspensivos si hay salto
    if (start > 2) {
      pages.push("...");
    }

    // Agregar páginas del rango
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Agregar puntos suspensivos si hay salto al final
    if (end < totalPages - 1) {
      pages.push("...");
    }

    // Siempre mostrar la última página
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Entregado
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <RefreshCw className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Fallido
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "ticket_confirmation":
        return "Confirmación";
      case "payment":
        return "Pago";
      case "ticket_resend":
        return "Reenvío";
      case "reminder":
        return "Recordatorio";
      case "welcome":
        return "Bienvenida";
      default:
        return type;
    }
  };

  return (
    <>
      {/* Estadísticas de emails */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Enviados
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entregados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.delivered}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 
                ? `${((stats.delivered / stats.total) * 100).toFixed(1)}% éxito`
                : "0% éxito"
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fallidos</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.failed}
            </div>
            <p className="text-xs text-muted-foreground">Requieren reenvío</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <RefreshCw className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">En proceso</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Registro de Emails</CardTitle>
              <CardDescription>
                {totalFiltered} emails mostrados - Página {pagination.page} de{" "}
                {pagination.totalPages}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por email, nombre o asunto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={filters.status}
              onValueChange={(val) => updateQuery("status", val)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="delivered">Entregados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="failed">Fallidos</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.type}
              onValueChange={(val) => updateQuery("type", val)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="ticket_confirmation">Confirmación</SelectItem>
                <SelectItem value="ticket_resend">Reenvío</SelectItem>
                <SelectItem value="payment">Pago</SelectItem>
                <SelectItem value="reminder">Recordatorio</SelectItem>
                <SelectItem value="welcome">Bienvenida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Destinatario</TableHead>
                  <TableHead>Asunto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Enviado</TableHead>
                  <TableHead>Entregado</TableHead>
                  <TableHead>Intentos</TableHead>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{email.recipientName}</div>
                        <div className="text-sm text-muted-foreground">
                          {email.recipient}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {email.subject}
                    </TableCell>
                    <TableCell>{getTypeText(email.type)}</TableCell>
                    <TableCell>{getStatusBadge(email.status)}</TableCell>
                    <TableCell>
                      {new Date(email.sentDate).toLocaleDateString("es")}
                    </TableCell>
                    <TableCell>
                      {email.deliveredDate
                        ? new Date(email.deliveredDate).toLocaleDateString("es")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={email.attempts > 1 ? "destructive" : "secondary"}
                      >
                        {email.attempts}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {email.ticketId
                        ? `TK-${String(email.ticketId).padStart(3, "0")}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {email.status === "failed" && (
                          <Button variant="ghost" size="sm" title="Reenviar email">
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" title="Ver detalles">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Paginación mejorada */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Página {pagination.page} de {pagination.totalPages}
            </div>

            <div className="flex items-center space-x-1">
              {/* Botón Anterior */}
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => goToPage(pagination.page - 1)}
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
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant={
                        pageNum === pagination.page ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => goToPage(pageNum as number)}
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
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => goToPage(pagination.page + 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}