import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/permissions";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") as string | null;
    const featured = searchParams.get("featured");

    const posts = await prisma.post.findMany({
      where: {
        ...(status && { status }),
        ...(featured === "true" && { featured: true }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        media: true,
      },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Error al obtener posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireEditor();
    const body = await request.json();

    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        description: body.description,
        status: body.status || "DRAFT",
        featured: body.featured || false,
        order: body.order || 0,
        authorId: user.id,
        mediaId: body.mediaId || null,
        publishedAt: body.status === "PUBLISHED" ? new Date() : null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        media: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear post" },
      { status: 500 }
    );
  }
}
