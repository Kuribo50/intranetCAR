import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  FileText,
  Search,
  List,
  Grid3x3,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Download,
} from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const initialDocuments = [
  {
    id: "1",
    title: "Protocolo de Atención",
    category: "Protocolos",
    date: "2024-01-10",
    url: "#",
    size: "2.4 MB",
    type: "PDF",
  },
  {
    id: "2",
    title: "Manual de Usuario",
    category: "Manuales",
    date: "2024-01-08",
    url: "#",
    size: "1.1 MB",
    type: "DOCX",
  },
  {
    id: "3",
    title: "Política de Privacidad",
    category: "Legales",
    date: "2024-02-15",
    url: "#",
    size: "150 KB",
    type: "PDF",
  },
  {
    id: "4",
    title: "Guía de Estilos",
    category: "Manuales",
    date: "2024-03-01",
    url: "#",
    size: "5.6 MB",
    type: "PDF",
  },
  {
    id: "5",
    title: "Reporte Anual 2023",
    category: "Reportes",
    date: "2024-01-20",
    url: "#",
    size: "12 MB",
    type: "XLSX",
  },
];

export function AdminDocumentos() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [view, setView] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState({
    title: "",
    category: "",
    date: "",
    url: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: "",
    category: "",
    date: "",
    url: "",
  });

  // Filter Logic
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "ALL" || doc.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [documents, search, categoryFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const paginatedDocs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDocuments.slice(start, start + itemsPerPage);
  }, [filteredDocuments, currentPage]);

  const uniqueCategories = useMemo(() => {
    const cats = new Set(documents.map((d) => d.category));
    return Array.from(cats);
  }, [documents]);

  const handleEdit = (doc: (typeof initialDocuments)[0]) => {
    setEditingId(doc.id);
    setEditingData({
      title: doc.title,
      category: doc.category,
      date: doc.date,
      url: doc.url,
    });
  };

  const handleSave = (id: string) => {
    setDocuments(
      documents.map((doc) =>
        doc.id === id ? { ...doc, ...editingData } : doc,
      ),
    );
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este documento?")) {
      setDocuments(documents.filter((doc) => doc.id !== id));
    }
  };

  const handleAdd = () => {
    if (newDocument.title && newDocument.category) {
      setDocuments([
        ...documents,
        {
          id: Date.now().toString(),
          ...newDocument,
          size: "0 KB", // Mock default
          type: "FILE", // Mock default
        },
      ]);
      setNewDocument({ title: "", category: "", date: "", url: "" });
      setShowAddForm(false);
    }
  };

  const getFileIcon = (type: string) => {
    // Simple mock icon logic
    return <FileText className="h-8 w-8 text-blue-500" />;
  };

  return (
    <div className="space-y-6 w-full">
      <Card className="border-0 shadow-lg w-full">
        {/* Header */}
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg shadow-md">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                  Documentos
                </CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {documents.length} archivos disponibles
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                className="h-10"
                onClick={() => {}} // Mock refresh
              >
                Actualizar
              </Button>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-orange-600 hover:bg-orange-700 text-white h-10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Subir Documento
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Add Form Panel */}
          {showAddForm && (
            <div className="mb-8 p-6 border-2 border-dashed border-orange-200 rounded-lg space-y-4 bg-orange-50/50 animate-in fade-in slide-in-from-top-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700">
                    <Plus className="h-4 w-4" />
                  </div>
                  Nuevo Documento
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Título del documento *"
                  value={newDocument.title}
                  onChange={(e) =>
                    setNewDocument({ ...newDocument, title: e.target.value })
                  }
                />
                <Input
                  placeholder="Categoría *"
                  value={newDocument.category}
                  onChange={(e) =>
                    setNewDocument({ ...newDocument, category: e.target.value })
                  }
                />
                <Input
                  type="date"
                  placeholder="Fecha"
                  value={newDocument.date}
                  onChange={(e) =>
                    setNewDocument({ ...newDocument, date: e.target.value })
                  }
                />
                <Input
                  placeholder="URL o ruta del archivo"
                  value={newDocument.url}
                  onChange={(e) =>
                    setNewDocument({ ...newDocument, url: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleAdd}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full sm:w-auto">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por título o categoría..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48 h-10">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas las categorías</SelectItem>
                  {uniqueCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                <List className="h-4 w-4 mr-2" />
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
                <Grid3x3 className="h-4 w-4 mr-2" />
                Cuadrícula
              </Button>
            </div>
          </div>

          {/* Content */}
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                <Search className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">
                No se encontraron documentos
              </h3>
              <p className="text-slate-500 mt-1">
                Intenta ajustar los filtros de búsqueda.
              </p>
            </div>
          ) : (
            <>
              {view === "table" ? (
                <div className="rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 dark:bg-slate-800">
                        <TableHead>Documento</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Tamaño</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedDocs.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="font-medium text-slate-900">
                                  {doc.title}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {doc.type}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="font-normal">
                              {doc.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-500">
                            {doc.date}
                          </TableCell>
                          <TableCell className="text-slate-500 text-xs">
                            {doc.size || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:text-blue-600"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(doc)}
                              >
                                <Edit className="h-4 w-4 text-slate-500 hover:text-blue-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(doc.id)}
                              >
                                <Trash2 className="h-4 w-4 text-slate-500 hover:text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {paginatedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="group relative p-4 border border-slate-200 rounded-xl hover:border-orange-200 hover:shadow-md transition-all bg-white dark:bg-slate-900 flex flex-col items-center text-center"
                    >
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-1 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-3 text-orange-600 group-hover:scale-110 transition-transform">
                        <FileText className="h-8 w-8" />
                      </div>

                      <h3
                        className="font-semibold text-slate-900 mb-1 line-clamp-1"
                        title={doc.title}
                      >
                        {doc.title}
                      </h3>
                      <p className="text-xs text-slate-500 mb-3">
                        {doc.category} • {doc.date}
                      </p>

                      <div className="mt-auto flex gap-2 w-full">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 w-full text-xs h-8"
                          onClick={() => handleEdit(doc)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 w-full text-xs h-8 bg-slate-900 hover:bg-slate-800"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Bajar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 mt-4">
                  <div className="text-sm text-slate-500">
                    Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredDocuments.length,
                    )}{" "}
                    de {filteredDocuments.length} documentos
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
            </>
          )}

          {/* Edit Dialog Logic - kept basic reuse of state for now, but UI hidden unless implemented properly as Dialog */}
          {/* In this version, the edit button sets state but there is no modal. 
              FIX: I will add a simple condition to show the edit form similar to 'Add Form' but populated, 
              or I should add a Modal. Given I want to standardize, I'll use the 'showAddForm' style panel for editing for now to safe time, 
              or just alert that it's a mock. 
              Actually, let's just make the Edit button open the "Add Form" populated with data. 
           */}
          {editingId && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
                <h3 className="text-lg font-bold">Editar Documento</h3>
                <Input
                  value={editingData.title}
                  onChange={(e) =>
                    setEditingData({ ...editingData, title: e.target.value })
                  }
                  placeholder="Título"
                />
                <Input
                  value={editingData.category}
                  onChange={(e) =>
                    setEditingData({ ...editingData, category: e.target.value })
                  }
                  placeholder="Categoría"
                />
                <Input
                  type="date"
                  value={editingData.date}
                  onChange={(e) =>
                    setEditingData({ ...editingData, date: e.target.value })
                  }
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setEditingId(null)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => handleSave(editingId)}>
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
