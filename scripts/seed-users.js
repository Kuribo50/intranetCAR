const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("car123", 10);

  // 1. Admin User
  const admin = await prisma.user.upsert({
    where: { rut: "11.111.111-1" },
    update: {
      password: hashedPassword,
      mustChangePassword: true,
      role: "ADMIN",
    },
    create: {
      rut: "11.111.111-1",
      email: "admin@cesfam.cl",
      name: "Administrador Sistema",
      password: hashedPassword,
      role: "ADMIN",
      mustChangePassword: true,
      estamento: "Informática",
      establecimiento: "CESFAM Dr. Alberto Reyes",
    },
  });

  // 2. Editor User
  const editor = await prisma.user.upsert({
    where: { rut: "22.222.222-2" },
    update: {
      password: hashedPassword,
      mustChangePassword: true,
      role: "EDITOR",
    },
    create: {
      rut: "22.222.222-2",
      email: "editor@cesfam.cl",
      name: "Editor Contenido",
      password: hashedPassword,
      role: "EDITOR",
      mustChangePassword: true,
      estamento: "Comunicaciones",
      establecimiento: "CESFAM Dr. Alberto Reyes",
    },
  });

  // 3. Funcionario User (Standard)
  const funcionario = await prisma.user.upsert({
    where: { rut: "33.333.333-3" },
    update: {
      password: hashedPassword,
      mustChangePassword: true,
      role: "USER",
    },
    create: {
      rut: "33.333.333-3",
      email: "funcionario@cesfam.cl",
      name: "Funcionario Salud",
      password: hashedPassword,
      role: "USER", // "USER" maps to Funcionario
      mustChangePassword: true,
      estamento: "Médico",
      establecimiento: "CESFAM Dr. Alberto Reyes",
    },
  });

  console.log("Database seeded with:");
  console.log({ admin, editor, funcionario });
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
