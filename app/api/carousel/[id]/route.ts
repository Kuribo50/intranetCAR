import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/permissions";
import { deleteFile } from "@/lib/files";

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;

  try {
    await requireEditor();
    const body = await request.json();

    // 1. Get current carousel item to check for media changes
    const existingItem = await prisma.carouselImage.findUnique({
      where: { id: params.id },
      include: { Media: true },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Elemento del carrusel no encontrado" },
        { status: 404 },
      );
    }

    const oldMediaId = existingItem.mediaId;
    const newMediaId = body.mediaId || oldMediaId; // Use new if provided, else keep old
    const mediaChanged = body.mediaId && body.mediaId !== oldMediaId;

    // 2. Update the carousel item
    const carouselImage = await prisma.carouselImage.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        linkUrl: body.linkUrl || null,
        linkType: body.linkType || null,
        order: body.order ?? 0,
        active: body.active ?? true,
        pinned: body.pinned ?? false,
        autoPlayDuration: body.autoPlayDuration ?? 5,
        mediaId: newMediaId,
      },
      include: {
        Media: true,
      },
    });

    // 3. If media changed, check if old media is orphaned and delete it
    if (mediaChanged) {
      const oldMediaInUse = await prisma.media.findUnique({
        where: { id: oldMediaId },
        include: {
          Post: true,
          Event: true,
          Link: true,
          CarouselImage: true,
          Announcement: true,
        },
      });

      if (
        oldMediaInUse &&
        oldMediaInUse.Post.length === 0 &&
        oldMediaInUse.Event.length === 0 &&
        oldMediaInUse.Link.length === 0 &&
        oldMediaInUse.CarouselImage.length === 0 &&
        oldMediaInUse.Announcement.length === 0
      ) {
        // Delete old file and media record
        await deleteFile(existingItem.Media!.path);
        await prisma.media.delete({
          where: { id: oldMediaId },
        });
      }
    }

    return NextResponse.json(carouselImage);
  } catch (error: any) {
    console.error("Error updating carousel image:", error);
    return NextResponse.json(
      { error: error.message || "Error al actualizar imagen del carrusel" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;

  try {
    await requireEditor();
    const carouselImage = await prisma.carouselImage.findUnique({
      where: { id: params.id },
      include: {
        Media: true,
      },
    });

    if (!carouselImage) {
      return NextResponse.json(
        { error: "Imagen del carrusel no encontrada" },
        { status: 404 },
      );
    }

    // 1. Eliminar el registro del Carrusel primero (para liberar la referencia)
    await prisma.carouselImage.delete({
      where: { id: params.id },
    });

    // 2. Verificar uso del archivo (Media)
    if (carouselImage.mediaId) {
      const mediaInUse = await prisma.media.findUnique({
        where: { id: carouselImage.mediaId },
        include: {
          Post: true,
          Event: true,
          Link: true,
          CarouselImage: true,
          Announcement: true,
        },
      });

      // 3. Si no está en uso por nadie más, limpiar archivo y registro Media
      // Nota: CarouselImage se acaba de borrar, así que no aparecerá en la lista de mediaInUse si se refresca la query,
      // PERO como Prisma transaction no se usa aquí, hay una race condition pequeña.
      // Sin embargo, `mediaInUse.CarouselImage` SÍ incluira el item recién borrado SI se corre antes del delete.
      // Corrección: Borrar primero el item de carrusel (paso 1). Luego chequear orphans.
      // Al borrar paso 1, la query de orphans devolverá 0 carouselImages. Correcto.

      if (
        mediaInUse &&
        mediaInUse.Post.length === 0 &&
        mediaInUse.Event.length === 0 &&
        mediaInUse.Link.length === 0 &&
        mediaInUse.CarouselImage.length === 0 &&
        mediaInUse.Announcement.length === 0
      ) {
        // Eliminar archivo físico si existe path
        if (carouselImage.Media?.path) {
          await deleteFile(carouselImage.Media.path);
        }

        // Eliminar registro de metadatos
        await prisma.media.delete({
          where: { id: carouselImage.mediaId },
        });
      }
    }

    return NextResponse.json({ message: "Imagen eliminada correctamente" });
  } catch (error: any) {
    console.error("Error deleting carousel image:", error);
    return NextResponse.json(
      { error: error.message || "Error al eliminar imagen del carrusel" },
      { status: 500 },
    );
  }
}
