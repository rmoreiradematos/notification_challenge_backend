//@ts-ignore
const { PrismaClient } = require("@prisma/client");
//@ts-ignore
const prisma = new PrismaClient();

//@ts-ignore
async function main() {
  await prisma.channel.create({
    data: {
      name: "Sports",
      description: "General discussion sports channel",
    },
  });

  await prisma.channel.create({
    data: {
      name: "Movies",
      description: "Channel for movies",
    },
  });

  await prisma.channel.create({
    data: {
      name: "Finance",
      description: "Channel for Finance",
    },
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
