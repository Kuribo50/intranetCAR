"use client";

import * as React from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  description?: string;
  type: string;
  startDate: string;
  endDate?: string;
  allDay: boolean;
  location?: string;
}

const eventTypeColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  BIRTHDAY: {
    bg: "bg-pink-50",
    text: "text-pink-700",
    border: "border-pink-200",
  },
  EVENT: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  REMINDER: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  HOLIDAY: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  MEETING: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  TRAINING: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },
};

const eventTypeLabels: Record<string, string> = {
  BIRTHDAY: "Cumpleaños",
  EVENT: "Evento",
  REMINDER: "Recordatorio",
  HOLIDAY: "Feriado",
  MEETING: "Reunión",
  TRAINING: "Capacitación",
};

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export interface EventCalendarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function EventCalendar({ collapsed, onToggle }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  React.useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events");
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // Generar días del calendario
  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  if (collapsed) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-2 group">
        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-all">
          <Calendar className="h-6 w-6 text-blue-500" />
        </div>
        <span className="mt-2 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          Calendario
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-xl shadow-sm">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Calendario
              </h3>
              {!collapsed && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Eventos y reuniones
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!collapsed && (
              <button
                onClick={goToToday}
                className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                Hoy
              </button>
            )}
            <button
              onClick={onToggle}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {!collapsed && (
        <>
          {/* Month Navigation */}
          <div className="px-6 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>
            <h4 className="text-base font-semibold text-slate-900 dark:text-white capitalize">
              {MONTHS[month]} {year}
            </h4>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return (
                    <div key={`empty-${index}`} className="aspect-square" />
                  );
                }

                const date = new Date(year, month, day);
                const dayEvents = getEventsForDate(date);
                const hasEvents = dayEvents.length > 0;
                const isSelected =
                  selectedDate &&
                  selectedDate.getFullYear() === year &&
                  selectedDate.getMonth() === month &&
                  selectedDate.getDate() === day;

                return (
                  <motion.button
                    key={day}
                    onClick={() => setSelectedDate(date)}
                    className={cn(
                      "aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all",
                      isToday(day) &&
                        "ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-slate-800",
                      isSelected && "bg-blue-500 text-white",
                      !isSelected &&
                        hasEvents &&
                        "bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/60",
                      !isSelected &&
                        !hasEvents &&
                        "hover:bg-slate-50 dark:hover:bg-slate-700/50",
                      !isSelected && "text-slate-700 dark:text-slate-300",
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isSelected
                          ? "text-white"
                          : "text-slate-700 dark:text-slate-300",
                      )}
                    >
                      {day}
                    </span>
                    {hasEvents && !isSelected && (
                      <div className="absolute bottom-1 flex gap-0.5">
                        {dayEvents.slice(0, 3).map((_, i) => (
                          <div
                            key={i}
                            className="w-1 h-1 rounded-full bg-blue-500"
                          />
                        ))}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Events */}
          <AnimatePresence>
            {selectedDate && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-slate-100 overflow-hidden"
              >
                <div className="p-4 border-t border-slate-100 dark:border-slate-700 transition-colors duration-200">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
                    {selectedDate.getDate()} de{" "}
                    {MONTHS[selectedDate.getMonth()]}
                  </p>
                  {selectedDateEvents.length > 0 ? (
                    <div className="space-y-2">
                      {selectedDateEvents.map((event) => {
                        const colors =
                          eventTypeColors[event.type] || eventTypeColors.EVENT;
                        return (
                          <motion.div
                            key={event.id}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className={cn(
                              "p-3 rounded-xl border",
                              colors.bg,
                              colors.border,
                            )}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p
                                  className={cn(
                                    "font-semibold text-sm",
                                    colors.text,
                                  )}
                                >
                                  {event.title}
                                </p>
                                {event.description && (
                                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                                    {event.description}
                                  </p>
                                )}
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                  {!event.allDay && (
                                    <span className="flex items-center gap-1 text-xs text-slate-500">
                                      <Clock className="h-3 w-3" />
                                      {formatTime(event.startDate)}
                                    </span>
                                  )}
                                  {event.location && (
                                    <span className="flex items-center gap-1 text-xs text-slate-500">
                                      <MapPin className="h-3 w-3" />
                                      {event.location}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span
                                className={cn(
                                  "text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap",
                                  colors.bg,
                                  colors.text,
                                )}
                              >
                                {eventTypeLabels[event.type] || event.type}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                      No hay eventos para esta fecha
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading && (
            <div className="p-4 text-center text-sm text-slate-500">
              Cargando eventos...
            </div>
          )}
        </>
      )}
    </div>
  );
}
