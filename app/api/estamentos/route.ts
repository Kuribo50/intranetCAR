import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";

// GET: Listar todos los estamentos
export async function GET() {
  try {
    const estamentos = await prisma.estamento.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(estamentos);
  } catch (error) {
    console.error("Error fetching estamentos:", error);
    return NextResponse.json(
      { error: "Error al obtener estamentos" },
      { status: 500 },
    );
  }
}

// POST: Crear estamento
export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { name, order = 0, active = true } = body;

    if (!name) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 },
      );
    }

    // Verificar si ya existe
    const existing = await prisma.estamento.findUnique({
      where: { name },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un estamento con este nombre" },
        { status: 400 },
      );
    }

    const estamento = await prisma.estamento.create({
      data: { name, order, active },
    });

    return NextResponse.json(estamento, { status: 201 });
  } catch (error: any) {
    console.error("Error creating estamento:", error);
    if (
      error.message === "No autenticado" ||
      error.message === "No tienes permisos para esta acción"
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Error al crear estamento" },
      { status: 500 },
    );
  }
}
