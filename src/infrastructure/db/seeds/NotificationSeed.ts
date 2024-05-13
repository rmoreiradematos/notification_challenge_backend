//@ts-ignore
const { PrismaClient } = require("@prisma/client");
//@ts-ignore
const prisma = new PrismaClient();
//@ts-ignore
async function main() {
  await prisma.notification.create({
    data: {
      name: "SMS",
      description: "send message by sms",
    },
  });

  await prisma.notification.create({
    data: {
      name: "Email",
      description: "send message by email",
    },
  });

  await prisma.notification.create({
    data: {
      name: "Push Notification",
      description: "send message by push notification",
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
