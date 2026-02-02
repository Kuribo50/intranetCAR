"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cake, Heart, ChevronLeft, ChevronRight, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as React from "react";

interface BirthdayEvent {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  type: string;
}

const formatBirthdayDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const eventDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const tomorrowDate = new Date(
    tomorrow.getFullYear(),
    tomorrow.getMonth(),
    tomorrow.getDate(),
  );

  if (eventDate.getTime() === todayDate.getTime()) {
    return "Hoy";
  }
  if (eventDate.getTime() === tomorrowDate.getTime()) {
    return "Mañana";
  }

  return date.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
  });
};

const getDepartmentFromDescription = (description: string | null): string => {
  if (!description) return "General";
  const desc = description.toLowerCase();
  if (desc.includes("medicina") || desc.includes("médico")) return "Medicina";
  if (desc.includes("informática") || desc.includes("informatica"))
    return "Informática";
  if (desc.includes("enfermería") || desc.includes("enfermeria"))
    return "Enfermería";
  if (desc.includes("urgencia")) return "Urgencias";
  if (desc.includes("dental")) return "Dental";
  return description;
};

interface BirthdaysProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Birthdays({ collapsed, onToggle }: BirthdaysProps) {
  const [birthdays, setBirthdays] = React.useState<BirthdayEvent[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchBirthdays() {
      try {
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setDate(nextMonth.getDate() + 5);

        const response = await fetch(
          `/api/events?type=BIRTHDAY&startDate=${today.toISOString()}&endDate=${nextMonth.toISOString()}`,
        );
        if (response.ok) {
          const data = await response.json();
          setBirthdays(data.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching birthdays:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBirthdays();
    const interval = setInterval(fetchBirthdays, 300000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (collapsed) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-2 group">
        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-all">
          <Gift className="h-6 w-6 text-pink-500" />
        </div>
        <span className="mt-2 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          Cumpleaños
        </span>
      </div>
    );
  }

  return (
    <div className="w-full transition-all duration-300">
      <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800 backdrop-blur-md ring-1 ring-slate-100/50 dark:ring-slate-700 overflow-hidden relative">
        {/* Decorative Header Background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400" />

        <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 p-2 rounded-xl text-pink-600 dark:text-pink-400 shadow-sm ring-1 ring-pink-50 dark:ring-pink-900/20">
              <Gift className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Cumpleaños
              </CardTitle>
              {!collapsed && (
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Celebraciones cercanas
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
            onClick={onToggle}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </CardHeader>

        {!collapsed && (
          <CardContent className="p-4 pt-2">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 animate-pulse"
                  >
                    <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-700" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3 w-2/3 bg-slate-100 dark:bg-slate-700 rounded" />
                      <div className="h-2 w-1/3 bg-slate-100 dark:bg-slate-700 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : birthdays.length === 0 ? (
              <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm bg-slate-50/50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700 border-dashed">
                <Cake className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                No hay cumpleaños próximos.
              </div>
            ) : (
              <div className="space-y-3">
                {birthdays.map((person) => {
                  const dateStr = formatBirthdayDate(person.startDate);
                  const department = getDepartmentFromDescription(
                    person.description,
                  );
                  const isToday = dateStr === "Hoy";

                  return (
                    <div
                      key={person.id}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-xl transition-all duration-200 group border",
                        isToday
                          ? "bg-gradient-to-r from-pink-50/80 to-rose-50/50 dark:from-pink-900/20 dark:to-rose-900/10 border-pink-100 dark:border-pink-900/30 hover:border-pink-200 dark:hover:border-pink-800 shadow-sm"
                          : "bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700 border-transparent hover:border-slate-100 dark:hover:border-slate-600",
                      )}
                    >
                      <div
                        className={cn(
                          "h-9 w-9 flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-white dark:ring-slate-700 transition-transform group-hover:scale-105",
                          isToday
                            ? "bg-gradient-to-br from-pink-500 to-rose-500 animate-[pulse_3s_ease-in-out_infinite]"
                            : "bg-gradient-to-br from-indigo-400 to-blue-400",
                        )}
                      >
                        {person.title.charAt(0)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate">
                            {person.title}
                          </p>
                          <span
                            className={cn(
                              "text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 flex-shrink-0",
                              isToday
                                ? "bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300"
                                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
                            )}
                          >
                            {dateStr}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                          {department}
                        </p>
                      </div>

                      {/* Button removed to avoid login requirements */}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-center">
              <Button
                variant="link"
                size="sm"
                className="text-xs text-slate-400 dark:text-slate-500 h-auto p-0 hover:text-pink-500 dark:hover:text-pink-400"
              >
                Ver calendario completo
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Fallback space filler if collapsed to prevent layout shifts if needed, 
          but grid column handles width mostly. 
      */}
    </div>
  );
}
