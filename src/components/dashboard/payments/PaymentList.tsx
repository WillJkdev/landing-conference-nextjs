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
  DollarSign,
  Download,
  ExternalLink,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface PaymentWithUser {
  id: string;
  payerEmail: string;
  payerName: string;
  transactionDate: Date;
  status: string;
  paymentMethod: string;
  paymentType: string;
  amount: number;
  fees: number;
  netAmount: number;
  ticketId: string;
}

interface FinancialSummary {
  totalRevenue: number;
  totalFees: number;
  netRevenue: number;
  approvedCount: number;
  feesPercentage: number;
}

interface Props {
  payments: PaymentWithUser[];
  pagination: {
    page: number;
    totalPages: number;
  };
  filters: {
    query: string;
    status: string;
    method: string;
  };
  financialSummary: FinancialSummary;
  totalPayments: number;
}

export default function PaymentList({
  payments,
  pagination,
  filters,
  financialSummary,
  totalPayments,
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
    [searchParams, router],
  );

  // Debounce para la búsqueda
  const debouncedUpdateQuery = useDebouncedCallback((value: string) => {
    updateQuery("q", value);
  }, 300);

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
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Aprobado</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
        );
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>;
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-800">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentMethodText = (method: string, type: string) => {
    const methodMap: Record<string, string> = {
      credit_card: "Tarjeta de Crédito",
      debit_card: "Tarjeta de Débito",
      bank_transfer: "Transferencia",
      cash: "Efectivo",
    };

    const typeMap: Record<string, string> = {
      visa: "Visa",
      mastercard: "Mastercard",
      pix: "PIX",
      rapipago: "Rapipago",
      pagofacil: "Pago Fácil",
    };

    return `${methodMap[method] || method} (${typeMap[type] || type})`;
  };

  return (
    <>
      {/* Resumen financiero */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Brutos
            </CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${financialSummary.totalRevenue.toFixed(2)}
            </div>
            <p className="text-muted-foreground text-xs">
              De {financialSummary.approvedCount} pagos aprobados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comisiones MP</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${financialSummary.totalFees.toFixed(2)}
            </div>
            <p className="text-muted-foreground text-xs">
              {financialSummary.feesPercentage.toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Netos
            </CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${financialSummary.netRevenue.toFixed(2)}
            </div>
            <p className="text-muted-foreground text-xs">
              Después de comisiones
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transacciones</CardTitle>
              <CardDescription>
                {payments.length} de {totalPayments} transacciones mostradas -
                Página {pagination.page} de {pagination.totalPages}
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
                placeholder="Buscar por ID, email o nombre..."
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
                <SelectItem value="approved">Aprobados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="rejected">Rechazados</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.method}
              onValueChange={(val) => updateQuery("method", val)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los métodos</SelectItem>
                <SelectItem value="credit_card">Tarjeta Crédito</SelectItem>
                <SelectItem value="debit_card">Tarjeta Débito</SelectItem>
                <SelectItem value="bank_transfer">Transferencia</SelectItem>
                <SelectItem value="cash">Efectivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Pago</TableHead>
                  <TableHead>Pagador</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Comisión</TableHead>
                  <TableHead>Neto</TableHead>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono font-medium">
                      {payment.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.payerName}</div>
                        <div className="text-muted-foreground text-sm">
                          {payment.payerEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(payment.transactionDate).toLocaleDateString(
                        "es",
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-sm">
                      {getPaymentMethodText(
                        payment.paymentMethod,
                        payment.paymentType,
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${payment.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-red-600">
                      ${payment.fees.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      ${payment.netAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {payment.ticketId}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Ver en MercadoPago"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
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
    </>
  );
}
