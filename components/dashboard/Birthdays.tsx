"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Cake, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
// Actually, let's use standard div with overflow for safety if ScrollArea isn't confirmed.
// User didn't ask for Shadcn ScrollArea specifically, but "premium". standard custom scrollbar is fine.

// Mock Data
const birthdays = [
  {
    name: "Dra. Ana López",
    date: "Hoy",
    department: "Medicina",
    image: null,
    age: 34,
  },
  {
    name: "Carlos Ruiz",
    date: "Mañana",
    department: "Informática",
    image: null,
    age: 29,
  },
  {
    name: "Enf. María Pérez",
    date: "18 Ene",
    department: "Enfermería",
    image: null,
    age: 45,
  },
  {
    name: "Dr. Juan Soto",
    date: "20 Ene",
    department: "Urgencias",
    image: null,
    age: 52,
  },
  {
    name: "Téc. Pedro Diaz",
    date: "22 Ene",
    department: "Dental",
    image: null,
    age: 30,
  },
];

export function Birthdays() {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm ring-1 ring-slate-200/60 sticky top-24 overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between px-4 py-4 bg-gradient-to-r from-pink-50 to-white">
        <div className="flex items-center gap-3">
          <div className="bg-pink-100 p-2 rounded-full ring-2 ring-pink-200/50">
            <Cake className="h-5 w-5 text-pink-500" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-slate-800">
              Cumpleaños
            </CardTitle>
            <p className="text-xs text-slate-500 font-medium">
              Próximas celebraciones
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-full"
          title="Agregar Cumpleaños"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-4 space-y-4">
          {birthdays.map((person, i) => (
            <div
              key={i}
              className="flex items-center gap-3 group p-2 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-default"
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-110 transition-transform ring-2 ring-white">
                {person.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {person.name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {person.department}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    person.date === "Hoy"
                      ? "bg-pink-100 text-pink-700 animate-pulse"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {person.date}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <Button
            variant="outline"
            className="w-full text-xs h-8 border-slate-200 text-slate-600 hover:text-pink-600 hover:border-pink-200"
          >
            <Calendar className="h-3 w-3 mr-2" />
            Ver Calendario Completo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
