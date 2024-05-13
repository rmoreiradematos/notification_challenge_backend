//@ts-ignore
const { PrismaClient } = require("@prisma/client");
//@ts-ignore
const prisma = new PrismaClient();
//@ts-ignore
async function main() {
  await prisma.channel.create({
    data: {
      name: "Sports",
      description: "sports channel",
    },
  });

  await prisma.channel.create({
    data: {
      name: "Finance",
      description: "finance channel",
    },
  });

  await prisma.channel.create({
    data: {
      name: "Movies",
      description: "Movies channel",
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
