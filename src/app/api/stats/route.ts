import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  // Total de tickets (vendidos)
  const totalTickets = await prisma.ticket.count({
    where: { paid: true }, // o quita el where si quieres incluir todos
  });

  // Total de check‑ins (marcados)
  const totalCheckedIn = await prisma.ticket.count({
    where: { checkedIn: true },
  });

  // Check‑ins de hoy, usando checkedInAt
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const checkInsToday = await prisma.ticket.count({
    where: {
      checkedIn: true,
      checkedInAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  // Tickets inválidos (ejemplo: no pagados o sin usuario)
  const totalInvalid = await prisma.ticket.count({
    where: {
      OR: [
        { paid: false },
        { userId: "" }, // o ajusta según tus reglas de "inválido"
      ],
    },
  });

  // Tasa de asistencia
  const attendanceRate =
    totalTickets > 0 ? (totalCheckedIn / totalTickets) * 100 : 0;

  return NextResponse.json({
    totalTickets,
    totalCheckedIn,
    checkInsToday,
    totalInvalid,
    attendanceRate: Number(attendanceRate.toFixed(1)), // un decimal
  });
}
