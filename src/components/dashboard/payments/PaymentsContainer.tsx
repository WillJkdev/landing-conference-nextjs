import PaymentList from "@/components/dashboard/payments/PaymentList";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const PAGE_SIZE = 10;

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

interface PaymentsContainerProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentsContainer({
  searchParams,
}: PaymentsContainerProps) {
  const params = await searchParams;

  const page = Number(params?.page || 1);
  const status = Array.isArray(params?.status)
    ? params.status[0]
    : params?.status || "all";
  const method = Array.isArray(params?.method)
    ? params.method[0]
    : params?.method || "all";
  const query = Array.isArray(params?.q)
    ? params.q[0]?.trim() || ""
    : params?.q?.trim() || "";

  if (isNaN(page) || page < 1) redirect("/dashboard/payments?page=1");

  const skip = (page - 1) * PAGE_SIZE;

  // 🔧 OPCIÓN 1: Búsqueda compatible con SQLite (case-sensitive)
  const whereConditions: Prisma.TicketWhereInput = {
    AND: [
      ...(query
        ? [
            {
              OR: [
                // Búsqueda case-sensitive (funciona en SQLite)
                { user: { name: { contains: query } } },
                { user: { email: { contains: query } } },
                { paymentId: { contains: query } },
                // Si quieres buscar por ID numérico
                ...(Number(query) && !isNaN(Number(query))
                  ? [{ id: Number(query) }]
                  : []),
              ],
            },
          ]
        : []),
      ...(status !== "all" ? [{ paymentStatus: status }] : []),
      ...(method !== "all" ? [{ paymentMethod: method }] : []),
    ],
  };

  // 🔧 OPCIÓN 2: Raw SQL para búsqueda case-insensitive en SQLite
  // const whereConditionsRaw = query ? Prisma.sql`
  //   (LOWER(User.name) LIKE LOWER(${'%' + query + '%'}) OR
  //    LOWER(User.email) LIKE LOWER(${'%' + query + '%'}) OR
  //    LOWER(Ticket.paymentId) LIKE LOWER(${'%' + query + '%'}))
  //   ${status !== "all" ? Prisma.sql`AND Ticket.paymentStatus = ${status}` : Prisma.empty}
  //   ${method !== "all" ? Prisma.sql`AND Ticket.paymentMethod = ${method}` : Prisma.empty}
  // ` : undefined;

  // Ejecutar queries
  const [paymentsWithUser, totalCount] = await Promise.all([
    prisma.ticket.findMany({
      where: whereConditions,
      include: {
        user: true,
      },
      skip,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.ticket.count({
      where: whereConditions,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Mapear datos
  const mappedPayments: PaymentWithUser[] = paymentsWithUser.map((payment) => {
    const amount = payment.amount ?? 0;
    const fees = payment.fees ?? 0;
    return {
      id: payment.paymentId || `DB-${payment.id}`,
      payerEmail: payment.user.email,
      payerName: payment.user.name,
      transactionDate: payment.paidAt || payment.createdAt,
      status: payment.paymentStatus || "pending",
      paymentMethod: payment.paymentMethod || "desconocido",
      paymentType: payment.paymentGateway || "desconocido",
      amount,
      fees,
      netAmount: payment.netAmount ?? amount - fees,
      ticketId: `TK-${payment.id.toString().padStart(3, "0")}`,
    };
  });

  // Calcular estadísticas
  const approvedPayments = mappedPayments.filter(
    (p) => p.status === "approved",
  );
  const totalRevenue = approvedPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalFees = approvedPayments.reduce((sum, p) => sum + p.fees, 0);
  const netRevenue = totalRevenue - totalFees;

  const financialSummary = {
    totalRevenue,
    totalFees,
    netRevenue,
    approvedCount: approvedPayments.length,
    feesPercentage: totalRevenue ? (totalFees / totalRevenue) * 100 : 0,
  };

  return (
    <PaymentList
      payments={mappedPayments}
      pagination={{
        page,
        totalPages,
      }}
      filters={{
        query,
        status,
        method,
      }}
      financialSummary={financialSummary}
      totalPayments={totalCount}
    />
  );
}
