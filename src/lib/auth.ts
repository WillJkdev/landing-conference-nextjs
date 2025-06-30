import { authConfig } from "@/auth.config";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import type { Admin } from "@/generated/prisma/client";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

async function getAdmin(email: string): Promise<Admin | null> {
  try {
    const UserAdmin = await prisma.admin.findUnique({
      where: { email },
    });
    return UserAdmin;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        const user = await getAdmin(email);
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (passwordsMatch) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: "admin",
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return {
          ...token,
          ...(session?.user && {
            name: session.user.name,
            email: session.user.email,
          }),
        };
      }

      if (user) {
        token.id = user.id;
        token.role = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
