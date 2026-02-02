"use client";

import { cn } from "@/lib/utils";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Globe,
  Youtube,
  Heart,
  Monitor,
  Users,
} from "lucide-react";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      {/* Top Section with Gradient Line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-primary to-blue-600" />

      <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand & Logo */}
          <div className="md:col-span-2 lg:col-span-1 flex flex-row gap-4 items-start justify-between">
            {/* Logos (Left Side - Swapped) */}
            <div className="flex flex-col gap-3 min-w-[120px] items-center pt-2">
              <Image
                src="/logo_disam.png"
                alt="Dirección de Salud Municipal Tomé"
                width={140}
                height={50}
                className="h-auto w-auto max-w-[140px]"
                style={{ width: "auto", height: "auto" }}
              />
              <Image
                src="/logoAcreditacion.png"
                alt="CESFAM Acreditado"
                width={100}
                height={35}
                className="h-auto w-auto max-w-[100px] rounded-sm opacity-90"
                style={{ width: "auto", height: "auto" }}
              />
            </div>

            {/* Branding & Social Links (Right Side - Swapped) */}
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white fill-current" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 leading-tight">
                  Intranet CAR
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px]">
                Aplicativos internos de gestión y recursos para el CESFAM Dr.
                Alberto Reyes.
              </p>

              <div className="flex gap-2 pt-1">
                <SocialButton
                  icon={Facebook}
                  href="https://www.facebook.com/profile.php?id=100067791033313"
                  label="Facebook"
                />
                <SocialButton
                  icon={Youtube}
                  href="https://www.youtube.com/channel/UCHkKgN4i2oe8uSx3w8VmeLA"
                  label="Youtube"
                />
                <SocialButton
                  icon={Globe}
                  href="https://disamtome.cl/#"
                  label="Web Oficial"
                />
              </div>
            </div>
          </div>

          {/* Column 2: Soporte Centros */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              <Monitor className="h-4 w-4 text-primary" />
              Soporte TI Centros
            </h3>
            <ul className="space-y-3">
              <ContactItem
                role="CESFAM Dr. Alberto Reyes"
                name="Martin Beroiza"
                email="martin.beroiza@disamtome.cl"
                colorClass="text-blue-600 dark:text-blue-400"
              />
              <ContactItem
                role="CESFAM Bellavista"
                name="Willis Orellana"
                email="willis.orellana@disamtome.cl"
                colorClass="text-emerald-600 dark:text-emerald-400"
              />
              <ContactItem
                role="CESFAM Dichato"
                name="Carla Vergara"
                email="carla.vergara@disamtome.cl"
                colorClass="text-purple-600 dark:text-purple-400"
              />
            </ul>
          </div>

          {/* Column 3: Administración */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              <Users className="h-4 w-4 text-primary" />
              Administración
            </h3>
            <ul className="space-y-3">
              <ContactItem
                role="Administrativo"
                name="Leandro Matamala Pino"
                email="leandro.matamala@disamtome.cl"
              />
              <ContactItem
                role="Administrativo"
                name="Gustavo Romero Retamal"
                email="gustavo.romero@disamtome.cl"
              />
              <ContactItem
                role="Administrativo"
                name="Fernando Garrido Carrillo"
                email="fernando.garrido@disamtome.cl"
              />
            </ul>
          </div>

          {/* Column 4: Ubicación & More */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Ubicación
            </h3>
            <div className="w-full h-56 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6406.178492097577!2d-72.96080645672791!3d-36.6001595521115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96684f105fd276f9%3A0xc4a654661505955b!2sCESFAM%20Doctor%20Alberto%20Reyes!5e0!3m2!1ses!2scl!4v1769104251938!5m2!1ses!2scl"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="mt-3 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Nueva Aldea 2720, Tomé</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-500 text-center md:text-left font-medium">
            Desarrollado por Unidad Informática Alberto Reyes - 2026
          </p>
          <div className="flex gap-6 text-xs text-slate-500 dark:text-slate-500 font-medium">
            <span className="opacity-50">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ContactItem({
  role,
  name,
  email,
  colorClass = "text-primary",
}: {
  role: string;
  name: string;
  email: string;
  colorClass?: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-1 h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400">
        <Users className="h-4 w-4" />
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            "text-xs font-bold uppercase tracking-wide",
            colorClass,
          )}
        >
          {role}
        </span>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {name}
        </span>
        <a
          href={`mailto:${email}`}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline transition-colors flex items-center gap-1 mt-0.5"
        >
          <Mail className="h-3 w-3" />
          {email}
        </a>
      </div>
    </li>
  );
}

function SocialButton({
  icon: Icon,
  href,
  label,
}: {
  icon: React.ElementType;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-primary hover:text-white transition-all duration-300"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

function FooterSimpleLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <a
        href={href}
        className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary transition-colors flex items-center gap-1"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Globe className="h-3 w-3" />
        {label}
      </a>
    </li>
  );
}
