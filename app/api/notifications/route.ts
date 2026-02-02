import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Obtener notificaciones
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const whereClause: any = {
      OR: [
        { global: true },
        ...(session?.user?.id ? [{ userId: session.user.id }] : []),
      ],
    };

    if (unreadOnly) {
      whereClause.read = false;
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: limit ? parseInt(limit) : 20,
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Error al obtener notificaciones" },
      { status: 500 },
    );
  }
}

// POST - Crear una notificación
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { title, message, type, link, userId, global } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: "Título y mensaje son requeridos" },
        { status: 400 },
      );
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type: type || "INFO",
        link: link || null,
        userId: global ? null : userId || null,
        global: global || false,
      },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Error al crear notificación" },
      { status: 500 },
    );
  }
}
