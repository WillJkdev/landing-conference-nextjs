import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.pathname.split("/").pop();

  if (!userId) {
    return redirect("/error");
  }

  const ticket = await prisma.ticket.findUnique({
    where: { userId },
  });

  if (!ticket) {
    return redirect("/error");
  }

  if (ticket.paid) {
    return redirect("/already-paid");
  }

  if (!ticket.initPoint) {
    return redirect("/error");
  }

  return redirect(ticket.initPoint);
}
