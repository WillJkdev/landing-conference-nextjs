import { prisma } from "@/lib/prisma";
import path from "path";
import { fileURLToPath } from "url";

export async function seedApiKeys() {
  console.log("🔑 Seeding API Keys con expiración...");

  const now = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(now.getMonth() + 1);

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const apiKeys = [
    {
      name: "Resend Email Service",
      key: "resend_main",
      type: "email",
      isActive: true,
      expiresAt: oneMonthLater, // expira en 1 mes
    },
    {
      name: "Resend Webhook",
      key: "resend_webhook",
      type: "webhook",
      isActive: true,
      expiresAt: null, // no expira
    },
    {
      name: "Mercado Pago Payment",
      key: "mp_production",
      type: "payment",
      isActive: true,
      expiresAt: null,
    },
    {
      name: "Google Maps API",
      key: "google_maps",
      type: "maps",
      isActive: true,
      expiresAt: oneMonthLater,
    },
    {
      name: "Cloudinary Storage",
      key: "cloudinary_main",
      type: "storage",
      isActive: true,
      expiresAt: yesterday, // ya expiró
    },
    {
      name: "JWT Authentication",
      key: "jwt_secret",
      type: "auth",
      isActive: true,
      expiresAt: null,
    },
  ];

  for (const apiKey of apiKeys) {
    await prisma.apiKey.upsert({
      where: { key: apiKey.key },
      update: {
        name: apiKey.name,
        isActive: apiKey.isActive,
        expiresAt: apiKey.expiresAt,
      },
      create: apiKey,
    });
  }

  console.log("✅ API Keys seeded correctamente");
}

const currentFile = fileURLToPath(import.meta.url);
const executedFile = path.resolve(process.argv[1]);

if (currentFile === executedFile) {
  seedApiKeys()
    .catch((error) => {
      console.error("❌ Error al ejecutar seed de API Keys:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
