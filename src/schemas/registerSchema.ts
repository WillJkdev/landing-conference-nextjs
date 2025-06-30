import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z
    .string()
    .regex(/^\d{7,15}$/, { message: "Número de teléfono inválido" }),
  // password: z.string().min(8, { message: "Mínimo 8 caracteres" }),
  acceptTerms: z.boolean().refine((val) => val, {
    message: "Debes aceptar los términos",
  }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
