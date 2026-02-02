"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Clock,
  ExternalLink,
  HelpCircle,
  Mail,
  Globe,
  LifeBuoy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Launchpad, LinkItem } from "@/components/dashboard/Launchpad";
import { HeroCarousel } from "@/components/dashboard/HeroCarousel";
import { Birthdays } from "@/components/dashboard/Birthdays";
import { EventCalendar } from "@/components/dashboard/EventCalendar";
import { AnnouncementBoard } from "@/components/dashboard/AnnouncementBoard";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { Typewriter } from "@/components/ui/typewriter";
import Link from "next/link";
import { cn } from "@/lib/utils";

const RECENT_APPS_KEY = "intranet-recent-apps";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [apps, setApps] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [recentApps, setRecentApps] = useState<LinkItem[]>([]);
  const [widgetStates, setWidgetStates] = useState({
    calendar: false,
    birthdays: false,
    announcements: false,
  });
  const allCollapsed = Object.values(widgetStates).every(Boolean);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchApps() {
      try {
        const response = await fetch("/api/links?category=APP&active=true");
        if (response.ok) {
          const data = await response.json();
          setApps(data);

          // Load recents from localStorage after fetching apps
          const savedRecents = localStorage.getItem(RECENT_APPS_KEY);
          if (savedRecents) {
            const recentIds = JSON.parse(savedRecents);
            const foundRecents = recentIds
              .map((id: string) => data.find((app: LinkItem) => app.id === id))
              .filter(Boolean) as LinkItem[];
            setRecentApps(foundRecents);
          }
        }
      } catch (error) {
        console.error("Error fetching apps:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchApps();
    const interval = setInterval(fetchApps, 10000);
    return () => clearInterval(interval);
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(value.length > 0);
  };

  const handleAppClick = (app: LinkItem, e: React.MouseEvent) => {
    e.preventDefault();

    // Add to recents
    const newRecentIds = [
      app.id,
      ...recentApps.map((r) => r.id).filter((id) => id !== app.id),
    ].slice(0, 5);
    localStorage.setItem(RECENT_APPS_KEY, JSON.stringify(newRecentIds));

    // Update state immediately
    const updatedRecents = [
      app,
      ...recentApps.filter((r) => r.id !== app.id),
    ].slice(0, 5);
    setRecentApps(updatedRecents);

    // Clear search
    setSearchTerm("");
    setShowResults(false);

    // Open in new tab
    window.open(app.url, "_blank", "noopener,noreferrer");
  };

  const normalize = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const normalizedSearch = normalize(searchTerm);
  const searchResults = apps
    .filter(
      (app) =>
        normalize(app.title).includes(normalizedSearch) ||
        (app.description &&
          normalize(app.description).includes(normalizedSearch)),
    )
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <main className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* HERO SECTION */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch min-h-[500px]">
          {/* Left Column: Welcome & Search */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-center space-y-8 py-8 z-20">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-primary dark:text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100 dark:border-blue-500/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Bienvenido a tu espacio
              </div>
              <h1 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] min-h-[140px] sm:min-h-[160px]">
                Intranet <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 block">
                  <Typewriter
                    text="Dr. Alberto Reyes"
                    speed={100}
                    delay={200}
                  />
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-medium">
                Accede a todas las herramientas, documentos y recursos de
                nuestro CESFAM en un solo lugar.
              </p>
            </div>

            {/* Search Component with Results */}
            <div
              className="relative max-w-lg w-full group"
              ref={searchContainerRef}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center p-2 border border-slate-100 dark:border-slate-700 z-20">
                <span className="w-12 h-12 flex items-center justify-center text-slate-400 dark:text-slate-500">
                  <Search className="w-6 h-6" />
                </span>
                <input
                  className="w-full bg-transparent border-none text-slate-700 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0 text-lg py-2 focus:outline-none font-medium"
                  placeholder="¿Qué necesitas encontrar hoy?"
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    if (searchTerm.length > 0) setShowResults(true);
                  }}
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95">
                  Buscar
                </button>
              </div>

              {/* Quick Results Dropdown */}
              <AnimatePresence>
                {showResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-30"
                  >
                    <div className="p-2">
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 px-3 py-2 uppercase tracking-wider">
                        Resultados rápidos
                      </p>
                      {searchResults.map((app) => (
                        <a
                          key={app.id}
                          href={app.url}
                          onClick={(e) => handleAppClick(app, e)}
                          className="flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-slate-700/80 rounded-xl transition-all group/item"
                        >
                          <div className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center justify-center p-1.5 text-primary shadow-sm">
                            {app.media?.filename ? (
                              <img
                                src={`/uploads/${app.media.filename}`}
                                className="w-full h-full object-contain"
                                alt={app.title}
                              />
                            ) : (
                              <span className="font-bold text-sm">
                                {app.title.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm group-hover/item:text-primary transition-colors">
                              {app.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                              {app.description}
                            </p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-slate-300 dark:text-slate-600 ml-auto" />
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Recent Apps Section (Under Search Bar) */}
            {recentApps.length > 0 && (
              <div className="w-full max-w-lg animate-in slide-in-from-left-4 fade-in duration-500">
                <div className="flex items-center gap-2 mb-3 text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Últimas utilizadas
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentApps.map((app) => (
                    <a
                      key={app.id}
                      href={app.url}
                      onClick={(e) => handleAppClick(app, e)}
                      className="group flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 pl-1.5 pr-3 py-1.5 rounded-full transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-slate-600"
                      title={app.title}
                    >
                      <div className="w-5 h-5 flex items-center justify-center text-primary bg-slate-50 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
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
                          <span className="font-bold text-[10px]">
                            {app.title.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors max-w-[100px] truncate">
                        {app.title}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Gallery (HeroCarousel) */}
          <div className="lg:col-span-7 xl:col-span-8 h-full flex items-center">
            <div className="relative w-full h-full overflow-hidden rounded-[2rem] shadow-2xl shadow-slate-200 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-800 group">
              {/* Carousel Content */}
              <div className="relative w-full h-full">
                <HeroCarousel />
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid lg:grid-cols-12 gap-8 pt-8">
          {/* Left Column: Apps Grid (Launchpad) */}
          <div
            className={cn(
              "transition-all duration-500 ease-in-out",
              allCollapsed ? "lg:col-span-11" : "lg:col-span-8",
            )}
          >
            <Launchpad searchTerm={searchTerm} apps={apps} loading={loading} />
          </div>

          {/* Right Sidebar: Widgets */}
          <aside
            className={cn(
              "space-y-4 transition-all duration-500 ease-in-out",
              allCollapsed ? "lg:col-span-1" : "lg:col-span-4",
            )}
          >
            {/* 1. Calendario Widget */}
            <div
              className={cn(
                "transition-all duration-300",
                widgetStates.calendar
                  ? "bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-105 cursor-pointer"
                  : "bg-white dark:bg-slate-800 rounded-[1.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700",
              )}
              onClick={() => {
                // Clicking the wrapper when collapsed (true) should expand it (false)
                if (widgetStates.calendar) {
                  setWidgetStates((prev) => ({ ...prev, calendar: false }));
                }
              }}
            >
              <EventCalendar
                collapsed={widgetStates.calendar}
                onToggle={() => {
                  if (widgetStates.calendar) {
                    // It is collapsed, so we are OPENING it -> Open only this one
                    setWidgetStates((prev) => ({ ...prev, calendar: false }));
                  } else {
                    // It is expanded, so we are CLOSING it -> Close ALL
                    setWidgetStates({
                      calendar: true,
                      birthdays: true,
                      announcements: true,
                    });
                  }
                }}
              />
            </div>

            {/* 2. Cumpleaños Widget */}
            <div
              className={cn(
                "transition-all duration-300",
                widgetStates.birthdays
                  ? "bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-105 cursor-pointer"
                  : "bg-white dark:bg-slate-800 rounded-[1.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700",
              )}
              onClick={() => {
                if (widgetStates.birthdays) {
                  setWidgetStates((prev) => ({ ...prev, birthdays: false }));
                }
              }}
            >
              <Birthdays
                collapsed={widgetStates.birthdays}
                onToggle={() => {
                  if (widgetStates.birthdays) {
                    // Opening -> Open only this one
                    setWidgetStates((prev) => ({ ...prev, birthdays: false }));
                  } else {
                    // Closing -> Close ALL
                    setWidgetStates({
                      calendar: true,
                      birthdays: true,
                      announcements: true,
                    });
                  }
                }}
              />
            </div>

            {/* 3. Anuncios Widget */}
            <div
              className={cn(
                "relative overflow-hidden transition-all duration-300",
                widgetStates.announcements
                  ? "bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-105 cursor-pointer"
                  : "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800/80 rounded-[1.5rem] p-6 border border-amber-100 dark:border-slate-700",
              )}
              onClick={() => {
                if (widgetStates.announcements) {
                  setWidgetStates((prev) => ({
                    ...prev,
                    announcements: false,
                  }));
                }
              }}
            >
              {!widgetStates.announcements && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200/20 rounded-full blur-2xl -mr-8 -mt-8"></div>
              )}
              <div className="relative z-10 text-center">
                <AnnouncementBoard
                  collapsed={widgetStates.announcements}
                  onToggle={() => {
                    if (widgetStates.announcements) {
                      // Opening -> Open only this one
                      setWidgetStates((prev) => ({
                        ...prev,
                        announcements: false,
                      }));
                    } else {
                      // Closing -> Close ALL
                      setWidgetStates({
                        calendar: true,
                        birthdays: true,
                        announcements: true,
                      });
                    }
                  }}
                />
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      <ScrollToTop />
    </div>
  );
}
