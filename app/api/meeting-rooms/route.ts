import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Obtener todas las salas de reunión
export async function GET() {
  try {
    const rooms = await prisma.meetingRoom.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      include: {
        User: {
          select: { id: true, name: true },
        },
        Establecimiento: true,
        Media: true,
      },
    });

    // Parse amenities JSON string to array
    const roomsWithParsedAmenities = rooms.map((room) => ({
      ...room,
      amenities: JSON.parse(room.amenities),
    }));

    return NextResponse.json(roomsWithParsedAmenities);
  } catch (error) {
    console.error("Error fetching meeting rooms:", error);
    return NextResponse.json(
      { error: "Error al obtener salas de reunión" },
      { status: 500 },
    );
  }
}

// POST - Crear nueva sala de reunión
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Solo admin y editor pueden crear salas
    if (!["ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    const data = await request.json();

    const room = await prisma.meetingRoom.create({
      data: {
        name: data.name,
        capacity: data.capacity || 6,
        amenities: JSON.stringify(data.amenities || []),
        color: data.color || "from-blue-500 to-blue-600",
        icon: data.icon || "🏢",
        description: data.description,
        active: data.active ?? true,
        order: data.order || 0,
        authorId: session.user.id,
        establecimientoId: data.establecimientoId,
        mediaId: data.mediaId,
      },
    });

    return NextResponse.json({
      ...room,
      amenities: JSON.parse(room.amenities),
    });
  } catch (error) {
    console.error("Error creating meeting room:", error);
    return NextResponse.json(
      { error: "Error al crear sala de reunión" },
      { status: 500 },
    );
  }
}
