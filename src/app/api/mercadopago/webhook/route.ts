import { TicketQRMail } from "@/components/emails/TicketQRMail";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { generateTicketToken } from "@/lib/token";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const query = Object.fromEntries(url.searchParams.entries());

    let type: string | undefined;
    let paymentId: string | undefined;

    try {
      const body = await req.json();
      type = body.type ?? query.type ?? query.topic;
      paymentId = body.data?.id ?? query["data.id"] ?? query.id;
    } catch {
      type = query.type ?? query.topic;
      paymentId = query["data.id"] ?? query.id;
    }

    if (type !== "payment") {
      console.log("🟡 Tipo de notificación no manejada:", type);
      return NextResponse.json({ received: true });
    }

    if (!paymentId) {
      console.error("❌ ID de pago no encontrado en webhook");
      return new NextResponse("Missing payment ID", { status: 400 });
    }

    const res = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      },
    );

    if (!res.ok) {
      console.error("❌ Error al consultar el pago en MercadoPago");
      return new NextResponse("Error consultando pago", { status: 500 });
    }

    const payment = await res.json();
    // console.log("🟢 Payment-WEBHOOK:", payment);

    const metadata = payment.metadata;
    const userId = metadata?.user_id;

    if (!userId || typeof userId !== "string") {
      console.error("❌ Metadata sin user_id válido");
      return new NextResponse("Falta user_id en metadata", { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({ where: { userId } });
    const emailSettings = await prisma.emailSettings.findFirst();
    if (!emailSettings) {
      throw new Error("Error al obtener configuración de email");
    }
    const { senderName, senderEmail, replyToEmail } = emailSettings || {
      senderName: "Conferencia",
      senderEmail: "conferencia@gmail.com",
      replyToEmail: "conferencia@gmail.com",
    };

    if (!ticket) {
      console.error("❌ Ticket no encontrado para userId:", userId);
      return new NextResponse("Ticket no encontrado", { status: 404 });
    }

    await prisma.ticket.update({
      where: { userId },
      data: {
        paid: payment.status === "approved",
        paymentStatus: payment.status,
        paymentMethod: payment.payment_method_id,
        paymentId: payment.id.toString(),
        paidAt:
          payment.status === "approved" && payment.date_approved
            ? new Date(payment.date_approved)
            : null,
        amount: Math.round(payment.transaction_amount ?? 0),
        fees: payment.fee_details?.[0]?.amount ?? 0,
        netAmount: payment.transaction_details?.net_received_amount ?? 0,
        installments: payment.installments ?? null,
      },
    });
    // Email Solo si el pago fue aprobado
    if (payment.status === "approved") {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        console.error("❌ Usuario no encontrado para ticket");
        return new NextResponse("Usuario no encontrado", { status: 404 });
      }

      const result = await prisma.$transaction(async (tx) => {
        const currentTicket = await tx.ticket.findUnique({ where: { userId } });

        if (!currentTicket || currentTicket.ticketEmailSent) {
          return { alreadySent: true };
        }

        const token = generateTicketToken(user.id, currentTicket.id);
        const pageURL = await prisma.urlSettings.findFirst();
        const { websiteUrl } = pageURL || { websiteUrl: process.env.BASE_URL };
        const qrImageUrl = `${websiteUrl}/scan?token=${encodeURIComponent(token)}`;

        await resend.emails.send({
          from: `${senderName} <${senderEmail}>`,
          to: user.email,
          replyTo: replyToEmail,
          subject: `Tu entrada con QR (${`TK-${String(currentTicket.id).padStart(3, "0")}`})`,
          react: TicketQRMail({ name: user.name, qrImageUrl }),
          tags: [
            { name: "ticketId", value: currentTicket.id.toString() },
            { name: "userId", value: user.id.toString() },
          ],
        });

        await tx.ticket.update({
          where: { userId },
          data: { ticketEmailSent: true },
        });

        return { alreadySent: false };
      });

      if (result.alreadySent) {
        console.log("🟡 Correo con QR ya fue enviado anteriormente.");
      } else {
        console.log("📧 Email con QR enviado a", user.email);
      }
    }

    console.log(
      `✅ Webhook procesado para userId ${userId} (${payment.payer?.email})`,
    );

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Error en el webhook:", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
