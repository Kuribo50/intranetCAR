"use client";

import { Launchpad } from "@/components/dashboard/Launchpad";
import { DocumentsTable } from "@/components/dashboard/DocumentsTable";
import Image from "next/image";
import { Search } from "lucide-react";
import { useState } from "react";
import { Birthdays } from "@/components/dashboard/Birthdays";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="pb-12 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      {/* Decorative background blobs - Global */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-cyan-200/40 blur-[100px]" />
        <div className="absolute top-[20%] right-[0%] w-[40%] h-[60%] rounded-full bg-blue-200/40 blur-[120px]" />
        <div className="absolute bottom-[0%] left-[20%] w-[30%] h-[40%] rounded-full bg-indigo-200/40 blur-[100px]" />
      </div>

      {/* Hero Section - Split Layout */}
      <section className="relative z-10 border-b border-white/20 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-[95%] px-4 sm:px-8 lg:px-12 py-12 lg:py-20 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-medical-900 sm:text-5xl md:text-6xl text-balance">
                Bienvenido al <br />
                <span className="text-blue-600">CESFAM Dr. Alberto Reyes</span>
              </h1>
              <p className="mt-4 text-xl text-slate-600 max-w-lg">
                Plataforma unificada de gestión clínica, administrativa y
                recursos humanos.
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-md relative">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-3 rounded-full border border-slate-300 bg-white text-slate-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  placeholder="Buscar aplicaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative h-[300px] lg:h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10">
            <Image
              src="/hero.jpg"
              alt="CESFAM Hero"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[95%] px-4 sm:px-8 lg:px-12 space-y-8 mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content: Launchpad & Docs */}
          <div className="lg:col-span-9 space-y-12">
            {/* Applications Launchpad - Primary Focus */}
            <section>
              <Launchpad searchTerm={searchTerm} />
            </section>

            {/* Documents Section */}
            <section>
              <DocumentsTable />
            </section>
          </div>

          {/* Sidebar: Birthdays & maybe others */}
          <div className="lg:col-span-3 space-y-6">
            <Birthdays />
            {/* Placeholder for future widgets like weather, santoral, etc. */}
          </div>
        </div>

        <footer className="pt-8 border-t border-slate-200/60 text-center text-slate-500 pb-8">
          <p>&copy; 2024 CESFAM Dr. Alberto Reyes - Unidad de Informática</p>
        </footer>
      </div>
    </div>
  );
}
