import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No se envió imagen" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Formato no permitido" },
      { status: 415 }
    );
  }

  // Validar tamaño (ej. máx 5MB)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Archivo muy grande (máx 5MB)" },
      { status: 413 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "eventos" }, (error, result) => {
            if (error) return reject(error);
            if (!result)
              return reject(new Error("Sin resultado de Cloudinary"));
            resolve(result);
          })
          .end(buffer);
      }
    );

    let eventSettings = await prisma.eventSettings.findFirst();

    if (!eventSettings) {
      eventSettings = await prisma.eventSettings.create({
        data: {
          name: "Nombre del Evento",
          date: new Date(),
          time: "00:00",
          location: "Ubicación por defecto",
          maxAttendees: 0,
          ticketPrice: 0,
          currency: "EUR",
          logoUrl: uploadResult.secure_url,
          description: "Descripción por defecto",
        },
      });
    } else {
      await prisma.eventSettings.update({
        where: { id: eventSettings.id },
        data: { logoUrl: uploadResult.secure_url },
      });
    }

    return NextResponse.json({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (e) {
    console.error("Error al subir la imagen:", e);
    return NextResponse.json(
      { error: "Error al subir la imagen" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const eventSettings = await prisma.eventSettings.findFirst();
    if (!eventSettings || !eventSettings.logoUrl) {
      return NextResponse.json(
        { error: "No hay logo para eliminar" },
        { status: 404 }
      );
    }

    // Extraer el `public_id` desde la URL si guardaste el logo así: https://res.cloudinary.com/.../eventos/<public_id>.jpg
    const publicIdMatch = eventSettings.logoUrl.match(
      /eventos\/(.+)\.[a-zA-Z]+$/
    );
    const public_id = publicIdMatch?.[1];

    if (public_id) {
      await cloudinary.uploader.destroy(`eventos/${public_id}`);
    }

    await prisma.eventSettings.update({
      where: { id: eventSettings.id },
      data: { logoUrl: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar el logo:", error);
    return NextResponse.json(
      { error: "Error al eliminar el logo" },
      { status: 500 }
    );
  }
}
