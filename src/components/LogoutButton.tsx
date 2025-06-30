"use client";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";

import { logout } from "@/lib/actions";

export default function Logout() {
  return (
    <Button onClick={logout} variant="ghost" className="w-full justify-start">
      <LogOut className="h-5 w-5" />
      <span className="ml-2">Cerrar sesión</span>
    </Button>
  );
}
