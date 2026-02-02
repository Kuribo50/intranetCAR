"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Loader2,
  Heart,
  Mail,
  Calendar,
} from "lucide-react";

interface Birthday {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  type: string;
  estamento: string | null;
  programa: string | null;
}

export function AdminCumpleanos() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState({
    title: "",
    startDate: "",
    estamento: "",
    programa: "",
    description: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBirthday, setNewBirthday] = useState({
    title: "",
    startDate: "",
    estamento: "",
    programa: "",
    description: "",
  });
  const [sendingGreeting, setSendingGreeting] = useState<string | null>(null);

  // Cargar cumpleaños desde la API
  useEffect(() => {
    async function fetchBirthdays() {
      try {
        const response = await fetch("/api/events?type=BIRTHDAY");
        if (response.ok) {
          const data = await response.json();
          setBirthdays(data);
        }
      } catch (error) {
        console.error("Error cargando cumpleaños:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBirthdays();
  }, []);

  const handleEdit = (birthday: Birthday) => {
    setEditingId(birthday.id);
    const date = new Date(birthday.startDate);
    const dateStr = date.toISOString().split("T")[0];
    setEditingData({
      title: birthday.title,
      startDate: dateStr,
      estamento: birthday.estamento || "",
      programa: birthday.programa || "",
      description: birthday.description || "",
    });
  };

  const handleSave = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingData.title,
          description: editingData.description,
          type: "BIRTHDAY",
          // Force noon to prevent timezone shifts
          startDate: new Date(
            editingData.startDate + "T12:00:00",
          ).toISOString(),
          allDay: true,
          estamento: editingData.estamento || null,
          programa: editingData.programa || null,
        }),
      });
      if (response.ok) {
        const updated = await response.json();
        setBirthdays(birthdays.map((b) => (b.id === id ? updated : b)));
        setEditingId(null);
      } else {
        const error = await response.json();
        alert(error.error || "Error al actualizar cumpleaños");
      }
    } catch (error) {
      console.error("Error actualizando cumpleaños:", error);
      alert("Error al actualizar cumpleaños");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este cumpleaños?")) return;

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setBirthdays(birthdays.filter((b) => b.id !== id));
      } else {
        const error = await response.json();
        alert(error.error || "Error al eliminar cumpleaños");
      }
    } catch (error) {
      console.error("Error eliminando cumpleaños:", error);
      alert("Error al eliminar cumpleaños");
    }
  };

  const handleAdd = async () => {
    if (!newBirthday.title || !newBirthday.startDate) {
      alert("El nombre y la fecha son obligatorios");
      return;
    }

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newBirthday.title,
          description: newBirthday.description,
          type: "BIRTHDAY",
          // Force noon to prevent timezone shifts
          startDate: new Date(
            newBirthday.startDate + "T12:00:00",
          ).toISOString(),
          allDay: true,
          estamento: newBirthday.estamento || null,
          programa: newBirthday.programa || null,
        }),
      });
      if (response.ok) {
        const created = await response.json();
        setBirthdays([...birthdays, created]);
        setNewBirthday({
          title: "",
          startDate: "",
          estamento: "",
          programa: "",
          description: "",
        });
        setShowAddForm(false);
      } else {
        const error = await response.json();
        alert(error.error || "Error al crear cumpleaños");
      }
    } catch (error) {
      console.error("Error creando cumpleaños:", error);
      alert("Error al crear cumpleaños");
    }
  };

  const handleSendGreeting = async (birthday: Birthday) => {
    setSendingGreeting(birthday.id);
    try {
      // Aquí puedes implementar el envío de email o notificación
      // Por ahora, simulamos el envío
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(
        `¡Felicitación enviada a ${birthday.title}! 🎉\n\nSe ha enviado un mensaje de felicitación.`,
      );
    } catch (error) {
      console.error("Error enviando felicitación:", error);
      alert("Error al enviar felicitación");
    } finally {
      setSendingGreeting(null);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    // Use UTC components to show the exact stored date regardless of local timezone
    const day = date.getUTCDate();
    const month = date.toLocaleString("es-CL", {
      month: "long",
      timeZone: "UTC",
    });
    const year = date.getUTCFullYear();
    return `${day} de ${month} de ${year}`;
  };

  const getDaysUntil = (dateString: string): number => {
    const today = new Date();
    const birthday = new Date(dateString);
    birthday.setFullYear(today.getFullYear());
    if (birthday < today) {
      birthday.setFullYear(today.getFullYear() + 1);
    }
    const diffTime = birthday.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Cumpleaños</CardTitle>
              <p className="text-sm text-slate-500 mt-1">
                Gestiona los cumpleaños del personal
              </p>
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Agregar Cumpleaños
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddForm && (
            <div className="p-6 border-2 border-dashed border-pink-200 rounded-lg space-y-4 bg-pink-50/50">
              <h3 className="font-semibold text-slate-900">Nuevo Cumpleaños</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-name">Nombre *</Label>
                  <Input
                    id="new-name"
                    placeholder="Nombre completo"
                    value={newBirthday.title}
                    onChange={(e) =>
                      setNewBirthday({ ...newBirthday, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="new-date">Fecha de Cumpleaños *</Label>
                  <Input
                    id="new-date"
                    type="date"
                    value={newBirthday.startDate}
                    onChange={(e) =>
                      setNewBirthday({
                        ...newBirthday,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="new-estamento">Estamento/Funciones</Label>
                  <Input
                    id="new-estamento"
                    placeholder="Ej: Médico, Enfermero, Técnico"
                    value={newBirthday.estamento}
                    onChange={(e) =>
                      setNewBirthday({
                        ...newBirthday,
                        estamento: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="new-programa">Programa</Label>
                  <Input
                    id="new-programa"
                    placeholder="Ej: Programa Cardiovascular"
                    value={newBirthday.programa}
                    onChange={(e) =>
                      setNewBirthday({
                        ...newBirthday,
                        programa: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="new-description">
                    Descripción (opcional)
                  </Label>
                  <Input
                    id="new-description"
                    placeholder="Información adicional"
                    value={newBirthday.description}
                    onChange={(e) =>
                      setNewBirthday({
                        ...newBirthday,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleAdd} size="sm" className="gap-2">
                  <Save className="h-4 w-4" />
                  Guardar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewBirthday({
                      title: "",
                      startDate: "",
                      estamento: "",
                      programa: "",
                      description: "",
                    });
                  }}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <div className="rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3 w-[50px]"></th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Estamento</th>
                  <th className="px-4 py-3">Programa</th>
                  <th className="px-4 py-3">Descripción</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-900">
                {birthdays.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No hay cumpleaños registrados. Agrega uno nuevo.
                    </td>
                  </tr>
                ) : (
                  birthdays
                    .sort(
                      (a, b) =>
                        new Date(a.startDate).getTime() -
                        new Date(b.startDate).getTime(),
                    )
                    .map((birthday) => {
                      const daysUntil = getDaysUntil(birthday.startDate);
                      const isToday = daysUntil === 0;

                      if (editingId === birthday.id) {
                        return (
                          <tr key={birthday.id} className="bg-slate-50">
                            <td className="px-4 py-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                                <Edit className="w-4 h-4" />
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                value={editingData.title}
                                onChange={(e) =>
                                  setEditingData({
                                    ...editingData,
                                    title: e.target.value,
                                  })
                                }
                                className="h-8 w-full"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                type="date"
                                value={editingData.startDate}
                                onChange={(e) =>
                                  setEditingData({
                                    ...editingData,
                                    startDate: e.target.value,
                                  })
                                }
                                className="h-8 w-full"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                value={editingData.estamento}
                                onChange={(e) =>
                                  setEditingData({
                                    ...editingData,
                                    estamento: e.target.value,
                                  })
                                }
                                className="h-8 w-full"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                value={editingData.programa}
                                onChange={(e) =>
                                  setEditingData({
                                    ...editingData,
                                    programa: e.target.value,
                                  })
                                }
                                className="h-8 w-full"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                value={editingData.description}
                                onChange={(e) =>
                                  setEditingData({
                                    ...editingData,
                                    description: e.target.value,
                                  })
                                }
                                className="h-8 w-full"
                              />
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  size="icon"
                                  onClick={() => handleSave(birthday.id)}
                                  className="h-8 w-8 text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100"
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setEditingId(null)}
                                  className="h-8 w-8"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr
                          key={birthday.id}
                          className={`hover:bg-slate-50 transition-colors ${
                            isToday ? "bg-pink-50/30" : ""
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                                isToday
                                  ? "bg-gradient-to-br from-pink-500 to-purple-500 animate-pulse"
                                  : "bg-gradient-to-br from-pink-400 to-purple-400"
                              }`}
                            >
                              {birthday.title.charAt(0)}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {birthday.title}
                            {isToday && (
                              <span className="ml-2 px-1.5 py-0.5 bg-pink-100 text-pink-700 text-[10px] font-bold rounded-full animate-pulse uppercase">
                                Hoy
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            <div className="flex flex-col">
                              <span>{formatDate(birthday.startDate)}</span>
                              {!isToday && (
                                <span className="text-[10px] text-slate-400">
                                  {daysUntil === 1
                                    ? "Mañana"
                                    : `En ${daysUntil} días`}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {birthday.estamento && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                {birthday.estamento}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {birthday.programa && (
                              <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                                {birthday.programa}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-500 text-xs max-w-[200px] truncate">
                            {birthday.description}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleSendGreeting(birthday)}
                                disabled={sendingGreeting === birthday.id}
                                className="h-8 w-8 text-pink-500 hover:text-pink-600 hover:bg-pink-50"
                                title="Felicitar"
                              >
                                {sendingGreeting === birthday.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Heart className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(birthday)}
                                className="h-8 w-8 text-slate-400 hover:text-blue-600"
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(birthday.id)}
                                className="h-8 w-8 text-slate-400 hover:text-red-600"
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
