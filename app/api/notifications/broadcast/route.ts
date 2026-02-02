import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST - Crear notificaciones broadcast para REMINDER
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { title, message, eventId, scheduleFor } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: "Título y mensaje son requeridos" },
        { status: 400 },
      );
    }

    const scheduleDate = new Date(scheduleFor);
    const now = new Date();

    // Determinar si es inmediato o programado
    const isImmediate = scheduleDate <= now;

    // Obtener TODOS los usuarios activos
    const users = await prisma.user.findMany({
      where: { active: true },
      select: { id: true },
    });

    // Crear notificación para cada usuario
    const notifications = await Promise.all(
      users.map((user) =>
        prisma.notification.create({
          data: {
            id: `reminder-${eventId}-${user.id}-${Date.now()}`,
            title,
            message,
            type: "REMINDER",
            userId: user.id,
            read: false,
            link: eventId ? `/admin/calendario?event=${eventId}` : null,
          },
        }),
      ),
    );

    return NextResponse.json({
      success: true,
      count: notifications.length,
      immediate: isImmediate,
      message: isImmediate
        ? `Notificación enviada a ${notifications.length} usuarios`
        : `Notificación programada para ${notifications.length} usuarios`,
    });
  } catch (error) {
    console.error("Error creating broadcast notifications:", error);
    return NextResponse.json(
      { error: "Error al crear notificaciones" },
      { status: 500 },
    );
  }
}
