"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Phone,
  Copy,
  Check,
  Search,
  X,
  ArrowLeft,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  department: string;
  extension: string;
  category: string;
  email?: string;
  phone?: string;
}

export default function PhoneDirectory() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [copied, setCopied] = useState<string | null>(null);
  const [paginaActual, setPaginaActual] = useState(0);
  const [filasXPagina, setFilasXPagina] = useState(10);

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("/api/contacts");
        if (!res.ok) throw new Error("Error fetching contacts");
        const data = await res.json();
        setContacts(Array.isArray(data) ? data : data.contacts || []);
      } catch (error) {
        console.error("Error:", error);
        toast.error("No se pudieron cargar los contactos");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Get unique departments
  const departments = useMemo(() => {
    const depts = new Set(contacts.map((c) => c.department).filter(Boolean));
    return Array.from(depts).sort();
  }, [contacts]);

  // Filter and search
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch =
        !searchInput ||
        contact.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        contact.department?.toLowerCase().includes(searchInput.toLowerCase()) ||
        contact.category?.toLowerCase().includes(searchInput.toLowerCase()) ||
        contact.extension?.includes(searchInput);

      const matchesDept =
        departmentFilter === "all" || contact.department === departmentFilter;

      return matchesSearch && matchesDept;
    });
  }, [contacts, searchInput, departmentFilter]);

  const contactosPaginados = useMemo(() => {
    const inicio = paginaActual * filasXPagina;
    const fin = inicio + filasXPagina;
    return filteredContacts.slice(inicio, fin);
  }, [filteredContacts, paginaActual, filasXPagina]);

  const totalPaginas = useMemo(() => {
    return Math.ceil(filteredContacts.length / filasXPagina);
  }, [filteredContacts.length, filasXPagina]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied("ERROR");
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const resetFilters = () => {
    setSearchInput("");
    setDepartmentFilter("all");
  };

  if (loading) {
    return (
      <div className="w-full space-y-6 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando contactos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200/60 space-y-4">
        <div className="flex items-center gap-4">
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
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                <Phone className="h-6 w-6 text-white" />
              </div>
              Directorio Telefónico
            </h1>
            <p className="text-slate-600 text-sm sm:text-base font-medium mt-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              CESFAM Dr. Alberto Reyes •
              <span className="font-bold text-blue-600">
                {filteredContacts.length}
              </span>
              /
              <span className="font-semibold text-slate-700">
                {contacts.length}
              </span>
              contactos
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-5 py-3 rounded-lg border border-amber-300/60 shadow-sm flex items-center gap-3 text-amber-900">
          <div className="p-1.5 bg-amber-100 rounded-lg flex-shrink-0">
            <Info className="h-5 w-5 text-amber-600" />
          </div>
          <p className="text-sm font-medium">
            <span className="font-bold">Llamadas externas:</span> Marcar
            <span className="font-mono font-bold bg-white px-2.5 py-1 rounded-md border border-amber-300 shadow-sm mx-1 whitespace-nowrap">
              41 327
            </span>
            + los últimos 4 dígitos.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200/60 shadow-md">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, área, categoría o anexo…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-200 text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Department Filter */}
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full sm:w-[200px] flex-shrink-0">
            <SelectValue placeholder="Filtrar por área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos las áreas</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Button */}
        <Button
          type="button"
          variant="outline"
          onClick={resetFilters}
          className="w-full sm:w-auto flex-shrink-0 whitespace-nowrap"
        >
          Limpiar
        </Button>
      </div>

      {/* Contacts Table */}
      {filteredContacts.length > 0 ? (
        <>
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Área
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Anexo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {contactosPaginados.map((contact, idx) => (
                    <tr
                      key={contact.id}
                      className={cn(
                        "hover:bg-blue-50/50 transition-colors",
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/30",
                      )}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        {contact.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {contact.department}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {contact.category}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(contact.extension)}
                          className={cn(
                            "font-mono font-bold whitespace-nowrap",
                            copied === contact.extension
                              ? "border-green-300 bg-green-50 text-green-800"
                              : "hover:bg-blue-50 hover:border-blue-300",
                          )}
                        >
                          {copied === contact.extension ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Copiado
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1" />
                              {contact.extension}
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginación */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-sm text-slate-600 flex items-center gap-2">
              <span>Filas por página:</span>
              <Select
                value={`${filasXPagina}`}
                onValueChange={(value) => {
                  setFilasXPagina(Number(value));
                  setPaginaActual(0);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20, 50].map((num) => (
                    <SelectItem key={num} value={`${num}`}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-slate-600">
              Mostrando {paginaActual * filasXPagina + 1} a{" "}
              {Math.min(
                (paginaActual + 1) * filasXPagina,
                filteredContacts.length,
              )}{" "}
              de {filteredContacts.length} contactos
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaActual(Math.max(0, paginaActual - 1))}
                disabled={paginaActual === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-slate-600">
                Página {paginaActual + 1} de {Math.max(1, totalPaginas)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPaginaActual(Math.min(totalPaginas - 1, paginaActual + 1))
                }
                disabled={paginaActual >= totalPaginas - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-md p-12 text-center">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <div className="p-3 bg-slate-100 rounded-full">
              <Search className="h-10 w-10 opacity-40" />
            </div>
            <p className="font-semibold text-slate-700">
              No se encontraron contactos
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="mt-3"
            >
              Limpiar filtros
            </Button>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {copied && copied !== "ERROR" && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur text-white px-5 py-3 rounded-full shadow-2xl text-sm font-medium flex items-center gap-2 z-50 animate-in slide-in-from-bottom-4 fade-in">
          <Check className="h-5 w-5 text-green-400" />
          <span>
            Copiado: <span className="font-mono font-bold">{copied}</span>
          </span>
        </div>
      )}
      {copied === "ERROR" && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur text-white px-5 py-3 rounded-full shadow-2xl text-sm font-medium z-50 animate-in slide-in-from-bottom-4 fade-in">
          <span className="font-semibold">
            No se pudo copiar. Intenta nuevamente.
          </span>
        </div>
      )}
    </div>
  );
}
