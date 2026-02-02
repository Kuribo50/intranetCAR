// Phone Directory Contact Data
// Archivo separado para facilitar mantenimiento
import type React from "react";

export interface Contact {
  id: string;
  name: string;
  department: string;
  extension: string;
  category: string;
}

export const contacts: Contact[] = [
  // Sector Rojo
  {
    id: "1",
    name: "Grupal (Diego Villarroel - Marlen Castillo)",
    department: "Sector Rojo",
    extension: "419850",
    category: "Clínico",
  },
  {
    id: "2",
    name: "SOME (Juan Vasquez)",
    department: "Sector Rojo",
    extension: "419851",
    category: "Administrativo",
  },
  {
    id: "3",
    name: "SOME (Maria Jose Fierro)",
    department: "Sector Rojo",
    extension: "419852",
    category: "Administrativo",
  },
  {
    id: "4",
    name: "Médico (Dra. Acevedo)",
    department: "Sector Rojo",
    extension: "419857",
    category: "Clínico",
  },
  {
    id: "5",
    name: "Médico",
    department: "Sector Rojo",
    extension: "419853",
    category: "Clínico",
  },
  {
    id: "6",
    name: "Dental (Dra. Troncoso / TENS Marg A)",
    department: "Sector Rojo",
    extension: "419856",
    category: "Clínico",
  },
  {
    id: "7",
    name: "Matrona (Romina Mejias)",
    department: "Sector Rojo",
    extension: "419823",
    category: "Clínico",
  },
  {
    id: "8",
    name: "Matrona",
    department: "Sector Rojo",
    extension: "419822",
    category: "Clínico",
  },
  {
    id: "9",
    name: "Enfermera (Natalia Díaz)",
    department: "Sector Rojo",
    extension: "419858",
    category: "Clínico",
  },
  {
    id: "10",
    name: "Enfermero (Carlos Zambrano)",
    department: "Sector Rojo",
    extension: "419859",
    category: "Clínico",
  },
  {
    id: "11",
    name: "Nutricionista (Karen Olivares) Coord.",
    department: "Sector Rojo",
    extension: "419855",
    category: "Clínico",
  },
  {
    id: "12",
    name: "Médico (Dra. Pizarro)",
    department: "Sector Rojo",
    extension: "419855",
    category: "Clínico",
  },

  // Sector Azul
  {
    id: "13",
    name: "Grupal (Priscilla Hidalgo - Jovita Camaño)",
    department: "Sector Azul",
    extension: "419871",
    category: "Clínico",
  },
  {
    id: "14",
    name: "SOME (Juan David Velasquez)",
    department: "Sector Azul",
    extension: "419873",
    category: "Administrativo",
  },
  {
    id: "15",
    name: "SOME (Andrea Gonzalez)",
    department: "Sector Azul",
    extension: "419875",
    category: "Administrativo",
  },
  {
    id: "16",
    name: "Médico (Dra. Sanhueza)",
    department: "Sector Azul",
    extension: "419874",
    category: "Clínico",
  },
  {
    id: "17",
    name: "Médico (Dr. Ruiz)",
    department: "Sector Azul",
    extension: "419870",
    category: "Clínico",
  },
  {
    id: "18",
    name: "Dental (Dr. Luengo - Dr. Moraga)",
    department: "Sector Azul",
    extension: "419878",
    category: "Clínico",
  },
  {
    id: "19",
    name: "Matrona (Ingrid Peña)",
    department: "Sector Azul",
    extension: "419830",
    category: "Clínico",
  },
  {
    id: "20",
    name: "Médico (Antonia Rosales)",
    department: "Sector Azul",
    extension: "419877",
    category: "Clínico",
  },
  {
    id: "21",
    name: "Enfermera (Cinthya Muñoz) Coord.",
    department: "Sector Azul",
    extension: "419879",
    category: "Clínico",
  },
  {
    id: "22",
    name: "Enfermera (Jorge Burgos)",
    department: "Sector Azul",
    extension: "419876",
    category: "Clínico",
  },
  {
    id: "23",
    name: "Nutricionista (Vannia Alarcon)",
    department: "Sector Azul",
    extension: "419839",
    category: "Clínico",
  },
  {
    id: "24",
    name: "Matrona (Pilar Sanhueza)",
    department: "Sector Azul",
    extension: "419872",
    category: "Clínico",
  },

  // Sector Verde
  {
    id: "25",
    name: "Grupal (Hector Solar - Vivian Medina)",
    department: "Sector Verde",
    extension: "419834",
    category: "Clínico",
  },
  {
    id: "26",
    name: "SOME (Elsa Paredes)",
    department: "Sector Verde",
    extension: "419880",
    category: "Administrativo",
  },
  {
    id: "27",
    name: "SOME (Francisco Salazar)",
    department: "Sector Verde",
    extension: "419889",
    category: "Administrativo",
  },
  {
    id: "28",
    name: "Médico (Dr. Belmar)",
    department: "Sector Verde",
    extension: "419824",
    category: "Clínico",
  },
  {
    id: "29",
    name: "Médico (Dra. Jarufe)",
    department: "Sector Verde",
    extension: "419831",
    category: "Clínico",
  },
  {
    id: "30",
    name: "Dental (Dra. Barrera - Dr. Acuña)",
    department: "Sector Verde",
    extension: "419838",
    category: "Clínico",
  },
  {
    id: "31",
    name: "Matrona (Pamela Perez)",
    department: "Sector Verde",
    extension: "419837",
    category: "Clínico",
  },
  {
    id: "32",
    name: "Matrona (Dayana Cartes)",
    department: "Sector Verde",
    extension: "419828",
    category: "Clínico",
  },
  {
    id: "33",
    name: "Enfermera (Marioly Ramirez)",
    department: "Sector Verde",
    extension: "419833",
    category: "Clínico",
  },
  {
    id: "34",
    name: "Enfermera (Tatiana Vallejo)",
    department: "Sector Verde",
    extension: "419836",
    category: "Clínico",
  },
  {
    id: "35",
    name: "Nutricionista (Claudia Silva)",
    department: "Sector Verde",
    extension: "419835",
    category: "Clínico",
  },
  {
    id: "36",
    name: "Médico (Dra. Diaz)",
    department: "Sector Verde",
    extension: "419832",
    category: "Clínico",
  },

  // Transversal Amarillo
  {
    id: "37",
    name: "SOME Transversal (Katy - Marcela)",
    department: "Transversal Amarillo",
    extension: "419863",
    category: "Administrativo",
  },
  {
    id: "38",
    name: "Sala IRA (Carlos S.)",
    department: "Transversal Amarillo",
    extension: "419885",
    category: "Clínico",
  },
  {
    id: "39",
    name: "Sala ERA (Julio E. - Ma José Farías)",
    department: "Transversal Amarillo",
    extension: "419883",
    category: "Clínico",
  },
  {
    id: "40",
    name: "Vacunatorio (Ángela Rodriguez)",
    department: "Transversal Amarillo",
    extension: "419884",
    category: "Clínico",
  },
  {
    id: "41",
    name: "Procedimientos (Pamela - Loreto - Adriana)",
    department: "Transversal Amarillo",
    extension: "419869",
    category: "Clínico",
  },
  {
    id: "42",
    name: "Exámenes/Electro (Érika S. - Ninoska D.)",
    department: "Transversal Amarillo",
    extension: "419860",
    category: "Clínico",
  },
  {
    id: "43",
    name: "Farmacia (Yusset-Nathalie-Magda-Cathi)",
    department: "Transversal Amarillo",
    extension: "419864",
    category: "Clínico",
  },
  {
    id: "44",
    name: "Leche (Ruth S./Febe V.)",
    department: "Transversal Amarillo",
    extension: "419861",
    category: "Clínico",
  },
  {
    id: "45",
    name: "Químico Farmacéutico (Maca + Fran)",
    department: "Transversal Amarillo",
    extension: "419862",
    category: "Clínico",
  },
  {
    id: "46",
    name: "Esterilización (Erna V - Astrid S.)",
    department: "Transversal Amarillo",
    extension: "419868",
    category: "Clínico",
  },
  {
    id: "47",
    name: "Matrona Ecógrafo (Sandra Parra)",
    department: "Transversal Amarillo",
    extension: "419901",
    category: "Clínico",
  },
  {
    id: "48",
    name: "Interconsultas (Loreto Silva)",
    department: "Transversal Amarillo",
    extension: "419908",
    category: "Administrativo",
  },
  {
    id: "49",
    name: "Radiografías (Angela Pedraza)",
    department: "Transversal Amarillo",
    extension: "419825",
    category: "Clínico",
  },

  // Administración
  {
    id: "50",
    name: "Directora",
    department: "Administración",
    extension: "419903",
    category: "Dirección",
  },
  {
    id: "51",
    name: "Secretaria (Jéssica Figueroa)",
    department: "Administración",
    extension: "419905",
    category: "Administrativo",
  },
  {
    id: "52",
    name: "A. Administrativa",
    department: "Administración",
    extension: "419909",
    category: "Administrativo",
  },
  {
    id: "53",
    name: "A. Técnica",
    department: "Administración",
    extension: "419906",
    category: "Administrativo",
  },
  {
    id: "54",
    name: "A. Salud Familiar",
    department: "Administración",
    extension: "419904",
    category: "Administrativo",
  },
  {
    id: "55",
    name: "OIRS (Natalia San Miguel)",
    department: "Administración",
    extension: "419907",
    category: "Administrativo",
  },
  {
    id: "56",
    name: "Percápita (Pamela Alarcon/ Erty Montecino)",
    department: "Administración",
    extension: "419902",
    category: "Administrativo",
  },
  {
    id: "57",
    name: "Apoyo Adm (Marcelo Valdebenito/ Carol Rodriguez)",
    department: "Administración",
    extension: "419820",
    category: "Administrativo",
  },
  {
    id: "58",
    name: "Agenda (Jaime Reyes)",
    department: "Administración",
    extension: "419881",
    category: "Administrativo",
  },
  {
    id: "59",
    name: "Agenda (Camila Riquelme)",
    department: "Administración",
    extension: "419882",
    category: "Administrativo",
  },
  {
    id: "60",
    name: "Agenda (Sandra Sandaña)",
    department: "Administración",
    extension: "419867",
    category: "Administrativo",
  },
  {
    id: "61",
    name: "Agenda (Sandra Millar)",
    department: "Administración",
    extension: "419887",
    category: "Administrativo",
  },
  {
    id: "62",
    name: "Agenda (Ricardo Roa)",
    department: "Administración",
    extension: "419843",
    category: "Administrativo",
  },
  {
    id: "63",
    name: "Calidad (Laura Campos)",
    department: "Administración",
    extension: "419886",
    category: "Administrativo",
  },

  // Planta Baja
  {
    id: "64",
    name: "Estadística (Carmen - Claudia - Patricio)",
    department: "Planta Baja",
    extension: "419844",
    category: "Administrativo",
  },
  {
    id: "65",
    name: "SIGGES (Alejandra - M. Isabel - Francesca)",
    department: "Planta Baja",
    extension: "419845",
    category: "Administrativo",
  },
  {
    id: "66",
    name: "Químico (Tatiana / Alejandro)",
    department: "Planta Baja",
    extension: "419894",
    category: "Clínico",
  },
  {
    id: "67",
    name: "Informático (Fernando Garrido)",
    department: "Planta Baja",
    extension: "419900",
    category: "Soporte",
  },
  {
    id: "68",
    name: "Bodega (Patricio Contreras)",
    department: "Planta Baja",
    extension: "419842",
    category: "Logística",
  },
  {
    id: "69",
    name: "Bodega",
    department: "Planta Baja",
    extension: "419841",
    category: "Logística",
  },
  {
    id: "70",
    name: "Encarg. Participación (Magaly)",
    department: "Planta Baja",
    extension: "419899",
    category: "Administrativo",
  },
  {
    id: "71",
    name: "Sala UC",
    department: "Planta Baja",
    extension: "419849",
    category: "Clínico",
  },
  {
    id: "72",
    name: "Salon Carlos Alvarez",
    department: "Planta Baja",
    extension: "419848",
    category: "General",
  },
  {
    id: "73",
    name: "Archivo",
    department: "Planta Baja",
    extension: "419840",
    category: "Administrativo",
  },
  {
    id: "74",
    name: "Apoyo Compra Farm.",
    department: "Planta Baja",
    extension: "419846",
    category: "Administrativo",
  },
  {
    id: "75",
    name: "Sala Semillero",
    department: "Planta Baja",
    extension: "419847",
    category: "General",
  },

  // Transversal
  {
    id: "76",
    name: "Podóloga (Florcinia Toledo)",
    department: "Transversal",
    extension: "414661",
    category: "Clínico",
  },
  {
    id: "77",
    name: "Semillero 1",
    department: "Transversal",
    extension: "419865",
    category: "General",
  },
  {
    id: "78",
    name: "Semillero 2 (Cirugía Menor)",
    department: "Transversal",
    extension: "419866",
    category: "Clínico",
  },
  {
    id: "79",
    name: "Sala Rehabilitación (CCR)",
    department: "Transversal",
    extension: "419890",
    category: "Clínico",
  },
  {
    id: "80",
    name: "IVADEC (Pilar Alarcon)",
    department: "Transversal",
    extension: "419891",
    category: "Clínico",
  },
  {
    id: "81",
    name: "Dental (Marcela C.)",
    department: "Transversal",
    extension: "419892",
    category: "Clínico",
  },
  {
    id: "82",
    name: "Box USS Médico 1 (Dr. Cuevas)",
    department: "Transversal",
    extension: "419895",
    category: "Clínico",
  },
  {
    id: "83",
    name: "Box USS Médico 2 (Dr. Villarroel)",
    department: "Transversal",
    extension: "419896",
    category: "Clínico",
  },
  {
    id: "84",
    name: "Box USS Médico 3 (Dr. Ponce)",
    department: "Transversal",
    extension: "419898",
    category: "Clínico",
  },
  {
    id: "85",
    name: "EMP",
    department: "Transversal",
    extension: "419897",
    category: "Clínico",
  },

  // SAR
  {
    id: "86",
    name: "Admisión SAR (Ana Maria Flores / Sandro Reyes)",
    department: "SAR",
    extension: "414650",
    category: "SAR",
  },
  {
    id: "87",
    name: "Box Reanimación",
    department: "SAR",
    extension: "414652",
    category: "SAR",
  },
  {
    id: "88",
    name: "Box Categorización",
    department: "SAR",
    extension: "414651",
    category: "SAR",
  },
  {
    id: "89",
    name: "Of. Coordinadora / Carabineros",
    department: "SAR",
    extension: "414653",
    category: "SAR",
  },
  {
    id: "90",
    name: "Box Alcoholemia",
    department: "SAR",
    extension: "414654",
    category: "SAR",
  },
  {
    id: "91",
    name: "Box RX. (Paula Villagran)",
    department: "SAR",
    extension: "414656",
    category: "SAR",
  },
  {
    id: "92",
    name: "Sala de Atención",
    department: "SAR",
    extension: "414657",
    category: "SAR",
  },
  {
    id: "93",
    name: "Botiquín Fcia.",
    department: "SAR",
    extension: "414658",
    category: "SAR",
  },

  // Externos
  {
    id: "94",
    name: "Call Center Adultos Mayores",
    department: "Externos",
    extension: "41-327 98 87",
    category: "Servicios",
  },
  {
    id: "95",
    name: "UAPO",
    department: "Externos",
    extension: "9-40183931",
    category: "Servicios",
  },
  {
    id: "96",
    name: "Farmacia Popular",
    department: "Externos",
    extension: "9-44152314",
    category: "Servicios",
  },
  {
    id: "97",
    name: "Óptica Popular Tomé",
    department: "Externos",
    extension: "9-39517543",
    category: "Servicios",
  },
  {
    id: "98",
    name: "CECOSF El Santo",
    department: "Externos",
    extension: "9-57797916",
    category: "Red",
  },
  {
    id: "99",
    name: "CECOSF Cerro Estanque",
    department: "Externos",
    extension: "41-3279814",
    category: "Red",
  },

  // Red Salud
  {
    id: "100",
    name: "Hospital Tomé",
    department: "Red Salud",
    extension: "41-2724950",
    category: "Red",
  },
  {
    id: "101",
    name: "Hospital Higueras",
    department: "Red Salud",
    extension: "41-2688516",
    category: "Red",
  },
  {
    id: "102",
    name: "Hospital Penco Lirquén",
    department: "Red Salud",
    extension: "41-2724800",
    category: "Red",
  },
  {
    id: "103",
    name: "Hospital Regional",
    department: "Red Salud",
    extension: "41-2722500",
    category: "Red",
  },
  {
    id: "104",
    name: "CESFAM Bellavista",
    department: "Red Salud",
    extension: "41-2209748",
    category: "Red",
  },
  {
    id: "105",
    name: "CESFAM Dichato",
    department: "Red Salud",
    extension: "9-57797865",
    category: "Red",
  },
];

// Get unique departments
export const departments = Array.from(
  new Set(contacts.map((c) => c.department)),
);

// Department color mapping
export const getDepartmentColor = (department: string): string => {
  if (department.includes("Rojo"))
    return "bg-red-100 text-red-800 border-red-200";
  if (department.includes("Azul"))
    return "bg-blue-100 text-blue-800 border-blue-200";
  if (department.includes("Verde"))
    return "bg-green-100 text-green-800 border-green-200";
  if (department.includes("Amarillo"))
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (department === "SAR") return "bg-red-100 text-red-800 border-red-200";
  if (department === "Administración")
    return "bg-orange-100 text-orange-800 border-orange-200";
  if (department === "Planta Baja")
    return "bg-slate-100 text-slate-800 border-slate-200";
  if (department === "Transversal")
    return "bg-amber-100 text-amber-800 border-amber-200";
  if (department === "Externos")
    return "bg-purple-100 text-purple-800 border-purple-200";
  if (department === "Red Salud")
    return "bg-teal-100 text-teal-800 border-teal-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
};
// Department header style mapping (for grid view) - using inline styles to avoid Tailwind purging
export const getDepartmentHeaderStyle = (
  department: string,
): React.CSSProperties => {
  if (department.includes("Rojo"))
    return { backgroundColor: "#dc2626", color: "#ffffff" };
  if (department.includes("Azul"))
    return { backgroundColor: "#2563eb", color: "#ffffff" };
  if (department.includes("Verde"))
    return { backgroundColor: "#059669", color: "#ffffff" };
  if (department.includes("Amarillo"))
    return { backgroundColor: "#fbbf24", color: "#1e293b" };
  if (department === "SAR")
    return { backgroundColor: "#e11d48", color: "#ffffff" };
  if (department === "Administración")
    return { backgroundColor: "#f97316", color: "#ffffff" };
  if (department === "Planta Baja")
    return { backgroundColor: "#475569", color: "#ffffff" };
  if (department === "Transversal")
    return { backgroundColor: "#d97706", color: "#ffffff" };
  if (department === "Externos")
    return { backgroundColor: "#7c3aed", color: "#ffffff" };
  if (department === "Red Salud")
    return { backgroundColor: "#0d9488", color: "#ffffff" };
  return { backgroundColor: "#64748b", color: "#ffffff" };
};

// Keep the class version for backwards compatibility
export const getDepartmentHeaderColor = (department: string): string => {
  if (department.includes("Rojo")) return "bg-red-600 text-white";
  if (department.includes("Azul")) return "bg-blue-600 text-white";
  if (department.includes("Verde")) return "bg-emerald-600 text-white";
  if (department.includes("Amarillo")) return "bg-amber-400 text-slate-900";
  if (department === "SAR") return "bg-rose-600 text-white";
  if (department === "Administración") return "bg-orange-500 text-white";
  if (department === "Planta Baja") return "bg-slate-600 text-white";
  if (department === "Transversal") return "bg-amber-600 text-white";
  if (department === "Externos") return "bg-violet-600 text-white";
  if (department === "Red Salud") return "bg-teal-600 text-white";
  return "bg-slate-500 text-white";
};
