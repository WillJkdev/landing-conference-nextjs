import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const protectedRoutes = ["/dashboard", "/admin", "/scan-reader"];
      const isProtected = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      );

      // Solo bloquear si se intenta acceder a rutas protegidas sin login
      if (isProtected) {
        return isLoggedIn;
      }

      // Permitir acceso libre a rutas públicas (como "/"), incluso logueado
      return true;
    },
    async redirect({ baseUrl }) {
      // Si el usuario accede desde otra parte, redirígelo al dashboard por defecto
      return `${baseUrl}/dashboard`;
    },
  },

  providers: [],
} satisfies NextAuthConfig;
