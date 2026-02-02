import { prisma } from "../lib/prisma";

async function main() {
  const userId = "fabbfe2b-a11a-47cc-a401-81173ff45426";
  console.log(`Checking for user with ID: ${userId}`);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      console.log("User found:", user);
    } else {
      console.error("User NOT found in database.");

      // List all users to see what's available
      const allUsers = await prisma.user.findMany();
      console.log(`Total users in DB: ${allUsers.length}`);
      console.log(
        allUsers.map((u) => ({ id: u.id, email: u.email, name: u.name })),
      );
    }
  } catch (error) {
    console.error("Error querying database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
