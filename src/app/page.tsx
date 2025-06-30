import EventMap from "@/components/EventMap";
import RegisterForm from "@/components/RegisterForm";
import SpeakerCard from "@/components/SpeakerCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
  User,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TechConf 2024",
  description:
    "La conferencia tecnológica más importante del año en Lima, Perú",
};

export default async function ConferenceLanding() {
  const session = await auth();

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"></div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                TechConf 2024
              </span>
            </div>
            <div className="hidden items-center space-x-6 md:flex">
              <Link
                href="#speakers"
                className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Speakers
              </Link>
              <Link
                href="#agenda"
                className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Agenda
              </Link>
              <Link
                href="#location"
                className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Ubicación
              </Link>
              <Link
                href="#register"
                className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Registro
              </Link>
              {session?.user && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  <User className="h-4 w-4" />
                  <span>{session.user.name}</span>
                </Link>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 lg:py-32 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-500/20 dark:to-purple-500/20"></div>
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 h-20 w-20 rounded-full bg-blue-500/10 blur-xl dark:bg-blue-400/20"></div>
        <div className="absolute right-10 bottom-20 h-32 w-32 rounded-full bg-purple-500/10 blur-xl dark:bg-purple-400/20"></div>

        <div className="relative container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 border-0 bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900/70">
              15-16 Marzo 2024
            </Badge>
            <h1 className="mb-6 text-4xl font-bold text-gray-900 lg:text-6xl dark:text-white">
              La Conferencia de
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                {" "}
                Tecnología{" "}
              </span>
              más Grande del Año
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Únete a más de 1,000 desarrolladores, emprendedores y líderes
              tecnológicos en dos días llenos de innovación, networking y
              aprendizaje.
            </p>
            <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600"
              >
                <Link href="#register" className="flex items-center">
                  Registrarse Ahora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 bg-transparent px-8 py-3 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
              >
                Ver Agenda
              </Button>
            </div>

            {/* Stats */}
            <div className="mx-auto grid max-w-2xl grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  50+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Speakers
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  1000+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Asistentes
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  30+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Charlas
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  2
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Días
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Info */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            <Card className="border-0 bg-white shadow-lg backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800/50">
              <CardHeader>
                <CalendarDays className="mx-auto mb-4 h-12 w-12 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-gray-900 dark:text-white">
                  Fechas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  15-16 Marzo 2024
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Viernes y Sábado
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-lg backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800/50">
              <CardHeader>
                <MapPin className="mx-auto mb-4 h-12 w-12 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-gray-900 dark:text-white">
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Centro de Convenciones
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Lima, Perú
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-lg backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800/50">
              <CardHeader>
                <Users className="mx-auto mb-4 h-12 w-12 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-gray-900 dark:text-white">
                  Networking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  1000+ Profesionales
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Conecta y aprende
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Speakers */}
      <section id="speakers" className="bg-white py-20 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl dark:text-white">
              Speakers Destacados
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Aprende de los mejores expertos en tecnología, innovación y
              emprendimiento
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            <SpeakerCard
              name="Ana García"
              role="CTO en TechCorp"
              topic="IA y Machine Learning"
              image="/placeholder.svg?height=300&width=300"
              company="TechCorp"
            />
            <SpeakerCard
              name="Carlos Mendoza"
              role="Founder & CEO"
              topic="Startups y Escalabilidad"
              image="/placeholder.svg?height=300&width=300"
              company="InnovateLab"
            />
            <SpeakerCard
              name="María Rodriguez"
              role="Lead Developer"
              topic="Frontend Moderno"
              image="/placeholder.svg?height=300&width=300"
              company="DevStudio"
            />
          </div>
          <div className="mt-12 text-center">
            <Button
              variant="outline"
              size="lg"
              className="border-gray-300 bg-transparent hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              Ver Todos los Speakers
            </Button>
          </div>
        </div>
      </section>

      {/* Agenda Preview */}
      <section id="agenda" className="bg-gray-50 py-20 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl dark:text-white">
              Agenda del Evento
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Dos días llenos de contenido de alta calidad
            </p>
          </div>
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Day 1 */}
              <Card className="overflow-hidden border-0 bg-white shadow-lg backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800/50">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white dark:from-blue-500 dark:to-purple-500">
                  <CardTitle className="flex items-center">
                    <CalendarDays className="mr-2 h-5 w-5" />
                    Día 1 - Viernes 15 Marzo
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Clock className="mt-0.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          9:00 - 9:30
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          Registro y Networking
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="mt-0.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          9:30 - 10:30
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          Keynote: El Futuro de la IA
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="mt-0.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          11:00 - 12:00
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          Panel: Startups Tech
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="mt-0.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          14:00 - 15:00
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          Workshop: React Avanzado
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Day 2 */}
              <Card className="overflow-hidden border-0 bg-white shadow-lg backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800/50">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white dark:from-purple-500 dark:to-pink-500">
                  <CardTitle className="flex items-center">
                    <CalendarDays className="mr-2 h-5 w-5" />
                    Día 2 - Sábado 16 Marzo
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Clock className="mt-0.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          9:00 - 10:00
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          Keynote: Cloud Computing
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="mt-0.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          10:30 - 11:30
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          DevOps en la Práctica
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="mt-0.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          12:00 - 13:00
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          Ciberseguridad 2024
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="mt-0.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          15:00 - 16:00
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          Networking Final
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="register" className="bg-white py-20 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl dark:text-white">
              Regístrate Ahora
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Asegura tu lugar en la conferencia más importante del año
            </p>
          </div>
          <RegisterForm />
        </div>
      </section>

      {/* Location Map */}
      <section id="location" className="bg-gray-50 py-20 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl dark:text-white">
              Ubicación del Evento
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Centro de Convenciones de Lima - Fácil acceso y estacionamiento
            </p>
          </div>
          <div className="mx-auto max-w-4xl">
            <EventMap />
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <Card className="border-0 bg-white shadow-lg dark:bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <MapPin className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Dirección
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Av. Javier Prado Este 4200
                    <br />
                    Surco, Lima 15023
                    <br />
                    Perú
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white shadow-lg dark:bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">
                    Información Adicional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Estacionamiento gratuito disponible</li>
                    <li>• Acceso en transporte público</li>
                    <li>• Instalaciones accesibles</li>
                    <li>• WiFi gratuito en todo el recinto</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section className="bg-white py-16 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Patrocinadores
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Gracias a nuestros patrocinadores que hacen posible este evento
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl grid-cols-2 items-center justify-center gap-8 md:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="flex items-center justify-center rounded-lg bg-gray-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md dark:bg-gray-800/50"
              >
                <Image
                  src={`/placeholder.svg?height=60&width=120&text=Sponsor${i}`}
                  alt={`Sponsor ${i}`}
                  width={120}
                  height={60}
                  className="opacity-60 transition-opacity hover:opacity-100 dark:opacity-40 dark:hover:opacity-80"
                  style={{
                    width: "auto",
                    height: "auto",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"></div>
                <span className="text-xl font-bold">TechConf 2024</span>
              </div>
              <p className="text-gray-400 dark:text-gray-300">
                La conferencia de tecnología más importante del año en Perú.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Enlaces</h3>
              <ul className="space-y-2 text-gray-400 dark:text-gray-300">
                <li>
                  <Link
                    href="#speakers"
                    className="transition-colors hover:text-white"
                  >
                    Speakers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#agenda"
                    className="transition-colors hover:text-white"
                  >
                    Agenda
                  </Link>
                </li>
                <li>
                  <Link
                    href="#register"
                    className="transition-colors hover:text-white"
                  >
                    Registro
                  </Link>
                </li>
                <li>
                  <Link
                    href="#location"
                    className="transition-colors hover:text-white"
                  >
                    Ubicación
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Contacto</h3>
              <ul className="space-y-2 text-gray-400 dark:text-gray-300">
                <li>info@techconf2024.com</li>
                <li>+51 999 888 777</li>
                <li>Lima, Perú</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Síguenos</h3>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-white"
                >
                  Twitter
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-white"
                >
                  LinkedIn
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-white"
                >
                  Instagram
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400 dark:border-gray-700 dark:text-gray-300">
            <p>&copy; 2024 TechConf. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
