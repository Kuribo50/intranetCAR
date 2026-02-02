"use client";

import * as React from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  Save,
  X,
  Building,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface MeetingRoom {
  id: string;
  name: string;
  capacity: number;
  amenities: string[];
  color: string;
  icon: string;
  active: boolean;
  order: number;
}

const ROOM_COLORS = [
  {
    value: "from-blue-500 to-blue-600",
    label: "Azul",
    preview: "bg-gradient-to-r from-blue-500 to-blue-600",
  },
  {
    value: "from-purple-500 to-purple-600",
    label: "Púrpura",
    preview: "bg-gradient-to-r from-purple-500 to-purple-600",
  },
  {
    value: "from-emerald-500 to-emerald-600",
    label: "Verde",
    preview: "bg-gradient-to-r from-emerald-500 to-emerald-600",
  },
  {
    value: "from-amber-500 to-amber-600",
    label: "Ámbar",
    preview: "bg-gradient-to-r from-amber-500 to-amber-600",
  },
  {
    value: "from-rose-500 to-rose-600",
    label: "Rosa",
    preview: "bg-gradient-to-r from-rose-500 to-rose-600",
  },
  {
    value: "from-cyan-500 to-cyan-600",
    label: "Cyan",
    preview: "bg-gradient-to-r from-cyan-500 to-cyan-600",
  },
  {
    value: "from-slate-500 to-slate-600",
    label: "Gris",
    preview: "bg-gradient-to-r from-slate-500 to-slate-600",
  },
  {
    value: "from-indigo-500 to-indigo-600",
    label: "Índigo",
    preview: "bg-gradient-to-r from-indigo-500 to-indigo-600",
  },
];

const ROOM_ICONS = ["🏢", "🏠", "🎭", "🔒", "💼", "📊", "🎓", "🏥", "🖥️", "📹"];

const AMENITIES_OPTIONS = [
  "Proyector",
  "Pizarra",
  "Videoconferencia",
  "TV",
  "Sistema de audio",
  "Micrófono",
  "Aire acondicionado",
  "Privacidad",
  "Escritorio",
  "Computador",
  "Wifi dedicado",
  "Pizarra digital",
];

export default function AdminSalasPage() {
  const [rooms, setRooms] = React.useState<MeetingRoom[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Modal states
  const [showRoomModal, setShowRoomModal] = React.useState(false);
  const [editingRoom, setEditingRoom] = React.useState<MeetingRoom | null>(
    null,
  );

  // Form states
  const [roomForm, setRoomForm] = React.useState({
    name: "",
    capacity: 6,
    amenities: [] as string[],
    color: ROOM_COLORS[0].value,
    icon: "🏢",
  });

  // Fetch data
  React.useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/meeting-rooms");
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Error al cargar las salas");
    } finally {
      setLoading(false);
    }
  };

  // Room handlers
  const handleSaveRoom = async () => {
    if (!roomForm.name.trim()) {
      toast.error("El nombre de la sala es obligatorio");
      return;
    }

    try {
      const url = editingRoom
        ? `/api/meeting-rooms/${editingRoom.id}`
        : "/api/meeting-rooms";

      const res = await fetch(url, {
        method: editingRoom ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomForm),
      });

      if (res.ok) {
        fetchRooms();
        setShowRoomModal(false);
        resetRoomForm();
        toast.success(editingRoom ? "Sala actualizada" : "Sala creada");
      } else {
        const error = await res.json();
        toast.error(error.error || "Error al guardar la sala");
      }
    } catch (error) {
      console.error("Error saving room:", error);
      toast.error("Error de conexión");
    }
  };

  const handleDeleteRoom = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar esta sala?")) return;

    try {
      const res = await fetch(`/api/meeting-rooms/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchRooms();
        toast.success("Sala eliminada");
      } else {
        toast.error("Error al eliminar la sala");
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error("Error de conexión");
    }
  };

  const openEditRoom = (room: MeetingRoom) => {
    setEditingRoom(room);
    setRoomForm({
      name: room.name,
      capacity: room.capacity,
      amenities: room.amenities,
      color: room.color,
      icon: room.icon,
    });
    setShowRoomModal(true);
  };

  const resetRoomForm = () => {
    setEditingRoom(null);
    setRoomForm({
      name: "",
      capacity: 6,
      amenities: [],
      color: ROOM_COLORS[0].value,
      icon: "🏢",
    });
  };

  const toggleAmenity = (amenity: string) => {
    setRoomForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Building className="h-7 w-7 text-blue-600" />
            Gestión de Salas de Reunión
          </h2>
          <p className="text-slate-500 mt-1">
            Administra las salas disponibles para reservas. Las reuniones se
            gestionan desde el{" "}
            <a
              href="/admin/calendario"
              className="text-blue-600 hover:underline font-medium"
            >
              Calendario
            </a>
            .
          </p>
        </div>
        <Button
          onClick={() => {
            resetRoomForm();
            setShowRoomModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Sala
        </Button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {rooms.map((room) => (
            <motion.div
              key={room.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative"
            >
              <div
                className={cn(
                  "rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300",
                  "bg-gradient-to-br",
                  room.color,
                )}
              >
                {/* Card Header */}
                <div className="p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{room.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold">{room.name}</h3>
                        <p className="text-white/80 text-sm flex items-center gap-1 mt-1">
                          <Users className="h-4 w-4" />
                          Capacidad: {room.capacity} personas
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white hover:bg-white/20"
                        onClick={() => openEditRoom(room)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white hover:bg-red-500/50"
                        onClick={() => handleDeleteRoom(room.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Amenities */}
                  {room.amenities.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {room.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status indicator */}
                <div className="bg-white/10 px-6 py-3 flex items-center justify-between">
                  <span className="text-white/80 text-sm">
                    {room.active ? "✓ Sala activa" : "○ Sala inactiva"}
                  </span>
                  <span className="text-white/60 text-xs">
                    Orden: {room.order}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {rooms.length === 0 && (
          <div className="col-span-full text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <Building className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300">
              No hay salas registradas
            </h3>
            <p className="text-slate-500 mt-1 mb-4">
              Crea tu primera sala de reuniones para comenzar
            </p>
            <Button
              onClick={() => {
                resetRoomForm();
                setShowRoomModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear primera sala
            </Button>
          </div>
        )}
      </div>

      {/* Room Modal */}
      <Dialog
        open={showRoomModal}
        onOpenChange={(open) => {
          if (!open) resetRoomForm();
          setShowRoomModal(open);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingRoom ? "Editar Sala" : "Nueva Sala de Reunión"}
            </DialogTitle>
            <DialogDescription>
              {editingRoom
                ? "Modifica los datos de la sala"
                : "Configura una nueva sala para reservas"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre de la Sala *</Label>
              <Input
                id="name"
                value={roomForm.name}
                onChange={(e) =>
                  setRoomForm({ ...roomForm, name: e.target.value })
                }
                placeholder="Ej: Sala de Conferencias Principal"
                className="text-lg"
              />
            </div>

            {/* Capacity */}
            <div className="grid gap-2">
              <Label htmlFor="capacity">
                Capacidad (personas): {roomForm.capacity}
              </Label>
              <input
                id="capacity"
                type="range"
                min="2"
                max="50"
                value={roomForm.capacity}
                onChange={(e) =>
                  setRoomForm({
                    ...roomForm,
                    capacity: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>2</span>
                <span>50</span>
              </div>
            </div>

            {/* Icon Selector */}
            <div className="grid gap-2">
              <Label>Icono</Label>
              <div className="flex flex-wrap gap-2">
                {ROOM_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setRoomForm({ ...roomForm, icon })}
                    className={cn(
                      "w-12 h-12 text-2xl rounded-xl border-2 transition-all flex items-center justify-center hover:scale-105",
                      roomForm.icon === icon
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-slate-200 hover:border-slate-300",
                    )}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="grid gap-2">
              <Label>Color de la Tarjeta</Label>
              <div className="flex flex-wrap gap-2">
                {ROOM_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() =>
                      setRoomForm({ ...roomForm, color: color.value })
                    }
                    className={cn(
                      "w-10 h-10 rounded-xl transition-all flex items-center justify-center",
                      color.preview,
                      roomForm.color === color.value
                        ? "ring-2 ring-offset-2 ring-blue-500 scale-110"
                        : "hover:scale-105",
                    )}
                    title={color.label}
                  >
                    {roomForm.color === color.value && (
                      <Check className="h-5 w-5 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="grid gap-2">
              <Label>Equipamiento / Comodidades</Label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES_OPTIONS.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                      roomForm.amenities.includes(amenity)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-blue-300",
                    )}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowRoomModal(false);
                resetRoomForm();
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSaveRoom}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {editingRoom ? "Guardar Cambios" : "Crear Sala"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
