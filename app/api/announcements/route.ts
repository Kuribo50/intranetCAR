import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Obtener todos los anuncios activos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const type = searchParams.get("type");
    const includeExpired = searchParams.get("includeExpired") === "true";
    const includeInactive = searchParams.get("includeInactive") === "true";

    const whereClause: any = {};

    // Solo filtrar por active si no se pide incluir inactivos
    if (!includeInactive) {
      whereClause.active = true;
    }

    if (type) {
      whereClause.type = type;
    }

    if (!includeExpired) {
      // Para expiración, permitimos que se muestren los que vencen hoy
      // Ajustamos la fecha de comparación al inicio del día actual
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      whereClause.OR = [
        { expiresAt: null },
        { expiresAt: { gte: startOfDay } },
      ];
    }

    const announcements = await prisma.announcement.findMany({
      where: whereClause,
      include: {
        User: {
          select: { id: true, name: true },
        },
        Media: true,
      },
      orderBy: [
        { pinned: "desc" },
        { priority: "desc" },
        { createdAt: "desc" },
      ],
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Error al obtener anuncios" },
      { status: 500 },
    );
  }
}

// POST - Crear un nuevo anuncio
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, type, priority, pinned, expiresAt, mediaId } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Título y contenido son requeridos" },
        { status: 400 },
      );
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        type: type || "INFO",
        priority: priority || 0,
        pinned: pinned || false,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        authorId: session.user.id,
        mediaId: mediaId || null,
      },
      include: {
        User: {
          select: { id: true, name: true },
        },
        Media: true,
      },
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { error: "Error al crear anuncio" },
      { status: 500 },
    );
  }
}
