const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!admin) {
    console.error("No admin user found. Please run seed-users.js first.");
    return;
  }

  console.log("Found admin:", admin.name);

  // 1. Create Media for Carousel (Using existing logos for now)
  const media1 = await prisma.media.create({
    data: {
      filename: "logo_disam.png",
      originalName: "logo_disam.png",
      path: "/logo_disam.png",
      type: "IMAGE",
      mimeType: "image/png",
      size: 157844,
      authorId: admin.id,
      alt: "Logo DISAM",
    },
  });

  const media2 = await prisma.media.create({
    data: {
      filename: "logoAcreditacion.png",
      originalName: "logoAcreditacion.png",
      path: "/logoAcreditacion.png",
      type: "IMAGE",
      mimeType: "image/png",
      size: 41119,
      authorId: admin.id,
      alt: "Acreditación",
    },
  });

  // 2. Create Carousel Images
  await prisma.carouselImage.create({
    data: {
      title: "Bienvenidos a Intranet CAR",
      description: "Tu espacio de trabajo digital y colaborativo.",
      authorId: admin.id,
      mediaId: media1.id,
      order: 1,
      active: true,
    },
  });

  await prisma.carouselImage.create({
    data: {
      title: "Campaña de Vacunación",
      description: "Infórmate sobre las fechas y puntos de vacunación.",
      authorId: admin.id,
      mediaId: media2.id,
      order: 2,
      active: true,
    },
  });

  // 3. Create Links (Apps) - Using ORIGINAL apps found in seed.ts
  const apps = [
    {
      title: "Códigos Percápita",
      description: "Asignación de códigos PER CÁPITA",
      url: "http://tic.albertoreyes.cl",
      icon: "barcode",
    },
    {
      title: "BUK",
      description: "Sistema Personal DISAM Tomé",
      url: "#",
      icon: "users",
    },
    {
      title: "Mantención de Vehículos",
      description: "Plataforma Solicitud de Mantenciones",
      url: "#",
      icon: "wrench",
    },
    {
      title: "Gestión Documental",
      description: "Protocolos y Documentos Clínicos",
      url: "#",
      icon: "files",
    },
    {
      title: "Moodle CESFAM",
      description: "Plataforma de Capacitación",
      url: "http://moodle.albertoreyes.cl",
      icon: "GraduationCap",
    },
    {
      title: "HomeBox",
      description: "Servicios Internos",
      url: "http://homebox.albertoreyes.cl",
      icon: "Activity",
    },
    {
      title: "NetBox",
      description: "Infraestructura de Red",
      url: "http://netbox.albertoreyes.cl",
      icon: "Server",
    },
  ];

  for (const [index, app] of apps.entries()) {
    await prisma.link.create({
      data: {
        title: app.title,
        description: app.description || "",
        url: app.url,
        icon: app.icon, // Lucide icon name
        category: "APP",
        authorId: admin.id,
        order: index + 1,
        active: true,
      },
    });
  }

  console.log("Content seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
