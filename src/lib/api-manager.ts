import { ApiKey } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export class SecureApiManager {
  // Mapeo de keyId a variables de entorno (NUNCA exponer esto al frontend)
  private static readonly ENV_MAPPING: Record<string, string> = {
    resend_main: process.env.RESEND_API_KEY || "",
    resend_webhook: process.env.RESEND_WEBHOOK_SECRET || "",
    mp_production: process.env.MP_ACCESS_TOKEN || "",
    google_maps: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", // Esta es pública
    cloudinary_main: process.env.CLOUDINARY_API_SECRET || "", // Secreta
    jwt_secret: process.env.JWT_SECRET || "",
  } as const;

  private static getEnvKey(keyId: string): string | null {
    const key = this.ENV_MAPPING[keyId];
    if (!key) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`⚠️ No env variable found for: ${keyId}`);
      }
      return null;
    }
    return key;
  }

  // Método principal para obtener API key
  static async getApiKey(type: string): Promise<string | null> {
    try {
      // 1. Verificar que la API esté activa en DB
      const keyConfig = await prisma.apiKey.findFirst({
        where: {
          type,
          isActive: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      });

      if (!keyConfig) {
        console.warn(`⚠️ No active API key found for type: ${type}`);
        return null;
      }

      // 2. Obtener la clave real del entorno
      const realKey = this.getEnvKey(keyConfig.key);

      if (!realKey) {
        console.error(
          `❌ Environment variable not found for keyId: ${keyConfig.key}`,
        );
        return null;
      }

      // 3. Actualizar último uso y crear log
      await Promise.all([
        this.updateLastUsed(keyConfig.id),
        // this.logUsage(keyConfig.id, "success"),
      ]);

      return realKey;
    } catch (error) {
      console.error(`Error getting API key for type ${type}:`, error);
      return null;
    }
  }

  // Métodos específicos para cada servicio
  static async getResendKey(): Promise<string | null> {
    return this.getApiKey("email");
  }

  static async getMercadoPagoKey(): Promise<string | null> {
    return this.getApiKey("payment");
  }

  static async getCloudinarySecret(): Promise<string | null> {
    return this.getApiKey("storage");
  }

  static async getJwtSecret(): Promise<string | null> {
    return this.getApiKey("auth");
  }

  // Google Maps es pública, pero aún queremos trackear uso
  static async getGoogleMapsKey(): Promise<string | null> {
    const key = await this.getApiKey("maps");
    return key;
  }

  // Obtener información parcial para mostrar en el dashboard (SIN la clave real)
  static async getApiKeysInfo() {
    const keys = await prisma.apiKey.findMany({
      select: {
        id: true,
        name: true,
        key: true,
        type: true,
        isActive: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return keys.map((key) => ({
      ...key,
      // Solo mostrar parte de la referencia, NUNCA la clave real
      partialKey: this.maskKey(key.key),
      status: this.getKeyStatus(key),
    }));
  }

  // Helpers privados
  private static async updateLastUsed(key: string) {
    await prisma.apiKey.update({
      where: { id: key },
      data: { lastUsedAt: new Date() },
    });
  }

  private static maskKey(keyId: string): string {
    const realKey = this.ENV_MAPPING[keyId as keyof typeof this.ENV_MAPPING];

    if (!realKey || realKey.length < 8) return "****-****-****-****";

    const visibleStart = realKey.slice(0, 4);
    const visibleEnd = realKey.slice(-4);
    return `${visibleStart}****-****${visibleEnd}`;
  }

  private static getKeyStatus(key: ApiKey): "healthy" | "expired" | "inactive" {
    if (!key.isActive) return "inactive";
    if (key.expiresAt && key.expiresAt < new Date()) return "expired";
    return "healthy";
  }
}
