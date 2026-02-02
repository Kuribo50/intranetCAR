import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEditor, requireAdmin } from "@/lib/permissions";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireEditor();
    const body = await request.json();

    const existingContact = await prisma.contact.findUnique({
      where: { id: params.id },
    });

    if (!existingContact) {
      return NextResponse.json(
        { error: "Contacto no encontrado" },
        { status: 404 },
      );
    }

    if (existingContact.authorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No tienes permisos para editar este contacto" },
        { status: 403 },
      );
    }

    const contact = await prisma.contact.update({
      where: { id: params.id },
      data: {
        name: body.name,
        department: body.department,
        extension: body.extension,
        category: body.category,
        email: body.email,
        phone: body.phone,
        position: body.position,
        location: body.location,
        description: body.description,
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(contact);
  } catch (error: any) {
    console.error("Error updating contact:", error);
    return NextResponse.json(
      { error: error.message || "Error al actualizar contacto" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin();
    const contact = await prisma.contact.findUnique({
      where: { id: params.id },
    });

    if (!contact) {
      return NextResponse.json(
        { error: "Contacto no encontrado" },
        { status: 404 },
      );
    }

    await prisma.contact.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Contacto eliminado correctamente" });
  } catch (error: any) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { error: error.message || "Error al eliminar contacto" },
      { status: 500 },
    );
  }
}
