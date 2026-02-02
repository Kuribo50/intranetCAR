import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { deleteFile } from "@/lib/files";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const media = await prisma.media.findUnique({
      where: { id: params.id },
      include: {
        posts: true,
        events: true,
        links: true,
      },
    });

    if (!media) {
      return NextResponse.json(
        { error: "Archivo no encontrado" },
        { status: 404 }
      );
    }

    // Si está en uso, primero desvincular de todos los recursos
    if (media.links.length > 0) {
      await prisma.link.updateMany({
        where: { mediaId: params.id },
        data: { mediaId: null },
      });
    }
    if (media.posts.length > 0) {
      await prisma.post.updateMany({
        where: { mediaId: params.id },
        data: { mediaId: null },
      });
    }
    if (media.events.length > 0) {
      await prisma.event.updateMany({
        where: { mediaId: params.id },
        data: { mediaId: null },
      });
    }

    // Eliminar archivo del sistema de archivos
    await deleteFile(media.path);

    // Eliminar registro de la base de datos
    await prisma.media.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Archivo eliminado correctamente" });
  } catch (error: any) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      { error: error.message || "Error al eliminar archivo" },
      { status: 500 }
    );
  }
}
