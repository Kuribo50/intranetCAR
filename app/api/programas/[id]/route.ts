import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";

// PATCH: Actualizar un programa
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { name, order, active } = body;

    const programa = await prisma.programa.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(programa);
  } catch (error: any) {
    console.error("Error updating programa:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Programa no encontrado" },
        { status: 404 },
      );
    }
    if (
      error.message === "No autenticado" ||
      error.message === "No tienes permisos para esta acción"
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Error al actualizar programa" },
      { status: 500 },
    );
  }
}

// DELETE: Eliminar un programa
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin();

    // Verificar si hay usuarios usando este programa
    const usersCount = await prisma.user.count({
      where: { programaId: params.id },
    });

    if (usersCount > 0) {
      return NextResponse.json(
        {
          error: `No se puede eliminar. Hay ${usersCount} usuario(s) asignados a este programa`,
        },
        { status: 400 },
      );
    }

    await prisma.programa.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting programa:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Programa no encontrado" },
        { status: 404 },
      );
    }
    if (
      error.message === "No autenticado" ||
      error.message === "No tienes permisos para esta acción"
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Error al eliminar programa" },
      { status: 500 },
    );
  }
}
