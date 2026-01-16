"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Phone,
  Copy,
  Check,
  ArrowLeft,
  Search,
  Info,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LayoutGrid,
  List,
  X,
  ChevronUp as CollapseUp,
  ChevronDown as CollapseDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  contacts,
  departments,
  getDepartmentColor,
  getDepartmentHeaderStyle,
  type Contact,
} from "@/data/contacts";

function normalizeText(input: string) {
  return (input ?? "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function sortIcon(sortState: false | "asc" | "desc") {
  if (sortState === "asc") return <ChevronUp className="ml-2 h-4 w-4" />;
  if (sortState === "desc") return <ChevronDown className="ml-2 h-4 w-4" />;
  return <ArrowUpDown className="ml-2 h-4 w-4 opacity-70" />;
}

export function PhoneDirectory() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [searchInput, setSearchInput] = React.useState("");
  const [copied, setCopied] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<"table" | "grid">("table");
  const [collapsedDept, setCollapsedDept] = React.useState<
    Record<string, boolean>
  >({});

  // Debounce input -> globalFilter (mejor rendimiento)
  const debounceRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setGlobalFilter(searchInput);
    }, 250);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  // Copy con fallback + feedback consistente
  const copyToClipboard = async (text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback
        const el = document.createElement("textarea");
        el.value = text;
        el.setAttribute("readonly", "");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopied(text);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      // Si falla, al menos no “rompe” UX
      setCopied("ERROR");
      window.setTimeout(() => setCopied(null), 1800);
    }
  };

  const columns: ColumnDef<Contact>[] = [
    {
      accessorKey: "department",
      header: ({ column }) => {
        const sort = column.getIsSorted();
        return (
          <Button
            type="button"
            variant="ghost"
            onClick={() => column.toggleSorting(sort === "asc")}
            className="hover:bg-slate-100 -ml-4 font-bold"
            aria-label="Ordenar por departamento"
          >
            Departamento
            {sortIcon(sort)}
          </Button>
        );
      },
      cell: ({ row }) => {
        const department = row.getValue("department") as string;
        return (
          <span
            className={cn(
              "inline-flex px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap",
              getDepartmentColor(department)
            )}
          >
            {department}
          </span>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        const sort = column.getIsSorted();
        return (
          <Button
            type="button"
            variant="ghost"
            onClick={() => column.toggleSorting(sort === "asc")}
            className="hover:bg-slate-100 -ml-4 font-bold"
            aria-label="Ordenar por nombre o cargo"
          >
            Nombre / Cargo
            {sortIcon(sort)}
          </Button>
        );
      },
      cell: ({ row }) => (
        <span className="font-medium text-slate-900">
          {row.getValue("name")}
        </span>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        const sort = column.getIsSorted();
        return (
          <Button
            type="button"
            variant="ghost"
            onClick={() => column.toggleSorting(sort === "asc")}
            className="hover:bg-slate-100 -ml-4 font-bold"
            aria-label="Ordenar por categoría"
          >
            Categoría
            {sortIcon(sort)}
          </Button>
        );
      },
      cell: ({ row }) => (
        <span className="text-slate-600 text-sm">
          {row.getValue("category")}
        </span>
      ),
    },
    {
      accessorKey: "extension",
      header: () => <span className="font-bold">Anexo</span>,
      cell: ({ row }) => {
        const extension = row.getValue("extension") as string;
        const isCopied = copied === extension;

        return (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(extension)}
            className={cn(
              "font-mono font-bold transition-all min-w-[132px] justify-center",
              isCopied
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "hover:bg-blue-600 hover:text-white hover:border-blue-600"
            )}
            aria-label={`Copiar anexo ${extension}`}
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                {extension}
              </>
            )}
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: contacts,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    // Búsqueda global por tokens (nombre/depto/categoría/anexo)
    globalFilterFn: (row, _columnIds, filterValue) => {
      const q = normalizeText(String(filterValue ?? ""));
      if (!q) return true;

      const tokens = q.split(/\s+/).filter(Boolean);
      const haystack = normalizeText(
        [
          row.original.name,
          row.original.department,
          row.original.category,
          row.original.extension,
        ].join(" ")
      );

      return tokens.every((t) => haystack.includes(t));
    },
    state: { sorting, columnFilters, columnVisibility, globalFilter },
    initialState: { pagination: { pageSize: 15 } },
  });

  const totalCount = contacts.length;
  const filteredCount = table.getFilteredRowModel().rows.length;

  const departmentFilterValue =
    ((table.getColumn("department")?.getFilterValue() as string) ?? "") ||
    "all";

  const resetAll = () => {
    setSearchInput("");
    setGlobalFilter("");
    setSorting([]);
    setColumnFilters([]);
    table.setPageIndex(0);
    table.getColumn("department")?.setFilterValue("");
  };

  // Datos “ya filtrados” para grilla (consistentes con la tabla)
  const filteredSortedContacts = React.useMemo(() => {
    // Usa el pipeline de TanStack (filtrado + sorting) pero sin paginación
    return table.getSortedRowModel().rows.map((r) => r.original);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalFilter, columnFilters, sorting]);

  const toggleDept = (dept: string) => {
    setCollapsedDept((prev) => ({ ...prev, [dept]: !prev[dept] }));
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200/60 backdrop-blur-sm">
        <div className="flex items-center gap-4 flex-shrink-0 min-w-0 flex-1">
          <Link href="/">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-3 flex-wrap">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md flex-shrink-0">
                <Phone className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              <span className="min-w-0">Directorio Telefónico</span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base font-medium mt-2 flex items-center gap-2 flex-wrap">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></span>
              <span>CESFAM Dr. Alberto Reyes •</span>
              <span className="font-bold text-blue-600">{filteredCount}</span>
              <span>/</span>
              <span className="font-semibold text-slate-700">{totalCount}</span>
              <span>contactos</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 xl:items-start xl:justify-end flex-shrink-0">
          {/* View Toggle */}
          <div
            className="flex bg-gradient-to-r from-slate-100 to-slate-50 p-1.5 rounded-xl border border-slate-200 shadow-inner flex-shrink-0"
            role="tablist"
            aria-label="Cambiar vista"
          >
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={cn(
                "px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 whitespace-nowrap",
                viewMode === "table"
                  ? "bg-white text-blue-600 shadow-md border border-blue-200/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              )}
              aria-selected={viewMode === "table"}
            >
              <List className="h-4 w-4" />
              Lista
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 whitespace-nowrap",
                viewMode === "grid"
                  ? "bg-white text-blue-600 shadow-md border border-blue-200/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              )}
              aria-selected={viewMode === "grid"}
            >
              <LayoutGrid className="h-4 w-4" />
              Cuadrícula
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-5 py-3.5 rounded-xl border border-amber-300/60 shadow-sm flex items-center gap-3 text-amber-900 min-w-0">
            <div className="p-1.5 bg-amber-100 rounded-lg flex-shrink-0">
              <Info className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-sm font-medium flex-wrap">
              <span className="font-bold">Llamadas externas:</span> Marcar{" "}
              <span className="font-mono font-bold bg-white px-2.5 py-1 rounded-md border border-amber-300 shadow-sm whitespace-nowrap">
                41 327
              </span>{" "}
              + los últimos 4 dígitos.
            </p>
          </div>
        </div>
      </div>

      {/* Controls (para ambas vistas) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 bg-white p-5 rounded-xl border border-slate-200/60 shadow-md">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, departamento, categoría o anexo…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-11 pr-11 py-3 bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all shadow-sm hover:shadow-md"
            aria-label="Buscar contactos"
          />
          {searchInput?.length > 0 && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-slate-200 text-slate-600 transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Department filter */}
        <Select
          value={departmentFilterValue}
          onValueChange={(value) => {
            table
              .getColumn("department")
              ?.setFilterValue(value === "all" ? "" : value);
            table.setPageIndex(0);
          }}
        >
          <SelectTrigger className="w-full lg:w-[260px] flex-shrink-0">
            <SelectValue placeholder="Filtrar por Área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos las Áreas</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Columns toggle solo en tabla */}
        {viewMode === "table" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full lg:w-auto flex-shrink-0 whitespace-nowrap"
              >
                Columnas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id === "department"
                      ? "Área"
                      : column.id === "name"
                      ? "Nombre"
                      : column.id === "category"
                      ? "Categoría"
                      : column.id === "extension"
                      ? "Anexo"
                      : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Reset */}
        <Button
          type="button"
          variant="outline"
          className="w-full lg:w-auto flex-shrink-0 whitespace-nowrap"
          onClick={resetAll}
        >
          Limpiar
        </Button>

        {/* Result summary */}
        <div className="text-sm text-slate-600 lg:ml-auto whitespace-nowrap flex-shrink-0">
          Resultados:{" "}
          <span className="font-semibold text-slate-900">{filteredCount}</span>{" "}
          de <span className="font-semibold">{totalCount}</span>
        </div>
      </div>

      {/* Table View */}
      {viewMode === "table" && (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b-2 border-slate-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        scope="col"
                        className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody className="divide-y divide-slate-100">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, idx) => (
                    <tr
                      key={row.id}
                      className={cn(
                        "transition-all duration-150 hover:bg-blue-50/70 hover:shadow-sm",
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 align-middle whitespace-nowrap"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="h-40 text-center text-slate-500"
                    >
                      <div className="flex flex-col items-center gap-3 py-8">
                        <div className="p-3 bg-slate-100 rounded-full">
                          <Search className="h-10 w-10 opacity-40" />
                        </div>
                        <p className="font-medium text-slate-700">
                          No se encontraron resultados.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={resetAll}
                          className="mt-2"
                        >
                          Limpiar filtros
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-4 border-t border-slate-200 bg-gradient-to-r from-slate-50/80 to-white">
            <div className="text-sm text-slate-600 font-medium">
              Mostrando{" "}
              <span className="font-bold text-blue-600">
                {filteredCount === 0
                  ? 0
                  : table.getState().pagination.pageIndex *
                      table.getState().pagination.pageSize +
                    1}
              </span>
              {" - "}
              <span className="font-bold text-blue-600">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  filteredCount
                )}
              </span>
              {" de "}
              <span className="font-bold text-slate-700">
                {filteredCount}
              </span>{" "}
              contactos
            </div>

            <div className="flex items-center gap-2 justify-between md:justify-end">
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                  table.setPageIndex(0);
                }}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 15, 20, 30, 50, 100].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size} filas
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Primera página"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="px-3 py-1 text-sm font-medium text-slate-700">
                  Página {table.getState().pagination.pageIndex + 1} de{" "}
                  {table.getPageCount()}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Página siguiente"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  aria-label="Última página"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start animate-in fade-in duration-300">
          {departments.map((dept) => {
            const deptContacts = filteredSortedContacts.filter(
              (c) => c.department === dept
            );

            // Si hay filtro activo y este depto no tiene resultados, lo ocultamos (UX más limpia)
            const hasActiveFilter =
              normalizeText(globalFilter).length > 0 ||
              (departmentFilterValue !== "all" && departmentFilterValue !== "");
            if (hasActiveFilter && deptContacts.length === 0) return null;

            const isCollapsed = !!collapsedDept[dept];

            return (
              <div
                key={dept}
                className={cn(
                  "bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden",
                  isCollapsed ? "h-auto" : ""
                )}
              >
                <div
                  className="px-5 py-4 flex items-center justify-between gap-3"
                  style={getDepartmentHeaderStyle(dept)}
                >
                  <div className="flex items-center gap-3">
                    <div className="font-bold text-base uppercase tracking-wider">
                      {dept}
                    </div>
                    <span className="text-xs font-bold bg-white/60 border border-white/40 px-2 py-1 rounded-full">
                      {deptContacts.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleDept(dept)}
                    className="inline-flex items-center gap-2 text-xs font-bold bg-white/40 hover:bg-white/60 border border-white/30 px-3 py-1.5 rounded-lg transition"
                    aria-label={
                      isCollapsed
                        ? `Expandir departamento ${dept}`
                        : `Colapsar departamento ${dept}`
                    }
                  >
                    {isCollapsed ? (
                      <>
                        Expandir <CollapseDown className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Colapsar <CollapseUp className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                {!isCollapsed && (
                  <div className="divide-y divide-slate-100">
                    {deptContacts.length ? (
                      deptContacts.map((contact, idx) => (
                        <div
                          key={contact.id}
                          className={cn(
                            "flex items-center justify-between px-5 py-3 transition-colors hover:bg-blue-50 gap-4",
                            idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                          )}
                        >
                          <div className="min-w-0">
                            <div
                              className="text-sm font-medium text-slate-900 truncate"
                              title={contact.name}
                            >
                              {contact.name}
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                              {contact.category}
                            </div>
                          </div>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(contact.extension)}
                            className={cn(
                              "flex-shrink-0 min-w-[132px] justify-center font-mono font-bold",
                              copied === contact.extension
                                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                : "hover:bg-blue-600 hover:text-white hover:border-blue-600"
                            )}
                            aria-label={`Copiar anexo ${contact.extension}`}
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
                        </div>
                      ))
                    ) : (
                      <div className="px-5 py-6 text-sm text-slate-500">
                        No hay resultados en este departamento.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty global state */}
          {filteredCount === 0 && (
            <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
              <div className="flex flex-col items-center gap-2 text-slate-600">
                <Search className="h-10 w-10 opacity-30" />
                <p className="font-semibold text-slate-800">Sin resultados</p>
                <p className="text-sm">
                  Prueba con otro término o limpia los filtros.
                </p>
                <Button type="button" variant="outline" onClick={resetAll}>
                  Limpiar filtros
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Copied Toast */}
      {copied && copied !== "ERROR" && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur text-white px-5 py-3 rounded-full shadow-2xl text-sm font-medium animate-in slide-in-from-bottom-4 fade-in z-50 flex items-center gap-2"
          role="status"
          aria-live="polite"
        >
          <Check className="h-5 w-5 text-green-400" />
          <span>
            Copiado: <span className="font-mono font-bold">{copied}</span>
          </span>
        </div>
      )}
      {copied === "ERROR" && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur text-white px-5 py-3 rounded-full shadow-2xl text-sm font-medium animate-in slide-in-from-bottom-4 fade-in z-50 flex items-center gap-2"
          role="status"
          aria-live="polite"
        >
          <span className="font-semibold">No se pudo copiar.</span>
          <span className="opacity-80">Intenta nuevamente.</span>
        </div>
      )}
    </div>
  );
}
