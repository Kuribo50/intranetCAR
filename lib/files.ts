import { v4 as uuidv4 } from "uuid";
import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export type MediaType = "IMAGE" | "VIDEO" | "DOCUMENT";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./public/uploads";
const MAX_FILE_SIZE = 100 * 1024 * 1024;

export interface FileUpload {
  filename: string;
  originalName: string;
  path: string;
  type: MediaType;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
}

export async function ensureUploadDir() {
  const uploadPath = join(process.cwd(), UPLOAD_DIR);
  if (!existsSync(uploadPath)) {
    await mkdir(uploadPath, { recursive: true });
  }
  return uploadPath;
}

export function getMediaType(mimeType: string): MediaType {
  if (mimeType.startsWith("image/")) return "IMAGE";
  if (mimeType.startsWith("video/")) return "VIDEO";
  return "DOCUMENT";
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  // Validar tamaño
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `El archivo excede el tamaño máximo de ${
        MAX_FILE_SIZE / 1024 / 1024
      }MB`,
    };
  }

  // Validar tipo MIME
  const allowedMimes = [
    // Imágenes
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    // Videos
    "video/mp4",
    "video/webm",
    "video/quicktime",
    // Documentos
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
  ];

  if (!allowedMimes.includes(file.type)) {
    return {
      valid: false,
      error: "Tipo de archivo no permitido",
    };
  }

  return { valid: true };
}

export async function saveFile(
  file: File,
  authorId: string,
): Promise<FileUpload> {
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const uploadDir = await ensureUploadDir();
  const extension = file.name.split(".").pop() || "";
  const filename = `${uuidv4()}.${extension}`;
  const filepath = join(uploadDir, filename);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await writeFile(filepath, buffer);

  const mediaType = getMediaType(file.type);

  // Para imágenes, podríamos obtener dimensiones con sharp o similar
  // Por ahora, solo retornamos la info básica
  return {
    filename,
    originalName: file.name,
    path: join(UPLOAD_DIR, filename).replace(/\\/g, "/"),
    type: mediaType,
    mimeType: file.type,
    size: file.size,
  };
}

export async function deleteFile(filepath: string): Promise<void> {
  const fullPath = join(process.cwd(), filepath);
  if (existsSync(fullPath)) {
    await unlink(fullPath);
  }
}

export function getPublicUrl(filepath: string): string {
  // Remover ./public si existe
  const cleanPath = filepath.replace(/^\.\/public\//, "/");
  return cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
}
