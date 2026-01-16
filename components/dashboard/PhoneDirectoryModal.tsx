"use client";

import * as React from "react";
import { X, Search, Phone, Copy, Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Contact {
  name: string;
  department: string;
  extension: string;
  category?: string;
}

const contacts: Contact[] = [
  // Sector Rojo
  {
    name: "Grupal (Diego Villarroel - Marlen Castillo)",
    department: "Sector Rojo",
    extension: "419850",
    category: "Clínico",
  },
  {
    name: "SOME (Juan Vasquez)",
    department: "Sector Rojo",
    extension: "419851",
    category: "Administrativo",
  },
  {
    name: "SOME (Maria Jose Fierro)",
    department: "Sector Rojo",
    extension: "419852",
    category: "Administrativo",
  },
  {
    name: "Médico (Dra. Acevedo)",
    department: "Sector Rojo",
    extension: "419857",
    category: "Clínico",
  },
  {
    name: "Médico",
    department: "Sector Rojo",
    extension: "419853",
    category: "Clínico",
  },
  {
    name: "Dental (Dra. Troncoso / TENS Marg A)",
    department: "Sector Rojo",
    extension: "419856",
    category: "Clínico",
  },
  {
    name: "Matrona (Romina Mejias)",
    department: "Sector Rojo",
    extension: "419823",
    category: "Clínico",
  },
  {
    name: "Matrona",
    department: "Sector Rojo",
    extension: "419822",
    category: "Clínico",
  },
  {
    name: "Enfermera (Natalia Díaz)",
    department: "Sector Rojo",
    extension: "419858",
    category: "Clínico",
  },
  {
    name: "Enfermero (Carlos Zambrano)",
    department: "Sector Rojo",
    extension: "419859",
    category: "Clínico",
  },
  {
    name: "Nutricionista (Karen Olivares) Coord.",
    department: "Sector Rojo",
    extension: "419855",
    category: "Clínico",
  },
  {
    name: "Médico (Dra. Pizarro)",
    department: "Sector Rojo",
    extension: "419855",
    category: "Clínico",
  },

  // Sector Azul
  {
    name: "Grupal (Priscilla Hidalgo - Jovita Camaño)",
    department: "Sector Azul",
    extension: "419871",
    category: "Clínico",
  },
  {
    name: "SOME (Juan David Velasquez)",
    department: "Sector Azul",
    extension: "419873",
    category: "Administrativo",
  },
  {
    name: "SOME (Andrea Gonzalez)",
    department: "Sector Azul",
    extension: "419875",
    category: "Administrativo",
  },
  {
    name: "Médico (Dra. Sanhueza)",
    department: "Sector Azul",
    extension: "419874",
    category: "Clínico",
  },
  {
    name: "Médico (Dr. Ruiz)",
    department: "Sector Azul",
    extension: "419870",
    category: "Clínico",
  },
  {
    name: "Dental (Dr. Luengo - Dr. Moraga)",
    department: "Sector Azul",
    extension: "419878",
    category: "Clínico",
  },
  {
    name: "Matrona (Ingrid Peña)",
    department: "Sector Azul",
    extension: "419830",
    category: "Clínico",
  },
  {
    name: "Médico (Antonia Rosales)",
    department: "Sector Azul",
    extension: "419877",
    category: "Clínico",
  },
  {
    name: "Enfermera (Cinthya Muñoz) Coord.",
    department: "Sector Azul",
    extension: "419879",
    category: "Clínico",
  },
  {
    name: "Enfermera (Jorge Burgos)",
    department: "Sector Azul",
    extension: "419876",
    category: "Clínico",
  },
  {
    name: "Nutricionista (Vannia Alarcon)",
    department: "Sector Azul",
    extension: "419839",
    category: "Clínico",
  },
  {
    name: "Matrona (Pilar Sanhueza)",
    department: "Sector Azul",
    extension: "419872",
    category: "Clínico",
  },

  // Sector Verde
  {
    name: "Grupal (Hector Solar - Vivian Medina)",
    department: "Sector Verde",
    extension: "419834",
    category: "Clínico",
  },
  {
    name: "SOME (Elsa Paredes)",
    department: "Sector Verde",
    extension: "419880",
    category: "Administrativo",
  },
  {
    name: "SOME (Francisco Salazar)",
    department: "Sector Verde",
    extension: "419889",
    category: "Administrativo",
  },
  {
    name: "Médico (Dr. Belmar)",
    department: "Sector Verde",
    extension: "419824",
    category: "Clínico",
  },
  {
    name: "Médico (Dra. Jarufe)",
    department: "Sector Verde",
    extension: "419831",
    category: "Clínico",
  },
  {
    name: "Dental (Dra. Barrera - Dr. Acuña)",
    department: "Sector Verde",
    extension: "419838",
    category: "Clínico",
  },
  {
    name: "Matrona (Pamela Perez)",
    department: "Sector Verde",
    extension: "419837",
    category: "Clínico",
  },
  {
    name: "Matrona (Dayana Cartes)",
    department: "Sector Verde",
    extension: "419828",
    category: "Clínico",
  },
  {
    name: "Enfermera (Marioly Ramirez)",
    department: "Sector Verde",
    extension: "419833",
    category: "Clínico",
  },
  {
    name: "Enfermera (Tatiana Vallejo)",
    department: "Sector Verde",
    extension: "419836",
    category: "Clínico",
  },
  {
    name: "Nutricionista (Claudia Silva)",
    department: "Sector Verde",
    extension: "419835",
    category: "Clínico",
  },
  {
    name: "Médico (Dra. Diaz)",
    department: "Sector Verde",
    extension: "419832",
    category: "Clínico",
  },

  // Transversal Amarillo
  {
    name: "SOME Transversal (Katy - Marcela)",
    department: "Transversal Amarillo",
    extension: "419863",
    category: "Administrativo",
  },
  {
    name: "Sala IRA (Carlos S.)",
    department: "Transversal Amarillo",
    extension: "419885",
    category: "Clínico",
  },
  {
    name: "Sala ERA (Julio E. - Ma José Farías)",
    department: "Transversal Amarillo",
    extension: "419883",
    category: "Clínico",
  },
  {
    name: "Vacunatorio (Ángela Rodriguez)",
    department: "Transversal Amarillo",
    extension: "419884",
    category: "Clínico",
  },
  {
    name: "Procedimientos (Pamela - Loreto - Adriana)",
    department: "Transversal Amarillo",
    extension: "419869",
    category: "Clínico",
  },
  {
    name: "Exámenes/Electro (Érika S. - Ninoska D.)",
    department: "Transversal Amarillo",
    extension: "419860",
    category: "Clínico",
  },
  {
    name: "Farmacia (Yusset-Nathalie-Magda-Cathi)",
    department: "Transversal Amarillo",
    extension: "419864",
    category: "Clínico",
  },
  {
    name: "Leche (Ruth S./Febe V.)",
    department: "Transversal Amarillo",
    extension: "419861",
    category: "Clínico",
  },
  {
    name: "Químico Farmacéutico (Maca + Fran)",
    department: "Transversal Amarillo",
    extension: "419862",
    category: "Clínico",
  },
  {
    name: "Esterilización (Erna V - Astrid S.)",
    department: "Transversal Amarillo",
    extension: "419868",
    category: "Clínico",
  },
  {
    name: "Matrona Ecógrafo (Sandra Parra)",
    department: "Transversal Amarillo",
    extension: "419901",
    category: "Clínico",
  },
  {
    name: "Interconsultas (Loreto Silva)",
    department: "Transversal Amarillo",
    extension: "419908",
    category: "Administrativo",
  },
  {
    name: "Radiografías (Angela Pedraza)",
    department: "Transversal Amarillo",
    extension: "419825",
    category: "Clínico",
  },

  // Administración
  {
    name: "Directora",
    department: "Administración",
    extension: "419903",
    category: "Dirección",
  },
  {
    name: "Secretaria (Jéssica Figueroa)",
    department: "Administración",
    extension: "419905",
    category: "Administrativo",
  },
  {
    name: "A. Administrativa",
    department: "Administración",
    extension: "419909",
    category: "Administrativo",
  },
  {
    name: "A. Técnica",
    department: "Administración",
    extension: "419906",
    category: "Administrativo",
  },
  {
    name: "A. Salud Familiar",
    department: "Administración",
    extension: "419904",
    category: "Administrativo",
  },
  {
    name: "OIRS (Natalia San Miguel)",
    department: "Administración",
    extension: "419907",
    category: "Administrativo",
  },
  {
    name: "Percápita (Pamela Alarcon/ Erty Montecino)",
    department: "Administración",
    extension: "419902",
    category: "Administrativo",
  },
  {
    name: "Apoyo Adm (Marcelo Valdebenito/ Carol Rodriguez)",
    department: "Administración",
    extension: "419820",
    category: "Administrativo",
  },
  {
    name: "Agenda (Jaime Reyes)",
    department: "Administración",
    extension: "419881",
    category: "Administrativo",
  },
  {
    name: "Agenda (Camila Riquelme)",
    department: "Administración",
    extension: "419882",
    category: "Administrativo",
  },
  {
    name: "Agenda (Sandra Sandaña)",
    department: "Administración",
    extension: "419867",
    category: "Administrativo",
  },
  {
    name: "Agenda (Sandra Millar)",
    department: "Administración",
    extension: "419887",
    category: "Administrativo",
  },
  {
    name: "Agenda (Ricardo Roa)",
    department: "Administración",
    extension: "419843",
    category: "Administrativo",
  },
  {
    name: "Calidad (Laura Campos)",
    department: "Administración",
    extension: "419886",
    category: "Administrativo",
  },

  // Planta Baja
  {
    name: "Estadística (Carmen - Claudia - Patricio)",
    department: "Planta Baja",
    extension: "419844",
    category: "Administrativo",
  },
  {
    name: "SIGGES (Alejandra - M. Isabel - Francesca)",
    department: "Planta Baja",
    extension: "419845",
    category: "Administrativo",
  },
  {
    name: "Químico (Tatiana / Alejandro)",
    department: "Planta Baja",
    extension: "419894",
    category: "Clínico",
  },
  {
    name: "Informático (Fernando Garrido)",
    department: "Planta Baja",
    extension: "419900",
    category: "Soporte",
  },
  {
    name: "Bodega (Patricio Contreras)",
    department: "Planta Baja",
    extension: "419842",
    category: "Logística",
  },
  {
    name: "Bodega",
    department: "Planta Baja",
    extension: "419841",
    category: "Logística",
  },
  {
    name: "Encarg. Participación (Magaly)",
    department: "Planta Baja",
    extension: "419899",
    category: "Administrativo",
  },
  {
    name: "Sala UC",
    department: "Planta Baja",
    extension: "419849",
    category: "Clínico",
  },
  {
    name: "Salon Carlos Alvarez",
    department: "Planta Baja",
    extension: "419848",
    category: "General",
  },
  {
    name: "Archivo",
    department: "Planta Baja",
    extension: "419840",
    category: "Administrativo",
  },
  {
    name: "Apoyo Compra Farm.",
    department: "Planta Baja",
    extension: "419846",
    category: "Administrativo",
  },
  {
    name: "Sala Semillero",
    department: "Planta Baja",
    extension: "419847",
    category: "General",
  },

  // Transversal
  {
    name: "Podóloga (Florcinia Toledo)",
    department: "Transversal",
    extension: "414661",
    category: "Clínico",
  },
  {
    name: "Semillero 1",
    department: "Transversal",
    extension: "419865",
    category: "General",
  },
  {
    name: "Semillero 2 (Cirugía Menor)",
    department: "Transversal",
    extension: "419866",
    category: "Clínico",
  },
  {
    name: "Sala Rehabilitación (CCR)",
    department: "Transversal",
    extension: "419890",
    category: "Clínico",
  },
  {
    name: "IVADEC (Pilar Alarcon)",
    department: "Transversal",
    extension: "419891",
    category: "Clínico",
  },
  {
    name: "Dental (Marcela C.)",
    department: "Transversal",
    extension: "419892",
    category: "Clínico",
  },
  {
    name: "Box USS Médico 1 (Dr. Cuevas)",
    department: "Transversal",
    extension: "419895",
    category: "Clínico",
  },
  {
    name: "Box USS Médico 2 (Dr. Villarroel)",
    department: "Transversal",
    extension: "419896",
    category: "Clínico",
  },
  {
    name: "Box USS Médico 3 (Dr. Ponce)",
    department: "Transversal",
    extension: "419898",
    category: "Clínico",
  },
  {
    name: "EMP",
    department: "Transversal",
    extension: "419897",
    category: "Clínico",
  },

  // SAR
  {
    name: "Admisión SAR (Ana Maria Flores / Sandro Reyes)",
    department: "SAR",
    extension: "414650",
    category: "SAR",
  },
  {
    name: "Box Reanimación",
    department: "SAR",
    extension: "414652",
    category: "SAR",
  },
  {
    name: "Box Categorización",
    department: "SAR",
    extension: "414651",
    category: "SAR",
  },
  {
    name: "Of. Coordinadora / Carabineros",
    department: "SAR",
    extension: "414653",
    category: "SAR",
  },
  {
    name: "Box Alcoholemia",
    department: "SAR",
    extension: "414654",
    category: "SAR",
  },
  {
    name: "Box RX. (Paula Villagran)",
    department: "SAR",
    extension: "414656",
    category: "SAR",
  },
  {
    name: "Sala de Atención",
    department: "SAR",
    extension: "414657",
    category: "SAR",
  },
  {
    name: "Botiquín Fcia.",
    department: "SAR",
    extension: "414658",
    category: "SAR",
  },

  // Otros / Externos
  {
    name: "Call Center Adultos Mayores",
    department: "Externos",
    extension: "41-327 98 87",
    category: "Servicios",
  },
  {
    name: "UAPO",
    department: "Externos",
    extension: "9-40183931",
    category: "Servicios",
  },
  {
    name: "Farmacia Popular",
    department: "Externos",
    extension: "9-44152314",
    category: "Servicios",
  },
  {
    name: "Óptica Popular Tomé",
    department: "Externos",
    extension: "9-39517543",
    category: "Servicios",
  },
  {
    name: "CECOSF El Santo",
    department: "Externos",
    extension: "9-57797916",
    category: "Red",
  },
  {
    name: "CECOSF Cerro Estanque",
    department: "Externos",
    extension: "41-3279814",
    category: "Red",
  },
  {
    name: "Hospital Tomé",
    department: "Red Salud",
    extension: "41-2724950",
    category: "Red",
  },
  {
    name: "Hospital Higueras",
    department: "Red Salud",
    extension: "41-2688516",
    category: "Red",
  },
  {
    name: "Hospital Penco Lirquén",
    department: "Red Salud",
    extension: "41-2724800",
    category: "Red",
  },
  {
    name: "Hospital Regional",
    department: "Red Salud",
    extension: "41-2722500",
    category: "Red",
  },
  {
    name: "CESFAM Bellavista",
    department: "Red Salud",
    extension: "41-2209748",
    category: "Red",
  },
  {
    name: "CESFAM Dichato",
    department: "Red Salud",
    extension: "9-57797865",
    category: "Red",
  },
];

interface PhoneDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PhoneDirectoryModal({
  isOpen,
  onClose,
}: PhoneDirectoryModalProps) {
  const [search, setSearch] = React.useState("");
  const [copied, setCopied] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const normalize = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filteredContacts = contacts.filter(
    (c) =>
      normalize(c.name).includes(normalize(search)) ||
      normalize(c.department).includes(normalize(search)) ||
      c.extension.includes(search)
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2.5 rounded-full text-blue-600">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Directorio Telefónico
              </h2>
              <p className="text-sm text-slate-500">CESFAM Dr. Alberto Reyes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-yellow-50 px-4 py-3 border-b border-yellow-100 flex items-start gap-3">
          <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">Llamadas desde el exterior:</span>{" "}
            Marcar <strong>41 327</strong> + los últimos 4 dígitos del anexo.
          </p>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, sector o número..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 bg-slate-50/50">
          {filteredContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <Phone className="h-10 w-10 mb-2 opacity-20" />
              <p>No se encontraron contactos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {filteredContacts.map((contact, idx) => (
                <div
                  key={idx}
                  className="group flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm",
                        contact.department.includes("Rojo")
                          ? "bg-red-500"
                          : contact.department.includes("Azul")
                          ? "bg-blue-500"
                          : contact.department.includes("Verde")
                          ? "bg-green-500"
                          : contact.department.includes("Amarillo")
                          ? "bg-yellow-500"
                          : "bg-slate-400"
                      )}
                    >
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-base">
                        {contact.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-xs font-medium",
                            contact.department.includes("Rojo")
                              ? "bg-red-50 text-red-700"
                              : contact.department.includes("Azul")
                              ? "bg-blue-50 text-blue-700"
                              : contact.department.includes("Verde")
                              ? "bg-green-50 text-green-700"
                              : contact.department.includes("Amarillo")
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-slate-100 text-slate-600"
                          )}
                        >
                          {contact.department}
                        </span>
                        {contact.category && (
                          <span className="text-xs text-slate-400">
                            • {contact.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 font-bold rounded-lg hover:bg-blue-100 transition-colors group-hover:scale-105 active:scale-95 whitespace-nowrap"
                      onClick={() => copyToClipboard(contact.extension)}
                      title="Copiar Anexo"
                    >
                      <Phone className="h-4 w-4" />
                      {contact.extension}
                    </button>
                    {copied === contact.extension && (
                      <span className="absolute right-20 bg-black/75 text-white text-xs px-2 py-1 rounded animate-fade-in z-10">
                        Copiado
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-400">
          Presiona{" "}
          <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-500 font-sans mx-1">
            ESC
          </kbd>{" "}
          para cerrar
        </div>
      </div>
    </div>
  );
}
