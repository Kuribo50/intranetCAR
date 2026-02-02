import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";

// GET: Listar todos los establecimientos
export async function GET() {
  try {
    const establecimientos = await prisma.establecimiento.findMany({
      orderBy: { order: "asc" },
      include: { media: true },
    });
    return NextResponse.json(establecimientos);
  } catch (error) {
    console.error("Error fetching establecimientos:", error);
    return NextResponse.json(
      { error: "Error al obtener establecimientos" },
      { status: 500 },
    );
  }
}

// POST: Crear establecimiento
export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { name, order = 0, active = true, address, mediaId } = body;

    if (!name) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 },
      );
    }

    // Verificar si ya existe
    const existing = await prisma.establecimiento.findUnique({
      where: { name },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un establecimiento con este nombre" },
        { status: 400 },
      );
    }

    const establecimiento = await prisma.establecimiento.create({
      data: { name, order, active, address, mediaId },
    });

    return NextResponse.json(establecimiento, { status: 201 });
  } catch (error: any) {
    console.error("Error creating establecimiento:", error);
    if (
      error.message === "No autenticado" ||
      error.message === "No tienes permisos para esta acción"
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Error al crear establecimiento" },
      { status: 500 },
    );
  }
}
