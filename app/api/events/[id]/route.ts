import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEditor, requireAdmin } from "@/lib/permissions";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireEditor();
    const body = await request.json();
    const { id } = await params;

    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 },
      );
    }

    if (existingEvent.authorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No tienes permisos para editar este evento" },
        { status: 403 },
      );
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        type: body.type,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        allDay: body.allDay,
        location: body.location,
        estamento: body.estamento,
        programa: body.programa,
        mediaId: body.mediaId,
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        Media: true,
      },
    });

    return NextResponse.json(event);
  } catch (error: any) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: error.message || "Error al actualizar evento" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: { Media: true },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 },
      );
    }

    // Eliminar archivo asociado si existe
    if (event.Media) {
      const { deleteFile } = await import("@/lib/files");
      await deleteFile(event.Media.path);
      await prisma.media.delete({ where: { id: event.Media.id } });
    }

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Evento eliminado correctamente" });
  } catch (error: any) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: error.message || "Error al eliminar evento" },
      { status: 500 },
    );
  }
}
