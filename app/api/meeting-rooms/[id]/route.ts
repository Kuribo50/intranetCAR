import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Obtener una sala específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const room = await prisma.meetingRoom.findUnique({
      where: { id },
      include: {
        User: {
          select: { id: true, name: true },
        },
        Establecimiento: true,
        Media: true,
      },
    });

    if (!room) {
      return NextResponse.json(
        { error: "Sala no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ...room,
      amenities: JSON.parse(room.amenities),
    });
  } catch (error) {
    console.error("Error fetching meeting room:", error);
    return NextResponse.json(
      { error: "Error al obtener sala" },
      { status: 500 },
    );
  }
}

// PATCH - Actualizar sala
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verificar permisos de administrador
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No tienes permisos para esta acción" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const data = await request.json();

    const room = await prisma.meetingRoom.update({
      where: { id },
      data: {
        name: data.name,
        capacity: data.capacity,
        amenities: data.amenities ? JSON.stringify(data.amenities) : undefined,
        color: data.color,
        icon: data.icon,
        description: data.description,
        active: data.active,
        order: data.order,
        establecimientoId: data.establecimientoId,
        mediaId: data.mediaId,
      },
    });

    return NextResponse.json({
      ...room,
      amenities: JSON.parse(room.amenities),
    });
  } catch (error) {
    console.error("Error updating meeting room:", error);
    return NextResponse.json(
      { error: "Error al actualizar sala" },
      { status: 500 },
    );
  }
}

// DELETE - Eliminar sala
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Solo admin puede eliminar" },
        { status: 403 },
      );
    }

    const { id } = await params;

    await prisma.meetingRoom.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting meeting room:", error);
    return NextResponse.json(
      { error: "Error al eliminar sala" },
      { status: 500 },
    );
  }
}
