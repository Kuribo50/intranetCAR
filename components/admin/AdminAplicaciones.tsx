"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  Loader2,
  Upload,
  ExternalLink,
  Power,
  PowerOff,
  Search,
  List as ListIcon,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import Cropper, { Point, Area } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch"; // Assuming you have a Switch component, if not will use a button toggle
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// --- Utilitarios de Imagen (Igual que antes) ---
function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  flip = { horizontal: false, vertical: false },
): Promise<Blob> {
  const image = new Image();
  image.src = imageSrc;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return Promise.reject(new Error("No 2d context"));
  }

  return new Promise((resolve, reject) => {
    image.onload = function () {
      const rotRad = (rotation * Math.PI) / 180;
      const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation,
      );

      canvas.width = bBoxWidth;
      canvas.height = bBoxHeight;

      ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
      ctx.rotate(rotRad);
      ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
      ctx.translate(-image.width / 2, -image.height / 2);

      ctx.drawImage(image, 0, 0);

      const data = ctx.getImageData(
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
      );

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.putImageData(data, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      }, "image/png");
    };
    image.onerror = (error) => reject(error);
  });
}

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = (rotation * Math.PI) / 180;
  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

interface App {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: string;
  backgroundColor: string;
  imageSize: number;
  order: number;
  active: boolean;
  media?: {
    id: string;
    filename: string;
  };
  mediaId: string;
}

export function AdminAplicaciones() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // View & Pagination State
  const [view, setView] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Estado para el Modal de Edición/Creación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Partial<App> | null>(null);

  // States for Image Cropper inside the same modal flow
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Cargar apps
  const fetchApps = async () => {
    try {
      const response = await fetch("/api/links?category=APP");
      if (response.ok) {
        const data = await response.json();
        setApps(data);
      }
    } catch (error) {
      console.error("Error cargando apps:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  // --- Handlers del Formulario ---

  const handleCreateNew = () => {
    setEditingApp({
      title: "",
      description: "",
      url: "",
      backgroundColor: "#ffffff",
      imageSize: 0,
      order: 0,
      active: true,
      mediaId: undefined,
    });
    setTempImage(null);
    setIsModalOpen(true);
  };

  const handleEdit = (app: App) => {
    setEditingApp({ ...app });
    setTempImage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingApp(null);
    setTempImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  // --- Image Upload Handlers ---

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImage(reader.result as string);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    noClick: true, // We will use a custom button
  });

  const handleCropSave = async () => {
    if (!tempImage || !croppedAreaPixels) return;

    try {
      const croppedBlob = await getCroppedImg(
        tempImage,
        croppedAreaPixels,
        rotation,
      );

      const formData = new FormData();
      formData.append("file", croppedBlob, "app-icon.png");

      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const media = await response.json();
        setEditingApp((prev) => ({
          ...prev,
          mediaId: media.id,
          media: { id: media.id, filename: media.filename },
        }));
        setIsCropperOpen(false);
        setTempImage(null);
      } else {
        alert("Error al subir la imagen procesada");
      }
    } catch (e) {
      console.error(e);
      alert("Error al procesar la imagen");
    }
  };

  const handleSaveApp = async () => {
    if (!editingApp?.title || !editingApp?.url) {
      alert("El título y la URL son obligatorios");
      return;
    }

    const isNew = !editingApp.id;
    const url = isNew ? "/api/links" : `/api/links/${editingApp.id}`;
    const method = isNew ? "POST" : "PUT";

    const payload = {
      ...editingApp,
      category: "APP",
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchApps();
        closeModal();
      } else {
        const error = await response.json();
        alert(error.error || "Error al guardar");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al guardar");
    }
  };

  const handleToggleActive = async (app: App, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/links/${app.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...app, active: !app.active }),
      });
      if (response.ok) {
        setApps(
          apps.map((a) => (a.id === app.id ? { ...a, active: !a.active } : a)),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta aplicación?")) return;
    try {
      await fetch(`/api/links/${id}`, { method: "DELETE" });
      setApps(apps.filter((a) => a.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Filter & Pagination Logic
  const filteredApps = apps.filter((app) =>
    app.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const paginatedApps = filteredApps.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6 w-full">
      <Card className="border-0 shadow-lg w-full">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-md">
                <Power className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                  Aplicaciones
                </CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {apps.length} apps configuradas
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="h-10" onClick={fetchApps} disabled={loading}>
                Actualizar
              </Button>
              <Button
                onClick={handleCreateNew}
                className="bg-emerald-600 hover:bg-emerald-700 text-white h-10"
              >
                <Plus className="h-4 w-4 mr-2" /> Nueva App
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full sm:w-auto">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar aplicaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
              <Button
                variant={view === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("table")}
                className={
                  view === "table"
                    ? "bg-white text-slate-900 shadow-sm hover:bg-white/90"
                    : "text-slate-500 hover:text-slate-900"
                }
              >
                <ListIcon className="h-4 w-4 mr-2" />
                Tabla
              </Button>
              <Button
                variant={view === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("grid")}
                className={
                  view === "grid"
                    ? "bg-white text-slate-900 shadow-sm hover:bg-white/90"
                    : "text-slate-500 hover:text-slate-900"
                }
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Cuadrícula
              </Button>
            </div>
          </div>

          {/* Content Views */}
          {view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedApps.map((app) => (
                <div
                  key={app.id}
                  className={cn(
                    "group relative bg-white dark:bg-slate-800 rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden",
                    !app.active
                      ? "opacity-60 grayscale border-slate-200"
                      : "border-slate-200 dark:border-slate-700",
                  )}
                >
                  {/* Actions Overlay */}
                  <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(app);
                      }}
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className={cn(
                        "h-8 w-8 rounded-full shadow-sm",
                        app.active ? "text-emerald-600" : "text-slate-400",
                      )}
                      onClick={(e) => handleToggleActive(app, e)}
                      title={app.active ? "Desactivar" : "Activar"}
                    >
                      {app.active ? (
                        <Power className="h-4 w-4" />
                      ) : (
                        <PowerOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8 rounded-full shadow-sm bg-red-100 text-red-600 hover:bg-red-200 border-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(app.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Preview del Card */}
                  <div
                    className="h-48 w-full flex items-center justify-center relative p-6 transition-colors overflow-hidden"
                    style={{
                      backgroundColor: app.backgroundColor || "#ffffff",
                    }}
                  >
                    {app.media?.filename ? (
                      <img
                        src={`/uploads/${app.media.filename}`}
                        className="object-contain drop-shadow-sm transform group-hover:scale-105 transition-transform duration-500"
                        alt={app.title}
                        style={{
                          width:
                            app.imageSize > 0 ? `${app.imageSize}%` : "100%",
                          height:
                            app.imageSize > 0 ? `${app.imageSize}%` : "100%",
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <span className="text-2xl font-bold text-slate-400">
                          {app.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate">
                      {app.title}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge variant="outline" className="text-xs font-normal">
                        Orden: {app.order}
                      </Badge>
                      {app.active ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Activo
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                          Inactivo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-800">
                    <TableHead className="w-[80px]">Icono</TableHead>
                    <TableHead>Nombre / Info</TableHead>
                    <TableHead className="w-[100px]">Orden</TableHead>
                    <TableHead className="w-[100px]">Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedApps.map((app) => (
                    <TableRow
                      key={app.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <TableCell>
                        <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden">
                          {app.media?.filename ? (
                            <img
                              src={`/uploads/${app.media.filename}`}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-xs font-bold text-slate-400">
                              {app.title.charAt(0)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">
                            {app.title}
                          </span>
                          <span className="text-xs text-blue-500 truncate max-w-[250px]">
                            {app.url}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {app.order}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {app.active ? (
                          <Badge
                            variant="default"
                            className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200"
                          >
                            Activo
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-500"
                          >
                            Inactivo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(app)}
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(app.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 mt-4">
              <div className="text-sm text-slate-500">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                {Math.min(currentPage * itemsPerPage, filteredApps.length)} de{" "}
                {filteredApps.length} apps
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
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Left: Form */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-white dark:bg-slate-900">
              <DialogHeader>
                <DialogTitle>
                  {editingApp?.id ? "Editar Aplicación" : "Nueva Aplicación"}
                </DialogTitle>
                <DialogDescription>
                  Configura los detalles visuales y el enlace de la aplicación.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <Label>Estado de la aplicación</Label>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-xs font-medium",
                        editingApp?.active
                          ? "text-emerald-600"
                          : "text-slate-400",
                      )}
                    >
                      {editingApp?.active ? "Visible" : "Oculta"}
                    </span>
                    {/* Simple toggle simulation using button if Switch is not available, or standard checkbox */}
                    <Button
                      size="sm"
                      variant={editingApp?.active ? "default" : "outline"}
                      className={cn(
                        "h-6 text-xs",
                        editingApp?.active
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : "",
                      )}
                      onClick={() =>
                        setEditingApp((prev) => ({
                          ...prev!,
                          active: !prev?.active,
                        }))
                      }
                    >
                      {editingApp?.active ? "ON" : "OFF"}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={editingApp?.title || ""}
                      onChange={(e) =>
                        setEditingApp((prev) => ({
                          ...prev!,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Ej: Fonasa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Orden</Label>
                    <Input
                      type="number"
                      value={editingApp?.order || 0}
                      onChange={(e) =>
                        setEditingApp((prev) => ({
                          ...prev!,
                          order: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>URL de destino</Label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      className="pl-9"
                      value={editingApp?.url || ""}
                      onChange={(e) =>
                        setEditingApp((prev) => ({
                          ...prev!,
                          url: e.target.value,
                        }))
                      }
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Descripción Corta</Label>
                  <Input
                    value={editingApp?.description || ""}
                    onChange={(e) =>
                      setEditingApp((prev) => ({
                        ...prev!,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Breve descripción..."
                    maxLength={80}
                  />
                  <p className="text-xs text-right text-slate-400">
                    {editingApp?.description?.length || 0}/80
                  </p>
                </div>

                {/* Image Upload Area */}
                <div className="space-y-2 pt-2">
                  <Label>Icono / Logo</Label>
                  <div
                    {...getRootProps()}
                    className={cn(
                      "border-2 border-dashed rounded-xl p-6 text-center transition-colors flex flex-col items-center gap-4",
                      isDragActive
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:border-emerald-400 hover:bg-slate-50",
                    )}
                  >
                    <input {...getInputProps()} />
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-900">
                        Arrastra tu imagen aquí
                      </p>
                      <p className="text-xs text-slate-500">o si prefieres</p>
                    </div>
                    {/* Explicit Button for Upload */}
                    <Button
                      type="button"
                      onClick={open}
                      variant="secondary"
                      size="sm"
                    >
                      Seleccionar Archivo
                    </Button>
                  </div>
                </div>

                {/* Visual Controls */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold text-slate-500">
                      Color de Fondo
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        type="color"
                        className="w-12 h-10 p-1 cursor-pointer"
                        value={editingApp?.backgroundColor || "#ffffff"}
                        onChange={(e) =>
                          setEditingApp((prev) => ({
                            ...prev!,
                            backgroundColor: e.target.value,
                          }))
                        }
                      />
                      <Input
                        value={editingApp?.backgroundColor || "#ffffff"}
                        onChange={(e) =>
                          setEditingApp((prev) => ({
                            ...prev!,
                            backgroundColor: e.target.value,
                          }))
                        }
                        className="font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs uppercase font-bold text-slate-500">
                        Escala de Imagen
                      </Label>
                      <span className="text-xs font-bold text-emerald-600">
                        {editingApp?.imageSize || 0}%
                      </span>
                    </div>
                    <Slider
                      value={[editingApp?.imageSize || 0]}
                      max={200} // Increased to 200% as requested
                      step={5}
                      onValueChange={(val) =>
                        setEditingApp((prev) => ({
                          ...prev!,
                          imageSize: val[0],
                        }))
                      }
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 px-1">
                      <span>0% (Auto)</span>
                      <span>100%</span>
                      <span>200%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white dark:bg-slate-900">
                <Button variant="outline" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveApp}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </div>

            {/* Right: Preview Panel */}
            <div className="w-full lg:w-80 bg-slate-100 dark:bg-slate-950 p-8 flex flex-col items-center justify-center border-l border-slate-200 dark:border-slate-800">
              <div className="mb-6 text-center">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Vista Previa
                </h3>
                <p className="text-xs text-slate-500 max-w-[200px] mx-auto">
                  Así se verá el botón en el Laucnchpad.
                </p>
              </div>

              {/* The Preview Card */}
              <div
                className={cn(
                  "w-[200px] h-[280px] bg-white dark:bg-slate-800 rounded-[24px] shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col relative transition-opacity",
                  !editingApp?.active && "opacity-50 grayscale",
                )}
              >
                {/* Top Image Area */}
                <div
                  className={cn(
                    "h-[60%] w-full flex items-center justify-center relative overflow-hidden", // Added overflow-hidden for large images
                    (!editingApp?.imageSize || editingApp.imageSize === 0) &&
                      "p-6",
                  )}
                  style={{
                    backgroundColor: editingApp?.backgroundColor || "#ffffff",
                  }}
                >
                  {editingApp?.media?.filename || tempImage ? (
                    <img
                      alt="Preview"
                      className="object-contain drop-shadow-sm"
                      src={
                        tempImage || `/uploads/${editingApp?.media?.filename}`
                      }
                      style={{
                        width:
                          (editingApp?.imageSize || 0) > 0
                            ? `${editingApp?.imageSize}%`
                            : "100%",
                        height:
                          (editingApp?.imageSize || 0) > 0
                            ? `${editingApp?.imageSize}%`
                            : "100%",
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center">
                      <span className="text-2xl font-bold text-slate-400 opacity-50">
                        {(editingApp?.title || "A").charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Text Area */}
                <div className="h-[40%] w-full flex flex-col items-center justify-center text-center p-4 bg-white dark:bg-slate-800 z-10">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 leading-tight">
                    {editingApp?.title || "Título App"}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {editingApp?.description ||
                      "Descripción de la aplicación..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Cropper Modal (Nested) */}
      <Dialog open={isCropperOpen} onOpenChange={setIsCropperOpen}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Recortar Imagen</DialogTitle>
          </DialogHeader>
          <div className="relative h-[400px] w-full bg-slate-950 rounded-lg overflow-hidden mt-2">
            {tempImage && (
              <Cropper
                image={tempImage}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={(area, pixels) => setCroppedAreaPixels(pixels)}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                objectFit="contain"
              />
            )}
          </div>
          <div className="flex items-center gap-4 py-4">
            <Label>Zoom</Label>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(v) => setZoom(v[0])}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCropperOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCropSave}>Confirmar Imagen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
