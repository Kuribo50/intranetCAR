import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";

// PATCH: Actualizar estamento
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const body = await request.json();
    const { name, order, active } = body;

    const existing = await prisma.estamento.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Estamento no encontrado" },
        { status: 404 },
      );
    }

    // Verificar nombre único si se cambia
    if (name && name !== existing.name) {
      const duplicate = await prisma.estamento.findUnique({
        where: { name },
      });
      if (duplicate) {
        return NextResponse.json(
          { error: "Ya existe un estamento con este nombre" },
          { status: 400 },
        );
      }
    }

    const estamento = await prisma.estamento.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(estamento);
  } catch (error: any) {
    console.error("Error updating estamento:", error);
    if (
      error.message === "No autenticado" ||
      error.message === "No tienes permisos para esta acción"
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Error al actualizar estamento" },
      { status: 500 },
    );
  }
}

// DELETE: Eliminar estamento
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;

    // Verificar si hay usuarios usando este estamento
    const usersCount = await prisma.user.count({
      where: { estamentoId: id },
    });

    if (usersCount > 0) {
      return NextResponse.json(
        {
          error: `No se puede eliminar. Hay ${usersCount} usuario(s) asignado(s) a este estamento`,
        },
        { status: 400 },
      );
    }

    await prisma.estamento.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Estamento eliminado" });
  } catch (error: any) {
    console.error("Error deleting estamento:", error);
    if (
      error.message === "No autenticado" ||
      error.message === "No tienes permisos para esta acción"
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Error al eliminar estamento" },
      { status: 500 },
    );
  }
}
