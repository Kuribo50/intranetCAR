import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { contacts as existingContacts } from "../data/contacts";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Crear usuarios iniciales
  const adminPassword = await bcrypt.hash("admin123", 10);
  const editorPassword = await bcrypt.hash("editor123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@cesfam.cl" },
    update: {
      rut: "11.111.111-1",
      password: adminPassword,
    },
    create: {
      id: randomUUID(),
      rut: "11.111.111-1",
      email: "admin@cesfam.cl",
      name: "Administrador Principal",
      password: adminPassword,
      role: "ADMIN",
      active: true,
      updatedAt: new Date(),
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: "editor@cesfam.cl" },
    update: {
      rut: "22.222.222-2",
      password: editorPassword,
    },
    create: {
      id: randomUUID(),
      rut: "22.222.222-2",
      email: "editor@cesfam.cl",
      name: "Editor de Contenido",
      password: editorPassword,
      role: "EDITOR",
      active: true,
      updatedAt: new Date(),
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@cesfam.cl" },
    update: {
      rut: "33.333.333-3",
      password: userPassword,
    },
    create: {
      id: randomUUID(),
      rut: "33.333.333-3",
      email: "user@cesfam.cl",
      name: "Usuario Regular",
      password: userPassword,
      role: "USER",
      active: true,
      updatedAt: new Date(),
    },
  });

  console.log("✅ Usuarios creados:");
  console.log("   Admin: admin@cesfam.cl / admin123");
  console.log("   Editor: editor@cesfam.cl / editor123");
  console.log("   User: user@cesfam.cl / user123");

  // Migrar todos los contactos existentes
  console.log("📞 Migrando contactos existentes...");
  let created = 0;
  let skipped = 0;

  for (const contact of existingContacts) {
    try {
      await prisma.contact.create({
        data: {
          id: randomUUID(),
          name: contact.name,
          department: contact.department,
          extension: contact.extension,
          category: contact.category,
          authorId: admin.id,
          updatedAt: new Date(),
        },
      });
      created++;
    } catch (error: any) {
      // Si ya existe (por extension único o similar), saltar
      if (error.code === "P2002") {
        skipped++;
      } else {
        console.error(`Error creando contacto ${contact.name}:`, error);
      }
    }
  }

  console.log(`✅ ${created} contactos migrados, ${skipped} omitidos`);

  // Migrar aplicaciones existentes
  console.log("📱 Migrando aplicaciones existentes...");
  const apps = [
    {
      title: "Códigos Percápita",
      description: "Asignación de códigos PER CÁPITA",
      url: "http://tic.albertoreyes.cl",
      icon: "barcode",
      category: "APP",
      order: 0,
      active: true,
    },
    {
      title: "BUK",
      description: "Sistema Personal DISAM Tomé",
      url: "#",
      icon: "users",
      category: "APP",
      order: 1,
      active: true,
    },
    {
      title: "Mantención de Vehículos",
      description: "Plataforma Solicitud de Mantenciones",
      url: "#",
      icon: "wrench",
      category: "APP",
      order: 2,
      active: true,
    },
    {
      title: "Gestión Documental",
      description: "Protocolos y Documentos Clínicos",
      url: "#",
      icon: "files",
      category: "APP",
      order: 3,
      active: true,
    },
    {
      title: "Moodle CESFAM",
      description: "Plataforma de Capacitación",
      url: "http://moodle.albertoreyes.cl",
      icon: "graduationcap",
      category: "APP",
      order: 4,
      active: true,
    },
    {
      title: "HomeBox",
      description: "Servicios Internos",
      url: "http://homebox.albertoreyes.cl",
      icon: "activity",
      category: "APP",
      order: 5,
      active: true,
    },
    {
      title: "NetBox",
      description: "Infraestructura de Red",
      url: "http://netbox.albertoreyes.cl",
      icon: "server",
      category: "APP",
      order: 6,
      active: true,
    },
  ];

  let appsCreated = 0;
  let appsSkipped = 0;

  for (const app of apps) {
    try {
      // Verificar si ya existe una app con el mismo título
      const existing = await prisma.link.findFirst({
        where: {
          title: app.title,
          category: "APP",
        },
      });

      if (existing) {
        // Actualizar si existe
        await prisma.link.update({
          where: { id: existing.id },
          data: {
            description: app.description,
            url: app.url,
            icon: app.icon,
            order: app.order,
            active: app.active,
            updatedAt: new Date(),
          },
        });
        appsSkipped++;
      } else {
        // Crear si no existe
        await prisma.link.create({
          data: {
            id: randomUUID(),
            title: app.title,
            description: app.description,
            url: app.url,
            icon: app.icon,
            category: app.category,
            order: app.order,
            active: app.active,
            authorId: admin.id,
            updatedAt: new Date(),
          },
        });
        appsCreated++;
      }
    } catch (error: any) {
      console.error(`Error creando app ${app.title}:`, error);
      appsSkipped++;
    }
  }

  console.log(
    `✅ ${appsCreated} aplicaciones migradas, ${appsSkipped} omitidas`,
  );

  console.log("🎉 Seed completado!");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
