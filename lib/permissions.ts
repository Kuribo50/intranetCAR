import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

type UserRole = "ADMIN" | "EDITOR" | "USER";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role as UserRole)) {
    throw new Error("No tienes permisos para esta acción");
  }
  return user;
}

export async function requireAdmin() {
  return requireRole(["ADMIN"]);
}

export async function requireEditor() {
  return requireRole(["ADMIN", "EDITOR"]);
}

export function canEdit(role: string): boolean {
  return role === "ADMIN" || role === "EDITOR";
}

export function canDelete(role: string): boolean {
  return role === "ADMIN";
}
