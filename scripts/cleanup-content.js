const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database...");

  // Delete in order to avoid foreign key violations
  await prisma.carouselImage.deleteMany({});
  console.log("- Deleted all Carousel Images");

  await prisma.link.deleteMany({});
  console.log("- Deleted all Links (Apps)");

  // Delete media created by the temporary seed (logos)
  await prisma.media.deleteMany({
    where: {
      filename: {
        in: ["logo_disam.png", "logoAcreditacion.png"],
      },
    },
  });
  console.log("- Deleted placeholder media");

  console.log("Cleanup complete!");
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
