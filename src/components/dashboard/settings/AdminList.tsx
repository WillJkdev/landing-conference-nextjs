import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Admin } from "@/generated/prisma";
import { Users } from "lucide-react";

interface Props {
  admins: Pick<Admin, "id" | "name" | "email" | "role">[];
}

export default function AdminList({ admins }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Administradores
        </CardTitle>
        <CardDescription>
          Gestiona quién tiene acceso al dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <div className="font-medium">{admin.name}</div>
                <div className="font-medium">{admin.email}</div>
                <div className="text-muted-foreground text-sm">
                  {admin.role === "admin" ? "Administrador Principal" : "Staff"}
                </div>
              </div>
              <Button variant="outline" size="sm" type="button">
                Editar
              </Button>
            </div>
          ))}
          {admins.length === 0 && (
            <div className="text-muted-foreground py-4 text-center">
              No hay administradores configurados
            </div>
          )}
        </div>
        <Button variant="outline" type="button">
          <Users className="mr-2 h-4 w-4" />
          Agregar Administrador
        </Button>
      </CardContent>
    </Card>
  );
}
