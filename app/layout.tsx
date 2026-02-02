import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { AdminProvider } from "@/contexts/AdminContext";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Intranet CESFAM Dr. Alberto Reyes",
  description: "Plataforma de gestión interna",
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head></head>
      <body
        className={cn(
          inter.className,
          "bg-slate-50 min-h-screen text-slate-900 antialiased",
        )}
      >
        <SessionProvider>
          <AdminProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Toaster richColors position="top-center" />
          </AdminProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
