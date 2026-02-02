import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Interceptar uploads a /api/media para validar tamaño
  if (request.method === "POST" && request.nextUrl.pathname === "/api/media") {
    const contentLength = request.headers.get("content-length");
    if (contentLength) {
      const sizeInBytes = parseInt(contentLength, 10);
      const sizeInMB = sizeInBytes / (1024 * 1024);

      if (sizeInMB > 100) {
        return NextResponse.json(
          { error: "Archivo demasiado grande. Máximo permitido: 100MB" },
          { status: 413 },
        );
      }
    }
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;
  const isInformaticaRoute = pathname.startsWith("/informatica");
  const isLoginRoute = pathname.startsWith("/login");
  const isApiAuthRoute = pathname.startsWith("/api/auth");
  const isApiRoute = pathname.startsWith("/api/");

  // 1. Definir rutas públicas (solo login y assets)
  const isPublicRoute =
    pathname === "/login" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/) ||
    pathname.startsWith("/api/auth"); // Permitir auth endpoints

  // 2. Si es ruta pública, permitir
  if (isPublicRoute) {
    // Si ya tiene sesión y va a login, redirigir al home
    if (pathname === "/login" && token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 3. Si no tiene token, redirigir a login
  if (!token) {
    if (isApiRoute) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 4. Verificar cambio de contraseña obligatorio
  // Si debe cambiar contraseña y NO está en /change-password (ni en api de cambio), redirigir
  if (
    token.mustChangePassword &&
    pathname !== "/change-password" &&
    pathname !== "/api/user/change-password"
  ) {
    return NextResponse.redirect(new URL("/change-password", request.url));
  }

  // 5. Si NO debe cambiar contraseña pero intenta entrar a /change-password, redirigir a home
  if (!token.mustChangePassword && pathname === "/change-password") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 6. Proteger rutas de administración (/admin y /informatica)
  if (pathname.startsWith("/admin") || pathname.startsWith("/informatica")) {
    const role = (token as any).role;
    if (role !== "ADMIN" && role !== "EDITOR") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|api/media|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
