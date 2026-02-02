"use client";

import { toast } from "sonner";
import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Image as ImageIcon,
  List,
  Pencil,
  Trash2,
  Search,
  Megaphone,
  Users,
  Cake,
  Bell,
} from "lucide-react";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// React Big Calendar Imports
import { Calendar, dateFnsLocalizer, SlotInfo } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Setup Localizer
const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  type: "INFO" | "MEETING" | "BIRTHDAY" | "REMINDER";
  location?: string;
  allDay: boolean;
  author?: {
    name: string;
  };
}

const eventTypes = [
  {
    value: "INFO",
    label: "Información",
    icon: Megaphone,
    color: "bg-blue-600 border-blue-700 text-white",
    hex: "#2563eb",
  },
  {
    value: "MEETING",
    label: "Reunión",
    icon: Users,
    color: "bg-violet-600 border-violet-700 text-white",
    hex: "#7c3aed",
  },
  {
    value: "BIRTHDAY",
    label: "Cumpleaños",
    icon: Cake,
    color: "bg-pink-600 border-pink-700 text-white",
    hex: "#db2777",
  },
  {
    value: "REMINDER",
    label: "Recordatorio",
    icon: Bell,
    color: "bg-amber-600 border-amber-700 text-white",
    hex: "#d97706",
  },
];

interface MeetingRoom {
  id: string;
  name: string;
  capacity: number;
  amenities: string[];
  color: string;
  icon: string;
  active: boolean;
  establecimientoId?: string | null;
}

interface Establecimiento {
  id: string;
  name: string;
  address?: string;
  order: number;
  active: boolean;
}

export function AdminEventos() {
  const [tipoFiltro, setTipoFiltro] = React.useState<string>("ALL");
  const [eventos, setEventos] = React.useState<Event[]>([]);
  const [meetingRooms, setMeetingRooms] = React.useState<MeetingRoom[]>([]);
  const [establecimientos, setEstablecimientos] = React.useState<
    Establecimiento[]
  >([]);
  const [cargando, setCargando] = React.useState(true);

  // Vista: "calendario" o "listado"
  const [vistaActual, setVistaActual] = React.useState<
    "calendario" | "listado"
  >("calendario");
  const [busqueda, setBusqueda] = React.useState("");

  // Paginación
  const [paginaActual, setPaginaActual] = React.useState(1);
  const itemsPorPagina = 5;

  const cargarEventos = async () => {
    try {
      const response = await fetch("/api/events");
      if (response.ok) {
        const data = await response.json();
        const expandedEvents: any[] = [];
        const currentYear = new Date().getFullYear();
        // Generate recurrences for likely viewed years
        const years = [
          currentYear - 2,
          currentYear - 1,
          currentYear,
          currentYear + 1,
          currentYear + 2,
        ];

        data.forEach((evt: any) => {
          if (evt.type === "BIRTHDAY") {
            const birthDate = new Date(evt.startDate);
            years.forEach((year) => {
              const recurrentStart = new Date(birthDate);
              recurrentStart.setFullYear(year);

              expandedEvents.push({
                ...evt,
                id: `${evt.id}-${year}`, // Unique ID for frontend key
                realId: evt.id, // Real ID for modifications
                title: evt.title,
                description: evt.description,
                type: evt.type,
                startDate: recurrentStart,
                endDate: null,
                allDay: true,
                location: evt.location,
              });
            });
          } else {
            expandedEvents.push({
              ...evt,
              id: evt.id,
              realId: evt.id,
              title: evt.title,
              description: evt.description,
              type: evt.type,
              startDate: new Date(evt.startDate),
              endDate: evt.endDate ? new Date(evt.endDate) : null,
              allDay: evt.allDay,
              location: evt.location,
            });
          }
        });
        setEventos(expandedEvents);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Error al cargar eventos");
    } finally {
      setCargando(false);
    }
  };

  const cargarSalas = async () => {
    try {
      const response = await fetch("/api/meeting-rooms");
      if (response.ok) {
        const data = await response.json();
        setMeetingRooms(data);
      }
    } catch (error) {
      console.error("Error fetching meeting rooms:", error);
    }
  };

  const cargarEstablecimientos = async () => {
    try {
      const response = await fetch("/api/establecimientos");
      if (response.ok) {
        const data = await response.json();
        setEstablecimientos(data.filter((e: Establecimiento) => e.active));
      }
    } catch (error) {
      console.error("Error fetching establecimientos:", error);
    }
  };

  React.useEffect(() => {
    cargarEventos();
    cargarSalas();
    cargarEstablecimientos();
  }, []);

  // Calendar Control State
  const [view, setView] = React.useState<any>("month");
  const [date, setDate] = React.useState(new Date());

  const onNavigate = React.useCallback(
    (newDate: Date) => setDate(newDate),
    [setDate],
  );
  const onView = React.useCallback(
    (newView: any) => setView(newView),
    [setView],
  );

  // Modal State
  const [modalAbierto, setModalAbierto] = React.useState(false);
  const [editando, setEditando] = React.useState(false);

  // Partial event state form
  const [eventoActual, setEventoActual] = React.useState<{
    id?: string;
    title: string;
    description: string;
    startDate: Date | null;
    endDate: Date | null;
    type: "INFO" | "MEETING" | "BIRTHDAY" | "REMINDER";
    location: string;
    allDay: boolean;
  }>({
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(new Date().setHours(new Date().getHours() + 1)),
    type: "INFO",
    location: "",
    allDay: false,
  });

  // Estado para establecimiento seleccionado (para filtrar salas)
  const [selectedEstablecimiento, setSelectedEstablecimiento] =
    React.useState<string>("");

  // Auto-ajustar hora de fin cuando cambia hora de inicio
  React.useEffect(() => {
    if (eventoActual.startDate && eventoActual.type !== "BIRTHDAY") {
      const newEndDate = new Date(eventoActual.startDate);
      newEndDate.setHours(newEndDate.getHours() + 1);

      // Solo actualizar si endDate es null o si es menor que startDate
      if (
        !eventoActual.endDate ||
        eventoActual.endDate <= eventoActual.startDate
      ) {
        setEventoActual((prev) => ({ ...prev, endDate: newEndDate }));
      }
    }
  }, [eventoActual.startDate, eventoActual.type]);

  const eventosFiltrados = React.useMemo(() => {
    let filtrados = eventos;

    // Filtrar por tipo
    if (tipoFiltro !== "ALL") {
      filtrados = filtrados.filter((e) => e.type === tipoFiltro);
    }

    // Filtrar por búsqueda de texto
    if (busqueda.trim()) {
      const searchLower = busqueda.toLowerCase();
      filtrados = filtrados.filter(
        (e) =>
          e.title.toLowerCase().includes(searchLower) ||
          (e.description &&
            e.description.toLowerCase().includes(searchLower)) ||
          (e.location && e.location.toLowerCase().includes(searchLower)),
      );
    }

    return filtrados;
  }, [eventos, tipoFiltro, busqueda]);

  // Eventos para la tabla (sin duplicados de cumpleaños)
  const eventosParaTabla = React.useMemo(() => {
    // Agrupar por realId para eliminar duplicados de cumpleaños
    const uniqueEvents = new Map<string, any>();
    eventosFiltrados.forEach((e: any) => {
      const key = e.realId || e.id;
      if (!uniqueEvents.has(key)) {
        uniqueEvents.set(key, e);
      }
    });
    return Array.from(uniqueEvents.values()).sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return dateB - dateA; // Más recientes primero
    });
  }, [eventosFiltrados]);

  // Paginación para la tabla
  const totalPaginas = Math.ceil(eventosParaTabla.length / itemsPorPagina);
  const eventosPaginados = React.useMemo(() => {
    const inicio = (paginaActual - 1) * itemsPorPagina;
    return eventosParaTabla.slice(inicio, inicio + itemsPorPagina);
  }, [eventosParaTabla, paginaActual]);

  // --- Helper: Convert Event to RBC format ---
  const eventosMapeados = eventosFiltrados.map((evt) => ({
    ...evt,
    start: new Date(evt.startDate),
    end: evt.endDate
      ? new Date(evt.endDate)
      : new Date(new Date(evt.startDate).getTime() + 60 * 60 * 1000), // Default 1h
    resource: evt,
  }));

  // --- Export Handlers ---
  const handleExportExcel = () => {
    const dataToExport = eventosFiltrados.map((e) => ({
      Titulo: e.title,
      Inicio: format(new Date(e.startDate), "dd/MM/yyyy HH:mm"),
      Fin: e.endDate ? format(new Date(e.endDate), "dd/MM/yyyy HH:mm") : "",
      Tipo: e.type,
      Ubicacion: e.location || "",
      Descripcion: e.description || "",
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Eventos");
    XLSX.writeFile(wb, "Calendario_Eventos.xlsx");
  };

  const handleExportImage = async () => {
    const element = document.getElementById("calendar-print-ref");
    if (!element) {
      toast.error("No se encontró el elemento para exportar");
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      canvas.toBlob((blob) => {
        if (blob) saveAs(blob, "calendario_vista.png");
      });
    } catch (err) {
      console.error("Export image error:", err);
      toast.error("Error al exportar imagen");
    }
  };

  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
      toolbar.onNavigate("PREV");
    };

    const goToNext = () => {
      toolbar.onNavigate("NEXT");
    };

    const goToCurrent = () => {
      toolbar.onNavigate("TODAY");
    };

    const label = () => {
      const date = new Date(toolbar.date);
      if (toolbar.view === "agenda") {
        return (
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-wide">
              Todos los Eventos
            </span>
            <span className="text-xs text-slate-500 font-medium capitalize">
              {format(date, "MMMM yyyy", { locale: es })}
            </span>
          </div>
        );
      }
      return (
        <span className="capitalize text-lg font-bold text-slate-800 dark:text-white">
          {format(date, "MMMM yyyy", { locale: es })}
        </span>
      );
    };

    return (
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
        <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-slate-200 dark:border-slate-700">
          <button
            onClick={goToBack}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToCurrent}
            className="px-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
          >
            Hoy
          </button>
          <button
            onClick={goToNext}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 text-center">{label()}</div>

        <div className="flex items-center gap-2">
          {/* Export Dropdown - Kept here for context or could be moved */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="h-8 w-8 flex items-center justify-center rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-300 transition-colors"
                title="Exportar"
              >
                <Download className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportExcel}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Exportar Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportImage}>
                <ImageIcon className="w-4 h-4 mr-2" />
                Exportar Imagen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-slate-200 dark:border-slate-700">
            {["month", "week", "day", "agenda"].map((viewItem) => (
              <button
                key={viewItem}
                onClick={() => toolbar.onView(viewItem)}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-md transition-all capitalize",
                  toolbar.view === viewItem
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700",
                )}
              >
                {viewItem === "month"
                  ? "Mes"
                  : viewItem === "week"
                    ? "Semana"
                    : viewItem === "day"
                      ? "Día"
                      : "Agenda"}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // --- Handlers ---

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    // Bloquear selección de fechas pasadas
    const selectedDate = new Date(slotInfo.start);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("No puedes agendar eventos en fechas anteriores a hoy");
      return;
    }

    let start = slotInfo.start;
    let end = slotInfo.end;
    let isAllDay = false;

    // ======================
    // Smart Time Suggestion
    // ======================
    const now = new Date();

    // Si la fecha seleccionada es HOY
    if (
      start.getFullYear() === now.getFullYear() &&
      start.getMonth() === now.getMonth() &&
      start.getDate() === now.getDate()
    ) {
      // Si es antes de las 6pm, redondear a la próxima media hora
      if (now.getHours() < 18) {
        const minutes = now.getMinutes();
        const roundedMinutes = minutes < 30 ? 30 : 0;
        const roundedHours = minutes < 30 ? now.getHours() : now.getHours() + 1;

        start = new Date(now);
        start.setHours(roundedHours, roundedMinutes, 0, 0);
        end = new Date(start);
        end.setHours(start.getHours() + 1, start.getMinutes(), 0, 0);

        toast.success(
          `⏰ Sugerencia: ${start.getHours()}:${start.getMinutes().toString().padStart(2, "0")}`,
          {
            duration: 2000,
          },
        );
      } else {
        // Después de las 6pm, default mañana a las 9am
        start = new Date(now);
        start.setDate(start.getDate() + 1);
        start.setHours(9, 0, 0, 0);
        end = new Date(start);
        end.setHours(10, 0, 0, 0);
      }
    } else {
      // Para fechas futuras, default 9am
      if (view === "month") {
        if (start.getHours() === 0 && start.getMinutes() === 0) {
          start.setHours(9, 0, 0, 0);
          end = new Date(start);
          end.setHours(10, 0, 0, 0);
        }
      } else {
        if (slotInfo.action === "click") {
          end = new Date(start.getTime() + 60 * 60 * 1000);
        }
      }
    }

    setEventoActual({
      title: "",
      description: "",
      startDate: start,
      endDate: end,
      type: "INFO",
      location: "",
      allDay: isAllDay,
    });
    setEditando(false);
    setModalAbierto(true);
  };

  const handleSelectEvent = (event: any) => {
    const originalEvent = event.resource as any;
    setEventoActual({
      id: originalEvent.realId || originalEvent.id, // Use real ID
      title: originalEvent.title,
      description: originalEvent.description,
      type: originalEvent.type,
      location: originalEvent.location || "",
      allDay: originalEvent.allDay,
      startDate: new Date(originalEvent.startDate),
      endDate: originalEvent.endDate ? new Date(originalEvent.endDate) : null,
    });
    setEditando(true);
    setModalAbierto(true);
  };

  const eventStyleGetter = (event: any) => {
    const typeDef = eventTypes.find((t) => t.value === event.type);
    const bgClass = typeDef ? typeDef.color : "bg-slate-600 text-white";
    const bgHex = typeDef ? typeDef.hex : "#475569";

    return {
      className: cn(
        "text-xs font-semibold rounded-md border shadow-sm transition-all hover:brightness-110",
        bgClass,
      ),
      style: {
        backgroundColor: bgHex,
        borderColor: "rgba(0,0,0,0.1)",
        color: "white",
        display: "block",
      },
    };
  };

  // Lista de nombres de salas conocidas para validación de conflictos
  const knownLocations = meetingRooms.map((room) => room.name);

  const checkConflict = (newEvent: any) => {
    if (newEvent.type === "BIRTHDAY") return false;
    if (!newEvent.location || !knownLocations.includes(newEvent.location))
      return false;

    const newStart = newEvent.startDate!.getTime();
    const newEnd = newEvent.endDate
      ? newEvent.endDate!.getTime()
      : newStart + 60 * 60 * 1000;

    const conflict = eventos.find((e) => {
      if (e.id === newEvent.id) return false;
      if (e.type === "BIRTHDAY") return false;
      if (e.location !== newEvent.location) return false;

      const existingStart = new Date(e.startDate).getTime();
      const existingEnd = e.endDate
        ? new Date(e.endDate).getTime()
        : existingStart + 60 * 60 * 1000;

      return newStart < existingEnd && newEnd > existingStart;
    });

    return conflict;
  };

  const guardarEvento = async () => {
    if (!eventoActual.title || !eventoActual.startDate) {
      toast.error("Título y Fecha de Inicio son obligatorios");
      return;
    }

    // Validar que no se puedan agendar eventos en el pasado (excepto cumpleaños)
    if (eventoActual.type !== "BIRTHDAY") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDateCheck = new Date(eventoActual.startDate);
      startDateCheck.setHours(0, 0, 0, 0);

      if (startDateCheck < today) {
        toast.error("No puedes agendar eventos en fechas anteriores a hoy");
        return;
      }
    }

    // Validar que los eventos no excedan 1 día (excepto cumpleaños)
    if (eventoActual.type !== "BIRTHDAY") {
      if (eventoActual.endDate && eventoActual.startDate) {
        const startDay = new Date(eventoActual.startDate);
        startDay.setHours(0, 0, 0, 0);
        const endDay = new Date(eventoActual.endDate);
        endDay.setHours(0, 0, 0, 0);

        // Verificar que inicio y fin sean el mismo día
        if (startDay.getTime() !== endDay.getTime()) {
          toast.error(
            "Los eventos solo pueden durar un día. La fecha de inicio y fin deben ser el mismo día.",
          );
          return;
        }
      }
    }

    if (checkConflict(eventoActual)) {
      toast.error(
        `¡Conflicto detectado!\nEl "${eventoActual.location}" ya está ocupado en ese horario.`,
      );
      return;
    }

    try {
      let eventToSave = { ...eventoActual };
      if (eventToSave.type === "BIRTHDAY") {
        eventToSave.allDay = true;
        eventToSave.location = "";
        eventToSave.endDate = null;
      }

      const url =
        editando && eventToSave.id
          ? `/api/events/${eventToSave.id}`
          : "/api/events";

      const method = editando ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...eventToSave,
          startDate: eventToSave.startDate!.toISOString(),
          endDate: eventToSave.endDate
            ? eventToSave.endDate!.toISOString()
            : null,
        }),
      });

      if (response.ok) {
        const savedEvent = await response.json();

        // Si es REMINDER, enviar notificaciones broadcast
        if (eventToSave.type === "REMINDER" && !editando) {
          try {
            const broadcastRes = await fetch("/api/notifications/broadcast", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: `📢 ${eventToSave.title}`,
                message: eventToSave.description || "Nuevo recordatorio",
                eventId: savedEvent.id,
                scheduleFor: eventToSave.startDate,
              }),
            });

            if (broadcastRes.ok) {
              const broadcastData = await broadcastRes.json();
              toast.success(broadcastData.message || "Recordatorio enviado");
            }
          } catch (err) {
            console.error("Error sending broadcast:", err);
            // No fallar si falla el broadcast
          }
        }

        setModalAbierto(false);
        cargarEventos();
        if (!eventToSave.type || eventToSave.type !== "REMINDER") {
          toast.success(editando ? "Evento actualizado" : "Evento creado");
        }
      } else {
        const err = await response.json();
        toast.error(`Error: ${err.error || "Error al guardar"}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión");
    }
  };

  const eliminarEvento = async (id: string) => {
    if (!confirm("¿Eliminar este evento?")) return;
    try {
      const response = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Evento eliminado correctamente");
        cargarEventos();
        setModalAbierto(false);
      } else {
        const err = await response.json();
        toast.error(`Error: ${err.error || "Error al eliminar"}`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Error de conexión al eliminar");
    }
  };

  // --- Custom Views ---

  const CustomAgenda = ({ events, date }: any) => {
    const sortedEvents = React.useMemo(() => {
      const currentMonth = date.getMonth();
      const currentYear = date.getFullYear();

      const filtered = events.filter((e: any) => {
        const eDate = new Date(e.start);
        return (
          eDate.getMonth() === currentMonth &&
          eDate.getFullYear() === currentYear
        );
      });

      return filtered.sort(
        (a: any, b: any) => a.start.getTime() - b.start.getTime(),
      );
    }, [events, date]);

    if (sortedEvents.length === 0) {
      return (
        <div className="p-8 text-center text-slate-500">
          No hay eventos para este mes.
        </div>
      );
    }

    return (
      <div className="rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
          <table className="w-full text-sm text-left relative">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 font-semibold w-[150px]">Fecha</th>
                <th className="px-4 py-3 font-semibold w-[120px]">Hora</th>
                <th className="px-4 py-3 font-semibold">Evento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-900">
              {sortedEvents.map((event: any) => {
                const typeDef = eventTypes.find((t) => t.value === event.type);
                const bgHex = typeDef?.hex || "#475569";

                return (
                  <tr
                    key={event.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    onClick={() => handleSelectEvent({ resource: event })}
                  >
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-700 dark:text-slate-200 capitalize">
                      {format(event.start, "EEE dd MMM", { locale: es })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                      {event.allDay ? (
                        "Todo el día"
                      ) : (
                        <div className="flex flex-col">
                          <span>{format(event.start, "HH:mm")}</span>
                          {event.endDate &&
                            event.endDate !== event.startDate &&
                            !isSameDay(event.start, event.endDate) && (
                              <span className="text-xs opacity-70">
                                - {format(new Date(event.endDate), "HH:mm")}
                              </span>
                            )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: bgHex }}
                          />
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {event.title}
                          </span>
                          <span
                            className={cn(
                              "ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-white",
                            )}
                            style={{ backgroundColor: bgHex }}
                          >
                            {typeDef?.label}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 ml-4.5 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-medium">
                              {event.location}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  CustomAgenda.title = (date: Date) => {
    return format(date, "MMMM yyyy", { locale: es });
  };

  CustomAgenda.navigate = (date: Date, action: string) => {
    if (action === "PREV")
      return new Date(date.getFullYear(), date.getMonth() - 1, 1);
    if (action === "NEXT")
      return new Date(date.getFullYear(), date.getMonth() + 1, 1);
    return date;
  };

  const { views } = React.useMemo(
    () => ({
      views: {
        month: true,
        week: true,
        day: true,
        agenda: CustomAgenda,
      },
    }),
    [],
  );

  // Función para editar desde la tabla
  const handleEditFromTable = (event: any) => {
    setEventoActual({
      id: event.realId || event.id,
      title: event.title,
      description: event.description || "",
      type: event.type,
      location: event.location || "",
      allDay: event.allDay,
      startDate: new Date(event.startDate),
      endDate: event.endDate ? new Date(event.endDate) : null,
    });
    setEditando(true);
    setModalAbierto(true);
  };

  return (
    <div className="space-y-6 w-full" id="calendar-print-ref">
      <Card className="border-0 shadow-lg w-full">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  Eventos
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {eventos.length} eventos programados
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={cargarEventos}
                disabled={cargando}
              >
                <Megaphone
                  className={`h-4 w-4 mr-2 ${cargando ? "animate-spin" : ""}`}
                />
                Actualizar
              </Button>
              <Button
                onClick={() => {
                  const now = new Date();
                  now.setHours(9, 0, 0, 0);
                  const nextHour = new Date(now);
                  nextHour.setHours(10, 0, 0, 0);
                  handleSelectSlot({
                    start: now,
                    end: nextHour,
                    slots: [],
                    action: "click",
                  } as any);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Evento
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Main Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por título, descripción o ubicación..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={tipoFiltro}
                onValueChange={(value) => setTipoFiltro(value)}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Tipo de evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los tipos</SelectItem>
                  {eventTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      <div className="flex items-center gap-2">
                        <t.icon className="h-4 w-4" style={{ color: t.hex }} />
                        {t.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 bg-slate-100 p-1 rounded-lg flex-shrink-0">
              <Button
                variant={vistaActual === "calendario" ? "default" : "ghost"}
                size="sm"
                onClick={() => setVistaActual("calendario")}
                className="gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                Calendario
              </Button>
              <Button
                variant={vistaActual === "listado" ? "default" : "ghost"}
                size="sm"
                onClick={() => setVistaActual("listado")}
                className="gap-2"
              >
                <List className="h-4 w-4" />
                Listado
              </Button>
            </div>
          </div>

          {/* Render Views */}
          {vistaActual === "calendario" && (
            <div className="h-[700px]">
              <Calendar
                localizer={localizer}
                events={eventosMapeados}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%", fontFamily: "inherit" }}
                view={view}
                date={date}
                onNavigate={onNavigate}
                onView={onView}
                views={views}
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventStyleGetter}
                components={{
                  toolbar: CustomToolbar,
                }}
                messages={{
                  next: "Sig.",
                  previous: "Ant.",
                  today: "Hoy",
                  month: "Mes",
                  week: "Semana",
                  day: "Día",
                  agenda: "Agenda",
                  date: "Fecha",
                  time: "Hora",
                  event: "Evento",
                  noEventsInRange: "No hay eventos en este rango.",
                  showMore: (total) => `+${total} más`,
                }}
                culture="es"
              />
            </div>
          )}

          {vistaActual === "listado" && (
            <>
              {/* Tabla de eventos */}
              {cargando ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : eventosParaTabla.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No se encontraron eventos
                </div>
              ) : (
                <div className="rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 dark:bg-slate-800">
                        <TableHead className="font-semibold">Título</TableHead>
                        <TableHead className="font-semibold">Tipo</TableHead>
                        <TableHead className="font-semibold">Fecha</TableHead>
                        <TableHead className="font-semibold">
                          Ubicación
                        </TableHead>
                        <TableHead className="font-semibold text-right">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eventosPaginados.map((evento: any) => {
                        const typeDef = eventTypes.find(
                          (t) => t.value === evento.type,
                        );
                        const eventId = evento.realId || evento.id;
                        const bgHex = typeDef?.hex || "#475569";

                        return (
                          <TableRow
                            key={eventId}
                            className="hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {typeDef?.icon && (
                                  <typeDef.icon
                                    className="h-5 w-5"
                                    style={{ color: typeDef.hex }}
                                  />
                                )}
                                <div className="flex flex-col">
                                  <span>{evento.title}</span>
                                  {evento.allDay && (
                                    <span className="text-xs text-slate-400">
                                      Todo el día
                                    </span>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={cn("text-xs", typeDef?.color)}
                                style={{
                                  backgroundColor: typeDef?.hex,
                                  borderColor: typeDef?.hex,
                                }}
                              >
                                {typeDef?.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="capitalize font-medium">
                                  {format(
                                    new Date(evento.startDate),
                                    "dd MMM yyyy",
                                    { locale: es },
                                  )}
                                </span>
                                {!evento.allDay && (
                                  <span className="text-xs text-slate-500">
                                    {format(
                                      new Date(evento.startDate),
                                      "HH:mm",
                                    )}
                                    {evento.endDate &&
                                      ` - ${format(new Date(evento.endDate), "HH:mm")}`}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {evento.location ? (
                                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                                  <MapPin className="h-3.5 w-3.5" />
                                  <span>{evento.location}</span>
                                </div>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditFromTable(evento)}
                                  className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
                                >
                                  <Pencil className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => eliminarEvento(eventId)}
                                  className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="sm:max-w-[750px] overflow-visible max-h-[90vh] overflow-y-auto">
          {/* overflow-visible required for DatePicker Popper to show outside if needed */}
          <DialogHeader className="space-y-3">
            <DialogTitle className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2.5 rounded-lg",
                  eventTypes.find((t) => t.value === eventoActual.type)
                    ?.color || "bg-slate-600",
                )}
              >
                {(() => {
                  const EventIcon = eventTypes.find(
                    (t) => t.value === eventoActual.type,
                  )?.icon;
                  return EventIcon ? <EventIcon className="h-5 w-5" /> : null;
                })()}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  {editando ? "Editar Evento" : "Nuevo Evento"}
                </h2>
                <p className="text-sm text-slate-500 font-normal">
                  {eventTypes.find((t) => t.value === eventoActual.type)?.label}
                </p>
              </div>
            </DialogTitle>
            {/* Conflict Warning */}
            {!editando && checkConflict(eventoActual) && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-r">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 text-lg">⚠️</span>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-yellow-800">
                      Conflicto detectado
                    </h4>
                    <p className="text-xs text-yellow-700 mt-0.5">
                      La sala "{eventoActual.location}" ya está reservada en
                      este horario. Por favor, elige otra sala u horario.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título del Evento</Label>
              <Input
                id="title"
                value={eventoActual.title}
                onChange={(e) =>
                  setEventoActual({ ...eventoActual, title: e.target.value })
                }
                placeholder="Ej: Reunión Clínica, Capacitación..."
                className="text-lg font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label>Tipo de Evento</Label>
                <Select
                  value={eventoActual.type}
                  onValueChange={(value) =>
                    setEventoActual({
                      ...eventoActual,
                      type: value as any,
                    })
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 border-slate-200 bg-white shadow-xl">
                    {eventTypes.map((t) => (
                      <SelectItem
                        key={t.value}
                        value={t.value}
                        className="rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer hover:bg-slate-100 focus:bg-slate-100"
                      >
                        <span className="flex items-center gap-2">
                          <t.icon className="h-4 w-4" />
                          <span>{t.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Establecimiento - Solo para INFO y MEETING */}
              {eventoActual.type !== "BIRTHDAY" &&
                eventoActual.type !== "REMINDER" && (
                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2">
                      📍 Establecimiento
                    </Label>
                    <Select
                      value={selectedEstablecimiento || "ALL"}
                      onValueChange={(val) => {
                        setSelectedEstablecimiento(val === "ALL" ? "" : val);
                        // Reset location when changing establecimiento
                        if (val !== selectedEstablecimiento) {
                          setEventoActual({ ...eventoActual, location: "" });
                        }
                      }}
                    >
                      <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                        <SelectValue placeholder="Seleccionar establecimiento" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2 border-slate-200 bg-white shadow-xl">
                        <SelectItem
                          value="ALL"
                          className="rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer hover:bg-slate-100 focus:bg-slate-100"
                        >
                          Todas las salas
                        </SelectItem>
                        {establecimientos.map((est) => (
                          <SelectItem
                            key={est.id}
                            value={est.id}
                            className="rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer hover:bg-slate-100 focus:bg-slate-100"
                          >
                            {est.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
            </div>

            {/* Sala - Solo para INFO y MEETING */}
            {eventoActual.type !== "BIRTHDAY" &&
              eventoActual.type !== "REMINDER" && (
                <div className="grid gap-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Sala / Ubicación
                  </Label>
                  <Select
                    value={
                      knownLocations.includes(eventoActual.location || "")
                        ? eventoActual.location
                        : "OTHER"
                    }
                    onValueChange={(val) => {
                      if (val === "OTHER") {
                        setEventoActual({ ...eventoActual, location: "" });
                      } else {
                        setEventoActual({ ...eventoActual, location: val });
                      }
                    }}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                      <SelectValue placeholder="📍 Seleccionar Sala" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 border-slate-200 bg-white shadow-xl max-h-[300px]">
                      {(() => {
                        const filteredRooms =
                          selectedEstablecimiento &&
                          selectedEstablecimiento !== ""
                            ? meetingRooms.filter(
                                (room) =>
                                  room.establecimientoId ===
                                  selectedEstablecimiento,
                              )
                            : meetingRooms;

                        if (filteredRooms.length === 0) {
                          return (
                            <div className="px-3 py-6 text-center text-sm text-slate-500">
                              {selectedEstablecimiento
                                ? "No hay salas en este establecimiento"
                                : "No hay salas disponibles"}
                            </div>
                          );
                        }

                        return (
                          <>
                            {filteredRooms.map((room) => (
                              <SelectItem
                                key={room.id}
                                value={room.name}
                                className="rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer hover:bg-slate-100 focus:bg-slate-100"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="text-base">{room.icon}</span>
                                  <span>{room.name}</span>
                                  <span className="text-slate-400 text-xs">
                                    (
                                    {room.capacity === 0
                                      ? "No corresponde"
                                      : `${room.capacity} pers.`}
                                    )
                                  </span>
                                </span>
                              </SelectItem>
                            ))}
                            <SelectItem
                              value="OTHER"
                              className="rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer hover:bg-slate-100 focus:bg-slate-100 border-t"
                            >
                              <span className="flex items-center gap-2">
                                <span className="text-base">✏️</span>
                                <span>Otra ubicación...</span>
                              </span>
                            </SelectItem>
                          </>
                        );
                      })()}
                    </SelectContent>
                  </Select>
                  {(!eventoActual.location ||
                    !knownLocations.includes(eventoActual.location)) && (
                    <Input
                      value={eventoActual.location || ""}
                      onChange={(e) =>
                        setEventoActual({
                          ...eventoActual,
                          location: e.target.value,
                        })
                      }
                      placeholder="Especifique ubicación..."
                      className="mt-1"
                    />
                  )}
                </div>
              )}

            {/* Banner para BIRTHDAY */}
            {eventoActual.type === "BIRTHDAY" && (
              <div className="flex items-center gap-2 text-sm text-pink-600 font-medium bg-pink-50 p-3 rounded-lg border border-pink-200">
                🎉 Los cumpleaños se muestran todo el día
              </div>
            )}

            {/* Banner para REMINDER */}
            {eventoActual.type === "REMINDER" && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-amber-800">
                      Notificación Broadcast
                    </h4>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Este recordatorio se enviará a <strong>TODOS</strong> los
                      usuarios registrados en la fecha seleccionada.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Fechas para REMINDER - Solo fecha de envío */}
            {eventoActual.type === "REMINDER" && (
              <div className="grid gap-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4 text-amber-600" /> Fecha de Envío
                </Label>
                <DateTimePicker
                  date={eventoActual.startDate}
                  setDate={(date) => {
                    if (date) {
                      // Establecer a medianoche
                      const sendDate = new Date(date);
                      sendDate.setHours(0, 0, 0, 0);
                      setEventoActual({
                        ...eventoActual,
                        startDate: sendDate,
                        endDate: null,
                        allDay: true,
                        location: "",
                      });
                    }
                  }}
                  placeholder="Seleccionar fecha de envío"
                  disablePastDates={true}
                />
              </div>
            )}

            {/* Fechas normales para INFO y MEETING */}
            {eventoActual.type !== "BIRTHDAY" &&
              eventoActual.type !== "REMINDER" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <Clock className="h-4 w-4 text-blue-600" /> Inicio
                    </Label>
                    <DateTimePicker
                      date={eventoActual.startDate}
                      setDate={(date) =>
                        setEventoActual({ ...eventoActual, startDate: date })
                      }
                      placeholder="Seleccionar inicio"
                      disablePastDates={true}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <Clock className="h-4 w-4 text-blue-600" /> Fin
                    </Label>
                    <DateTimePicker
                      date={eventoActual.endDate}
                      setDate={(date) => {
                        // Validar que la fecha de fin no sea menor que la de inicio
                        if (
                          date &&
                          eventoActual.startDate &&
                          date <= eventoActual.startDate
                        ) {
                          toast.error(
                            "La hora de fin debe ser posterior a la hora de inicio",
                          );
                          return;
                        }
                        setEventoActual({ ...eventoActual, endDate: date });
                      }}
                      minDate={eventoActual.startDate || undefined}
                      placeholder="Seleccionar fin"
                      disablePastDates={true}
                    />
                  </div>
                </div>
              )}

            <div className="grid gap-2">
              <Label>
                {eventoActual.type === "REMINDER"
                  ? "Mensaje del Recordatorio"
                  : "Descripción / Detalles"}
              </Label>
              <textarea
                className={cn(
                  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  eventoActual.type === "REMINDER"
                    ? "min-h-[150px]"
                    : "min-h-[100px]",
                )}
                value={eventoActual.description || ""}
                onChange={(e) =>
                  setEventoActual({
                    ...eventoActual,
                    description: e.target.value,
                  })
                }
                placeholder={
                  eventoActual.type === "REMINDER"
                    ? "Escribe el mensaje que recibirán todos los usuarios..."
                    : "Temas a tratar, asistentes requeridos, etc."
                }
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            {editando && (
              <Button
                variant="destructive"
                onClick={() => eliminarEvento(eventoActual.id!)}
                className="mr-auto"
              >
                🗑️ Eliminar
              </Button>
            )}

            <div className="flex gap-2 flex-1 justify-end">
              <Button variant="outline" onClick={() => setModalAbierto(false)}>
                Cancelar
              </Button>

              {/* Botón "Enviar Ahora" solo para REMINDER */}
              {eventoActual.type === "REMINDER" && !editando && (
                <Button
                  onClick={async () => {
                    // Establecer fecha de envío como HOY
                    const now = new Date();
                    now.setHours(0, 0, 0, 0);
                    setEventoActual({
                      ...eventoActual,
                      startDate: now,
                      endDate: null,
                      allDay: true,
                      location: "",
                    });
                    // Pequeño delay para que se actualice el estado
                    setTimeout(() => guardarEvento(), 50);
                  }}
                  className="gap-2 bg-amber-600 hover:bg-amber-700"
                >
                  <span>📤</span>
                  Enviar Ahora
                </Button>
              )}

              <Button onClick={guardarEvento}>
                {editando ? "Actualizar" : "Guardar"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
