"use client";

import * as React from "react";
import {
  Megaphone,
  AlertTriangle,
  Info,
  CheckCircle,
  X,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: number;
  pinned: boolean;
  createdAt: string;
  author?: {
    id: string;
    name: string;
  };
}

const typeConfig: Record<
  string,
  {
    icon: React.ElementType;
    bg: string;
    border: string;
    text: string;
    iconBg: string;
  }
> = {
  INFO: {
    icon: Info,
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    iconBg: "bg-blue-500",
  },
  WARNING: {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    iconBg: "bg-amber-500",
  },
  URGENT: {
    icon: AlertTriangle,
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    iconBg: "bg-red-500",
  },
  SUCCESS: {
    icon: CheckCircle,
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    iconBg: "bg-green-500",
  },
};

interface AnnouncementBoardProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AnnouncementBoard({
  collapsed,
  onToggle,
}: AnnouncementBoardProps) {
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [dismissedIds, setDismissedIds] = React.useState<Set<string>>(
    new Set(),
  );

  React.useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const response = await fetch("/api/announcements?limit=5");
        if (response.ok) {
          const data = await response.json();
          setAnnouncements(data);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString("es-CL", { day: "numeric", month: "short" });
  };

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set([...Array.from(prev), id]));
  };

  const visibleAnnouncements = announcements.filter(
    (a) => !dismissedIds.has(a.id),
  );

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-sm">
            <Megaphone className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Anuncios</h3>
            <p className="text-sm text-slate-500">Comunicados importantes</p>
          </div>
        </div>
        <div className="text-center py-8 text-slate-500 text-sm">
          Cargando anuncios...
        </div>
      </div>
    );
  }

  if (collapsed) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-2 group">
        <div className="relative p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all">
          <Megaphone className="h-6 w-6 text-white" />
          {visibleAnnouncements.length > 0 && (
            <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white dark:border-slate-800 shadow-sm">
              {visibleAnnouncements.length}
            </span>
          )}
        </div>
        <span className="mt-2 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          Anuncios
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-sm">
              <Megaphone className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Anuncios
              </h3>
              {!collapsed && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Comunicados importantes
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!collapsed && visibleAnnouncements.length > 0 && (
              <span className="px-2.5 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 text-xs font-semibold rounded-full">
                {visibleAnnouncements.length}
              </span>
            )}
            <button
              onClick={onToggle}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      {!collapsed && (
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <AnimatePresence>
            {visibleAnnouncements.length > 0 ? (
              visibleAnnouncements.map((announcement, index) => {
                const config = typeConfig[announcement.type] || typeConfig.INFO;
                const Icon = config.icon;
                const isExpanded = expandedId === announcement.id;

                return (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={cn("relative", config.bg, "dark:bg-slate-800")}
                  >
                    {announcement.pinned && (
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-amber-500" />
                    )}
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-lg flex-shrink-0",
                            config.iconBg,
                          )}
                        >
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4
                                className={cn(
                                  "font-semibold text-sm leading-tight",
                                  config.text,
                                  "dark:text-slate-200",
                                )}
                              >
                                {announcement.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {formatDate(announcement.createdAt)}
                                </span>
                                {announcement.author && (
                                  <>
                                    <span className="text-slate-300 dark:text-slate-600">
                                      •
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                      {announcement.author.name}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDismiss(announcement.id)}
                              className="p-1 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700 transition-colors"
                            >
                              <X className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                            </button>
                          </div>

                          <motion.div
                            initial={false}
                            animate={{ height: isExpanded ? "auto" : "2.5rem" }}
                            className="overflow-hidden mt-2"
                          >
                            <p
                              className={cn(
                                "text-sm text-slate-600 dark:text-slate-400",
                                !isExpanded && "line-clamp-2",
                              )}
                            >
                              {announcement.content}
                            </p>
                          </motion.div>

                          {announcement.content.length > 100 && (
                            <button
                              onClick={() =>
                                setExpandedId(
                                  isExpanded ? null : announcement.id,
                                )
                              }
                              className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium mt-2 hover:text-blue-700 dark:hover:text-blue-300"
                            >
                              {isExpanded ? "Ver menos" : "Ver más"}
                              <ChevronRight
                                className={cn(
                                  "h-3 w-3 transition-transform",
                                  isExpanded && "rotate-90",
                                )}
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full inline-block mb-3">
                  <Megaphone className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No hay anuncios recientes
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
