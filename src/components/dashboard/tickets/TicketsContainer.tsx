import { TicketsList } from "@/components/dashboard/tickets/TicketsList";
import type { Prisma, Ticket, User } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const ITEMS_PER_PAGE = 10;

// Detectar el tipo de base de datos desde la configuración
const DATABASE_PROVIDER = process.env.DATABASE_URL?.startsWith("file:")
  ? "sqlite"
  : "other";
const SUPPORTS_INSENSITIVE = DATABASE_PROVIDER !== "sqlite";

// Constantes para valores de Prisma
const QUERY_MODE = {
  INSENSITIVE: "insensitive" as const,
  DEFAULT: "default" as const,
} as const;

interface TicketsContainerProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Tipos específicos para los filtros
interface SearchFilters {
  search: string;
  paymentStatus: string;
  attendanceStatus: string;
}

interface ExtractedParams extends SearchFilters {
  page: number;
}

// Tipo para ticket con usuario incluido
interface TicketWithUser extends Ticket {
  user: User;
}

// Tipo para el ticket mapeado de salida
interface MappedTicket {
  id: string;
  userEmail: string;
  userName: string;
  paymentMethod: string;
  paymentId: string;
  paymentStatus: string;
  attendanceStatus: string;
  purchaseDate: string;
  price: number;
}

// Tipo para la información de paginación
interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalTickets: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  itemsPerPage: number;
}

// Tipo para los parámetros de URL que pueden venir
type SearchParamValue = string | string[] | undefined;

// Función para extraer parámetros de búsqueda con tipos específicos
function extractSearchParams(
  params: Record<string, SearchParamValue> | undefined,
): ExtractedParams {
  const page = Number(params?.page || 1);

  const search = Array.isArray(params?.search)
    ? params.search[0] || ""
    : params?.search || "";

  const paymentStatus = Array.isArray(params?.paymentStatus)
    ? params.paymentStatus[0] || "all"
    : params?.paymentStatus || "all";

  const attendanceStatus = Array.isArray(params?.attendanceStatus)
    ? params.attendanceStatus[0] || "all"
    : params?.attendanceStatus || "all";

  return { page, search, paymentStatus, attendanceStatus };
}

// Función para construir condiciones de búsqueda usando tipos de Prisma
function buildSearchConditions(searchTerm: string): Prisma.TicketWhereInput[] {
  const orConditions: Prisma.TicketWhereInput[] = [];

  // Para SQLite, convertir a minúsculas tanto el término como los campos
  const searchConfig = SUPPORTS_INSENSITIVE
    ? { contains: searchTerm, mode: QUERY_MODE.INSENSITIVE }
    : { contains: searchTerm.toLowerCase() };

  // Búsqueda por email y nombre del usuario
  orConditions.push({
    user: {
      OR: [{ email: searchConfig }, { name: searchConfig }],
    },
  });

  // Búsqueda por ID numérico
  const cleanedSearchTerm = searchTerm.replace(/^TK-/, "");
  const numericId = parseInt(cleanedSearchTerm, 10);
  if (!isNaN(numericId)) {
    orConditions.push({ id: numericId });
  }

  // Búsqueda por paymentId (solo si es lo suficientemente largo)
  if (searchTerm.length >= 3) {
    orConditions.push({
      paymentId: searchConfig,
    });
  }

  return orConditions;
}

// Función para construir el objeto where de Prisma con tipos específicos
function buildWhereClause(filters: SearchFilters): Prisma.TicketWhereInput {
  const where: Prisma.TicketWhereInput = {};

  // Filtro de búsqueda
  if (filters.search.trim()) {
    where.OR = buildSearchConditions(filters.search.trim());
  }

  // Filtro de estado de pago
  if (filters.paymentStatus !== "all") {
    where.paymentStatus = filters.paymentStatus;
  }

  // Filtro de asistencia
  if (filters.attendanceStatus !== "all") {
    where.checkedIn = filters.attendanceStatus === "checked_in";
  }

  return where;
}

// Función recursiva para remover el mode con tipos específicos
function removeMode(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(removeMode);
  }

  if (obj && typeof obj === "object" && obj !== null) {
    const result: Record<string, unknown> = {};
    const entries = Object.entries(obj as Record<string, unknown>);

    for (const [key, value] of entries) {
      if (key !== "mode") {
        result[key] = removeMode(value);
      }
    }
    return result;
  }

  return obj;
}

// Función para ejecutar queries con manejo específico de SQLite
async function executeWithFallback<T>(
  queryFn: (whereClause: Prisma.TicketWhereInput) => Promise<T>,
  whereClause: Prisma.TicketWhereInput,
): Promise<T> {
  // Si sabemos que es SQLite, usar directamente la versión sin mode
  if (!SUPPORTS_INSENSITIVE) {
    const cleanWhereClause = removeMode(whereClause) as Prisma.TicketWhereInput;
    return await queryFn(cleanWhereClause);
  }

  // Para otras bases de datos, intentar con mode insensitive
  try {
    return await queryFn(whereClause);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Unknown argument `mode`")
    ) {
      console.warn(
        "Database doesn't support case-insensitive search, falling back...",
      );
      const fallbackWhere = removeMode(whereClause) as Prisma.TicketWhereInput;
      return await queryFn(fallbackWhere);
    }
    throw error;
  }
}

// Función para mapear tickets al formato de salida con tipos específicos
function mapTicketsToOutput(tickets: TicketWithUser[]): MappedTicket[] {
  return tickets.map(
    (ticket): MappedTicket => ({
      id: `TK-${ticket.id.toString().padStart(3, "0")}`,
      userEmail: ticket.user.email,
      userName: ticket.user.name || "Sin nombre",
      paymentMethod: ticket.paymentMethod || "unknown",
      paymentId: ticket.paymentId?.toString() || "N/A",
      paymentStatus: ticket.paymentStatus || "pending",
      attendanceStatus: ticket.checkedIn ? "checked_in" : "pending",
      purchaseDate: ticket.createdAt.toISOString(),
      price: ticket.amount || 0,
    }),
  );
}

// Función para crear información de paginación
function createPaginationInfo(
  totalTickets: number,
  currentPage: number,
): PaginationInfo {
  const totalPages = Math.ceil(totalTickets / ITEMS_PER_PAGE);

  return {
    currentPage,
    totalPages: Math.max(1, totalPages),
    totalTickets,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    itemsPerPage: ITEMS_PER_PAGE,
  };
}

export default async function TicketsContainer({
  searchParams,
}: TicketsContainerProps) {
  const params = await searchParams;
  const { page, search, paymentStatus, attendanceStatus } =
    extractSearchParams(params);

  // Redirect si no hay página especificada
  if (!params?.page) {
    redirect("/dashboard/tickets?page=1");
  }

  const filters: SearchFilters = { search, paymentStatus, attendanceStatus };
  const where = buildWhereClause(filters);

  try {
    console.log("Search parameters:", filters);
    console.log("Prisma where clause:", JSON.stringify(where, null, 2));

    // Ejecutar ambas queries en paralelo con tipos específicos
    const [totalTickets, tickets] = await Promise.all([
      executeWithFallback(
        (whereClause: Prisma.TicketWhereInput) =>
          prisma.ticket.count({ where: whereClause }),
        where,
      ),
      executeWithFallback(
        (whereClause: Prisma.TicketWhereInput) =>
          prisma.ticket.findMany({
            where: whereClause,
            include: { user: true },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * ITEMS_PER_PAGE,
            take: ITEMS_PER_PAGE,
          }),
        where,
      ),
    ]);

    // Type assertion con validación en runtime
    const typedTotalTickets = totalTickets as number;
    const typedTickets = tickets as TicketWithUser[];

    // Verificar si la página solicitada existe
    const totalPages = Math.ceil(typedTotalTickets / ITEMS_PER_PAGE);
    if (page > totalPages && totalPages > 0) {
      redirect(`/dashboard/tickets?page=${totalPages}`);
    }

    const mappedTickets = mapTicketsToOutput(typedTickets);
    const paginationInfo = createPaginationInfo(typedTotalTickets, page);

    console.log("Results:", {
      totalTickets: typedTotalTickets,
      mappedTicketsCount: mappedTickets.length,
    });

    return (
      <TicketsList
        tickets={mappedTickets}
        pagination={paginationInfo}
        initialFilters={filters}
      />
    );
  } catch (error) {
    console.error("Error fetching tickets:", error);

    // Fallback en caso de error
    return (
      <TicketsList
        tickets={[]}
        pagination={createPaginationInfo(0, 1)}
        initialFilters={filters}
      />
    );
  }
}
