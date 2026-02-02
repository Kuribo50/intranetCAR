"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Play,
  Film,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface CarouselImage {
  id: string;
  title?: string | null;
  description?: string | null;
  linkUrl?: string | null;
  linkType?: string | null;
  order: number;
  active: boolean;
  pinned?: boolean;
  autoPlayDuration?: number;
  Media?: {
    id: string;
    filename: string;
    alt?: string | null;
    type?: string;
    mimeType?: string;
  };
}

export function AdminCarrusel() {
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Pagination & Filter State
  const [view, setView] = useState<"table" | "grid">("table"); // Although Carrusel might be better as Table always due to order. Let's keep table mainly but standardize UI.
  // Actually, standard layout uses list/grid. AdminCarrusel usually needs ordering (drag and drop maybe? Or just manual order edit).
  // Current logic uses a number input for order.
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, ACTIVE, INACTIVE

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    linkUrl: "",
    linkType: "",
    order: 0,
    active: true,
    pinned: false,
    autoPlayDuration: 5,
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaId, setMediaId] = useState<string | null>(null);

  useEffect(() => {
    fetchCarouselImages();
  }, []);

  const fetchCarouselImages = async () => {
    try {
      const response = await fetch("/api/carousel");
      if (response.ok) {
        const data = await response.json();
        setCarouselImages(
          data.sort((a: CarouselImage, b: CarouselImage) => a.order - b.order),
        );
      }
    } catch (error) {
      console.error("Error fetching carousel images:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      linkUrl: "",
      linkType: "",
      order: 0,
      active: true,
      pinned: false,
      autoPlayDuration: 5,
    });
    setPreviewUrl(null);
    setMediaId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (img: CarouselImage) => {
    setEditingId(img.id);
    setFormData({
      title: img.title || "",
      description: img.description || "",
      linkUrl: img.linkUrl || "",
      linkType: img.linkType || "",
      order: img.order,
      active: img.active,
      pinned: img.pinned || false,
      autoPlayDuration: img.autoPlayDuration || 5,
    });
    setPreviewUrl(img.Media?.filename || null);
    setMediaId(img.Media?.id || null);
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    // Validar tipo de archivo
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "image/gif",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Tipo de archivo no soportado", {
        description: "Solo se permiten: JPG, PNG, WebP, GIF, MP4, WebM, MOV",
      });
      return;
    }

    // Validar tamaño (máx 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Archivo demasiado grande", {
        description: `Tamaño máximo: 100MB. Tu archivo: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      });
      return;
    }

    const data = new FormData();
    data.append("file", file);
    setUploadingImage(true);

    const loadingToast = toast.loading("Subiendo archivo...");

    try {
      const response = await fetch("/api/media", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const media = await response.json();
        setMediaId(media.id);
        setPreviewUrl(media.filename);
        toast.dismiss(loadingToast);
        toast.success("Archivo subido exitosamente", {
          description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
        });
      } else {
        toast.dismiss(loadingToast);
        let errorMessage = "Intenta nuevamente";

        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          if (response.status === 413) {
            errorMessage = "Archivo demasiado grande. Máximo 100MB.";
          }
        }

        toast.error("Error al subir archivo", {
          description: errorMessage,
        });
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      console.error("Error subiendo archivo:", error);
      toast.error("Error de conexión", {
        description: error.message || "No se pudo conectar al servidor",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!mediaId) {
      toast.error("Falta seleccionar multimedia", {
        description: "Por favor sube una imagen o video",
      });
      return;
    }

    try {
      const url = editingId ? `/api/carousel/${editingId}` : "/api/carousel";
      const method = editingId ? "PUT" : "POST";

      const saveToast = toast.loading("Guardando cambios...");

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          linkUrl: formData.linkUrl || null,
          linkType: formData.linkType || null,
          mediaId: mediaId,
        }),
      });

      if (response.ok) {
        toast.dismiss(saveToast);
        toast.success(editingId ? "Actualizado" : "Creado", {
          description: "Los cambios se guardaron correctamente",
        });
        await fetchCarouselImages();
        setIsDialogOpen(false);
        resetForm();
      } else {
        const error = await response.json();
        toast.dismiss(saveToast);
        toast.error("Error al guardar", {
          description: error.error || "Intenta nuevamente",
        });
      }
    } catch (error: any) {
      console.error("Error saving:", error);
      toast.error("Error de conexión", {
        description: error.message || "No se pudo guardar",
      });
    }
  };

  const handleDelete = async (id: string) => {
    toast.custom((t) => (
      <div className="bg-white rounded-lg shadow-lg p-4 flex gap-3 max-w-sm">
        <div className="flex-1">
          <p className="font-semibold text-slate-900">¿Eliminar slide?</p>
          <p className="text-sm text-slate-600 mt-1">
            Se eliminará el archivo si no se usa en otro lugar.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.dismiss(t)}
            className="h-8"
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={async () => {
              try {
                toast.dismiss(t);
                const deleteToast = toast.loading("Eliminando...");
                const response = await fetch(`/api/carousel/${id}`, {
                  method: "DELETE",
                });

                if (response.ok) {
                  toast.dismiss(deleteToast);
                  toast.success("Eliminado", {
                    description: "El slide fue eliminado correctamente",
                  });
                  await fetchCarouselImages();
                } else {
                  toast.dismiss(deleteToast);
                  toast.error("Error al eliminar", {
                    description: "Intenta nuevamente",
                  });
                }
              } catch (error: any) {
                toast.error("Error de conexión", {
                  description: error.message || "No se pudo eliminar",
                });
              }
            }}
            className="h-8 bg-red-600 hover:bg-red-700"
          >
            Eliminar
          </Button>
        </div>
      </div>
    ));
  };

  const isVideo = (filename: string) => {
    return filename?.match(/\.(mp4|webm|mov)$/i);
  };

  // Filter Logic
  const filteredImages = carouselImages.filter((img) => {
    const matchesSearch = (img.title || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "ACTIVE"
          ? img.active
          : !img.active;
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  const paginatedImages = filteredImages.slice(
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
              <div className="p-2 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-lg shadow-md">
                <Film className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                  Carrusel Multimedia
                </CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {carouselImages.length} slides configurados
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                className="h-10" // Height 10 to match standard inputs/buttons
                onClick={fetchCarouselImages}
                disabled={loading}
              >
                Actualizar
              </Button>
              <Button
                onClick={handleOpenAdd}
                className="bg-indigo-600 hover:bg-indigo-700 text-white h-10"
              >
                <Plus className="h-4 w-4 mr-2" /> Nuevo Slide
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
                  placeholder="Buscar por título..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 h-10">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los estados</SelectItem>
                  <SelectItem value="ACTIVE">Activos</SelectItem>
                  <SelectItem value="INACTIVE">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table Content */}
          <div className="rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800">
                  <TableHead className="w-[100px]">Vista</TableHead>
                  <TableHead>Título / Info</TableHead>
                  <TableHead className="w-[100px]">Orden</TableHead>
                  <TableHead className="w-[100px]">Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedImages.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center h-24 text-slate-500"
                    >
                      No hay elementos en el carrusel.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedImages.map((img) => (
                    <TableRow
                      key={img.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <TableCell>
                        <div className="w-16 h-10 bg-slate-100 rounded overflow-hidden relative border border-slate-200">
                          {img.Media?.filename &&
                          isVideo(img.Media.filename) ? (
                            <video
                              src={
                                img.Media.filename.startsWith("/") ||
                                img.Media.filename.startsWith("http")
                                  ? img.Media.filename
                                  : `/uploads/${img.Media.filename}`
                              }
                              className="w-full h-full object-cover"
                              muted
                            />
                          ) : img.Media?.filename ? (
                            <img
                              src={
                                img.Media.filename.startsWith("/") ||
                                img.Media.filename.startsWith("http")
                                  ? img.Media.filename
                                  : `/uploads/${img.Media.filename}`
                              }
                              alt="Thumb"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-slate-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">
                            {img.title || "Sin título"}
                          </span>
                          {img.pinned && (
                            <span className="text-xs text-yellow-600 font-bold flex items-center gap-1">
                              <span className="text-yellow-500">★</span> Anclado
                            </span>
                          )}
                          {img.linkUrl && (
                            <span className="text-xs text-blue-500 truncate max-w-[200px]">
                              {img.linkUrl}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {img.order}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {img.active ? (
                          <Badge
                            variant="default"
                            className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
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
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(img)}
                          className="hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(img.id)}
                          className="hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 mt-4">
              <div className="text-sm text-slate-500">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                {Math.min(currentPage * itemsPerPage, filteredImages.length)} de{" "}
                {filteredImages.length} slides
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editar Slide" : "Nuevo Slide"}
            </DialogTitle>
            <DialogDescription>
              Configura la imagen o video y los detalles del slide.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Media Upload */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Multimedia (Imagen o Video)
              </Label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 relative group hover:bg-slate-100 transition-colors">
                {previewUrl ? (
                  <div className="relative w-full h-auto bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
                    <div className="absolute top-2 left-2 z-10 bg-green-500 text-white text-xs px-2 py-1 rounded-md shadow-sm flex items-center gap-1 font-medium">
                      <span className="bg-white text-green-500 rounded-full w-4 h-4 flex items-center justify-center">
                        ✓
                      </span>
                      Subido exitosamente
                    </div>

                    <div className="h-48 w-full flex items-center justify-center bg-black/5 mt-8 mb-2">
                      {isVideo(previewUrl) ? (
                        <video
                          src={
                            previewUrl.startsWith("/") ||
                            previewUrl.startsWith("http")
                              ? previewUrl
                              : `/uploads/${previewUrl}`
                          }
                          controls
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <img
                          src={
                            previewUrl.startsWith("/") ||
                            previewUrl.startsWith("http")
                              ? previewUrl
                              : `/uploads/${previewUrl}`
                          }
                          alt="Preview"
                          className="h-full w-full object-contain"
                        />
                      )}
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-100 shadow-md"
                      onClick={() => {
                        setPreviewUrl(null);
                        setMediaId(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-48 hover:bg-slate-100 transition-colors rounded-lg">
                    {uploadingImage ? (
                      <div className="flex flex-col items-center animate-pulse">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent mb-3"></div>
                        <span className="text-sm font-medium text-indigo-600">
                          Subiendo archivo...
                        </span>
                        <span className="text-xs text-slate-400">
                          Por favor espere
                        </span>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium text-slate-600">
                          Click para subir archivo
                        </span>
                        <span className="text-xs text-slate-400 mt-2">
                          Soporta: JPG, PNG, WebP, MP4, WebM (Max 100MB)
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                      onChange={(e) =>
                        e.target.files && handleImageUpload(e.target.files[0])
                      }
                      disabled={uploadingImage}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Título</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Título principal"
                />
              </div>
              <div className="space-y-2">
                <Label>Orden</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Duración (s)</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.autoPlayDuration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      autoPlayDuration: parseInt(e.target.value) || 5,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Breve descripción..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>URL (Opcional)</Label>
                <Input
                  value={formData.linkUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, linkUrl: e.target.value })
                  }
                  placeholder="/ejemplo o https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo Enlace</Label>
                <select
                  value={formData.linkType}
                  onChange={(e) =>
                    setFormData({ ...formData, linkType: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
                >
                  <option value="">Ninguno</option>
                  <option value="INTERNAL">Interno</option>
                  <option value="EXTERNAL">Externo</option>
                  <option value="DOWNLOAD">Descarga</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(c) =>
                    setFormData({ ...formData, active: c })
                  }
                />
                <Label htmlFor="active" className="cursor-pointer">
                  Visible (Activo)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="pinned"
                  checked={formData.pinned}
                  onCheckedChange={(c) =>
                    setFormData({ ...formData, pinned: c })
                  }
                />
                <Label
                  htmlFor="pinned"
                  className="flex items-center gap-1 cursor-pointer"
                >
                  Anclado <span className="text-yellow-500">★</span>
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={uploadingImage}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
