"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center justify-between space-x-2 rounded-lg border p-2 cursor-default">
      <div className="flex items-center space-x-2">
        <Sun className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
        <span className="text-sm font-medium">Claro</span>
      </div>
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        className="data-[state=checked]:bg-slate-700 cursor-pointer"
      />
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Oscuro</span>
        <Moon className="h-4 w-4 text-slate-700 dark:text-slate-400" />
      </div>
    </div>
  );
}
