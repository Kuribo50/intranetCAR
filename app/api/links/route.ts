import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/permissions";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const active = searchParams.get("active");

    const links = await prisma.link.findMany({
      where: {
        ...(category && { category }),
        ...(active !== null && { active: active === "true" }),
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
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json(
      { error: "Error al obtener enlaces" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireEditor();
    const body = await request.json();

    const link = await prisma.link.create({
      data: {
        title: body.title,
        description: body.description,
        url: body.url,
        icon: body.icon,
        category: body.category,
        backgroundColor: body.backgroundColor,
        imageSize: body.imageSize || 0,
        order: body.order || 0,
        active: body.active !== undefined ? body.active : true,
        authorId: user.id,
        mediaId: body.mediaId || null,
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

    return NextResponse.json(link, { status: 201 });
  } catch (error: any) {
    console.error("Error creating link:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear enlace" },
      { status: 500 },
    );
  }
}
