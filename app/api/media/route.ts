import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/permissions";
import { saveFile, MediaType } from "@/lib/files";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");

    const media = await prisma.media.findMany({
      where: type ? { type: type as any } : undefined,
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Error al obtener archivos" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireEditor();

    // Verificar que el usuario existe en la base de datos
    // Esto es necesario porque la sesión puede ser válida (JWT) pero el usuario
    // pudo haber sido eliminado de la DB (ej. reinicio de DB)
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      console.error(`Usuario ${user.id} no encontrado en la base de datos`);
      return NextResponse.json(
        { error: "Usuario no inválido. Por favor inicie sesión nuevamente." },
        { status: 401 },
      );
    }

    console.log("Usuario autenticado:", user);

    let formData;
    try {
      formData = await request.formData();
    } catch (formError: any) {
      console.error("FormData parse error:", formError.message);
      // Capturar cualquier error de parsing de FormData
      return NextResponse.json(
        {
          error:
            "El archivo es demasiado grande o formato inválido. Máximo permitido: 100MB",
          details: formError.message,
        },
        { status: 413 },
      );
    }

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 },
      );
    }

    // Validar tamaño del archivo
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Archivo demasiado grande. Máximo 100MB." },
        { status: 413 },
      );
    }

    const fileData = await saveFile(file, user.id);
    console.log("Datos del archivo:", fileData);
    console.log("ID del usuario:", user.id);

    const media = await prisma.media.create({
      data: {
        id: uuidv4(),
        filename: fileData.filename,
        originalName: fileData.originalName,
        path: fileData.path,
        type: fileData.type,
        mimeType: fileData.mimeType,
        size: fileData.size,
        width: fileData.width,
        height: fileData.height,
        alt: formData.get("alt") as string | undefined,
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

    return NextResponse.json(media, { status: 201 });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: error.message || "Error al subir archivo" },
      { status: 500 },
    );
  }
}

// Nota: El límite de 10MB es del servidor Next.js por defecto.
// Para archivos > 10MB, el cliente debe validar antes de enviar.
// En producción, considera usar un servicio de almacenamiento en la nube (S3, Cloudinary, etc.)
