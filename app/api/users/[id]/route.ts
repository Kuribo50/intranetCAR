import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";

// GET: Obtener un usuario
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        rut: true,
        email: true,
        name: true,
        role: true,
        active: true,
        establecimientoId: true,
        estamentoId: true,
        programaId: true,
        mustChangePassword: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    if (
      error.message === "No autenticado" ||
      error.message === "No tienes permisos para esta acción"
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Error al obtener usuario" },
      { status: 500 },
    );
  }
}

// PATCH: Actualizar usuario
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const body = await request.json();
    const {
      rut,
      name,
      apellidos,
      email,
      phone,
      role,
      estamentoId,
      establecimientoId,
      programaId,
      active,
    } = body;

    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    // Verificar si el RUT ya existe (si se proporciona y es diferente)
    if (rut && rut !== existingUser.rut) {
      const existingUserByRut = await prisma.user.findUnique({
        where: { rut },
      });

      if (existingUserByRut) {
        return NextResponse.json(
          { error: "Ya existe un usuario con este RUT" },
          { status: 400 },
        );
      }
    }

    // Verificar si el email ya existe (si se proporciona y es diferente)
    if (email && email !== existingUser.email) {
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

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(rut !== undefined && { rut }),
        ...(name !== undefined && { name }),
        ...(apellidos !== undefined && { apellidos: apellidos || null }),
        ...(email !== undefined && { email: email || null }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(role !== undefined && { role }),
        ...(estamentoId !== undefined && { estamentoId: estamentoId || null }),
        ...(establecimientoId !== undefined && {
          establecimientoId: establecimientoId || null,
        }),
        ...(programaId !== undefined && { programaId: programaId || null }),
        ...(active !== undefined && { active }),
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
        updatedAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error updating user:", error);
    if (
      error.message === "No autenticado" ||
      error.message === "No tienes permisos para esta acción"
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Error al actualizar usuario" },
      { status: 500 },
    );
  }
}

// DELETE: Eliminar usuario permanentemente
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;

    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Usuario eliminado correctamente" });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    if (
      error.message === "No autenticado" ||
      error.message === "No tienes permisos para esta acción"
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Error al eliminar usuario" },
      { status: 500 },
    );
  }
}
