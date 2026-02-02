import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import bcrypt from "bcryptjs";

// POST: Establecer nueva contraseña y marcar mustChangePassword = true
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "La contraseña es obligatoria" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 },
      );
    }

    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        mustChangePassword: true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message:
        "Contraseña restablecida correctamente. El usuario deberá cambiarla en su próximo inicio de sesión.",
    });
  } catch (error: any) {
    console.error("Error resetting password:", error);
    if (
      error.message === "No autenticado" ||
      error.message === "No tienes permisos para esta acción"
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Error al restablecer contraseña" },
      { status: 500 },
    );
  }
}
