import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEditor, requireAdmin, canDelete } from "@/lib/permissions";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
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

    if (!post) {
      return NextResponse.json({ error: "Post no encontrado" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Error al obtener post" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireEditor();
    const body = await request.json();

    const existingPost = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post no encontrado" }, { status: 404 });
    }

    // Solo el autor o admin puede editar
    if (existingPost.authorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No tienes permisos para editar este post" },
        { status: 403 }
      );
    }

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        title: body.title,
        content: body.content,
        description: body.description,
        status: body.status,
        featured: body.featured,
        order: body.order,
        mediaId: body.mediaId,
        publishedAt:
          body.status === "PUBLISHED" && !existingPost.publishedAt
            ? new Date()
            : existingPost.publishedAt,
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

    return NextResponse.json(post);
  } catch (error: any) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: error.message || "Error al actualizar post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAdmin();
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: { media: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post no encontrado" }, { status: 404 });
    }

    // Eliminar archivo asociado si existe
    if (post.media) {
      const { deleteFile } = await import("@/lib/files");
      await deleteFile(post.media.path);
      await prisma.media.delete({ where: { id: post.media.id } });
    }

    // Eliminar el post (CASCADE eliminará relaciones)
    await prisma.post.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Post eliminado correctamente" });
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: error.message || "Error al eliminar post" },
      { status: 500 }
    );
  }
}
