"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LayoutGrid, List, Search } from "lucide-react";

export interface LinkItem {
  id: string;
  title: string;
  description: string | null;
  url: string;
  icon: string | null;
  category: string | null;
  backgroundColor?: string | null;
  imageSize?: number | 0;
  order: number;
  active: boolean;
  media?: {
    id: string;
    filename: string;
    path: string;
    type: string;
  } | null;
}

interface LaunchpadProps {
  searchTerm: string;
  apps: LinkItem[];
  loading?: boolean;
}

export function Launchpad({
  searchTerm,
  apps,
  loading = false,
}: LaunchpadProps) {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  // Load view mode from localStorage
  React.useEffect(() => {
    const savedView = localStorage.getItem("intranet-view-mode");
    if (savedView === "grid" || savedView === "list") {
      setViewMode(savedView);
    }
  }, []);

  // Save view mode to localStorage
  const handleViewChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    localStorage.setItem("intranet-view-mode", mode);
  };

  const normalize = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const normalizedSearch = normalize(searchTerm);

  const filteredApps = apps.filter(
    (app) =>
      normalize(app.title).includes(normalizedSearch) ||
      (app.description &&
        normalize(app.description).includes(normalizedSearch)),
  );

  if (loading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none">
              <LayoutGrid className="h-5 w-5" />
            </span>
            Aplicaciones
          </h2>
          <p className="text-sm text-slate-500 mt-1 ml-14">
            Herramientas y accesos corporativos
          </p>
        </div>

        <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm self-start sm:self-center">
          <button
            onClick={() => handleViewChange("grid")}
            className={cn(
              "px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-2 transition-all",
              viewMode === "grid"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-bold"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Cuadrícula</span>
          </button>
          <div className="w-px bg-slate-200 dark:bg-slate-700 mx-1 my-1"></div>
          <button
            onClick={() => handleViewChange("list")}
            className={cn(
              "px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-2 transition-all",
              viewMode === "list"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-bold"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
            )}
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Lista</span>
          </button>
        </div>
      </div>

      <div
        className={cn(
          "grid gap-6 transition-all",
          viewMode === "grid"
            ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            : "grid-cols-1",
        )}
      >
        {filteredApps.length === 0 ? (
          <div className="col-span-full py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              No se encontraron aplicaciones
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Intenta con otro término de búsqueda
            </p>
          </div>
        ) : (
          filteredApps.map((app) => {
            const customBg = app.backgroundColor;
            const imageSize = app.imageSize || 0; // 0 means default

            if (viewMode === "list") {
              return (
                <a
                  key={app.id}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all flex items-center gap-5 relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div
                    className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center p-2 flex-shrink-0 shadow-inner",
                      !customBg && "bg-slate-50 dark:bg-slate-700",
                    )}
                    style={customBg ? { backgroundColor: customBg } : {}}
                  >
                    {app.media?.filename ? (
                      <img
                        src={
                          app.media.filename.startsWith("/") ||
                          app.media.filename.startsWith("http")
                            ? app.media.filename
                            : `/uploads/${app.media.filename}`
                        }
                        className="w-full h-full object-contain"
                        alt={app.title}
                      />
                    ) : (
                      <span className="font-bold text-xl text-slate-400">
                        {app.title.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors text-base truncate">
                      {app.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {app.description || app.url}
                    </p>
                  </div>

                  <span className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <LayoutGrid className="h-4 w-4" /> {/* Or chevron right */}
                  </span>
                </a>
              );
            }

            // Grid View
            return (
              <a
                key={app.id}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group rounded-[24px] shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col h-[260px]",
                  "bg-white dark:bg-slate-800",
                )}
              >
                {/* Top Image Area */}
                <div
                  className={cn(
                    "h-[60%] w-full flex items-center justify-center relative transition-transform duration-700 group-hover:scale-[1.02] overflow-hidden",
                    !customBg && "bg-slate-50 dark:bg-slate-900/50",
                    imageSize === 0 && "p-8",
                  )}
                  style={customBg ? { backgroundColor: customBg } : {}}
                >
                  {app.media?.filename ? (
                    <img
                      alt={app.title}
                      className="object-contain drop-shadow-sm transform group-hover:scale-110 transition-transform duration-500"
                      src={
                        app.media.filename.startsWith("/") ||
                        app.media.filename.startsWith("http")
                          ? app.media.filename
                          : `/uploads/${app.media.filename}`
                      }
                      style={{
                        width: imageSize > 0 ? `${imageSize}%` : "100%",
                        height: imageSize > 0 ? `${imageSize}%` : "100%",
                      }}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white/50 backdrop-blur-sm shadow-sm">
                      <span className="text-3xl font-bold text-slate-400/70">
                        {app.title.substring(0, 2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Text Area */}
                <div className="h-[40%] w-full flex flex-col items-center justify-center text-center p-4 relative z-10 bg-white dark:bg-slate-800">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-slate-100 dark:bg-slate-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight px-2">
                    {app.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 px-2 leading-relaxed">
                    {app.description || "Acceso directo"}
                  </p>
                </div>
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}
