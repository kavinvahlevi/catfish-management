
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Droplets,
  ListTodo,
  LineChart,
  Wallet,
  Calendar,
  Sparkles,
} from "lucide-react";
import { FishIcon } from "@/components/icons";
import { FarmDataProvider } from "@/contexts/FarmDataContext";

const menuItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/ponds", icon: Droplets, label: "Manajemen Kolam" },
  { href: "/feeding-schedule", icon: ListTodo, label: "Jadwal Pakan" },
  { href: "/growth-monitoring", icon: LineChart, label: "Monitoring Pertumbuhan" },
  { href: "/finance", icon: Wallet, label: "Catatan Keuangan" },
  { href: "/calendar", icon: Calendar, label: "Kalender Budidaya" },
  { href: "/tips", icon: Sparkles, label: "Tips Budidaya" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // NOTE: This is a workaround for a hydration mismatch error.
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }
  
  return (
    <FarmDataProvider>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center gap-2">
                <FishIcon className="w-8 h-8 text-primary" />
                <h1 className="text-xl font-bold tracking-tighter text-foreground">
                  CatfishCare
                </h1>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.href === '/' ? pathname === item.href : pathname.startsWith(item.href)}
                      tooltip={{ children: item.label }}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <SidebarInset className="flex flex-col flex-1">
            <header className="flex h-14 items-center gap-4 border-b bg-card px-6 md:hidden">
              <SidebarTrigger>
                <FishIcon className="w-6 h-6 text-primary" />
                <span className="sr-only">Toggle sidebar</span>
              </SidebarTrigger>
              <h1 className="text-lg font-semibold">CatfishCare</h1>
            </header>
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </FarmDataProvider>
  );
}
