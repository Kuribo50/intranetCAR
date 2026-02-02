"use client";

import { useSession } from "next-auth/react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { useAdmin } from "@/contexts/AdminContext";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Settings,
  UserCog,
  Phone,
  FileText,
  Grid3x3,
  Image as ImageIcon,
  CalendarDays,
  Menu,
  Cog,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "EDITOR";

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <AdminLogin />
      </div>
    );
  }

  const sections = [
    {
      href: "/admin/calendario",
      name: "Eventos",
      icon: CalendarDays,
      description: "Calendario y listado de eventos",
    },
    {
      href: "/admin/usuarios",
      name: "Usuarios",
      icon: UserCog,
      description: "Gestión de cuentas",
    },
    {
      href: "/admin/anexos",
      name: "Anexos",
      icon: Phone,
      description: "Directorio telefónico",
    },
    {
      href: "/admin/documentos",
      name: "Documentos",
      icon: FileText,
      description: "Repositorio de archivos",
    },
    {
      href: "/admin/carrusel",
      name: "Carrusel Hero",
      icon: ImageIcon,
      description: "Imágenes principales",
    },
    {
      href: "/admin/aplicaciones",
      name: "Apps y Links",
      icon: Grid3x3,
      description: "Accesos directos",
    },
    {
      href: "/admin/configuracion",
      name: "Configuración",
      icon: Cog,
      description: "Estamentos, Programas y Salas",
    },
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const activeSection = sections.find((s) => pathname.includes(s.href));

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Container */}
      <div className="flex flex-1 items-start">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 lg:translate-x-0 lg:h-[calc(100vh-5rem)] lg:sticky lg:top-20",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
            isCollapsed ? "w-16 lg:w-16" : "w-64 lg:w-56",
          )}
        >
          <div className="flex flex-col h-full relative">
            {/* Collapse Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute -right-3 top-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1 shadow-md hidden lg:flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors z-50 transform hover:scale-110"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>

            <div className="p-4 overflow-x-hidden flex-1 overflow-y-auto">
              <div
                className={cn(
                  "flex items-center gap-3 mb-8 transition-all duration-300",
                  isCollapsed ? "justify-center" : "justify-start",
                )}
              >
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg shrink-0">
                  <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div
                  className={cn(
                    "transition-all duration-300 whitespace-nowrap overflow-hidden",
                    isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100",
                  )}
                >
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    Panel Admin
                  </h2>
                  <p className="text-xs text-slate-500">Gestión Intranet</p>
                </div>
              </div>

              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = pathname.startsWith(section.href);
                  return (
                    <Link
                      key={section.href}
                      href={section.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      title={isCollapsed ? section.name : undefined}
                      className={cn(
                        "w-full flex items-center gap-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                        isCollapsed ? "justify-center px-2" : "px-4",
                        isActive
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200",
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-blue-600 rounded-r-full" />
                      )}
                      <Icon
                        className={cn(
                          "h-5 w-5 transition-colors shrink-0",
                          isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300",
                        )}
                      />
                      <div
                        className={cn(
                          "transition-all duration-300 whitespace-nowrap overflow-hidden",
                          isCollapsed
                            ? "w-0 opacity-0 hidden"
                            : "w-auto opacity-100",
                        )}
                      >
                        <span className="block font-medium text-sm">
                          {section.name}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-hidden space-y-2">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className={cn(
                  "w-full text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 gap-3 transition-all",
                  isCollapsed ? "justify-center px-2" : "justify-start",
                )}
                title={isCollapsed ? "Cerrar Sesión" : undefined}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span
                  className={cn(
                    "whitespace-nowrap transition-all duration-300",
                    isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100",
                  )}
                >
                  Cerrar Sesión
                </span>
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
          {/* Top bar for mobile */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <span className="font-bold text-slate-900 dark:text-white">
                Panel de Administración
              </span>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-10rem)] pb-20">
            <div className="w-full space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 min-h-[600px]">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Full Width Footer */}
      <Footer />
    </div>
  );
}
