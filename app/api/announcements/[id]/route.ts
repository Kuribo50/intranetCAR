import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Obtener un anuncio específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const announcement = await prisma.announcement.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: { id: true, name: true },
        },
        media: true,
      },
    });

    if (!announcement) {
      return NextResponse.json(
        { error: "Anuncio no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("Error fetching announcement:", error);
    return NextResponse.json(
      { error: "Error al obtener anuncio" },
      { status: 500 },
    );
  }
}

// PUT - Actualizar un anuncio
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      content,
      type,
      priority,
      pinned,
      active,
      expiresAt,
      mediaId,
    } = body;

    const announcement = await prisma.announcement.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(type !== undefined && { type }),
        ...(priority !== undefined && { priority }),
        ...(pinned !== undefined && { pinned }),
        ...(active !== undefined && { active }),
        ...(expiresAt !== undefined && {
          expiresAt: expiresAt ? new Date(expiresAt) : null,
        }),
        ...(mediaId !== undefined && { mediaId }),
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
        media: true,
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json(
      { error: "Error al actualizar anuncio" },
      { status: 500 },
    );
  }
}

// DELETE - Eliminar un anuncio
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await prisma.announcement.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
      { error: "Error al eliminar anuncio" },
      { status: 500 },
    );
  }
}
