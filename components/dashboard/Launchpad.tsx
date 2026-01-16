"use client";

import * as React from "react";
import {
  HeartPulse,
  Wrench,
  GraduationCap,
  Server,
  Users,
  Barcode,
  Files,
  Activity,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "./SearchBar";
import { cn } from "@/lib/utils";

// Define apps with specific branding colors/gradients for the "Cover"
// Define apps with specific branding colors/gradients for the "Cover"
const apps = [
  {
    name: "Códigos Percápita",
    description: "Asignación de códigos PER CÁPITA",
    icon: Barcode,
    url: "http://tic.albertoreyes.cl",
    coverClass: "bg-orange-500", // Solid Orange
    iconClass: "text-white h-14 w-14",
  },
  {
    name: "BUK",
    description: "Sistema Personal DISAM Tomé",
    icon: Users, // Using Users as a proxy for the BUK logo
    url: "#",
    coverClass: "bg-[#2b3a8c]", // Specific BUK Blue
    iconClass: "text-white h-14 w-14",
    isLogo: true, // Flag to potentially render text instead of icon if needed, but icon is fine
  },
  {
    name: "Mantención de Vehículos",
    description: "Plataforma Solicitud de Mantenciones",
    icon: Wrench,
    url: "#",
    coverClass: "bg-slate-800", // Dark for maintenance
    iconClass: "text-cyan-400 h-14 w-14",
  },
  {
    name: "Gestión Documental",
    description: "Protocolos y Documentos Clínicos",
    icon: Files,
    url: "#",
    coverClass: "bg-emerald-600",
    iconClass: "text-white h-14 w-14",
  },
  {
    name: "Moodle CESFAM",
    description: "Plataforma de Capacitación",
    icon: GraduationCap,
    url: "http://moodle.albertoreyes.cl",
    coverClass: "bg-yellow-500",
    iconClass: "text-white h-14 w-14",
  },
  {
    name: "HomeBox",
    description: "Servicios Internos",
    icon: Activity,
    url: "http://homebox.albertoreyes.cl",
    coverClass: "bg-pink-500",
    iconClass: "text-white h-14 w-14",
  },
  {
    name: "NetBox",
    description: "Infraestructura de Red",
    icon: Server,
    url: "http://netbox.albertoreyes.cl",
    coverClass: "bg-blue-600",
    iconClass: "text-white h-14 w-14",
  },
];

interface LaunchpadProps {
  searchTerm: string;
}

import { LayoutGrid, List as ListIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Launchpad({ searchTerm }: LaunchpadProps) {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  // Helper to normalize text (remove accents and lower case)
  const normalize = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const normalizedSearch = normalize(searchTerm);

  const filteredApps = apps.filter(
    (app) =>
      normalize(app.name).includes(normalizedSearch) ||
      normalize(app.description).includes(normalizedSearch)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-medical-900 border-l-4 border-sanitary-500 pl-3">
          Aplicaciones
        </h2>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "h-8 px-2",
              viewMode === "grid" &&
                "shadow-sm text-blue-600 bg-white hover:bg-slate-50"
            )}
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Cuadrícula
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "h-8 px-2",
              viewMode === "list" &&
                "shadow-sm text-blue-600 bg-white hover:bg-slate-50"
            )}
            onClick={() => setViewMode("list")}
          >
            <ListIcon className="h-4 w-4 mr-2" />
            Lista
          </Button>
        </div>
      </div>

      {filteredApps.length === 0 ? (
        <div className="text-center py-10 text-slate-500">
          No se encontraron aplicaciones que coincidan con su búsqueda.
        </div>
      ) : (
        <div
          className={cn(
            "grid gap-6 transition-all",
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              : "grid-cols-1"
          )}
        >
          {filteredApps.map((app) => (
            <a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group h-full"
            >
              <Card
                className={cn(
                  "overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white ring-1 ring-slate-200 h-full flex flex-col",
                  viewMode === "grid"
                    ? "hover:-translate-y-1"
                    : "flex-row items-center hover:bg-slate-50"
                )}
              >
                {viewMode === "grid" ? (
                  <>
                    {/* Grid View: Cover Section */}
                    <div
                      className={cn(
                        "h-32 flex items-center justify-center relative overflow-hidden",
                        app.coverClass
                      )}
                    >
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
                      <app.icon
                        className={cn(
                          "relative z-10 drop-shadow-lg transform transition-transform group-hover:scale-110",
                          app.iconClass
                        )}
                      />
                    </div>
                    {/* Grid View: Body */}
                    <CardContent className="p-5 text-center flex-grow flex flex-col justify-start">
                      <h3 className="font-bold text-lg text-slate-900 mb-2 leading-tight">
                        {app.name}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium line-clamp-2">
                        {app.description}
                      </p>
                    </CardContent>
                  </>
                ) : (
                  <>
                    {/* List View: Icon Left */}
                    <div
                      className={cn(
                        "w-24 h-24 flex-shrink-0 flex items-center justify-center",
                        app.coverClass
                      )}
                    >
                      <app.icon
                        className={cn("h-10 w-10 text-white drop-shadow-md")}
                      />
                    </div>
                    {/* List View: Content Right */}
                    <CardContent className="p-6 flex-grow flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 leading-tight">
                          {app.name}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium mt-1">
                          {app.description}
                        </p>
                      </div>
                      <div className="text-slate-400">
                        <span className="sr-only">Ir</span>
                        <svg
                          className="w-6 h-6 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
