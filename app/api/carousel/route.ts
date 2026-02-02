import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/permissions";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const active = searchParams.get("active");

    const where: any = {};
    if (active === "true") {
      where.active = true;
    }

    const carouselImages = await prisma.carouselImage.findMany({
      where,
      include: {
        Media: {
          select: {
            id: true,
            filename: true,
            alt: true,
            type: true,
            mimeType: true,
          },
        },
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(carouselImages);
  } catch (error) {
    console.error("Error fetching carousel images:", error);
    return NextResponse.json(
      { error: "Error al obtener imágenes del carrusel" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireEditor();
    const body = await request.json();

    const carouselImage = await prisma.carouselImage.create({
      data: {
        id: uuidv4(),
        title: body.title,
        description: body.description,
        linkUrl: body.linkUrl || null,
        linkType: body.linkType || null,
        order: body.order ?? 0,
        active: body.active ?? true,
        pinned: body.pinned ?? false,
        autoPlayDuration: body.autoPlayDuration ?? 5,
        mediaId: body.mediaId,
        authorId: user.id,
        updatedAt: new Date(),
      },
      include: {
        Media: {
          select: {
            id: true,
            filename: true,
            alt: true,
          },
        },
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(carouselImage, { status: 201 });
  } catch (error: any) {
    console.error("Error creating carousel image:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear imagen del carrusel" },
      { status: 500 },
    );
  }
}
