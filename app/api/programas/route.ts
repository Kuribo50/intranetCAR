import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";

// GET: Listar todos los programas
export async function GET() {
  try {
    const programas = await prisma.programa.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(programas);
  } catch (error) {
    console.error("Error fetching programas:", error);
    return NextResponse.json(
      { error: "Error al obtener programas" },
      { status: 500 },
    );
  }
}

// POST: Crear un nuevo programa
export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { name, order = 0, active = true } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 },
      );
    }

    // Verificar si ya existe
    const existing = await prisma.programa.findUnique({
      where: { name: name.trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un programa con este nombre" },
        { status: 400 },
      );
    }

    const programa = await prisma.programa.create({
      data: {
        name: name.trim(),
        order,
        active,
      },
    });

    return NextResponse.json(programa, { status: 201 });
  } catch (error: any) {
    console.error("Error creating programa:", error);
    if (
      error.message === "No autenticado" ||
      error.message === "No tienes permisos para esta acción"
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Error al crear programa" },
      { status: 500 },
    );
  }
}
