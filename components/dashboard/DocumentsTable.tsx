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

// Placeholder data
const documents = [
  {
    id: 1,
    name: "Protocolo de Ingreso Trakcare",
    category: "Clínico",
    date: "15/01/2024",
    type: "PDF",
    size: "2.4 MB",
  },
  {
    id: 2,
    name: "Manual de Usuario Centinela",
    category: "Informática",
    date: "10/01/2024",
    type: "PDF",
    size: "1.8 MB",
  },
  {
    id: 3,
    name: "Anexos de Derivación",
    category: "Administración",
    date: "05/01/2024",
    type: "DOCX",
    size: "450 KB",
  },
  {
    id: 4,
    name: "Guía de Buenas Prácticas",
    category: "RRHH",
    date: "02/01/2024",
    type: "PDF",
    size: "3.2 MB",
  },
  {
    id: 5,
    name: "Instructivo de Red MINSAL",
    category: "Informática",
    date: "20/12/2023",
    type: "PDF",
    size: "900 KB",
  },
];

const getBadgeColor = (category: string) => {
  switch (category) {
    case "Clínico":
      return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
    case "Informática":
      return "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200";
    case "RRHH":
      return "bg-pink-100 text-pink-700 hover:bg-pink-200 border-pink-200";
    default:
      return "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200";
  }
};

export function DocumentsTable() {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur ring-1 ring-slate-200">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
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
              className="flex h-10 w-full rounded-full border border-slate-200 bg-white px-3 py-1 pl-10 text-sm shadow-sm transition-all placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
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
            {filteredDocs.map((doc) => (
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
                      {doc.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getBadgeColor(doc.category)}
                  >
                    {doc.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500 hidden md:table-cell">
                  {doc.date}
                </TableCell>
                <TableCell className="text-slate-400 text-xs hidden sm:table-cell">
                  {doc.size}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
