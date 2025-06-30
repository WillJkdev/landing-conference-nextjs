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
import { UserWithTicket } from "@/types/UserType";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  users: UserWithTicket[];
  pagination: {
    page: number;
    totalPages: number;
  };
  filters: {
    name: string;
    status: string;
    checkin: string;
  };
}

export default function UserList({ users, pagination, filters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estado para el debounce del buscador
  const [searchTerm, setSearchTerm] = useState(filters.name);

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
    [searchParams, router],
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
    [searchParams, router],
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
    if (status === "paid") {
      return <Badge className="bg-green-100 text-green-800">Pagado</Badge>;
    }
    return <Badge variant="secondary">Pendiente</Badge>;
  };

  const getCheckInBadge = (status: string) => {
    if (status === "checked") {
      return <Badge className="bg-blue-100 text-blue-800">Check-in</Badge>;
    }
    return <Badge variant="outline">Pendiente</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lista de Asistentes</CardTitle>
            <CardDescription>
              {users.length} usuarios mostrados - Página {pagination.page} de{" "}
              {pagination.totalPages}
            </CardDescription>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder="Buscar por nombre o email..."
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
              <SelectValue placeholder="Estado del pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los pagos</SelectItem>
              <SelectItem value="paid">Pagados</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.checkin}
            onValueChange={(val) => updateQuery("checkin", val)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado check-in" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="checked">Con check-in</SelectItem>
              <SelectItem value="pending">Sin check-in</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado Pago</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Fecha Compra</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{getStatusBadge(user.ticketStatus)}</TableCell>
                  <TableCell>{getCheckInBadge(user.checkInStatus)}</TableCell>
                  <TableCell>
                    {new Date(user.purchaseDate).toLocaleDateString("es")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {user.checkInStatus === "pending" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="cursor-pointer"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Paginación mejorada */}
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-muted-foreground text-sm">
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
  );
}
