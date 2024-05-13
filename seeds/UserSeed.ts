//@ts-ignore
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
//@ts-ignore
const prisma = new PrismaClient();

//@ts-ignore
async function main() {
  let password = await bcrypt.hash("password123", 10);
  await prisma.user.create({
    data: {
      name: "John Doe",
      phoneNumber: "+1234567890",
      email: "john@example.com",
      password,
      role: "admin",
    },
  });

  password = await bcrypt.hash("password456", 10);
  await prisma.user.create({
    data: {
      name: "Jane Doe",
      phoneNumber: "+0987654321",
      email: "jane@example.com",
      password: "password456",
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
