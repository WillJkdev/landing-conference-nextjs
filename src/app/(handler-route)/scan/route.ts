import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyTicketToken } from "@/lib/token";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  const pageURL = await prisma.urlSettings.findFirst();
  const { websiteUrl } = pageURL || { websiteUrl: process.env.BASE_URL };
  if (!session || session.user?.role !== "admin") {
    return NextResponse.redirect(`${websiteUrl}/presentation`);
  }

  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const code = url.searchParams.get("code");

  try {
    let ticket;

    // 🧠 Modo escaneo QR con JWT
    if (token) {
      const payload = verifyTicketToken(token);
      const { userId, ticketId } = payload;

      ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: { user: true },
      });

      if (!ticket || ticket.userId !== userId) {
        return NextResponse.json(
          { status: "invalid", message: "Ticket inválido" },
          { status: 404 },
        );
      }
    }

    // 🧠 Modo manual con código TK-XXX
    else if (code) {
      if (!code.startsWith("TK-")) {
        return NextResponse.json(
          { status: "error", message: "Formato de código inválido" },
          { status: 400 },
        );
      }

      const ticketId = parseInt(code.replace("TK-", ""));
      if (isNaN(ticketId)) {
        return NextResponse.json(
          { status: "error", message: "Código inválido" },
          { status: 400 },
        );
      }

      ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: { user: true },
      });

      if (!ticket) {
        return NextResponse.json(
          { status: "invalid", message: "Ticket no encontrado" },
          { status: 404 },
        );
      }
    }

    // ⚠️ Ningún parámetro válido recibido
    else {
      return NextResponse.json(
        { status: "error", message: "Falta token o código" },
        { status: 400 },
      );
    }

    // 🚦 Verificar si ya fue registrado
    if (ticket.checkedIn) {
      return NextResponse.json({
        status: "already_checked_in",
        message: "Este ticket ya fue usado",
        user: {
          name: ticket.user.name,
          email: ticket.user.email,
        },
        ticket: {
          id: ticket.id,
          checkedIn: true,
        },
      });
    }

    // ✅ Registrar asistencia
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        checkedIn: true,
        checkedInAt: new Date(),
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Asistencia registrada",
      user: {
        name: ticket.user.name,
        email: ticket.user.email,
      },
      ticket: {
        id: ticket.id,
        checkedIn: true,
      },
    });
  } catch (err) {
    console.error("Error en /scan:", err);
    return NextResponse.json(
      { status: "error", message: "Token o código inválido" },
      { status: 401 },
    );
  }
}
