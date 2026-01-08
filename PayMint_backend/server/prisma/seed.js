import { faker } from "@faker-js/faker";
import { prisma } from "../src/db.js";
async function main() {
  console.log("Seeding database...");

  // 1️⃣ Create fake users
  const users = [];
  for (let i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "password123", // default password
        balance: Number(faker.finance.amount(1000, 5000, 2)),
      },
    });
    users.push(user);
  }

  // 2️⃣ Create transactions
  for (let i = 0; i < 20; i++) {
    const user = faker.helpers.arrayElement(users); // transaction belongs to 1 user

    const amount = Number(faker.finance.amount(10, 500, 2));

    const status = faker.helpers.arrayElement(["PENDING", "SUCCESS", "FAILED"]);
    const type = faker.helpers.arrayElement(["DEBIT", "CREDIT"]);

    await prisma.transaction.create({
      data: {
        transactionId: faker.string.uuid(),
        userId: user.id,
        type,
        status,
        amount,
        description: `${type} transaction`,
        date: faker.date.recent(30),
      },
    });

    // Update user balance only if SUCCESS
    if (status === "SUCCESS") {
      let newBalance = user.balance;
      if (type === "DEBIT") newBalance -= amount;
      else if (type === "CREDIT") newBalance += amount;

      await prisma.user.update({
        where: { id: user.id },
        data: { balance: newBalance },
      });
      user.balance = newBalance; // update local copy for next iteration
    }
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
