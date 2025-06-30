"use server";
import { PaymentLinkEmail } from "@/components/emails/PaymentLinkEmail";
import { signIn, signOut } from "@/lib/auth";
import { preference } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { RegisterFormValues, registerSchema } from "@/schemas/registerSchema";
import {
  EmailSettingsForm,
  EventSettingsForm,
  SecuritySettingsForm,
  UpdateEmailSettingsState,
  UpdateEventSettingsState,
  UpdateSecuritySettingsState,
  UpdateUrlSettingsState,
  UrlSettingsForm,
} from "@/types/SettingsType";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

// ⛓️ Register Form
export async function registerForm(data: RegisterFormValues) {
  const result = registerSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: result.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone } = result.data;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return {
        success: false,
        error: {
          email: ["Este correo ya está registrado"],
        },
      };
    }

    const [pageURL, settings, emailSettings] = await Promise.all([
      prisma.urlSettings.findFirst(),
      prisma.eventSettings.findFirst(),
      prisma.emailSettings.findFirst(),
    ]);
    if (!pageURL || !settings) {
      throw new Error("Error al obtener URL de página");
    }
    const { websiteUrl } = pageURL;
    const { ticketPrice } = settings;
    const { senderName, senderEmail, replyToEmail } = emailSettings || {
      senderName: "Conferencia",
      senderEmail: "conferencia@gmail.com",
      replyToEmail: "conferencia@gmail.com",
    };

    // ⛓️ Prisma Transaction
    const { payment, user } = await prisma.$transaction(async (tx) => {
      // Crear usuario y ticket en una sola operación
      const user = await tx.user.create({
        data: {
          name,
          email,
          phone,
          // password: await bcrypt.hash(password, 10),
          Ticket: {
            create: {
              paid: false,
              checkedIn: false,
              paymentStatus: "pending",
              amount: ticketPrice || 20,
            },
          },
        },
        include: { Ticket: true },
      });
      if (!user.Ticket) {
        throw new Error("Error al crear ticket");
      }

      // Crear preferencia de pago con Mercado Pago (fuera de Prisma)
      const payment = await preference.create({
        body: {
          items: [
            {
              id: "entrada-conferencia",
              title: "Entrada a conferencia",
              quantity: 1,
              unit_price: ticketPrice || 20,
            },
          ],
          external_reference: user.email,
          notification_url: `${websiteUrl ?? process.env.BASE_URL}/api/mercadopago/webhook`,
          back_urls: {
            success: `${websiteUrl ?? process.env.BASE_URL}/confirmation`,
            failure: `${websiteUrl ?? process.env.BASE_URL}/error`,
            pending: `${websiteUrl ?? process.env.BASE_URL}/pending`,
          },
          auto_return: "approved",
          metadata: {
            user_id: user.id.toString(),
          },
        },
      });

      // console.log("🟢 Payment-ACTIONS:", payment);

      const initPoint = payment.init_point;
      if (!initPoint) throw new Error("Error al generar enlace de pago");

      // Actualizar ticket con info del pago
      await tx.ticket.update({
        where: { userId: user.id },
        data: {
          initPoint,
          paymentPreferenceId: payment.id,
          paymentStatus: "pending",
          paymentGateway: "mercadopago",
        },
      });

      return { user, payment };
    });

    const paymentLink = `${websiteUrl ?? process.env.BASE_URL}/payment/${user.id}`;

    // Enviar correo luego de la transacción
    if (payment.init_point) {
      try {
        console.log("Email:", email);
        const response = await resend.emails.send({
          // from: "Conferencia <onboarding@resend.dev>",
          from: `${senderName} <${senderEmail}>`,
          to: email, // poner email para production
          replyTo: replyToEmail,
          subject: "Completa tu pago",
          react: PaymentLinkEmail({ name, paymentLink: paymentLink }),
          tags: [
            { name: "ticketId", value: user.Ticket?.id.toString() || "" },
            { name: "userId", value: user.id.toString() },
          ],
        });
        await prisma.ticket.update({
          where: { userId: user.id.toString() },
          data: { paymentEmailSent: true },
        });

        console.log("📧 Respuesta de Resend:", response);
      } catch (emailError) {
        console.error("Error enviando email:", emailError);
      }
    }

    return { success: true, checkoutUrl: paymentLink };
  } catch (err) {
    console.error("Error en registerForm:", err);
    return {
      success: false,
      error: {
        root: ["Error inesperado al registrar. Intenta de nuevo."],
      },
    };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Credenciales incorrectas.";
        default:
          return "Error al iniciar sesión.";
      }
    }
    throw error;
  }
}
export async function logout() {
  await signOut({ redirectTo: "/" });
}

// Función para obtener todas las configuraciones
export async function getSettings() {
  try {
    const [
      eventSettings,
      urlSettings,
      emailSettings,
      securitySettings,
      admins,
    ] = await Promise.all([
      prisma.eventSettings.findFirst(),
      prisma.urlSettings.findFirst(),
      prisma.emailSettings.findFirst(),
      prisma.securitySettings.findFirst(),
      prisma.admin.findMany({
        where: { isActive: true },
        select: { id: true, name: true, email: true, role: true },
      }),
    ]);

    return {
      eventSettings,
      urlSettings,
      emailSettings,
      securitySettings,
      admins,
    };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {
      eventSettings: null,
      urlSettings: null,
      emailSettings: null,
      securitySettings: null,
      admins: [],
    };
  }
}

export async function updateEventSettings(
  prevState: UpdateEventSettingsState,
  formData: FormData,
): Promise<UpdateEventSettingsState> {
  try {
    const data: EventSettingsForm = {
      name: formData.get("name") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      location: formData.get("location") as string,
      description: formData.get("description") as string,
      maxAttendees: parseInt(formData.get("maxAttendees") as string),
      ticketPrice: parseFloat(formData.get("ticketPrice") as string),
      currency: formData.get("currency") as string,
      durationDays: parseInt(formData.get("durationDays") as string),
    };

    // Buscar configuración existente
    const existingSettings = await prisma.eventSettings.findFirst();

    if (existingSettings) {
      await prisma.eventSettings.update({
        where: { id: existingSettings.id },
        data: {
          ...data,
          date: new Date(data.date + "T" + data.time),
        },
      });
    } else {
      await prisma.eventSettings.create({
        data: {
          ...data,
          date: new Date(data.date + "T" + data.time),
        },
      });
    }

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message: "Configuración actualizada correctamente",
    };
  } catch (error) {
    console.error("Error updating event settings:", error);
    return {
      success: false,
      message: "Error al actualizar la configuración",
    };
  }
}

export async function updateUrlSettings(
  prevState: UpdateUrlSettingsState,
  formData: FormData,
): Promise<UpdateUrlSettingsState> {
  try {
    const data: UrlSettingsForm = {
      confirmationUrl: formData.get("confirmationUrl") as string,
      presentationUrl: formData.get("presentationUrl") as string,
      websiteUrl: formData.get("websiteUrl") as string,
    };

    const existingSettings = await prisma.urlSettings.findFirst();

    if (existingSettings) {
      await prisma.urlSettings.update({
        where: { id: existingSettings.id },
        data,
      });
    } else {
      await prisma.urlSettings.create({ data });
    }

    revalidatePath("/dashboard/settings");
    return { success: true, message: "URLs actualizadas correctamente" };
  } catch (error) {
    console.error("Error updating URL settings:", error);
    return { success: false, message: "Error al actualizar las URLs" };
  }
}

export async function updateEmailSettings(
  prevState: UpdateEmailSettingsState,
  formData: FormData,
): Promise<UpdateEmailSettingsState> {
  try {
    const data: EmailSettingsForm = {
      senderName: formData.get("senderName") as string,
      senderEmail: formData.get("senderEmail") as string,
      replyToEmail: formData.get("replyToEmail") as string,
      enableReminders: formData.get("enableReminders") === "on",
      reminderDays: parseInt(formData.get("reminderDays") as string),
    };

    const existingSettings = await prisma.emailSettings.findFirst();

    if (existingSettings) {
      await prisma.emailSettings.update({
        where: { id: existingSettings.id },
        data,
      });
    } else {
      await prisma.emailSettings.create({ data });
    }

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message: "Configuración actualizada correctamente",
    };
  } catch (error) {
    console.error("Error updating email settings:", error);
    return {
      success: false,
      message: "Error al actualizar la configuración",
    };
  }
}

export async function updateSecuritySettings(
  prevState: UpdateSecuritySettingsState,
  formData: FormData,
): Promise<UpdateSecuritySettingsState> {
  try {
    const data: SecuritySettingsForm = {
      requireEmailVerification:
        formData.get("requireEmailVerification") === "on",
      enableTwoFactor: formData.get("enableTwoFactor") === "on",
      sessionTimeout: parseInt(formData.get("sessionTimeout") as string),
    };

    const existingSettings = await prisma.securitySettings.findFirst();

    if (existingSettings) {
      await prisma.securitySettings.update({
        where: { id: existingSettings.id },
        data,
      });
    } else {
      await prisma.securitySettings.create({ data });
    }

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message: "Configuración actualizada correctamente",
    };
  } catch (error) {
    console.error("Error updating security settings:", error);
    return { success: false, message: "Error al actualizar la configuración" };
  }
}
