import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Testing auth logic...");

  const credentials = {
    rut: "11.111.111-1", // Admin RUT from seed
    password: "admin123", // Admin password from seed
  };

  console.log(`Attempting login for RUT: ${credentials.rut}`);

  try {
    const user = await prisma.user.findUnique({
      where: { rut: credentials.rut },
    });

    if (!user) {
      console.log("User not found!");
      return;
    }

    if (!user.active) {
      console.log("User is not active!");
      return;
    }

    console.log("User found:", user.email);

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password,
    );

    if (isPasswordValid) {
      console.log("✅ Password is valid. Login successful!");
    } else {
      console.error("❌ Password is invalid.");
    }
  } catch (error) {
    console.error("🔥 Error during auth logic:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
