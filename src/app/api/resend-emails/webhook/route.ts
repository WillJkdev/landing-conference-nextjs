import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Webhook } from "svix";
import { WebhookEvent } from "@/types/EmailType";

export async function POST(req: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET!;
  const payload = await req.text();
  const headers = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };

  const wh = new Webhook(secret);
  let event: WebhookEvent;

  try {
    event = wh.verify(payload, headers) as WebhookEvent;
    console.log("📩 Webhook recibido:", event);
  } catch (err) {
    console.error("❌ Webhook verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const data = event.data;
  const emailId = data.email_id;
  const to = data.to?.[0] || "unknown";
  const subject = data.subject || "";
  const status = event.type;
  const timestamp = new Date();
  const tags = data.tags || [];

  function detectType(subject: string): string {
    const s = subject.toLowerCase();
    if (s.includes("reenvío") || s.includes("reenviar")) return "ticket_resend";
    if (s.includes("recordatorio") || s.includes("recuerda")) return "reminder";
    if (s.includes("bienvenida") || s.includes("te damos la bienvenida"))
      return "welcome";
    if (s.includes("ticket") || s.includes("entrada") || s.includes("qr"))
      return "ticket_confirmation";
    if (s.includes("pago") || s.includes("completa tu pago")) return "payment";
    return "otro";
  }

  // function extractTicketId(subject: string): number | null {
  //   const match = subject.match(/TK-(\d+)/);
  //   return match ? parseInt(match[1], 10) : null;
  // }

  const ticketId = data.tags?.ticketId
    ? parseInt(data.tags.ticketId, 10)
    : null;
  console.log("🔍 Tags:", tags);
  console.log("🔍 Ticket ID:", ticketId);

  const type = detectType(subject);
  // const ticketId = extractTicketId(subject);

  await prisma.emailEvent.upsert({
    where: { emailId },
    create: {
      emailId,
      to,
      subject,
      status,
      timestamp,
      sentDate: status === "email.sent" ? timestamp : undefined,
      deliveredDate: status === "email.delivered" ? timestamp : undefined,
      type,
      ticketId,
    },
    update: {
      status,
      timestamp,
      ...(status === "email.sent" && { sentDate: timestamp }),
      ...(status === "email.delivered" && { deliveredDate: timestamp }),
    },
  });

  return NextResponse.json({ received: true });
}
