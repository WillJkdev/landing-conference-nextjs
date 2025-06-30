import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";

export async function seedAdmin() {
  console.log("🚀 Ejecutando seed-admin.ts");
  const password = await bcrypt.hash("123456", 10);

  const admin = await prisma.admin.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password,
      name: "Admin",
    },
  });

  console.log("✅ Admin creado o existente:", admin.email);
}

const currentFile = fileURLToPath(import.meta.url);
const executedFile = path.resolve(process.argv[1]);

if (currentFile === executedFile) {
  seedAdmin()
    .catch((error) => {
      console.error("❌ Error al crear admin:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
