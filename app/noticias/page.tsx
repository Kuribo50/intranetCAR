"use client";

import * as React from "react";
import Link from "next/link";
import {
  Megaphone,
  Calendar,
  ArrowLeft,
  Info,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  MapPin,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: number;
  pinned: boolean;
  createdAt: string;
  expiresAt?: string;
  author?: {
    id: string;
    name: string;
  };
}

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

const announcementTypeConfig: Record<
  string,
  {
    icon: React.ElementType;
    bg: string;
    border: string;
    text: string;
    badge: string;
  }
> = {
  INFO: {
    icon: Info,
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    badge: "Información",
  },
  WARNING: {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "Aviso",
  },
  URGENT: {
    icon: AlertTriangle,
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    badge: "Urgente",
  },
  SUCCESS: {
    icon: CheckCircle,
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    badge: "Éxito",
  },
};

const eventTypeConfig: Record<
  string,
  { bg: string; text: string; label: string; border: string }
> = {
  BIRTHDAY: {
    bg: "bg-pink-100",
    text: "text-pink-700",
    label: "Cumpleaños",
    border: "border-pink-200",
  },
  EVENT: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    label: "Evento",
    border: "border-blue-200",
  },
  MEETING: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    label: "Reunión",
    border: "border-purple-200",
  },
  TRAINING: {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    label: "Capacitación",
    border: "border-cyan-200",
  },
  HOLIDAY: {
    bg: "bg-green-100",
    text: "text-green-700",
    label: "Feriado",
    border: "border-green-200",
  },
  REMINDER: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    label: "Recordatorio",
    border: "border-amber-200",
  },
};

// Horarios disponibles para reservas (9:00 - 18:00)
const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

interface MeetingRoom {
  id: string;
  name: string;
  capacity: number;
  amenities: string[];
  color: string;
  icon: string;
  active: boolean;
}

export default function NoticiasPage() {
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [events, setEvents] = React.useState<Event[]>([]);
  const [meetingRooms, setMeetingRooms] = React.useState<MeetingRoom[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<
    "announcements" | "events" | "calendar" | "meetings"
  >("calendar");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState<string>("all");
  const [calendarFilter, setCalendarFilter] = React.useState<string>("all");
  const [showAnnouncements, setShowAnnouncements] = React.useState(true);
  const [showEvents, setShowEvents] = React.useState(true);
  const [currentDate, setCurrentDate] = React.useState(new Date());

  // Estado para el modal de detalle del día
  const [selectedDay, setSelectedDay] = React.useState<{
    date: Date;
    items: any[];
  } | null>(null);
  const [isDayModalOpen, setIsDayModalOpen] = React.useState(false);

  // Estados para Reuniones (solo vista, no creación)
  const [selectedRoom, setSelectedRoom] = React.useState<string | null>(null);
  const [selectedMeetingDate, setSelectedMeetingDate] = React.useState<Date>(
    new Date(),
  );

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [announcementsRes, eventsRes, roomsRes] = await Promise.all([
          // Incluir anuncios expirados como solicitó el usuario ("todos incluso si ya pasaron")
          fetch("/api/announcements?includeExpired=true"),
          fetch("/api/events"),
          fetch("/api/meeting-rooms"),
        ]);

        if (announcementsRes.ok) {
          const data = await announcementsRes.json();
          setAnnouncements(data);
        }

        if (eventsRes.ok) {
          const data = await eventsRes.json();
          setEvents(data);
        }

        if (roomsRes.ok) {
          const data = await roomsRes.json();
          setMeetingRooms(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Hace ${diffMins} minutos`;
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return formatDate(dateString);
  };

  const normalize = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesSearch =
      normalize(a.title).includes(normalize(searchTerm)) ||
      normalize(a.content).includes(normalize(searchTerm));
    const matchesType = filterType === "all" || a.type === filterType;
    return matchesSearch && matchesType;
  });

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      normalize(e.title).includes(normalize(searchTerm)) ||
      (e.description &&
        normalize(e.description).includes(normalize(searchTerm)));
    const matchesType = filterType === "all" || e.type === filterType;
    return matchesSearch && matchesType;
  });

  // Obtener todas las reservas de reuniones
  const allMeetingBookings = events.filter((e) => e.type === "MEETING");

  const bookings = selectedRoom
    ? events.filter((e) => e.type === "MEETING" && e.location === selectedRoom)
    : [];

  // Función para verificar si un slot está ocupado
  const isSlotOccupied = (room: string, date: Date, timeSlot: string) => {
    const roomBookings = allMeetingBookings.filter((b) => b.location === room);
    const slotTime = new Date(
      `${date.toISOString().split("T")[0]}T${timeSlot}:00`,
    );

    return roomBookings.some((booking) => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = booking.endDate
        ? new Date(booking.endDate)
        : new Date(bookingStart.getTime() + 60 * 60 * 1000);
      return slotTime >= bookingStart && slotTime < bookingEnd;
    });
  };

  // Obtener próximos slots disponibles para una sala
  const getNextAvailableSlots = (room: string) => {
    const available: { date: Date; time: string }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (
      let dayOffset = 0;
      dayOffset < 7 && available.length < 3;
      dayOffset++
    ) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + dayOffset);

      // Saltar fines de semana
      if (checkDate.getDay() === 0 || checkDate.getDay() === 6) continue;

      for (const slot of TIME_SLOTS) {
        if (!isSlotOccupied(room, checkDate, slot)) {
          available.push({ date: checkDate, time: slot });
          if (available.length >= 3) break;
        }
      }
    }
    return available;
  };

  // Obtener slots del día seleccionado para la sala seleccionada
  const getDaySlotsWithStatus = () => {
    if (!selectedRoom) return [];
    return TIME_SLOTS.map((slot) => ({
      time: slot,
      occupied: isSlotOccupied(selectedRoom, selectedMeetingDate, slot),
      booking: bookings.find((b) => {
        const bookingStart = new Date(b.startDate);
        const slotTime = new Date(
          `${selectedMeetingDate.toISOString().split("T")[0]}T${slot}:00`,
        );
        const bookingEnd = b.endDate
          ? new Date(b.endDate)
          : new Date(bookingStart.getTime() + 60 * 60 * 1000);
        return slotTime >= bookingStart && slotTime < bookingEnd;
      }),
    }));
  };

  // Contar reservas de hoy por sala
  const getTodayBookingsCount = (room: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return allMeetingBookings.filter((b) => {
      const bookingDate = new Date(b.startDate);
      return (
        b.location === room && bookingDate >= today && bookingDate < tomorrow
      );
    }).length;
  };

  const filteredBookings = bookings
    .filter((e) => {
      // Si queremos filtrar por fecha en la vista de lista, podríamos hacerlo aquí
      // Por ahora mostramos todas las futuras o recientes
      return true;
    })
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

  const upcomingEvents = filteredEvents
    // No filtrar eventos pasados y ordenar descendente (más recientes/futuros primero)
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-blue-50 hover:border-blue-300"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-md">
                  <Megaphone className="h-6 w-6 text-white" />
                </div>
                Muro de Eventos
              </h1>
              <p className="text-slate-600 mt-1">
                Mantente informado de todo lo que pasa en nuestro CESFAM
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-200">
            <button
              onClick={() => {
                setActiveTab("announcements");
                setFilterType("all");
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                activeTab === "announcements"
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              <Megaphone className="h-4 w-4" />
              Anuncios
              {announcements.length > 0 && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-bold",
                    activeTab === "announcements"
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-600",
                  )}
                >
                  {announcements.length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("events");
                setFilterType("all");
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                activeTab === "events"
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              <Calendar className="h-4 w-4" />
              Eventos
              {upcomingEvents.length > 0 && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-bold",
                    activeTab === "events"
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-600",
                  )}
                >
                  {upcomingEvents.length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("calendar");
                setFilterType("all");
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                activeTab === "calendar"
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              <Calendar className="h-4 w-4" />
              Calendario
            </button>
            <button
              onClick={() => {
                setActiveTab("meetings");
                setFilterType("all");
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                activeTab === "meetings"
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              <Users className="h-4 w-4" />
              Salas de Reunión
            </button>
          </div>

          {/* Search y Filter - Ocultar en reuniones */}
          {activeTab !== "meetings" && (
            <>
              {/* Search - Solo para anuncios y eventos */}
              {activeTab !== "calendar" && (
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              )}

              {/* Filter para anuncios/eventos */}
              {activeTab !== "calendar" && (
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="all">Todos los tipos</option>
                    {activeTab === "announcements" ? (
                      <>
                        <option value="INFO">Información</option>
                        <option value="WARNING">Aviso</option>
                        <option value="URGENT">Urgente</option>
                        <option value="SUCCESS">Éxito</option>
                      </>
                    ) : (
                      <>
                        <option value="EVENT">Evento</option>
                        <option value="MEETING">Reunión</option>
                        <option value="TRAINING">Capacitación</option>
                        <option value="HOLIDAY">Feriado</option>
                        <option value="BIRTHDAY">Cumpleaños</option>
                      </>
                    )}
                  </select>
                </div>
              )}

              {/* Filtros para calendario */}
              {activeTab === "calendar" && (
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-slate-200">
                    <input
                      type="checkbox"
                      id="showEvents"
                      checked={showEvents}
                      onChange={(e) => setShowEvents(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="showEvents"
                      className="text-sm font-medium text-slate-700 cursor-pointer flex items-center gap-1"
                    >
                      <Calendar className="h-3.5 w-3.5 text-blue-500" />
                      Eventos
                    </label>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-slate-200">
                    <input
                      type="checkbox"
                      id="showAnnouncements"
                      checked={showAnnouncements}
                      onChange={(e) => setShowAnnouncements(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label
                      htmlFor="showAnnouncements"
                      className="text-sm font-medium text-slate-700 cursor-pointer flex items-center gap-1"
                    >
                      <Megaphone className="h-3.5 w-3.5 text-orange-500" />
                      Alertas
                    </label>
                  </div>
                  <select
                    value={calendarFilter}
                    onChange={(e) => setCalendarFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="all">Todos los tipos</option>
                    <optgroup label="Eventos">
                      <option value="EVENT">Evento</option>
                      <option value="MEETING">Reunión</option>
                      <option value="TRAINING">Capacitación</option>
                      <option value="HOLIDAY">Feriado</option>
                      <option value="BIRTHDAY">Cumpleaños</option>
                    </optgroup>
                    <optgroup label="Alertas">
                      <option value="INFO">Información</option>
                      <option value="WARNING">Aviso</option>
                      <option value="URGENT">Urgente</option>
                      <option value="SUCCESS">Éxito</option>
                    </optgroup>
                  </select>
                </div>
              )}
            </>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Cargando...</p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === "announcements" ? (
              <motion.div
                key="announcements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {filteredAnnouncements.length > 0 ? (
                  filteredAnnouncements.map((announcement, index) => {
                    const config =
                      announcementTypeConfig[announcement.type] ||
                      announcementTypeConfig.INFO;
                    const Icon = config.icon;

                    return (
                      <motion.div
                        key={announcement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "bg-white rounded-2xl border shadow-sm overflow-hidden",
                          config.border,
                          announcement.pinned && "ring-2 ring-orange-300",
                        )}
                      >
                        {announcement.pinned && (
                          <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold px-4 py-1">
                            📌 Anuncio fijado
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            <div
                              className={cn(
                                "p-3 rounded-xl flex-shrink-0",
                                config.bg,
                              )}
                            >
                              <Icon className={cn("h-6 w-6", config.text)} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <h3 className="text-lg font-bold text-slate-900">
                                  {announcement.title}
                                </h3>
                                <span
                                  className={cn(
                                    "px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap",
                                    config.bg,
                                    config.text,
                                  )}
                                >
                                  {config.badge}
                                </span>
                              </div>
                              <p className="text-slate-600 leading-relaxed mb-4">
                                {announcement.content}
                              </p>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {formatRelativeTime(announcement.createdAt)}
                                </span>
                                {announcement.author && (
                                  <span className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    {announcement.author.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <Megaphone className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">
                      No hay anuncios
                    </h3>
                    <p className="text-slate-500">
                      No se encontraron anuncios que coincidan con tu búsqueda.
                    </p>
                  </div>
                )}
              </motion.div>
            ) : activeTab === "events" ? (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid gap-4 md:grid-cols-2"
              >
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, index) => {
                    const config =
                      eventTypeConfig[event.type] || eventTypeConfig.EVENT;

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="p-5">
                          <div className="flex items-start gap-4">
                            <div className="text-center bg-blue-50 rounded-xl p-3 min-w-[60px]">
                              <div className="text-2xl font-bold text-blue-600">
                                {new Date(event.startDate).getDate()}
                              </div>
                              <div className="text-xs text-blue-500 uppercase font-medium">
                                {new Date(event.startDate).toLocaleDateString(
                                  "es-CL",
                                  {
                                    month: "short",
                                  },
                                )}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-bold text-slate-900">
                                  {event.title}
                                </h3>
                                <span
                                  className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap",
                                    config.bg,
                                    config.text,
                                  )}
                                >
                                  {config.label}
                                </span>
                              </div>
                              {event.description && (
                                <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                  {event.description}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                {!event.allDay && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatTime(event.startDate)}
                                  </span>
                                )}
                                {event.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {event.location}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">
                      No hay eventos próximos
                    </h3>
                    <p className="text-slate-500">
                      No se encontraron eventos que coincidan con tu búsqueda.
                    </p>
                  </div>
                )}
              </motion.div>
            ) : activeTab === "meetings" ? (
              <motion.div
                key="meetings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Vista de Tarjetas de Salas - Se muestra cuando no hay sala seleccionada */}
                {!selectedRoom ? (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-slate-800 mb-2">
                        Salas de Reunión
                      </h2>
                      <p className="text-slate-500">
                        Consulta la disponibilidad de cada sala
                      </p>
                    </div>
                    {meetingRooms.length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {meetingRooms.map((room) => {
                          const nextSlots = getNextAvailableSlots(room.name);
                          const todayCount = getTodayBookingsCount(room.name);

                          return (
                            <motion.div
                              key={room.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedRoom(room.name)}
                              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
                            >
                              {/* Header con gradiente */}
                              <div
                                className={cn(
                                  "bg-gradient-to-r p-4 text-white",
                                  room.color,
                                )}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-3xl">{room.icon}</span>
                                  <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                                    <Users className="h-3 w-3" />
                                    <span className="text-xs font-medium">
                                      {room.capacity}
                                    </span>
                                  </div>
                                </div>
                                <h3 className="font-bold text-lg">
                                  {room.name}
                                </h3>
                              </div>

                              {/* Contenido */}
                              <div className="p-4 space-y-3">
                                {/* Estado de hoy */}
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-slate-500">
                                    Reservas hoy
                                  </span>
                                  <span
                                    className={cn(
                                      "text-xs font-bold px-2 py-0.5 rounded-full",
                                      todayCount === 0
                                        ? "bg-green-100 text-green-700"
                                        : todayCount < 3
                                          ? "bg-amber-100 text-amber-700"
                                          : "bg-red-100 text-red-700",
                                    )}
                                  >
                                    {todayCount === 0
                                      ? "Libre"
                                      : `${todayCount} reserva(s)`}
                                  </span>
                                </div>

                                {/* Amenidades */}
                                <div className="flex flex-wrap gap-1">
                                  {room.amenities
                                    .slice(0, 2)
                                    .map((amenity: string) => (
                                      <span
                                        key={amenity}
                                        className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                                      >
                                        {amenity}
                                      </span>
                                    ))}
                                  {room.amenities.length > 2 && (
                                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                      +{room.amenities.length - 2}
                                    </span>
                                  )}
                                </div>

                                {/* Próximos disponibles */}
                                <div className="pt-2 border-t border-slate-100">
                                  <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">
                                    Próximo disponible
                                  </p>
                                  {nextSlots.length > 0 ? (
                                    <div className="flex items-center gap-1.5">
                                      <Clock className="h-3 w-3 text-green-500" />
                                      <span className="text-xs text-slate-600">
                                        {nextSlots[0].date.toLocaleDateString(
                                          "es-CL",
                                          { weekday: "short", day: "numeric" },
                                        )}{" "}
                                        {nextSlots[0].time}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-slate-400">
                                      Sin disponibilidad esta semana
                                    </span>
                                  )}
                                </div>

                                {/* Botón */}
                                <Button
                                  variant="outline"
                                  className="w-full mt-2 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-colors"
                                >
                                  Ver Disponibilidad
                                </Button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                        <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">
                          No hay salas configuradas
                        </h3>
                        <p className="text-slate-500">
                          Contacte al administrador para crear salas de reunión
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Vista detallada de la sala seleccionada */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      {/* Header de la sala */}
                      {(() => {
                        const roomConfig = meetingRooms.find(
                          (r) => r.name === selectedRoom,
                        );
                        return roomConfig ? (
                          <div
                            className={cn(
                              "bg-gradient-to-r p-6 text-white",
                              roomConfig.color,
                            )}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-4">
                                <button
                                  onClick={() => setSelectedRoom(null)}
                                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                                >
                                  <ArrowLeft className="h-5 w-5" />
                                </button>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-2xl">
                                      {roomConfig.icon}
                                    </span>
                                    <h2 className="text-2xl font-bold">
                                      {roomConfig.name}
                                    </h2>
                                  </div>
                                  <div className="flex items-center gap-4 text-white/80 text-sm">
                                    <span className="flex items-center gap-1">
                                      <Users className="h-4 w-4" />
                                      {roomConfig.capacity} personas
                                    </span>
                                    <span className="flex items-center gap-1">
                                      {roomConfig.amenities.join(" • ")}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })()}

                      {/* Selector de fecha */}
                      <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const prev = new Date(selectedMeetingDate);
                                prev.setDate(prev.getDate() - 1);
                                setSelectedMeetingDate(prev);
                              }}
                              className="h-8 w-8 rounded-full"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="text-center min-w-[200px]">
                              <p className="text-lg font-bold text-slate-800 capitalize">
                                {selectedMeetingDate.toLocaleDateString(
                                  "es-CL",
                                  {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                  },
                                )}
                              </p>
                              {selectedMeetingDate.toDateString() ===
                                new Date().toDateString() && (
                                <span className="text-xs text-blue-600 font-medium">
                                  Hoy
                                </span>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const next = new Date(selectedMeetingDate);
                                next.setDate(next.getDate() + 1);
                                setSelectedMeetingDate(next);
                              }}
                              className="h-8 w-8 rounded-full"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedMeetingDate(new Date())}
                            className="text-xs"
                          >
                            Hoy
                          </Button>
                        </div>
                      </div>

                      {/* Grid de horarios */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-slate-700">
                            Horarios del día
                          </h3>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded bg-green-100 border border-green-300" />
                              Disponible
                            </span>
                            <span className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded bg-red-100 border border-red-300" />
                              Ocupado
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {getDaySlotsWithStatus().map(
                            ({ time, occupied, booking }) => (
                              <div
                                key={time}
                                className={cn(
                                  "p-3 rounded-xl border text-center transition-all",
                                  occupied
                                    ? "bg-red-50 border-red-200"
                                    : "bg-green-50 border-green-200",
                                )}
                                title={
                                  occupied && booking
                                    ? booking.title
                                    : "Disponible"
                                }
                              >
                                <p
                                  className={cn(
                                    "font-bold text-sm",
                                    occupied
                                      ? "text-red-700"
                                      : "text-green-700",
                                  )}
                                >
                                  {time}
                                </p>
                                {occupied && booking && (
                                  <p className="text-[10px] text-red-600 truncate mt-1">
                                    {booking.title}
                                  </p>
                                )}
                                {!occupied && (
                                  <p className="text-[10px] text-green-600 mt-1">
                                    Libre
                                  </p>
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Próximas reservas de esta sala */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-purple-500" />
                        Próximas reservas en {selectedRoom}
                      </h3>
                      {filteredBookings.filter(
                        (b) => new Date(b.startDate) >= new Date(),
                      ).length > 0 ? (
                        <div className="space-y-3">
                          {filteredBookings
                            .filter((b) => new Date(b.startDate) >= new Date())
                            .slice(0, 5)
                            .map((booking) => (
                              <div
                                key={booking.id}
                                className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl"
                              >
                                <div className="text-center bg-purple-100 rounded-lg p-2 min-w-[50px]">
                                  <p className="text-lg font-bold text-purple-700">
                                    {new Date(booking.startDate).getDate()}
                                  </p>
                                  <p className="text-[10px] text-purple-500 uppercase">
                                    {new Date(
                                      booking.startDate,
                                    ).toLocaleDateString("es-CL", {
                                      month: "short",
                                    })}
                                  </p>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-slate-800 truncate">
                                    {booking.title}
                                  </p>
                                  <p className="text-sm text-slate-500">
                                    {formatTime(booking.startDate)} -{" "}
                                    {booking.endDate
                                      ? formatTime(booking.endDate)
                                      : "..."}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-slate-400">
                          <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
                          <p>No hay reservas próximas</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Resumen de alertas del mes */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-orange-800 flex items-center gap-2">
                      <Megaphone className="h-5 w-5" />
                      Alertas Activas
                    </h3>
                    <span className="text-sm text-orange-600 font-medium">
                      {
                        announcements.filter(
                          (a) =>
                            a.pinned ||
                            !a.expiresAt ||
                            new Date(a.expiresAt) >= new Date(),
                        ).length
                      }{" "}
                      activas
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {announcements
                      .filter(
                        (a) =>
                          a.pinned ||
                          !a.expiresAt ||
                          new Date(a.expiresAt) >= new Date(),
                      )
                      .slice(0, 4)
                      .map((a) => {
                        const config =
                          announcementTypeConfig[a.type] ||
                          announcementTypeConfig.INFO;
                        const Icon = config.icon;
                        return (
                          <div
                            key={a.id}
                            className={cn(
                              "p-3 rounded-xl border flex items-start gap-2 bg-white",
                              config.border,
                            )}
                          >
                            <div
                              className={cn(
                                "p-1.5 rounded-lg flex-shrink-0",
                                config.bg,
                              )}
                            >
                              <Icon className={cn("h-4 w-4", config.text)} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-800 truncate">
                                {a.title}
                              </p>
                              <p className="text-xs text-slate-500 truncate">
                                {a.content}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    {announcements.filter(
                      (a) =>
                        a.pinned ||
                        !a.expiresAt ||
                        new Date(a.expiresAt) >= new Date(),
                    ).length === 0 && (
                      <div className="col-span-full text-center py-4 text-orange-600 text-sm">
                        No hay alertas activas
                      </div>
                    )}
                  </div>
                </div>

                {/* Calendar Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 capitalize flex items-center gap-2">
                      <Calendar className="h-6 w-6 text-blue-600" />
                      {currentDate.toLocaleDateString("es-CL", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h2>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setCurrentDate(
                            new Date(
                              currentDate.setMonth(currentDate.getMonth() - 1),
                            ),
                          )
                        }
                        className="rounded-full hover:bg-slate-100"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentDate(new Date())}
                        className="rounded-full"
                      >
                        Hoy
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setCurrentDate(
                            new Date(
                              currentDate.setMonth(currentDate.getMonth() + 1),
                            ),
                          )
                        }
                        className="rounded-full hover:bg-slate-100"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-lg overflow-hidden border border-slate-200">
                    {/* Days Header */}
                    {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(
                      (day) => (
                        <div
                          key={day}
                          className="bg-slate-50 p-4 text-center text-sm font-semibold text-slate-600 uppercase tracking-wider"
                        >
                          {day}
                        </div>
                      ),
                    )}

                    {/* Calendar Days */}
                    {(() => {
                      const daysInMonth = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() + 1,
                        0,
                      ).getDate();
                      const firstDayOfMonth = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        1,
                      ).getDay();
                      const days = [];

                      // Previous month pad
                      for (let i = 0; i < firstDayOfMonth; i++) {
                        days.push(
                          <div
                            key={`prev-${i}`}
                            className="bg-white min-h-[120px] p-2 bg-slate-50/50"
                          />,
                        );
                      }

                      // Days
                      for (let d = 1; d <= daysInMonth; d++) {
                        const date = new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth(),
                          d,
                        );
                        const isToday =
                          new Date().toDateString() === date.toDateString();

                        // Filtrar eventos del día con filtros aplicados
                        const dayEvents = showEvents
                          ? events.filter((e) => {
                              const eventDate = new Date(e.startDate);
                              const matchesDate =
                                eventDate.getDate() === d &&
                                eventDate.getMonth() ===
                                  currentDate.getMonth() &&
                                eventDate.getFullYear() ===
                                  currentDate.getFullYear();
                              const matchesFilter =
                                calendarFilter === "all" ||
                                e.type === calendarFilter;
                              return matchesDate && matchesFilter;
                            })
                          : [];

                        // Filtrar anuncios del día con filtros aplicados
                        const dayAnnouncements = showAnnouncements
                          ? announcements.filter((a) => {
                              const announcementDate = new Date(a.createdAt);
                              const isCreatedToday =
                                announcementDate.getDate() === d &&
                                announcementDate.getMonth() ===
                                  currentDate.getMonth() &&
                                announcementDate.getFullYear() ===
                                  currentDate.getFullYear();

                              // También mostrar si está vigente (pinned o no expirado)
                              const isActive =
                                a.pinned ||
                                !a.expiresAt ||
                                new Date(a.expiresAt) >= date;
                              const matchesFilter =
                                calendarFilter === "all" ||
                                a.type === calendarFilter;

                              return isCreatedToday && matchesFilter;
                            })
                          : [];

                        const dayItems = [
                          ...dayEvents.map((e) => ({ ...e, _type: "event" })),
                          ...dayAnnouncements.map((a) => ({
                            ...a,
                            _type: "announcement",
                            startDate: a.createdAt,
                          })),
                        ];

                        const handleDayClick = () => {
                          const dateObj = new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth(),
                            d,
                          );
                          setSelectedDay({ date: dateObj, items: dayItems });
                          setIsDayModalOpen(true);
                        };

                        days.push(
                          <div
                            key={d}
                            onClick={handleDayClick}
                            className={cn(
                              "bg-white min-h-[120px] p-2 hover:bg-blue-50/30 transition-colors relative group cursor-pointer",
                              isToday && "bg-blue-50/50",
                            )}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span
                                className={cn(
                                  "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full",
                                  isToday
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-700",
                                )}
                              >
                                {d}
                              </span>
                              {dayItems.length > 0 && (
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full font-medium">
                                  {dayItems.length}
                                </span>
                              )}
                            </div>
                            <div className="space-y-1">
                              {dayItems.map((item: any) => {
                                let config;
                                if (item._type === "event") {
                                  config =
                                    eventTypeConfig[item.type] ||
                                    eventTypeConfig.EVENT;
                                } else {
                                  const annConfig =
                                    announcementTypeConfig[item.type] ||
                                    announcementTypeConfig.INFO;
                                  config = {
                                    bg: annConfig.bg,
                                    text: annConfig.text,
                                    border: annConfig.border,
                                    label: annConfig.badge,
                                  };
                                }

                                return (
                                  <div
                                    key={`${item._type}-${item.id}`}
                                    className={cn(
                                      "text-[10px] px-2 py-1 rounded-md border truncate cursor-pointer transition-all hover:opacity-80 active:scale-95 flex items-center gap-1",
                                      config.bg,
                                      config.text,
                                      config.border,
                                    )}
                                    title={`${item.title} - ${config.label}`}
                                  >
                                    {item._type === "announcement" && (
                                      <Megaphone className="h-3 w-3 flex-shrink-0" />
                                    )}
                                    <span className="font-semibold block truncate">
                                      {item.title}
                                    </span>
                                    {item._type === "event" && !item.allDay && (
                                      <span className="opacity-75 text-[9px] ml-auto">
                                        {formatTime(item.startDate)}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>,
                        );
                      }

                      return days;
                    })()}
                  </div>

                  {/* Leyenda de colores */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                      Leyenda
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-600 font-medium">
                          Eventos:
                        </span>
                        {Object.entries(eventTypeConfig).map(
                          ([key, config]) => (
                            <div
                              key={key}
                              className="flex items-center gap-1.5"
                            >
                              <div
                                className={cn(
                                  "w-3 h-3 rounded",
                                  config.bg,
                                  config.border,
                                  "border",
                                )}
                              />
                              <span className="text-xs text-slate-600">
                                {config.label}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-600 font-medium">
                          Alertas:
                        </span>
                        {Object.entries(announcementTypeConfig).map(
                          ([key, config]) => (
                            <div
                              key={key}
                              className="flex items-center gap-1.5"
                            >
                              <div
                                className={cn(
                                  "w-3 h-3 rounded",
                                  config.bg,
                                  config.border,
                                  "border",
                                )}
                              />
                              <span className="text-xs text-slate-600">
                                {config.badge}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Modal de Detalle del Día */}
      <Dialog open={isDayModalOpen} onOpenChange={setIsDayModalOpen}>
        <DialogContent className="sm:max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle className="capitalize text-2xl">
              {selectedDay?.date.toLocaleDateString("es-CL", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </DialogTitle>
            <DialogDescription className="text-base">
              {selectedDay?.items.length
                ? `${selectedDay.items.length} actividad(es) programada(s)`
                : "No hay actividades para este día."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 mt-4">
            {selectedDay?.items.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed">
                <span className="block text-4xl mb-2">📅</span>
                <p>Sin eventos ni anuncios</p>
              </div>
            ) : (
              selectedDay?.items.map((item: any) => {
                let config;
                let Icon;

                if (item._type === "event") {
                  config = eventTypeConfig[item.type] || eventTypeConfig.EVENT;
                  Icon = Calendar;
                } else {
                  const annConfig =
                    announcementTypeConfig[item.type] ||
                    announcementTypeConfig.INFO;
                  config = {
                    bg: annConfig.bg,
                    text: annConfig.text,
                    border: annConfig.border,
                    badge: annConfig.badge,
                    label: annConfig.badge,
                  };
                  Icon = annConfig.icon;
                }

                return (
                  <div
                    key={`${item._type}-${item.id}`}
                    className={cn(
                      "p-4 rounded-xl border transition-all hover:shadow-md bg-white",
                      config.border,
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "mt-1 p-3 rounded-xl",
                          config.bg,
                          config.text,
                        )}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h4 className="font-bold text-lg text-slate-900">
                            {item.title}
                          </h4>
                          <span
                            className={cn(
                              "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                              config.bg,
                              config.text,
                            )}
                          >
                            {config.label}
                          </span>
                        </div>

                        {(item.content || item.description) && (
                          <p className="text-slate-600 leading-relaxed">
                            {item.content || item.description}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          {item._type === "event" && !item.allDay && (
                            <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
                              <Clock className="h-4 w-4" />
                              {formatTime(item.startDate)}
                            </span>
                          )}
                          {item._type === "announcement" && (
                            <span className="flex items-center gap-1.5">
                              <Megaphone className="h-4 w-4" />
                              Publicado: {formatTime(item.createdAt)}
                            </span>
                          )}
                          {item.location && (
                            <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
                              <MapPin className="h-4 w-4" />
                              {item.location}
                            </span>
                          )}
                          {item.author && (
                            <span className="flex items-center gap-1.5 ml-auto">
                              <User className="h-4 w-4" />
                              {item.author.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
