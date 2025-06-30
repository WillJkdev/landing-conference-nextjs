import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const eventSettings = await prisma.eventSettings.findFirst();

    if (!eventSettings) {
      return NextResponse.json(
        { error: "No se encontró configuración del evento" },
        { status: 404 },
      );
    }

    return NextResponse.json(eventSettings);
  } catch (error) {
    console.error("Error fetching event settings:", error);
    return NextResponse.json(
      { error: "Error al obtener configuración" },
      { status: 500 },
    );
  }
}
