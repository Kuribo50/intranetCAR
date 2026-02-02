"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  Phone,
  Megaphone,
  FileText,
  Layers,
  ShieldCheck,
  Moon,
  Bell,
  Cake,
  User,
  LogOut,
  Lock,
  Home,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import {
  useNotifications,
  NotificationsPanel,
} from "@/components/dashboard/NotificationsPanel";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "EDITOR";
  const { unreadCount } = useNotifications();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [previousUnreadCount, setPreviousUnreadCount] = useState(0);
  const [manualClose, setManualClose] = useState(false);

  // Check storage on mount
  useState(() => {
    if (typeof window !== "undefined") {
      const isDark = localStorage.getItem("theme") === "dark";
      if (
        isDark ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  });

  // Auto-open when NEW notifications arrive (only if not manually closed)
  useEffect(() => {
    if (
      unreadCount > previousUnreadCount &&
      previousUnreadCount > 0 &&
      !manualClose
    ) {
      // Nueva notificación detectada
      setIsNotificationsOpen(true);
    }
    setPreviousUnreadCount(unreadCount);
  }, [unreadCount, manualClose]);

  // Auto-open on first load if there are unread notifications
  useEffect(() => {
    if (unreadCount > 0) {
      const hasOpened = sessionStorage.getItem("notifications_auto_opened");
      if (!hasOpened) {
        setIsNotificationsOpen(true);
        sessionStorage.setItem("notifications_auto_opened", "true");
      }
    }
  }, []);

  const handleToggleNotifications = () => {
    const newState = !isNotificationsOpen;
    setIsNotificationsOpen(newState);

    // Si el usuario cierra manualmente, marcar para evitar auto-reopen
    if (!newState) {
      setManualClose(true);
      // Resetear después de 5 segundos para permitir auto-open de nuevas notificaciones
      setTimeout(() => setManualClose(false), 5000);
    }
  };

  const bellButtonRef = React.useRef<HTMLButtonElement>(null);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  if (pathname === "/login" || pathname === "/change-password") {
    return null;
  }

  return (
    <>
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-primary to-secondary p-0.5 rounded-xl shadow-lg shadow-blue-500/20">
                  <div className="bg-white dark:bg-slate-900 w-10 h-10 rounded-[10px] flex items-center justify-center">
                    <span className="text-primary font-extrabold text-xl">
                      C
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <h1 className="font-bold text-slate-900 dark:text-white text-lg leading-tight tracking-tight">
                    CESFAM
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Dr. Alberto Reyes
                  </p>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700">
              <Link
                href="/"
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-white dark:hover:bg-slate-700 px-4 py-2 rounded-xl transition-all font-medium text-sm group"
              >
                <Home className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                <span>Inicio</span>
              </Link>
              <Link
                href="/anexos"
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-white dark:hover:bg-slate-700 px-4 py-2 rounded-xl transition-all font-medium text-sm group"
              >
                <Phone className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                <span>Anexos</span>
              </Link>
              <Link
                href="/noticias"
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-white dark:hover:bg-slate-700 px-4 py-2 rounded-xl transition-all font-medium text-sm group"
              >
                <Megaphone className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                <span>Muro</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-white dark:hover:bg-slate-700 px-4 py-2 rounded-xl transition-all font-medium text-sm group"
              >
                <FileText className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                <span>Documentos</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-white dark:hover:bg-slate-700 px-4 py-2 rounded-xl transition-all font-medium text-sm group"
              >
                <Layers className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                <span>Varios</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-white dark:hover:bg-slate-700 px-4 py-2 rounded-xl transition-all font-medium text-sm group"
              >
                <Cake className="w-5 h-5 text-slate-400 group-hover:text-pink-500 transition-colors" />
                <span>Cumpleaños</span>
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link href="/admin" title="Panel de Administración">
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-sm font-medium hidden md:inline">
                      Admin
                    </span>
                  </button>
                </Link>
              )}

              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              >
                <Moon className="w-6 h-6" />
              </button>

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

              <button
                ref={bellButtonRef}
                onClick={handleToggleNotifications}
                className={cn(
                  "relative w-10 h-10 flex items-center justify-center rounded-full text-slate-500 transition-all",
                  isNotificationsOpen
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800",
                )}
              >
                <Bell
                  className={cn(
                    "w-6 h-6 transition-transform",
                    isNotificationsOpen && "scale-110",
                    unreadCount > previousUnreadCount &&
                      previousUnreadCount > 0 &&
                      "animate-shake",
                  )}
                />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                )}
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px] cursor-pointer hover:shadow-glow transition-shadow">
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                      {(session?.user as any)?.image ? (
                        <img
                          src={(session?.user as any).image}
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-bold text-xs text-primary">
                          {session?.user?.name
                            ? session.user.name.substring(0, 2).toUpperCase()
                            : "AR"}
                        </span>
                      )}
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session?.user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {(session?.user as any)?.rut}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/change-password" className="cursor-pointer">
                      <Lock className="mr-2 h-4 w-4" />
                      <span>Cambiar Contraseña</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {isNotificationsOpen && (
        <NotificationsPanel
          isOpen={isNotificationsOpen}
          onClose={() => {
            setIsNotificationsOpen(false);
            setManualClose(true);
            setTimeout(() => setManualClose(false), 5000);
          }}
          bellButtonRef={bellButtonRef}
        />
      )}
    </>
  );
}
