//@ts-ignore
const { PrismaClient } = require("@prisma/client");
//@ts-ignore
const prisma = new PrismaClient();

//@ts-ignore
async function main() {
  await prisma.userSubscription.create({
    data: {
      userId: 1,
      channelId: 1,
      notificationId: 1,
    },
  });

  await prisma.userSubscription.create({
    data: {
      userId: 2,
      channelId: 2,
      notificationId: 2,
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
