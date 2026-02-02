"use client";

import * as React from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Edit2,
  Trash2,
  Building2,
  Users2,
  DoorOpen,
  RefreshCw,
  GripVertical,
  Check,
  X,
  Briefcase,
  Search,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Pill,
  Microscope,
  TestTube,
  HeartPulse,
  Syringe,
  Presentation,
  Armchair,
  Projector,
  Coffee,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Image as ImageIcon } from "lucide-react";

// Tipos
interface Estamento {
  id: string;
  name: string;
  order: number;
  active: boolean;
}

interface Establecimiento {
  id: string;
  name: string;
  order: number;
  active: boolean;
  address?: string;
  mediaId?: string | null;
  media?: {
    id: string;
    filename: string;
    type: string;
  };
}

interface Programa {
  id: string;
  name: string;
  order: number;
  active: boolean;
}

interface MeetingRoom {
  id: string;
  name: string;
  capacity: number;
  amenities: string;
  color: string;
  icon: string;
  description?: string;
  active: boolean;
  order: number;
  establecimientoId?: string | null;
  mediaId?: string | null;
  Establecimiento?: Establecimiento;
  Media?: {
    id: string;
    filename: string;
    type: string;
  };
}

type TabType = "estamentos" | "establecimientos" | "programas" | "salas";

export function AdminConfiguracion() {
  const [activeTab, setActiveTab] = React.useState<TabType>("estamentos");
  const [cargando, setCargando] = React.useState(false);

  // Estados para Estamentos
  const [estamentos, setEstamentos] = React.useState<Estamento[]>([]);
  const [modalEstamento, setModalEstamento] = React.useState(false);
  const [estamentoForm, setEstamentoForm] = React.useState({
    id: "",
    name: "",
    order: 0,
  });
  const [editingEstamento, setEditingEstamento] = React.useState(false);

  // Estados para Establecimientos
  const [establecimientos, setEstablecimientos] = React.useState<
    Establecimiento[]
  >([]);
  const [modalEstablecimiento, setModalEstablecimiento] = React.useState(false);
  const [establecimientoForm, setEstablecimientoForm] = React.useState({
    id: "",
    name: "",
    order: 0,
    address: "",
    mediaId: "",
  });
  const [editingEstablecimiento, setEditingEstablecimiento] =
    React.useState(false);

  // Image Upload State for Establecimiento
  const [uploadingEstablecimientoImage, setUploadingEstablecimientoImage] =
    React.useState(false);
  const [establecimientoPreviewUrl, setEstablecimientoPreviewUrl] =
    React.useState<string | null>(null);
  const [establecimientoMediaId, setEstablecimientoMediaId] = React.useState<
    string | null
  >(null);

  // Estados para Programas
  const [programas, setProgramas] = React.useState<Programa[]>([]);
  const [modalPrograma, setModalPrograma] = React.useState(false);
  const [programaForm, setProgramaForm] = React.useState({
    id: "",
    name: "",
    order: 0,
  });
  const [editingPrograma, setEditingPrograma] = React.useState(false);

  // Estados para Salas
  const [salas, setSalas] = React.useState<MeetingRoom[]>([]);
  const [modalSala, setModalSala] = React.useState(false);
  const [salaForm, setSalaForm] = React.useState({
    id: "",
    name: "",
    capacity: 6,
    amenities: "[]",
    color: "from-blue-500 to-blue-600",
    icon: "🏥",
    description: "",
    active: true,
    order: 0,
    establecimientoId: "",
    mediaId: "",
  });
  const [editingSala, setEditingSala] = React.useState(false);

  // Image Upload State
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [mediaId, setMediaId] = React.useState<string | null>(null);

  // Modal eliminar
  const [modalEliminar, setModalEliminar] = React.useState(false);
  const [itemAEliminar, setItemAEliminar] = React.useState<{
    type: TabType;
    id: string;
    name: string;
  } | null>(null);

  const [guardando, setGuardando] = React.useState(false);

  // Estados para Filtros y Paginación
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  // Reset pagination on tab change
  React.useEffect(() => {
    setCurrentPage(1);
    setSearchTerm("");
  }, [activeTab]);

  // Cargar datos
  const cargarEstamentos = async () => {
    try {
      const response = await fetch("/api/estamentos");
      if (response.ok) {
        const data = await response.json();
        setEstamentos(data);
      }
    } catch (error) {
      console.error("Error loading estamentos:", error);
    }
  };

  const cargarEstablecimientos = async () => {
    try {
      const response = await fetch("/api/establecimientos");
      if (response.ok) {
        const data = await response.json();
        setEstablecimientos(data);
      }
    } catch (error) {
      console.error("Error loading establecimientos:", error);
    }
  };

  const cargarProgramas = async () => {
    try {
      const response = await fetch("/api/programas");
      if (response.ok) {
        const data = await response.json();
        setProgramas(data);
      }
    } catch (error) {
      console.error("Error loading programas:", error);
    }
  };

  const cargarSalas = async () => {
    try {
      const response = await fetch("/api/meeting-rooms");
      if (response.ok) {
        const data = await response.json();
        setSalas(data);
      }
    } catch (error) {
      console.error("Error loading salas:", error);
    }
  };

  const cargarTodo = async () => {
    setCargando(true);
    await Promise.all([
      cargarEstamentos(),
      cargarEstablecimientos(),
      cargarProgramas(),
      cargarSalas(),
    ]);
    setCargando(false);
  };

  React.useEffect(() => {
    cargarTodo();
  }, []);

  // --- Logic for Pagination/Filter ---
  const getActiveList = () => {
    switch (activeTab) {
      case "estamentos":
        return estamentos;
      case "establecimientos":
        return establecimientos;
      case "programas":
        return programas;
      case "salas":
        return salas;
      default:
        return [];
    }
  };

  const filteredList = React.useMemo(() => {
    const list = getActiveList();
    if (!searchTerm) return list;
    return list.filter((item: any) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [activeTab, estamentos, establecimientos, programas, salas, searchTerm]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(start, start + itemsPerPage);
  }, [filteredList, currentPage]);

  const PaginationControls = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 mt-4">
        <div className="text-sm text-slate-500">
          Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
          {Math.min(currentPage * itemsPerPage, filteredList.length)} de{" "}
          {filteredList.length} registros
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-2">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  // === ESTAMENTOS ===
  const handleNuevoEstamento = () => {
    setEstamentoForm({ id: "", name: "", order: estamentos.length });
    setEditingEstamento(false);
    setModalEstamento(true);
  };

  const handleEditarEstamento = (item: Estamento) => {
    setEstamentoForm({ id: item.id, name: item.name, order: item.order });
    setEditingEstamento(true);
    setModalEstamento(true);
  };

  const guardarEstamento = async () => {
    if (!estamentoForm.name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }

    setGuardando(true);
    try {
      const url = editingEstamento
        ? `/api/estamentos/${estamentoForm.id}`
        : "/api/estamentos";
      const method = editingEstamento ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: estamentoForm.name,
          order: estamentoForm.order,
        }),
      });

      if (response.ok) {
        toast.success(
          editingEstamento ? "Estamento actualizado" : "Estamento creado",
        );
        setModalEstamento(false);
        cargarEstamentos();
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al guardar");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setGuardando(false);
    }
  };

  const toggleEstamentoActivo = async (item: Estamento) => {
    try {
      const response = await fetch(`/api/estamentos/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !item.active }),
      });

      if (response.ok) {
        toast.success(
          item.active ? "Estamento desactivado" : "Estamento activado",
        );
        cargarEstamentos();
      }
    } catch (error) {
      toast.error("Error de conexión");
    }
  };

  // === ESTABLECIMIENTOS ===
  const handleNuevoEstablecimiento = () => {
    setEstablecimientoForm({
      id: "",
      name: "",
      order: establecimientos.length,
      address: "",
      mediaId: "",
    });
    setEstablecimientoPreviewUrl(null);
    setEstablecimientoMediaId(null);
    setEditingEstablecimiento(false);
    setModalEstablecimiento(true);
  };

  const handleEditarEstablecimiento = (item: Establecimiento) => {
    setEstablecimientoForm({
      id: item.id,
      name: item.name,
      order: item.order,
      address: item.address || "",
      mediaId: item.mediaId || "",
    });
    setEstablecimientoPreviewUrl(item.media ? item.media.filename : null);
    setEstablecimientoMediaId(item.media ? item.media.id : null);
    setEditingEstablecimiento(true);
    setModalEstablecimiento(true);
  };

  const guardarEstablecimiento = async () => {
    if (!establecimientoForm.name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }

    setGuardando(true);
    try {
      const url = editingEstablecimiento
        ? `/api/establecimientos/${establecimientoForm.id}`
        : "/api/establecimientos";
      const method = editingEstablecimiento ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: establecimientoForm.name,
          order: establecimientoForm.order,
          address: establecimientoForm.address,
          mediaId: establecimientoForm.mediaId || null,
        }),
      });

      if (response.ok) {
        toast.success(
          editingEstablecimiento
            ? "Establecimiento actualizado"
            : "Establecimiento creado",
        );
        setModalEstablecimiento(false);
        cargarEstablecimientos();
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al guardar");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setGuardando(false);
    }
  };

  const toggleEstablecimientoActivo = async (item: Establecimiento) => {
    try {
      const response = await fetch(`/api/establecimientos/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !item.active }),
      });

      if (response.ok) {
        toast.success(
          item.active
            ? "Establecimiento desactivado"
            : "Establecimiento activado",
        );
        cargarEstablecimientos();
      }
    } catch (error) {
      toast.error("Error de conexión");
    }
  };

  // === PROGRAMAS ===
  const handleNuevoPrograma = () => {
    setProgramaForm({ id: "", name: "", order: programas.length });
    setEditingPrograma(false);
    setModalPrograma(true);
  };

  const handleEditarPrograma = (item: Programa) => {
    setProgramaForm({ id: item.id, name: item.name, order: item.order });
    setEditingPrograma(true);
    setModalPrograma(true);
  };

  const guardarPrograma = async () => {
    if (!programaForm.name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }

    setGuardando(true);
    try {
      const url = editingPrograma
        ? `/api/programas/${programaForm.id}`
        : "/api/programas";
      const method = editingPrograma ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: programaForm.name,
          order: programaForm.order,
        }),
      });

      if (response.ok) {
        toast.success(
          editingPrograma ? "Programa actualizado" : "Programa creado",
        );
        setModalPrograma(false);
        cargarProgramas();
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al guardar");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setGuardando(false);
    }
  };

  const toggleProgramaActivo = async (item: Programa) => {
    try {
      const response = await fetch(`/api/programas/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !item.active }),
      });

      if (response.ok) {
        toast.success(
          item.active ? "Programa desactivado" : "Programa activado",
        );
        cargarProgramas();
      }
    } catch (error) {
      toast.error("Error de conexión");
    }
  };

  // === SALAS ===
  const handleNuevaSala = () => {
    setSalaForm({
      id: "",
      name: "",
      capacity: 6,
      amenities: "[]",
      color: "from-blue-500 to-blue-600",
      icon: "🏥",
      description: "",
      active: true,
      order: salas.length,
      establecimientoId: "",
      mediaId: "",
    });
    setPreviewUrl(null);
    setMediaId(null);
    setEditingSala(false);
    setModalSala(true);
  };

  const handleEditarSala = (item: MeetingRoom) => {
    setSalaForm({
      id: item.id,
      name: item.name,
      capacity: item.capacity,
      amenities: item.amenities,
      color: item.color,
      icon: item.icon,
      description: item.description || "",
      active: item.active,
      order: item.order,
      establecimientoId: item.establecimientoId || "",
      mediaId: item.mediaId || "",
    });
    setPreviewUrl(item.Media ? item.Media.filename : null);
    setMediaId(item.Media ? item.Media.id : null);
    setEditingSala(true);
    setModalSala(true);
  };

  const handleEstablecimientoImageUpload = async (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Tipo de archivo no soportado (JPG, PNG, WebP, GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("El archivo no debe pesar más de 5MB");
      return;
    }

    const data = new FormData();
    data.append("file", file);
    setUploadingEstablecimientoImage(true);
    const loadingToast = toast.loading("Subiendo imagen...");

    try {
      const response = await fetch("/api/media", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const media = await response.json();
        setEstablecimientoForm((prev) => ({ ...prev, mediaId: media.id }));
        setEstablecimientoPreviewUrl(media.filename);
        toast.dismiss(loadingToast);
        toast.success("Imagen subida correctamente");
      } else {
        toast.dismiss(loadingToast);
        toast.error("Error al subir imagen");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error de conexión");
    } finally {
      setUploadingEstablecimientoImage(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Tipo de archivo no soportado (JPG, PNG, WebP, GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("El archivo no debe pesar más de 5MB");
      return;
    }

    const data = new FormData();
    data.append("file", file);
    setUploadingImage(true);
    const loadingToast = toast.loading("Subiendo imagen...");

    try {
      const response = await fetch("/api/media", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const media = await response.json();
        setSalaForm((prev) => ({ ...prev, mediaId: media.id }));
        setPreviewUrl(media.filename);
        toast.dismiss(loadingToast);
        toast.success("Imagen subida correctamente");
      } else {
        toast.dismiss(loadingToast);
        toast.error("Error al subir imagen");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error de conexión");
    } finally {
      setUploadingImage(false);
    }
  };

  const guardarSala = async () => {
    if (!salaForm.name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }

    setGuardando(true);
    try {
      const url = editingSala
        ? `/api/meeting-rooms/${salaForm.id}`
        : "/api/meeting-rooms";
      const method = editingSala ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: salaForm.name,
          capacity: salaForm.capacity,
          amenities: salaForm.amenities,
          color: salaForm.color,
          icon: salaForm.icon,
          description: salaForm.description,
          active: salaForm.active,
          order: salaForm.order,
          establecimientoId: salaForm.establecimientoId || null,
          mediaId: salaForm.mediaId || null,
        }),
      });

      if (response.ok) {
        toast.success(editingSala ? "Sala actualizada" : "Sala creada");
        setModalSala(false);
        cargarSalas();
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al guardar");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setGuardando(false);
    }
  };

  const toggleSalaActiva = async (item: MeetingRoom) => {
    try {
      const response = await fetch(`/api/meeting-rooms/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !item.active }),
      });

      if (response.ok) {
        toast.success(item.active ? "Sala desactivada" : "Sala activada");
        cargarSalas();
      }
    } catch (error) {
      toast.error("Error de conexión");
    }
  };

  // === ELIMINAR ===
  const handleEliminar = (type: TabType, id: string, name: string) => {
    setItemAEliminar({ type, id, name });
    setModalEliminar(true);
  };

  const confirmarEliminar = async () => {
    if (!itemAEliminar) return;

    setGuardando(true);
    try {
      const urls: Record<TabType, string> = {
        estamentos: `/api/estamentos/${itemAEliminar.id}`,
        establecimientos: `/api/establecimientos/${itemAEliminar.id}`,
        programas: `/api/programas/${itemAEliminar.id}`,
        salas: `/api/meeting-rooms/${itemAEliminar.id}`,
      };

      const response = await fetch(urls[itemAEliminar.type], {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Eliminado correctamente");
        setModalEliminar(false);
        if (itemAEliminar.type === "estamentos") cargarEstamentos();
        else if (itemAEliminar.type === "establecimientos")
          cargarEstablecimientos();
        else if (itemAEliminar.type === "programas") cargarProgramas();
        else cargarSalas();
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al eliminar");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setGuardando(false);
    }
  };

  const tabs = [
    {
      id: "estamentos" as TabType,
      label: "Estamentos",
      icon: Users2,
      count: estamentos.length,
    },
    {
      id: "establecimientos" as TabType,
      label: "Establecimientos",
      icon: Building2,
      count: establecimientos.length,
    },
    {
      id: "programas" as TabType,
      label: "Programas Clínicos",
      icon: Briefcase,
      count: programas.length,
    },
    {
      id: "salas" as TabType,
      label: "Salas Clínicas/Reunión",
      icon: DoorOpen,
      count: salas.length,
    },
  ];

  const colorOptions = [
    { value: "from-blue-500 to-blue-600", label: "Azul", bg: "bg-blue-500" },
    {
      value: "from-green-500 to-green-600",
      label: "Verde",
      bg: "bg-green-500",
    },
    {
      value: "from-purple-500 to-purple-600",
      label: "Morado",
      bg: "bg-purple-500",
    },
    {
      value: "from-orange-500 to-orange-600",
      label: "Naranja",
      bg: "bg-orange-500",
    },
    { value: "from-pink-500 to-pink-600", label: "Rosa", bg: "bg-pink-500" },
    { value: "from-teal-500 to-teal-600", label: "Teal", bg: "bg-teal-500" },
    { value: "from-red-500 to-red-600", label: "Rojo", bg: "bg-red-500" },
    {
      value: "from-yellow-500 to-yellow-600",
      label: "Amarillo",
      bg: "bg-yellow-500",
    },
  ];

  const availableIcons = [
    { name: "Edificio", value: "Building2", icon: Building2 },
    { name: "Reunión", value: "Users", icon: Users },
    { name: "Proyector", value: "Presentation", icon: Presentation },
    { name: "Sillón", value: "Armchair", icon: Armchair },
    { name: "Café", value: "Coffee", icon: Coffee },
    { name: "Estetoscopio", value: "Stethoscope", icon: Stethoscope },
    { name: "Medicamento", value: "Pill", icon: Pill },
    { name: "Microscopio", value: "Microscope", icon: Microscope },
    { name: "Laboratorio", value: "TestTube", icon: TestTube },
    { name: "Corazón", value: "HeartPulse", icon: HeartPulse },
    { name: "Jeringa", value: "Syringe", icon: Syringe },
  ];

  const renderIcon = (iconName: string) => {
    const found = availableIcons.find((i) => i.value === iconName);
    if (found) {
      const Icon = found.icon;
      return <Icon className="h-5 w-5" />;
    }
    // Fallback for emojis or unknown icons
    return <span>{iconName}</span>;
  };

  return (
    <div className="space-y-6 w-full">
      <Card className="border-0 shadow-lg w-full">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                  Configuración Médica
                </CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Gestiona estamentos, establecimientos y salas clínicas
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="h-10" // Height 10 to match standard inputs/buttons
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${cargando ? "animate-spin" : ""}`}
                />
                Actualizar
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Tabs */}
          <div className="flex border-b bg-slate-50 dark:bg-slate-800/50 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 bg-white dark:bg-slate-900"
                    : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                <Badge variant="secondary" className="ml-1">
                  {tab.count}
                </Badge>
              </button>
            ))}
          </div>

          {/* Filter Bar & Content */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder={`Buscar en ${tabs.find((t) => t.id === activeTab)?.label.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              <Button
                onClick={() => {
                  if (activeTab === "estamentos") handleNuevoEstamento();
                  else if (activeTab === "establecimientos")
                    handleNuevoEstablecimiento();
                  else if (activeTab === "programas") handleNuevoPrograma();
                  else if (activeTab === "salas") handleNuevaSala();
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo{" "}
                {tabs.find((t) => t.id === activeTab)?.label.slice(0, -1) ||
                  "Item"}
              </Button>
            </div>

            {/* Tab Estamentos */}
            {activeTab === "estamentos" && (
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead className="w-24">Estado</TableHead>
                        <TableHead className="w-32 text-right">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedList.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-8 text-slate-500"
                          >
                            No hay estamentos encontrados
                          </TableCell>
                        </TableRow>
                      ) : (
                        (paginatedList as Estamento[]).map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-slate-500">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </TableCell>
                            <TableCell className="font-medium">
                              {item.name}
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={item.active}
                                onCheckedChange={() =>
                                  toggleEstamentoActivo(item)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditarEstamento(item)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleEliminar(
                                      "estamentos",
                                      item.id,
                                      item.name,
                                    )
                                  }
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <PaginationControls />
              </div>
            )}

            {/* Tab Establecimientos */}
            {activeTab === "establecimientos" && (
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead className="w-24">Estado</TableHead>
                        <TableHead className="w-32 text-right">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedList.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-8 text-slate-500"
                          >
                            No hay establecimientos encontrados
                          </TableCell>
                        </TableRow>
                      ) : (
                        (paginatedList as Establecimiento[]).map(
                          (item, index) => (
                            <TableRow key={item.id}>
                              <TableCell className="text-slate-500">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </TableCell>
                              <TableCell className="font-medium">
                                {item.name}
                              </TableCell>
                              <TableCell>
                                <Switch
                                  checked={item.active}
                                  onCheckedChange={() =>
                                    toggleEstablecimientoActivo(item)
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-end gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleEditarEstablecimiento(item)
                                    }
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleEliminar(
                                        "establecimientos",
                                        item.id,
                                        item.name,
                                      )
                                    }
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ),
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
                <PaginationControls />
              </div>
            )}

            {/* Tab Programas */}
            {activeTab === "programas" && (
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead className="w-24">Estado</TableHead>
                        <TableHead className="w-32 text-right">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedList.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-8 text-slate-500"
                          >
                            No hay programas encontrados
                          </TableCell>
                        </TableRow>
                      ) : (
                        (paginatedList as Programa[]).map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-slate-500">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </TableCell>
                            <TableCell className="font-medium">
                              {item.name}
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={item.active}
                                onCheckedChange={() =>
                                  toggleProgramaActivo(item)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditarPrograma(item)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleEliminar(
                                      "programas",
                                      item.id,
                                      item.name,
                                    )
                                  }
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <PaginationControls />
              </div>
            )}

            {/* Tab Salas */}
            {activeTab === "salas" && (
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Capacidad</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead className="w-24">Estado</TableHead>
                        <TableHead className="w-32 text-right">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedList.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-slate-500"
                          >
                            No hay salas encontradas
                          </TableCell>
                        </TableRow>
                      ) : (
                        (paginatedList as MeetingRoom[]).map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-slate-500">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">
                                  {renderIcon(item.icon)}
                                </span>
                                {item.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {item.capacity === 0
                                  ? "No corresponde"
                                  : `${item.capacity} pers.`}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div
                                className={`w-6 h-6 rounded-full bg-gradient-to-br ${item.color} shadow-sm`}
                              />
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={item.active}
                                onCheckedChange={() => toggleSalaActiva(item)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditarSala(item)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleEliminar("salas", item.id, item.name)
                                  }
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <PaginationControls />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal Estamento */}
      <Dialog open={modalEstamento} onOpenChange={setModalEstamento}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingEstamento ? "Editar Estamento" : "Nuevo Estamento"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="estamento-name">Nombre *</Label>
              <Input
                id="estamento-name"
                value={estamentoForm.name}
                onChange={(e) =>
                  setEstamentoForm({ ...estamentoForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estamento-order">Orden</Label>
              <Input
                id="estamento-order"
                type="number"
                min={0}
                value={estamentoForm.order}
                onChange={(e) =>
                  setEstamentoForm({
                    ...estamentoForm,
                    order: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalEstamento(false)}>
              Cancelar
            </Button>
            <Button onClick={guardarEstamento} disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Establecimiento */}
      <Dialog
        open={modalEstablecimiento}
        onOpenChange={setModalEstablecimiento}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEstablecimiento
                ? "Editar Establecimiento"
                : "Nuevo Establecimiento"}
            </DialogTitle>
            <DialogDescription>
              Configurala ubicación, dirección y foto del establecimiento.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Image Upload */}
            <div className="flex justify-center">
              <div className="relative group cursor-pointer border-2 border-dashed border-slate-300 rounded-xl w-full h-48 bg-slate-50 hover:bg-slate-100 transition-colors flex flex-col items-center justify-center overflow-hidden">
                {establecimientoPreviewUrl ? (
                  <>
                    <img
                      src={
                        establecimientoPreviewUrl.startsWith("http") ||
                        establecimientoPreviewUrl.startsWith("/")
                          ? establecimientoPreviewUrl
                          : `/uploads/${establecimientoPreviewUrl}`
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEstablecimientoPreviewUrl(null);
                          setEstablecimientoMediaId(null);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Eliminar Imagen
                      </Button>
                    </div>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                    {uploadingEstablecimientoImage ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2" />
                    ) : (
                      <>
                        <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                          <ImageIcon className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-600">
                          Sube una foto del establecimiento
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          JPG, PNG, WebP (Max 5MB)
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files &&
                        handleEstablecimientoImageUpload(e.target.files[0])
                      }
                      disabled={uploadingEstablecimientoImage}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="establecimiento-name">Nombre *</Label>
                <Input
                  id="establecimiento-name"
                  value={establecimientoForm.name}
                  onChange={(e) =>
                    setEstablecimientoForm({
                      ...establecimientoForm,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="establecimiento-order">Orden</Label>
                <Input
                  id="establecimiento-order"
                  type="number"
                  min={0}
                  value={establecimientoForm.order}
                  onChange={(e) =>
                    setEstablecimientoForm({
                      ...establecimientoForm,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="establecimiento-address">Dirección</Label>
              <Input
                id="establecimiento-address"
                value={establecimientoForm.address}
                onChange={(e) =>
                  setEstablecimientoForm({
                    ...establecimientoForm,
                    address: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModalEstablecimiento(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={guardarEstablecimiento}
              disabled={guardando}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {guardando ? "Guardando..." : "Guardar Establecimiento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Programa */}
      <Dialog open={modalPrograma} onOpenChange={setModalPrograma}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPrograma ? "Editar Programa" : "Nuevo Programa"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="programa-name">Nombre *</Label>
              <Input
                id="programa-name"
                value={programaForm.name}
                onChange={(e) =>
                  setProgramaForm({ ...programaForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="programa-order">Orden</Label>
              <Input
                id="programa-order"
                type="number"
                min={0}
                value={programaForm.order}
                onChange={(e) =>
                  setProgramaForm({
                    ...programaForm,
                    order: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalPrograma(false)}>
              Cancelar
            </Button>
            <Button onClick={guardarPrograma} disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Sala */}
      <Dialog open={modalSala} onOpenChange={setModalSala}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSala ? "Editar Sala" : "Nueva Sala de Reunión"}
            </DialogTitle>
            <DialogDescription>
              Configura los detalles, capacidad y apariencia de la sala.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Image Upload */}
            <div className="flex justify-center">
              <div className="relative group cursor-pointer border-2 border-dashed border-slate-300 rounded-xl w-full h-48 bg-slate-50 hover:bg-slate-100 transition-colors flex flex-col items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <>
                    <img
                      src={
                        previewUrl.startsWith("http") ||
                        previewUrl.startsWith("/")
                          ? previewUrl
                          : `/uploads/${previewUrl}`
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewUrl(null);
                          setMediaId(null);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Eliminar Imagen
                      </Button>
                    </div>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                    {uploadingImage ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2" />
                    ) : (
                      <>
                        <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                          <ImageIcon className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-600">
                          Sube una foto de la sala
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          JPG, PNG, WebP (Max 5MB)
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files && handleImageUpload(e.target.files[0])
                      }
                      disabled={uploadingImage}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sala-name">Nombre de la Sala *</Label>
                <Input
                  id="sala-name"
                  placeholder="Ej: Sala de Reuniones 1"
                  value={salaForm.name}
                  onChange={(e) =>
                    setSalaForm({ ...salaForm, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Establecimiento</Label>
                <Select
                  value={salaForm.establecimientoId}
                  onValueChange={(v) =>
                    setSalaForm({ ...salaForm, establecimientoId: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona ubicación..." />
                  </SelectTrigger>
                  <SelectContent>
                    {establecimientos.map((establishment) => (
                      <SelectItem
                        key={establishment.id}
                        value={establishment.id}
                      >
                        {establishment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sala-capacity">Capacidad (Personas)</Label>
                <Input
                  id="sala-capacity"
                  type="number"
                  min={0}
                  value={salaForm.capacity}
                  onChange={(e) =>
                    setSalaForm({
                      ...salaForm,
                      capacity: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sala-order">Orden de visualización</Label>
                <Input
                  id="sala-order"
                  type="number"
                  min={0}
                  value={salaForm.order}
                  onChange={(e) =>
                    setSalaForm({
                      ...salaForm,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descripción (Opcional)</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                placeholder="Características, equipamiento, instrucciones..."
                value={salaForm.description}
                onChange={(e) =>
                  setSalaForm({ ...salaForm, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-3">
              <Label>Icono Representativo</Label>
              <div className="grid grid-cols-6 gap-2">
                {availableIcons.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        setSalaForm({ ...salaForm, icon: item.value })
                      }
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all gap-1 h-14 ${
                        salaForm.icon === item.value
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-500"
                      }`}
                      title={item.name}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Color de Identificación</Label>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() =>
                      setSalaForm({ ...salaForm, color: color.value })
                    }
                    className={`w-8 h-8 rounded-full ${color.bg} transition-all ${
                      salaForm.color === color.value
                        ? "ring-2 ring-offset-2 ring-indigo-600 scale-110"
                        : "hover:scale-105 opacity-80 hover:opacity-100"
                    }`}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-slate-50 p-4 rounded-lg border border-slate-100">
              <Switch
                id="sala-active"
                checked={salaForm.active}
                onCheckedChange={(c) => setSalaForm({ ...salaForm, active: c })}
              />
              <Label
                htmlFor="sala-active"
                className="cursor-pointer font-medium"
              >
                Habilitada para reservas
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalSala(false)}>
              Cancelar
            </Button>
            <Button
              onClick={guardarSala}
              disabled={guardando}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {guardando ? "Guardando..." : "Guardar Sala"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Eliminar */}
      <Dialog open={modalEliminar} onOpenChange={setModalEliminar}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar{" "}
              <strong>{itemAEliminar?.name}</strong>? Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalEliminar(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmarEliminar}
              disabled={guardando}
            >
              {guardando ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
