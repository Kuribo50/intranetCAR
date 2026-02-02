"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Lock,
  AlertCircle,
  ShieldCheck,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";

export function AdminLogin() {
  const router = useRouter();
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md"
    >
      <Card className="shadow-2xl border-slate-200/50 backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-4 pb-6 border-b border-slate-100 items-center text-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-2">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              Panel de Administración
            </CardTitle>
            <CardDescription className="text-slate-500 mt-2">
              Ingrese sus credenciales para continuar
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-8 px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                RUT de Administrador
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="12.345.678-9"
                  value={rut}
                  onChange={handleRutChange}
                  required
                  disabled={loading}
                  maxLength={12}
                  className={`pl-10 h-11 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    error ? "border-red-300 bg-red-50 focus:ring-red-200" : ""
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className={`pl-10 pr-12 h-11 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    error ? "border-red-300 bg-red-50 focus:ring-red-200" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span className="font-medium">{error}</span>
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verificando...</span>
                </div>
              ) : (
                "Ingresar al Panel"
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
              Credenciales de Prueba
            </p>
            <div className="text-xs text-slate-400 space-y-1 font-mono bg-slate-50 py-2 rounded-lg">
              <p>Admin: 11.111.111-1 / admin123</p>
              <p>Editor: 22.222.222-2 / editor123</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-slate-400 text-xs mt-6">
        © 2026 Intranet CAR - Panel Administrativo
      </p>
    </motion.div>
  );
}
