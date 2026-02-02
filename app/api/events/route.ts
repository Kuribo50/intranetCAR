import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/permissions";
import { randomUUID } from "crypto";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") as string | null;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const events = await prisma.event.findMany({
      where: {
        ...(type && { type }),
        ...(startDate && {
          startDate: {
            gte: new Date(startDate),
          },
        }),
        ...(endDate && {
          startDate: {
            lte: new Date(endDate),
          },
        }),
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
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Error al obtener eventos" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireEditor();
    const body = await request.json();

    const event = await prisma.event.create({
      data: {
        id: randomUUID(),
        title: body.title,
        description: body.description,
        type: body.type || "EVENT",
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        allDay: body.allDay || false,
        location: body.location,
        estamento: body.estamento,
        programa: body.programa,
        authorId: user.id,
        mediaId: body.mediaId || null,
        updatedAt: new Date(),
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

    return NextResponse.json(event, { status: 201 });
  } catch (error: any) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear evento" },
      { status: 500 },
    );
  }
}
