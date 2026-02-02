"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, FileText, Download, FileType } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Media {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  type: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

const getBadgeColor = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("clínico") || cat.includes("clinico")) {
    return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
  }
  if (cat.includes("informática") || cat.includes("informatica")) {
    return "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200";
  }
  if (cat.includes("rrhh") || cat.includes("recursos humanos")) {
    return "bg-pink-100 text-pink-700 hover:bg-pink-200 border-pink-200";
  }
  if (cat.includes("administración") || cat.includes("administracion")) {
    return "bg-[#E0FBFC] text-[#0075F2] hover:bg-[#0056CC] hover:text-white border-[#0075F2]";
  }
  return "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200";
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getCategoryFromPath = (path: string): string => {
  // Extraer categoría del path o usar "General"
  if (path.includes("clinico") || path.includes("clínico")) return "Clínico";
  if (path.includes("informatica") || path.includes("informática"))
    return "Informática";
  if (path.includes("rrhh") || path.includes("recursos")) return "RRHH";
  if (path.includes("administracion") || path.includes("administración"))
    return "Administración";
  return "General";
};

export function DocumentsTable() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [documents, setDocuments] = React.useState<Media[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch("/api/media?type=DOCUMENT");
        if (response.ok) {
          const data = await response.json();
          setDocuments(data);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    }
    
    // Cargar inmediatamente
    fetchDocuments();
    
    // Actualizar cada 5 segundos para tener datos en tiempo real
    const interval = setInterval(fetchDocuments, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const filteredDocs = documents.filter((doc) =>
    doc.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur ring-1 ring-slate-200">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#E0FBFC', color: '#0075F2' }}>
              <FileType className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl text-slate-800">
                Documentos Recientes
              </CardTitle>
              <p className="text-sm text-slate-500">
                Archivos y protocolos actualizados
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              placeholder="Buscar por nombre..."
              className="flex h-10 w-full rounded-full border border-slate-200 bg-white px-3 py-1 pl-10 text-sm shadow-sm transition-all placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="text-center py-10 text-slate-500">
            Cargando documentos...
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="pl-6">Nombre del Archivo</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="hidden md:table-cell">Fecha</TableHead>
                <TableHead className="hidden sm:table-cell">Tamaño</TableHead>
                <TableHead className="text-right pr-6">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-10 text-slate-500"
                  >
                    {documents.length === 0
                      ? "No hay documentos disponibles."
                      : "No se encontraron documentos que coincidan con su búsqueda."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocs.map((doc) => {
                  const category = getCategoryFromPath(doc.path);
                  return (
                    <TableRow
                      key={doc.id}
                      className="cursor-pointer hover:bg-blue-50/50 transition-colors group"
                    >
                      <TableCell className="font-medium pl-6">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                            <FileText className="h-4 w-4" />
                          </div>
                          <span className="text-slate-700 group-hover:text-blue-700 transition-colors">
                            {doc.originalName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getBadgeColor(category)}
                        >
                          {category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500 hidden md:table-cell">
                        {formatDate(doc.createdAt)}
                      </TableCell>
                      <TableCell className="text-slate-400 text-xs hidden sm:table-cell">
                        {formatFileSize(doc.size)}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <a href={`/uploads/${doc.filename}`} download>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </a>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
