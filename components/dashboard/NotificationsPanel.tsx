"use client";

import * as React from "react";
import {
  Bell,
  X,
  Check,
  Info,
  AlertTriangle,
  CheckCircle,
  Calendar,
  FileText,
  Cake,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

const typeIcons: Record<string, React.ElementType> = {
  INFO: Info,
  SUCCESS: CheckCircle,
  WARNING: AlertTriangle,
  ERROR: AlertTriangle,
  BIRTHDAY: Cake,
  EVENT: Calendar,
  DOCUMENT: FileText,
  REMINDER: Bell,
};

const typeColors: Record<string, { bg: string; text: string; iconBg: string }> =
  {
    INFO: { bg: "bg-blue-50", text: "text-blue-600", iconBg: "bg-blue-500" },
    SUCCESS: {
      bg: "bg-green-50",
      text: "text-green-600",
      iconBg: "bg-green-500",
    },
    WARNING: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      iconBg: "bg-amber-500",
    },
    ERROR: { bg: "bg-red-50", text: "text-red-600", iconBg: "bg-red-500" },
    BIRTHDAY: {
      bg: "bg-pink-50",
      text: "text-pink-600",
      iconBg: "bg-pink-500",
    },
    EVENT: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      iconBg: "bg-purple-500",
    },
    DOCUMENT: {
      bg: "bg-cyan-50",
      text: "text-cyan-600",
      iconBg: "bg-cyan-500",
    },
    REMINDER: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      iconBg: "bg-orange-500",
    },
  };

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  bellButtonRef?: React.RefObject<HTMLButtonElement>;
}

export function NotificationsPanel({
  isOpen,
  onClose,
  bellButtonRef,
}: NotificationsPanelProps) {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    async function fetchNotifications() {
      try {
        const today = new Date();
        const todayISO = today.toISOString();

        // Parallel fetch: Real Notifications + All Daily Events
        const [notifsResponse, eventsResponse] = await Promise.all([
          fetch("/api/notifications?limit=10"),
          fetch(`/api/events?startDate=${todayISO}&endDate=${todayISO}`),
        ]);

        let combinedNotifications: Notification[] = [];

        // 1. Validar Notificaciones Reales
        if (notifsResponse.ok) {
          const data = await notifsResponse.json();
          combinedNotifications = [...data];
        }

        // 2. Validar Eventos del Día (Notificaciones Virtuales)
        if (eventsResponse.ok) {
          const events = await eventsResponse.json();
          const virtualNotifications = events.map((evt: any) => {
            // Determine ID and Content based on Type
            let virtualId = `event-${evt.id}`;
            let title = evt.title;
            let message = evt.description || "Evento hoy";
            let type = "EVENT";

            if (evt.type === "BIRTHDAY") {
              virtualId = `birthday-${evt.id}`;
              title = `¡Cumpleaños de ${evt.title}! 🎂`;
              message = `Hoy celebramos a ${evt.title}. ¡Deséale un gran día!`;
              type = "BIRTHDAY";
            } else if (evt.type === "MEETING") {
              virtualId = `event-${evt.id}`;
              title = `Reunión: ${evt.title}`;
              message = evt.location
                ? `📍 ${evt.location} - ${new Date(evt.startDate).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`
                : "Reunión agendada para hoy";
              type = "EVENT";
            } else if (evt.type === "EVENT") {
              virtualId = `event-${evt.id}`;
              title = `Evento: ${evt.title}`;
              message = evt.location
                ? `📍 ${evt.location} - ${new Date(evt.startDate).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`
                : "Evento agendado para hoy";
              type = "EVENT";
            } else if (evt.type === "HOLIDAY") {
              virtualId = `event-${evt.id}`;
              title = `Feriado: ${evt.title}`;
              type = "INFO";
            }

            const isRead = localStorage.getItem(`read-${virtualId}`) === "true";

            return {
              id: virtualId,
              title,
              message,
              type,
              link: null,
              read: isRead,
              createdAt: new Date().toISOString(),
            };
          });

          combinedNotifications = [
            ...virtualNotifications,
            ...combinedNotifications,
          ];
        }

        setNotifications(combinedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      // Check if click is outside panel AND not on bell button
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        (!bellButtonRef?.current || !bellButtonRef.current.contains(target))
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, bellButtonRef]);

  const markAsRead = async (id: string) => {
    // Handle Virtual Notifications
    if (id.startsWith("birthday-") || id.startsWith("event-")) {
      localStorage.setItem(`read-${id}`, "true");
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      return;
    }

    // Handle Real Database Notifications
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    for (const id of unreadIds) {
      await markAsRead(id);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString("es-CL", { day: "numeric", month: "short" });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Sin blur */}
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          /> */}

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                damping: 15,
                stiffness: 300,
                duration: 0.4,
              },
            }}
            exit={{
              opacity: 0,
              y: -20,
              scale: 0.95,
              transition: { duration: 0.2 },
            }}
            className="fixed top-16 right-4 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-slate-700" />
                  <h3 className="font-semibold text-slate-900">
                    Notificaciones
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Marcar todas
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X className="h-4 w-4 text-slate-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[60vh] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  Cargando notificaciones...
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {notifications.map((notification, index) => {
                    const colors =
                      typeColors[notification.type] || typeColors.INFO;
                    const Icon = typeIcons[notification.type] || typeIcons.INFO;

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={cn(
                          "p-4 hover:bg-slate-50 transition-colors cursor-pointer relative",
                          !notification.read && "bg-blue-50/50",
                        )}
                        onClick={() => {
                          if (!notification.read) {
                            markAsRead(notification.id);
                          }
                          if (notification.link) {
                            window.open(notification.link, "_blank");
                          }
                        }}
                      >
                        {!notification.read && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                        )}
                        <div className="flex gap-3">
                          <div
                            className={cn(
                              "p-2 rounded-lg flex-shrink-0",
                              colors.iconBg,
                            )}
                          >
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={cn(
                                  "text-sm font-medium text-slate-900",
                                  !notification.read && "font-semibold",
                                )}
                              >
                                {notification.title}
                              </p>
                              <span className="text-xs text-slate-400 whitespace-nowrap">
                                {formatTime(notification.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="p-3 bg-slate-100 rounded-full inline-block mb-3">
                    <Bell className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500">
                    No tienes notificaciones
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook para usar las notificaciones
export function useNotifications() {
  const { status } = useSession();
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchUnreadCount() {
      try {
        const today = new Date().toISOString();
        const [notifRes, eventRes] = await Promise.all([
          fetch("/api/notifications?unreadOnly=true"),
          fetch(`/api/events?startDate=${today}&endDate=${today}`),
        ]);

        let count = 0;

        if (notifRes.ok) {
          const data = await notifRes.json();
          count += data.length;
        }

        if (eventRes.ok) {
          const events = await eventRes.json();
          // Check localStorage for each event
          const unreadEvents = events.filter((e: any) => {
            const prefix = e.type === "BIRTHDAY" ? "birthday-" : "event-";
            return localStorage.getItem(`read-${prefix}${e.id}`) !== "true";
          });
          count += unreadEvents.length;
        }

        setUnreadCount(count);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    }

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [status]);

  return { unreadCount };
}
