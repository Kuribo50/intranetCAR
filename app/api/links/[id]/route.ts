import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEditor, requireAdmin } from "@/lib/permissions";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  try {
    const user = await requireEditor();
    const body = await request.json();

    const existingLink = await prisma.link.findUnique({
      where: { id: params.id },
    });

    if (!existingLink) {
      return NextResponse.json(
        { error: "Enlace no encontrado" },
        { status: 404 },
      );
    }

    if (existingLink.authorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No tienes permisos para editar este enlace" },
        { status: 403 },
      );
    }

    const link = await prisma.link.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        url: body.url,
        icon: body.icon,
        category: body.category,
        backgroundColor: body.backgroundColor,
        imageSize: body.imageSize,
        order: body.order,
        active: body.active,
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

    return NextResponse.json(link);
  } catch (error: any) {
    console.error("Error updating link:", error);
    return NextResponse.json(
      { error: error.message || "Error al actualizar enlace" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  try {
    const user = await requireEditor();
    const body = await request.json();

    const existingLink = await prisma.link.findUnique({
      where: { id: params.id },
    });

    if (!existingLink) {
      return NextResponse.json(
        { error: "Enlace no encontrado" },
        { status: 404 },
      );
    }

    if (existingLink.authorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No tienes permisos para editar este enlace" },
        { status: 403 },
      );
    }

    const link = await prisma.link.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        url: body.url,
        icon: body.icon,
        category: body.category,
        backgroundColor: body.backgroundColor,
        imageSize: body.imageSize,
        order: body.order,
        active: body.active,
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

    return NextResponse.json(link);
  } catch (error: any) {
    console.error("Error updating link:", error);
    return NextResponse.json(
      { error: error.message || "Error al actualizar enlace" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  try {
    await requireAdmin();
    const link = await prisma.link.findUnique({
      where: { id: params.id },
      include: { Media: true },
    });

    if (!link) {
      return NextResponse.json(
        { error: "Enlace no encontrado" },
        { status: 404 },
      );
    }

    // Eliminar archivo asociado si existe
    if (link.Media) {
      const { deleteFile } = await import("@/lib/files");
      await deleteFile(link.Media.path);
      await prisma.media.delete({ where: { id: link.Media.id } });
    }

    await prisma.link.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Enlace eliminado correctamente" });
  } catch (error: any) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      { error: error.message || "Error al eliminar enlace" },
      { status: 500 },
    );
  }
}
