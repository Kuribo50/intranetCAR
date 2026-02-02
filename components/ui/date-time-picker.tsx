"use client";

import * as React from "react";
import { format, addMonths, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  date: Date | null;
  setDate: (date: Date | null) => void;
  label?: string;
  minDate?: Date | null;
  placeholder?: string;
  disablePastDates?: boolean;
}

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
];

export function DateTimePicker({
  date,
  setDate,
  label,
  minDate,
  placeholder = "Seleccionar fecha y hora",
  disablePastDates = false,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(date || new Date());
  const [selectedTime, setSelectedTime] = React.useState<string>(
    date ? format(date, "HH:mm") : "09:00",
  );
  const timeListRef = React.useRef<HTMLDivElement>(null);

  // Scroll to selected time when opening
  React.useEffect(() => {
    if (isOpen && timeListRef.current) {
      const selectedButton = timeListRef.current.querySelector(
        '[data-selected="true"]',
      );
      if (selectedButton) {
        selectedButton.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  }, [isOpen]);

  const handleDateSelect = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    const [hours, minutes] = selectedTime.split(":").map(Number);
    newDate.setHours(hours, minutes, 0, 0);
    setDate(newDate);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (date) {
      const [hours, minutes] = time.split(":").map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes, 0, 0);
      setDate(newDate);
    }
  };

  const handleConfirm = () => {
    setIsOpen(false);
  };

  // Generate calendar days
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const days: (number | null)[] = [];

    // Add empty cells for days before the first day
    for (let i = 0; i < adjustedStart; i++) {
      days.push(null);
    }

    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const isDateDisabled = (day: number) => {
    const checkDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    checkDate.setHours(0, 0, 0, 0);

    // Deshabilitar fechas pasadas si disablePastDates está activo
    if (disablePastDates) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (checkDate < today) return true;
    }

    // Deshabilitar si es menor que minDate
    if (minDate) {
      const minDateNormalized = new Date(minDate);
      minDateNormalized.setHours(0, 0, 0, 0);
      if (checkDate < minDateNormalized) return true;
    }

    return false;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!date) return false;
    return (
      day === date.getDate() &&
      currentMonth.getMonth() === date.getMonth() &&
      currentMonth.getFullYear() === date.getFullYear()
    );
  };

  const weekDays = ["lu", "ma", "mi", "ju", "vi", "sá", "do"];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-11 bg-white hover:bg-slate-50 border-slate-200",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
          {date ? (
            <span className="text-slate-900">
              {format(date, "EEEE d 'de' MMMM, yyyy", { locale: es })}
              <span className="ml-2 text-blue-600 font-medium">
                {format(date, "HH:mm")}
              </span>
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-white shadow-xl border border-slate-200 rounded-xl overflow-hidden"
        align="start"
        sideOffset={8}
      >
        <div className="flex">
          {/* Calendario */}
          <div className="p-4 border-r border-slate-100">
            {/* Header con navegación */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-slate-100"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-semibold text-slate-900 capitalize">
                {format(currentMonth, "MMMM yyyy", { locale: es })}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-slate-100"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Week days header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="h-8 w-8 flex items-center justify-center text-xs font-medium text-slate-500 uppercase"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth().map((day, index) => (
                <div key={index} className="h-8 w-8">
                  {day !== null && (
                    <button
                      onClick={() => handleDateSelect(day)}
                      disabled={isDateDisabled(day)}
                      className={cn(
                        "h-8 w-8 rounded-lg text-sm font-medium transition-all flex items-center justify-center",
                        isSelected(day)
                          ? "bg-blue-500 text-white"
                          : isToday(day)
                            ? "bg-blue-100 text-blue-700 font-bold"
                            : "text-slate-700 hover:bg-slate-100",
                        isDateDisabled(day) &&
                          "text-slate-300 cursor-not-allowed hover:bg-transparent",
                      )}
                    >
                      {day}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Selector de hora */}
          <div className="w-24 flex flex-col">
            <div className="flex items-center justify-center gap-2 px-2 py-3 bg-blue-50 border-b border-slate-100">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 uppercase">
                Hora
              </span>
            </div>

            {/* Botón subir */}
            <button
              onClick={() => {
                if (timeListRef.current) {
                  timeListRef.current.scrollBy({
                    top: -120,
                    behavior: "smooth",
                  });
                }
              }}
              className="flex items-center justify-center py-2 hover:bg-slate-100 transition-colors border-b border-slate-100"
            >
              <ChevronUp className="h-5 w-5 text-slate-400" />
            </button>

            <div
              ref={timeListRef}
              className="flex-1 overflow-y-auto max-h-[200px] p-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div className="space-y-1">
                {timeSlots.map((time) => {
                  // Deshabilitar horas pasadas si la fecha seleccionada es hoy
                  const isDisabled = (() => {
                    if (!date) return false;

                    const selectedDate = new Date(date);
                    selectedDate.setHours(0, 0, 0, 0);

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    // Solo deshabilitar si es hoy
                    if (selectedDate.getTime() === today.getTime()) {
                      const [hours, minutes] = time.split(":").map(Number);
                      const now = new Date();
                      const timeDate = new Date();
                      timeDate.setHours(hours, minutes, 0, 0);

                      return timeDate < now;
                    }

                    return false;
                  })();

                  return (
                    <button
                      key={time}
                      data-selected={selectedTime === time}
                      onClick={() => handleTimeSelect(time)}
                      disabled={isDisabled}
                      className={cn(
                        "w-full px-3 py-2 text-sm rounded-lg transition-all text-center",
                        selectedTime === time
                          ? "bg-blue-500 text-white font-semibold shadow-md"
                          : isDisabled
                            ? "text-slate-300 cursor-not-allowed bg-slate-50"
                            : "text-slate-700 hover:bg-blue-50 hover:text-blue-700",
                      )}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Botón bajar */}
            <button
              onClick={() => {
                if (timeListRef.current) {
                  timeListRef.current.scrollBy({
                    top: 120,
                    behavior: "smooth",
                  });
                }
              }}
              className="flex items-center justify-center py-2 hover:bg-slate-100 transition-colors border-t border-slate-100"
            >
              <ChevronDown className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Footer con botón confirmar */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <span className="text-sm text-slate-600 font-medium">
            {date
              ? format(date, "d MMM yyyy, HH:mm", { locale: es })
              : "Sin selección"}
          </span>
          <Button
            size="sm"
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4"
          >
            Confirmar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
