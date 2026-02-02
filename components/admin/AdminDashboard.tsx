"use client";

import { useAdmin } from "@/contexts/AdminContext";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Settings,
  Users,
  Phone,
  FileText,
  Grid3x3,
  Image as ImageIcon,
  Megaphone,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { AdminAplicaciones } from "./AdminAplicaciones";
import { AdminCumpleanos } from "./AdminCumpleanos";
import { AdminAnexos } from "./AdminAnexos";
import { AdminDocumentos } from "./AdminDocumentos";
import { AdminCarrusel } from "./AdminCarrusel";
import { AdminEventos } from "./AdminEventos";
import { cn } from "@/lib/utils";

type AdminSection =
  | "apps"
  | "birthdays"
  | "contacts"
  | "documents"
  | "carousel"
  | "announcements";

export function AdminDashboard() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };
  const [activeSection, setActiveSection] = useState<AdminSection>("apps");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    {
      id: "apps" as AdminSection,
      name: "Tarjetas y Apps",
      icon: Grid3x3,
      description: "Gestiona los accesos directos",
    },
    {
      id: "announcements" as AdminSection,
      name: "Anuncios",
      icon: Megaphone,
      description: "Avisos importantes",
    },
    {
      id: "birthdays" as AdminSection,
      name: "Cumpleaños",
      icon: Users,
      description: "Registro de funcionarios",
    },
    {
      id: "contacts" as AdminSection,
      name: "Anexos",
      icon: Phone,
      description: "Directorio telefónico",
    },
    {
      id: "documents" as AdminSection,
      name: "Documentos",
      icon: FileText,
      description: "Repositorio de archivos",
    },
    {
      id: "carousel" as AdminSection,
      name: "Carrusel Hero",
      icon: ImageIcon,
      description: "Imágenes principales",
    },
  ];

  const activeSectionData = sections.find((s) => s.id === activeSection);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Lighter Theme */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 overflow-y-auto",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Panel Admin
              </h2>
              <p className="text-xs text-slate-500">Gestión Intranet v2.0</p>
            </div>
          </div>

          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left relative overflow-hidden",
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
                      "h-5 w-5 transition-colors",
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300",
                    )}
                  />
                  <div>
                    <span className="block font-medium text-sm">
                      {section.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 gap-3"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 overflow-hidden">
        {/* Top bar for mobile */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="h-full flex flex-col space-y-6">
            <header className="flex-shrink-0">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {activeSectionData?.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                {activeSectionData?.description}
              </p>
            </header>

            <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 min-h-0 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto p-6">
                {activeSection === "apps" && <AdminAplicaciones />}
                {activeSection === "birthdays" && <AdminCumpleanos />}
                {activeSection === "contacts" && <AdminAnexos />}
                {activeSection === "documents" && <AdminDocumentos />}
                {activeSection === "carousel" && <AdminCarrusel />}
                {activeSection === "announcements" && <AdminEventos />}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
