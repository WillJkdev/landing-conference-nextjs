"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function DashboardNav() {
  const pathname = usePathname();
  const items = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
  ];
  return (
    <div className="flex h-full flex-col">
      <nav className="grid items-start gap-2 px-2 py-4 text-sm">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "relative justify-start"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
        <div className="mt-auto">
          <Separator className="my-4" />
          <div className="px-2">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </div>
  );
}
