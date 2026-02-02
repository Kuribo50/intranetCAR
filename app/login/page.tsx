"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Eye, EyeOff, ShieldCheck, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isDev = process.env.NODE_ENV === "development";

  // Función para formatear RUT automáticamente
  const formatRut = (value: string) => {
    // Eliminar todo lo que no sea número o K/k
    let cleaned = value.replace(/[^0-9kK]/g, "").toUpperCase();

    if (cleaned.length === 0) return "";

    // Separar el dígito verificador
    const dv = cleaned.slice(-1);
    let body = cleaned.slice(0, -1);

    // Formatear con puntos
    let formatted = "";
    while (body.length > 3) {
      formatted = "." + body.slice(-3) + formatted;
      body = body.slice(0, -3);
    }
    formatted = body + formatted;

    // Agregar guión y dígito verificador
    if (cleaned.length > 1) {
      return formatted + "-" + dv;
    }
    return cleaned;
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value);
    setRut(formatted);
  };

  // Función para login rápido en desarrollo
  const quickLogin = async (testRut: string, testPassword: string) => {
    setRut(testRut);
    setPassword(testPassword);
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        rut: testRut,
        password: testPassword,
        redirect: false,
      });
      if (!result?.error) {
        router.push("/");
        router.refresh();
      } else {
        setError("Credenciales incorrectas");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        rut,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenciales incorrectas");
      } else {
        const redirect = new URLSearchParams(window.location.search).get(
          "redirect",
        );
        router.push(redirect || "/");
        router.refresh();
      }
    } catch (err) {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Left Side: Login Form Area */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex-1 flex flex-col justify-center items-center px-8 sm:px-12 lg:px-20 py-12"
      >
        <div className="w-full max-w-md space-y-8">
          {/* Header Branding */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <ShieldCheck className="text-white h-8 w-8" />
              </div>
              <div>
                <span className="block text-slate-900 font-black tracking-tight text-xl leading-none">
                  Intranet CAR
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Bienvenidos
              </h1>
              <p className="text-slate-500 text-base leading-relaxed">
                Ingresa tus credenciales para acceder a la plataforma de gestión
                interna.
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  RUT de Usuario
                </label>
                <Input
                  type="text"
                  placeholder="12.345.678-9"
                  value={rut}
                  onChange={handleRutChange}
                  required
                  disabled={loading}
                  maxLength={12}
                  className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 h-12 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 h-12 rounded-xl pr-12 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100"
                >
                  <AlertCircle size={18} className="shrink-0" />
                  <span className="font-medium">{error}</span>
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 rounded-xl font-bold text-base shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
              >
                {loading ? "Verificando..." : "Ingresar"}
              </Button>
            </form>

            {/* Botones de acceso rápido - Solo en desarrollo */}
            {isDev && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2">
                  ⚡ Dev Mode
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => quickLogin("11.111.111-1", "admin123")}
                    disabled={loading}
                    className="text-xs h-8 flex-1"
                  >
                    Admin
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => quickLogin("22.222.222-2", "editor123")}
                    disabled={loading}
                    className="text-xs h-8 flex-1"
                  >
                    Editor
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => quickLogin("33.333.333-3", "user123")}
                    disabled={loading}
                    className="text-xs h-8 flex-1"
                  >
                    Usuario
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Asistencia TIC - Fuera del card */}
          <div className="w-full mt-6">
            <div className="flex items-center gap-3 text-slate-400 mb-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[10px] uppercase font-bold tracking-widest">
                Asistencia TIC
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-500">
              <Mail size={14} />
              <a
                href="mailto:martin.beroiza@disamtome.cl"
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                martin.beroiza@disamtome.cl
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            © 2026 CESFAM Dr. Alberto Reyes
          </p>
        </footer>
      </motion.div>

      {/* Right Side: Full Height Photo Frame */}
      <div className="hidden lg:flex flex-col justify-center items-center w-[55%] p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative w-full h-[90vh] rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/50"
        >
          {/* Background GIF */}
          <img
            src="/Video-Intro.gif"
            alt="Background Animation"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay sutil */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}
