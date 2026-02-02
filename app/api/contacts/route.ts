import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/permissions";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const department = searchParams.get("department");
    const category = searchParams.get("category");

    const contacts = await prisma.contact.findMany({
      where: {
        ...(department && { department }),
        ...(category && { category }),
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
      orderBy: [{ department: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Error al obtener contactos" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireEditor();
    const body = await request.json();

    const contact = await prisma.contact.create({
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
        authorId: user.id,
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

    return NextResponse.json(contact, { status: 201 });
  } catch (error: any) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear contacto" },
      { status: 500 },
    );
  }
}
