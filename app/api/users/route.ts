import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// GET: Listar todos los usuarios (requiere ADMIN)
export async function GET() {
  try {
    await requireAdmin();

    const users = await prisma.user.findMany({
      select: {
        id: true,
        rut: true,
        email: true,
        name: true,
        apellidos: true,
        phone: true,
        role: true,
        active: true,
        establecimientoId: true,
        estamentoId: true,
        programaId: true,
        mustChangePassword: true,
        createdAt: true,
        updatedAt: true,
        Establecimiento: {
          select: { id: true, name: true },
        },
        Estamento: {
          select: { id: true, name: true },
        },
        Programa: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    if (
      error.message === "No autenticado" ||
      error.message === "No tienes permisos para esta acción"
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 },
    );
  }
}

// POST: Crear usuario con contraseña hasheada
export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const {
      rut,
      email,
      name,
      apellidos,
      phone,
      password,
      role = "USER",
      active = true,
      establecimientoId,
      estamentoId,
      programaId,
    } = body;

    // Validaciones
    if (!rut || !name || !password) {
      return NextResponse.json(
        { error: "RUT, nombre y contraseña son obligatorios" },
        { status: 400 },
      );
    }

    // Verificar si el RUT ya existe
    const existingUserByRut = await prisma.user.findUnique({
      where: { rut },
    });

    if (existingUserByRut) {
      return NextResponse.json(
        { error: "Ya existe un usuario con este RUT" },
        { status: 400 },
      );
    }

    // Verificar si el email ya existe (si se proporciona)
    if (email) {
      const existingUserByEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUserByEmail) {
        return NextResponse.json(
          { error: "Ya existe un usuario con este email" },
          { status: 400 },
        );
      }
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        rut,
        email: email || null,
        name,
        apellidos: apellidos || null,
        phone: phone || null,
        password: hashedPassword,
        role,
        active,
        establecimientoId: establecimientoId || null,
        estamentoId: estamentoId || null,
        programaId: programaId || null,
        mustChangePassword: true,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        rut: true,
        email: true,
        name: true,
        apellidos: true,
        phone: true,
        role: true,
        active: true,
        establecimientoId: true,
        estamentoId: true,
        programaId: true,
        mustChangePassword: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (
      error.message === "No autenticado" ||
      error.message === "No tienes permisos para esta acción"
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Error al crear usuario" },
      { status: 500 },
    );
  }
}
