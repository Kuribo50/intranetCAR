import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";

// PATCH: Actualizar establecimiento
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const body = await request.json();
    const { name, order, active, address, mediaId } = body;

    const existing = await prisma.establecimiento.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Establecimiento no encontrado" },
        { status: 404 },
      );
    }

    // Verificar nombre único si se cambia
    if (name && name !== existing.name) {
      const duplicate = await prisma.establecimiento.findUnique({
        where: { name },
      });
      if (duplicate) {
        return NextResponse.json(
          { error: "Ya existe un establecimiento con este nombre" },
          { status: 400 },
        );
      }
    }

    const establecimiento = await prisma.establecimiento.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
        ...(address !== undefined && { address }),
        ...(mediaId !== undefined && { mediaId }),
      },
    });

    return NextResponse.json(establecimiento);
  } catch (error: any) {
    console.error("Error updating establecimiento:", error);
    if (
      error.message === "No autenticado" ||
      error.message === "No tienes permisos para esta acción"
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Error al actualizar establecimiento" },
      { status: 500 },
    );
  }
}

// DELETE: Eliminar establecimiento
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;

    // Verificar si hay usuarios usando este establecimiento
    const usersCount = await prisma.user.count({
      where: { establecimientoId: id },
    });

    if (usersCount > 0) {
      return NextResponse.json(
        {
          error: `No se puede eliminar. Hay ${usersCount} usuario(s) asignado(s) a este establecimiento`,
        },
        { status: 400 },
      );
    }

    await prisma.establecimiento.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Establecimiento eliminado" });
  } catch (error: any) {
    console.error("Error deleting establecimiento:", error);
    if (
      error.message === "No autenticado" ||
      error.message === "No tienes permisos para esta acción"
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Error al eliminar establecimiento" },
      { status: 500 },
    );
  }
}
