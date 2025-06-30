import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const emails = await prisma.emailEvent.findMany({
    include: {
      ticket: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  const mapped = emails.map((email) => ({
    id: email.id,
    recipient: email.to,
    recipientName: email.ticket?.user?.name ?? email.to.split("@")[0],
    subject: email.subject,
    status: email.status.replace("email.", ""),
    sentDate: email.sentDate?.toISOString() ?? email.timestamp.toISOString(),
    deliveredDate: email.deliveredDate?.toISOString() ?? null,
    type: email.type,
    ticketId: email.ticketId,
    attempts: 1,
  }));

  // console.log("mapped", mapped);

  return NextResponse.json({ data: mapped });
}
