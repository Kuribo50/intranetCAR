"use client";

import { toast } from "sonner";
import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  KeyRound,
  Users,
  RefreshCw,
  Phone,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

interface Estamento {
  id: string;
  name: string;
}

interface Establecimiento {
  id: string;
  name: string;
}

interface Programa {
  id: string;
  name: string;
}

interface User {
  id: string;
  rut: string;
  email: string | null;
  name: string;
  apellidos: string | null;
  phone: string | null;
  role: "ADMIN" | "EDITOR" | "USER";
  active: boolean;
  establecimientoId: string | null;
  estamentoId: string | null;
  programaId: string | null;
  mustChangePassword: boolean;
  createdAt: string;
  Establecimiento?: { id: string; name: string } | null;
  Estamento?: { id: string; name: string } | null;
  Programa?: { id: string; name: string } | null;
}

interface UserFormData {
  id?: string;
  rut: string;
  name: string;
  apellidos: string;
  email: string;
  phone: string;
  password: string;
  role: "ADMIN" | "EDITOR" | "USER";
  active: boolean;
  establecimientoId: string;
  estamentoId: string;
  programaId: string;
}

const initialFormData: UserFormData = {
  rut: "",
  name: "",
  apellidos: "",
  email: "",
  phone: "",
  password: "",
  role: "USER",
  active: true,
  establecimientoId: "",
  estamentoId: "",
  programaId: "",
};

const roles = [
  {
    value: "ADMIN",
    label: "Administrador",
    color:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-0",
  },
  {
    value: "EDITOR",
    label: "Editor",
    color:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-0",
  },
  {
    value: "USER",
    label: "Usuario",
    color:
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-0",
  },
];

export function AdminUsuarios() {
  const [usuarios, setUsuarios] = React.useState<User[]>([]);
  const [estamentos, setEstamentos] = React.useState<Estamento[]>([]);
  const [establecimientos, setEstablecimientos] = React.useState<
    Establecimiento[]
  >([]);
  const [programas, setProgramas] = React.useState<Programa[]>([]);
  const [cargando, setCargando] = React.useState(true);
  const [busqueda, setBusqueda] = React.useState("");
  const [filtroRol, setFiltroRol] = React.useState<string>("ALL");
  const [filtroActivo, setFiltroActivo] = React.useState<string>("ALL");
  const [paginaActual, setPaginaActual] = React.useState(0);
  const [filasXPagina, setFilasXPagina] = React.useState(10);
  const [vistaActual, setVistaActual] = React.useState<"tabla" | "cuadricula">(
    "tabla",
  );

  const [modalCrear, setModalCrear] = React.useState(false);
  const [modalEditar, setModalEditar] = React.useState(false);
  const [modalEliminar, setModalEliminar] = React.useState(false);
  const [modalResetPassword, setModalResetPassword] = React.useState(false);

  const [formData, setFormData] = React.useState<UserFormData>(initialFormData);
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    React.useState<User | null>(null);
  const [nuevaPassword, setNuevaPassword] = React.useState("");
  const [guardando, setGuardando] = React.useState(false);

  const cargarUsuarios = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al cargar usuarios");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error de conexión");
    }
  };

  const cargarEstamentos = async () => {
    try {
      const response = await fetch("/api/estamentos");
      if (response.ok) {
        const data = await response.json();
        setEstamentos(
          data.filter((e: Estamento & { active: boolean }) => e.active),
        );
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
        setEstablecimientos(
          data.filter((e: Establecimiento & { active: boolean }) => e.active),
        );
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
        setProgramas(
          data.filter((e: Programa & { active: boolean }) => e.active),
        );
      }
    } catch (error) {
      console.error("Error loading programas:", error);
    }
  };

  const cargarTodo = async () => {
    setCargando(true);
    await Promise.all([
      cargarUsuarios(),
      cargarEstamentos(),
      cargarEstablecimientos(),
      cargarProgramas(),
    ]);
    setCargando(false);
  };

  React.useEffect(() => {
    cargarTodo();
  }, []);

  const usuariosFiltrados = React.useMemo(() => {
    return usuarios.filter((user) => {
      const nombreCompleto =
        `${user.name} ${user.apellidos || ""}`.toLowerCase();
      const matchBusqueda =
        busqueda === "" ||
        user.rut.toLowerCase().includes(busqueda.toLowerCase()) ||
        nombreCompleto.includes(busqueda.toLowerCase()) ||
        (user.email &&
          user.email.toLowerCase().includes(busqueda.toLowerCase()));

      const matchRol = filtroRol === "ALL" || user.role === filtroRol;
      const matchActivo =
        filtroActivo === "ALL" ||
        (filtroActivo === "ACTIVE" && user.active) ||
        (filtroActivo === "INACTIVE" && !user.active);

      return matchBusqueda && matchRol && matchActivo;
    });
  }, [usuarios, busqueda, filtroRol, filtroActivo]);

  const usuariosPaginados = React.useMemo(() => {
    const inicio = paginaActual * filasXPagina;
    const fin = inicio + filasXPagina;
    return usuariosFiltrados.slice(inicio, fin);
  }, [usuariosFiltrados, paginaActual, filasXPagina]);

  const totalPaginas = React.useMemo(() => {
    return Math.ceil(usuariosFiltrados.length / filasXPagina);
  }, [usuariosFiltrados.length, filasXPagina]);

  const getRolBadge = (role: string) => {
    const roleConfig = roles.find((r) => r.value === role);
    return (
      <Badge className={roleConfig?.color}>{roleConfig?.label || role}</Badge>
    );
  };

  const handleCrear = () => {
    setFormData(initialFormData);
    setModalCrear(true);
  };

  const handleEditar = (user: User) => {
    setUsuarioSeleccionado(user);
    setFormData({
      id: user.id,
      rut: user.rut,
      name: user.name,
      apellidos: user.apellidos || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "",
      role: user.role,
      active: user.active,
      establecimientoId: user.establecimientoId || "",
      estamentoId: user.estamentoId || "",
      programaId: user.programaId || "",
    });
    setModalEditar(true);
  };

  const handleEliminar = (user: User) => {
    setUsuarioSeleccionado(user);
    setModalEliminar(true);
  };

  const handleResetPassword = (user: User) => {
    setUsuarioSeleccionado(user);
    setNuevaPassword("");
    setModalResetPassword(true);
  };

  const handleToggleActive = async (user: User) => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !user.active }),
      });

      if (response.ok) {
        toast.success(user.active ? "Usuario desactivado" : "Usuario activado");
        cargarUsuarios();
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al actualizar usuario");
      }
    } catch (error) {
      toast.error("Error de conexión");
    }
  };

  const guardarNuevoUsuario = async () => {
    if (!formData.rut || !formData.name || !formData.password) {
      toast.error("RUT, nombre y contraseña son obligatorios");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setGuardando(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rut: formData.rut,
          name: formData.name,
          apellidos: formData.apellidos || null,
          email: formData.email || null,
          phone: formData.phone || null,
          password: formData.password,
          role: formData.role,
          active: formData.active,
          establecimientoId: formData.establecimientoId || null,
          estamentoId: formData.estamentoId || null,
          programaId: formData.programaId || null,
        }),
      });

      if (response.ok) {
        toast.success("Usuario creado correctamente");
        setModalCrear(false);
        cargarUsuarios();
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al crear usuario");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setGuardando(false);
    }
  };

  const guardarEdicion = async () => {
    if (!formData.name) {
      toast.error("El nombre es obligatorio");
      return;
    }

    setGuardando(true);
    try {
      const response = await fetch(`/api/users/${formData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rut: formData.rut,
          name: formData.name,
          apellidos: formData.apellidos || null,
          email: formData.email || null,
          phone: formData.phone || null,
          role: formData.role,
          estamentoId: formData.estamentoId || null,
          establecimientoId: formData.establecimientoId || null,
          programaId: formData.programaId || null,
          active: formData.active,
        }),
      });

      if (response.ok) {
        toast.success("Usuario actualizado correctamente");
        setModalEditar(false);
        cargarUsuarios();
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al actualizar usuario");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEliminar = async () => {
    if (!usuarioSeleccionado) return;

    setGuardando(true);
    try {
      const response = await fetch(`/api/users/${usuarioSeleccionado.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Usuario eliminado correctamente");
        setModalEliminar(false);
        cargarUsuarios();
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al eliminar usuario");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setGuardando(false);
    }
  };

  const confirmarResetPassword = async () => {
    if (!usuarioSeleccionado || !nuevaPassword) {
      toast.error("Ingrese la nueva contraseña");
      return;
    }

    if (nuevaPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setGuardando(true);
    try {
      const response = await fetch(
        `/api/users/${usuarioSeleccionado.id}/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: nuevaPassword }),
        },
      );

      if (response.ok) {
        toast.success("Contraseña restablecida correctamente");
        setModalResetPassword(false);
        cargarUsuarios();
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al restablecer contraseña");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <Card className="border-0 shadow-lg w-full">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  Usuarios
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {usuarios.length} usuarios registrados
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={cargarTodo}
                disabled={cargando}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${cargando ? "animate-spin" : ""}`}
                />
                Actualizar
              </Button>
              <Button onClick={handleCrear} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Usuario
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por RUT, nombre o email..."
                  value={busqueda}
                  onChange={(e) => {
                    setBusqueda(e.target.value);
                    setPaginaActual(0);
                  }}
                  className="pl-10"
                />
              </div>
              <Select
                value={filtroRol}
                onValueChange={(value) => {
                  setFiltroRol(value);
                  setPaginaActual(0);
                }}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filtroActivo}
                onValueChange={(value) => {
                  setFiltroActivo(value);
                  setPaginaActual(0);
                }}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="ACTIVE">Activos</SelectItem>
                  <SelectItem value="INACTIVE">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 bg-slate-100 p-1 rounded-lg flex-shrink-0">
              <Button
                variant={vistaActual === "tabla" ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setVistaActual("tabla");
                  setPaginaActual(0);
                }}
                className="gap-2"
              >
                <List className="h-4 w-4" />
                Tabla
              </Button>
              <Button
                variant={vistaActual === "cuadricula" ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setVistaActual("cuadricula");
                  setPaginaActual(0);
                }}
                className="gap-2"
              >
                <Grid3X3 className="h-4 w-4" />
                Cuadrícula
              </Button>
            </div>
          </div>

          {/* Vista Tabla */}
          {vistaActual === "tabla" && (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                      <TableHead>Nombre</TableHead>
                      <TableHead>RUT</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Email / Teléfono
                      </TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Estamento
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Establecimiento
                      </TableHead>
                      <TableHead className="hidden xl:table-cell">
                        Programa
                      </TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cargando ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-10">
                          <div className="flex items-center justify-center gap-2">
                            <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                            <span className="text-slate-500">
                              Cargando usuarios...
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : usuariosPaginados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-10">
                          <div className="text-slate-500">
                            No se encontraron usuarios
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      usuariosPaginados.map((user) => (
                        <TableRow
                          key={user.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>
                                {user.name} {user.apellidos}
                              </span>
                              {user.mustChangePassword && (
                                <span className="text-xs text-amber-600 dark:text-amber-400">
                                  Debe cambiar contraseña
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {user.rut}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex flex-col text-sm text-slate-600 dark:text-slate-400">
                              <span>{user.email || "-"}</span>
                              {user.phone && (
                                <span className="flex items-center gap-1 text-xs">
                                  <Phone className="h-3 w-3" />
                                  {user.phone}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{getRolBadge(user.role)}</TableCell>
                          <TableCell className="hidden lg:table-cell text-slate-600 dark:text-slate-400">
                            {user.Estamento?.name || "-"}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-slate-600 dark:text-slate-400">
                            {user.Establecimiento?.name || "-"}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell text-slate-600 dark:text-slate-400">
                            {user.Programa?.name || "-"}
                          </TableCell>
                          <TableCell>
                            {user.active ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">
                                Activo
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-0">
                                Inactivo
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditar(user)}
                                title="Editar"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleActive(user)}
                                title={user.active ? "Desactivar" : "Activar"}
                              >
                                {user.active ? (
                                  <UserX className="h-4 w-4 text-amber-600" />
                                ) : (
                                  <UserCheck className="h-4 w-4 text-green-600" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleResetPassword(user)}
                                title="Restablecer contraseña"
                              >
                                <KeyRound className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEliminar(user)}
                                title="Eliminar"
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

              {/* Paginación */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
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

                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Mostrando {paginaActual * filasXPagina + 1} a{" "}
                  {Math.min(
                    (paginaActual + 1) * filasXPagina,
                    usuariosFiltrados.length,
                  )}{" "}
                  de {usuariosFiltrados.length} usuarios
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPaginaActual(Math.max(0, paginaActual - 1))
                    }
                    disabled={paginaActual === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Página {paginaActual + 1} de {Math.max(1, totalPaginas)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPaginaActual(
                        Math.min(totalPaginas - 1, paginaActual + 1),
                      )
                    }
                    disabled={paginaActual >= totalPaginas - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Vista Cuadrícula */}
          {vistaActual === "cuadricula" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 w-full">
                {usuariosPaginados.length > 0 ? (
                  usuariosPaginados.map((user) => (
                    <div
                      key={user.id}
                      className="bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-5 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">
                            {user.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                            {user.apellidos}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-semibold">
                            {user.rut}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          {getRolBadge(user.role)}
                        </div>
                      </div>

                      <div className="space-y-3 mb-5 pb-5 border-b border-slate-200 dark:border-slate-700">
                        {user.email && (
                          <div className="text-sm">
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
                              Email
                            </p>
                            <p
                              className="text-slate-700 dark:text-slate-200 truncate"
                              title={user.email}
                            >
                              {user.email}
                            </p>
                          </div>
                        )}
                        {user.phone && (
                          <div className="text-sm">
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              Teléfono
                            </p>
                            <p className="text-slate-700 dark:text-slate-200">
                              {user.phone}
                            </p>
                          </div>
                        )}
                        {user.Estamento && (
                          <div className="text-sm">
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
                              Estamento
                            </p>
                            <p className="text-slate-700 dark:text-slate-200">
                              {user.Estamento.name}
                            </p>
                          </div>
                        )}
                        {user.Establecimiento && (
                          <div className="text-sm">
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
                              Establecimiento
                            </p>
                            <p className="text-slate-700 dark:text-slate-200">
                              {user.Establecimiento.name}
                            </p>
                          </div>
                        )}
                        {user.Programa && (
                          <div className="text-sm">
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
                              Programa
                            </p>
                            <p className="text-slate-700 dark:text-slate-200">
                              {user.Programa.name}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span>
                          {user.active ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">
                              ✓ Activo
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-0">
                              ✗ Inactivo
                            </Badge>
                          )}
                        </span>
                        {user.mustChangePassword && (
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                            ⚠ Cambiar
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleEditar(user)}
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleToggleActive(user)}
                          title={user.active ? "Desactivar" : "Activar"}
                        >
                          {user.active ? (
                            <UserX className="h-4 w-4 text-amber-600" />
                          ) : (
                            <UserCheck className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleResetPassword(user)}
                          title="Restablecer contraseña"
                        >
                          <KeyRound className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleEliminar(user)}
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-16 text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <Search className="h-12 w-12 opacity-20" />
                      <p className="text-lg font-semibold">
                        No se encontraron usuarios
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Paginación Cuadrícula */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <span className="font-semibold">Tarjetas por página:</span>
                  <Select
                    value={`${filasXPagina}`}
                    onValueChange={(value) => {
                      setFilasXPagina(Number(value));
                      setPaginaActual(0);
                    }}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[4, 8, 12, 16, 20, 24].map((num) => (
                        <SelectItem key={num} value={`${num}`}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Mostrando {paginaActual * filasXPagina + 1} a{" "}
                  {Math.min(
                    (paginaActual + 1) * filasXPagina,
                    usuariosFiltrados.length,
                  )}{" "}
                  de {usuariosFiltrados.length} usuarios
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPaginaActual(Math.max(0, paginaActual - 1))
                    }
                    disabled={paginaActual === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium px-3">
                    Página {paginaActual + 1} de {Math.max(1, totalPaginas)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPaginaActual(
                        Math.min(totalPaginas - 1, paginaActual + 1),
                      )
                    }
                    disabled={paginaActual >= totalPaginas - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal Crear Usuario */}
      <Dialog open={modalCrear} onOpenChange={setModalCrear}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuevo Usuario</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rut">RUT *</Label>
              <Input
                id="rut"
                placeholder="12345678-9"
                value={formData.rut}
                onChange={(e) =>
                  setFormData({ ...formData, rut: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input
                  id="apellidos"
                  placeholder="Apellidos"
                  value={formData.apellidos}
                  onChange={(e) =>
                    setFormData({ ...formData, apellidos: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.cl"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  placeholder="+56 9 1234 5678"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Rol *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "ADMIN" | "EDITOR" | "USER") =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estamento">Estamento</Label>
                <Select
                  value={formData.estamentoId || "none"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      estamentoId: value === "none" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin especificar</SelectItem>
                    {estamentos.map((est) => (
                      <SelectItem key={est.id} value={est.id}>
                        {est.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="establecimiento">Establecimiento</Label>
                <Select
                  value={formData.establecimientoId || "none"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      establecimientoId: value === "none" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin especificar</SelectItem>
                    {establecimientos.map((est) => (
                      <SelectItem key={est.id} value={est.id}>
                        {est.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="programa">Programa</Label>
                <Select
                  value={formData.programaId || "none"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      programaId: value === "none" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin especificar</SelectItem>
                    {programas.map((prog) => (
                      <SelectItem key={prog.id} value={prog.id}>
                        {prog.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalCrear(false)}>
              Cancelar
            </Button>
            <Button onClick={guardarNuevoUsuario} disabled={guardando}>
              {guardando ? "Guardando..." : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Usuario */}
      <Dialog open={modalEditar} onOpenChange={setModalEditar}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-rut">RUT *</Label>
              <Input
                id="edit-rut"
                placeholder="12345678-9"
                value={formData.rut}
                onChange={(e) =>
                  setFormData({ ...formData, rut: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre *</Label>
                <Input
                  id="edit-name"
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-apellidos">Apellidos</Label>
                <Input
                  id="edit-apellidos"
                  placeholder="Apellidos"
                  value={formData.apellidos}
                  onChange={(e) =>
                    setFormData({ ...formData, apellidos: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="correo@ejemplo.cl"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Teléfono</Label>
                <Input
                  id="edit-phone"
                  placeholder="+56 9 1234 5678"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">Rol *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "ADMIN" | "EDITOR" | "USER") =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-estamento">Estamento</Label>
                <Select
                  value={formData.estamentoId || "none"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      estamentoId: value === "none" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin especificar</SelectItem>
                    {estamentos.map((est) => (
                      <SelectItem key={est.id} value={est.id}>
                        {est.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-establecimiento">Establecimiento</Label>
                <Select
                  value={formData.establecimientoId || "none"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      establecimientoId: value === "none" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin especificar</SelectItem>
                    {establecimientos.map((est) => (
                      <SelectItem key={est.id} value={est.id}>
                        {est.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-programa">Programa</Label>
                <Select
                  value={formData.programaId || "none"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      programaId: value === "none" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin especificar</SelectItem>
                    {programas.map((prog) => (
                      <SelectItem key={prog.id} value={prog.id}>
                        {prog.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={formData.active ? "true" : "false"}
                onValueChange={(value) =>
                  setFormData({ ...formData, active: value === "true" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Activo</SelectItem>
                  <SelectItem value="false">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalEditar(false)}>
              Cancelar
            </Button>
            <Button onClick={guardarEdicion} disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Eliminar */}
      <Dialog open={modalEliminar} onOpenChange={setModalEliminar}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar Usuario</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar permanentemente al usuario{" "}
              <strong>
                {usuarioSeleccionado?.name} {usuarioSeleccionado?.apellidos}
              </strong>{" "}
              ({usuarioSeleccionado?.rut})?
              <br />
              <br />
              Esta acción no se puede deshacer.
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
              {guardando ? "Eliminando..." : "Eliminar Usuario"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Restablecer Contraseña */}
      <Dialog open={modalResetPassword} onOpenChange={setModalResetPassword}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Restablecer Contraseña</DialogTitle>
            <DialogDescription>
              Ingrese la nueva contraseña para{" "}
              <strong>
                {usuarioSeleccionado?.name} {usuarioSeleccionado?.apellidos}
              </strong>
              . El usuario deberá cambiarla en su próximo inicio de sesión.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="nueva-password">Nueva Contraseña</Label>
              <Input
                id="nueva-password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModalResetPassword(false)}
            >
              Cancelar
            </Button>
            <Button onClick={confirmarResetPassword} disabled={guardando}>
              {guardando ? "Guardando..." : "Restablecer Contraseña"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
