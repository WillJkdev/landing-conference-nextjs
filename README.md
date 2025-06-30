# 📋 Landing Conference - Next.js App

<p align="center">
  <img src="public/landing-conference.webp" alt="Vista previa de la app" width="700" style="border-radius: 15px;"/>
</p>

> Sistema completo para gestión de conferencias y eventos. Registro, tickets, pagos, escaneo QR, panel administrativo y más.

---

## 🚀 Características principales

- 🌐 Landing page moderna y responsive
- 🦾 Registro de asistentes con validación y confirmación por email
- 🎟️ Generación y validación de tickets con códigos QR
- 💳 Integración con MercadoPago
- 🢁‍♂️ Panel de administración con métricas, usuarios, pagos y configuración
- 🌗 Soporte para modo oscuro
- 📧 Envío automático de emails (registro, ticket, recordatorios)
- ⚙️ Configuración dinámica de evento, dominios y seguridad
- 🔐 Roles diferenciados: administrador y staff

---

## 🧰 Tecnologías utilizadas

- **Next.js 14/15 (App Router + Server Actions)**
- **Tailwind CSS**
- **Prisma ORM + SQLite (o PostgreSQL opcional)**
- **NextAuth para autenticación**
- **Resend API para correos**
- **MercadoPago API**
- **JWT y QR escáner en tiempo real**
- **Cloudinary (para imágenes)**

---

## ⚙️ Instalación local

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/WillJkdev/landing-conference-nextjs.git
   cd landing-conference-nextjs
   ```

2. **Instala dependencias:**

   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**

   Crea un archivo `.env` basado en `.env.example` y agrega tus valores:

   ```env
   DATABASE_URL="file:./dev.db"
   AUTH_SECRET="tu_auth_secret"
   RESEND_API_KEY="tu_resend_api_key"
   RESEND_WEBHOOK_SECRET="tu_resend_webhook_api_key"
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="tu_maps_api_key"
   MP_ACCESS_TOKEN="tu_mercadopago_api_key"
   BASE_URL="url_base_hosting"
   JWT_SECRET="tu_clave_secreta"
   CLOUDINARY_CLOUD_NAME="..."
   CLOUDINARY_API_KEY="..."
   CLOUDINARY_API_SECRET="..."
   ```

4. **Ejecuta migraciones y seeders:**

   ```bash
   npx prisma migrate dev --name init
   npm run seed
   ```

5. **Inicia el servidor de desarrollo:**

   ```bash
   npm run dev
   ```

---

## 📁 Estructura de carpetas

```
landing-conference-nextjs/
├── public/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/           # App Router, rutas y páginas
│   ├── components/    # Componentes UI y layouts
│   ├── lib/           # Lógica de negocio y helpers
│   ├── hooks/         # Hooks personalizados
│   ├── context/       # Contextos globales
│   ├── types/         # Tipado compartido
│   └── schemas/       # Validaciones Zod
├── .env.example
├── package.json
└── README.md
```

---

## 🧪 Scripts útiles

| Comando             | Descripción                      |
| ------------------- | -------------------------------- |
| `npm run dev`       | Inicia el entorno de desarrollo  |
| `npm run build`     | Compila la app para producción   |
| `npm run start`     | Inicia en modo producción        |
| `npm run lint`      | Ejecuta el linter                |
| `npm run seed`      | Inserta datos de prueba          |
| `npx prisma studio` | Interfaz visual de base de datos |

---

## ☁️ Despliegue

Puedes desplegar fácilmente en plataformas como:

- [Vercel](https://vercel.com/)
- [Render](https://render.com/)
- [Railway](https://railway.app/)
- [Fly.io](https://fly.io/)

> Asegúrete de agregar las variables de entorno necesarias en el dashboard de tu plataforma.

---

## 👨‍💼 Créditos

- **Desarrollador**: [@WillJkdev](https://github.com/WillJkdev)
- **Stack**: Next.js, Prisma, Tailwind CSS, MercadoPago, Resend, Cloudinary

---

## 📄 Licencia

Este proyecto está licenciado bajo la [MIT License](LICENSE).

---

_Hecho con ❤️ por [WillJkdev](https://willjk.pages.dev/)_
