"use client";

import Link from "next/link";
import {
  Stethoscope,
  Bell,
  Phone,
  FileText,
  Layers,
  Type,
  Sun,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-[95%] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 mr-8 group">
            <div className="rounded-full bg-sanitary-500 p-1.5 shadow-[0_0_15px_rgba(16,185,129,0.5)] group-hover:scale-110 transition-transform">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white hidden sm:inline-block">
              Intranet<span className="text-sanitary-400">CAR</span>
            </span>
          </Link>

          {/* Central Navigation - "Bonito" style */}
          <nav className="flex items-center gap-2 flex-1 justify-center">
            <Link href="/anexos">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 hover:text-white gap-2 rounded-full px-6"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden md:inline">Anexos</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 hover:text-white gap-2 rounded-full px-6"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Documentos</span>
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 hover:text-white gap-2 rounded-full px-6"
            >
              <Layers className="h-4 w-4" />
              <span className="hidden md:inline">Varios</span>
            </Button>
          </nav>

          {/* Right Side: Accessibility & Notifications */}
          <div className="flex items-center gap-3 bg-black/10 rounded-full px-3 py-1 border border-white/10">
            {/* Accessibility Controls */}
            <div className="flex items-center gap-1 border-r border-white/10 pr-3 mr-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-blue-100 hover:text-white hover:bg-white/10 rounded-full"
                title="Disminuir Texto"
              >
                <Minus className="h-3 w-3" />
              </Button>

              <Type className="h-4 w-4 text-blue-200" />

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-blue-100 hover:text-white hover:bg-white/10 rounded-full"
                title="Aumentar Texto"
              >
                <Plus className="h-3 w-3" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-blue-100 hover:text-white hover:bg-white/10 rounded-full ml-1"
                title="Alto Contraste"
              >
                <Sun className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 relative h-8 w-8 rounded-full"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-400 animate-pulse ring-2 ring-blue-600" />
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
