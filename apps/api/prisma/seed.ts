import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("LedgrNow@123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@ledgrnow.com" },
    update: {},
    create: {
      name: "LedgrNow Admin",
      email: "admin@ledgrnow.com",
      passwordHash,
      role: "SUPER_ADMIN",
      emailVerifiedAt: new Date(),
      adminProfile: { create: { department: "Finance Operations" } }
    }
  });

  const user = await prisma.user.upsert({
    where: { email: "demo@ledgrnow.com" },
    update: {},
    create: {
      name: "Demo Founder",
      email: "demo@ledgrnow.com",
      passwordHash,
      emailVerifiedAt: new Date(),
      expenses: {
        create: [
          { title: "AWS invoice", amount: 34000, category: "Software", merchant: "Amazon Web Services", spentAt: new Date() },
          { title: "Search ads", amount: 52000, category: "Marketing", merchant: "Google Ads", spentAt: new Date() },
          { title: "Client visit", amount: 18000, category: "Travel", merchant: "IndiGo", spentAt: new Date() }
        ]
      },
      transactions: {
        create: [
          { title: "Product revenue", type: "INCOME", amount: 310000, occurredAt: new Date() },
          { title: "AWS invoice", type: "EXPENSE", amount: 34000, category: "Software", occurredAt: new Date() }
        ]
      },
      savingsGoals: { create: { name: "Runway reserve", targetAmount: 360000, currentAmount: 245000 } },
      loans: {
        create: {
          lenderName: "HDFC Bank",
          principal: 500000,
          interestRate: 11.5,
          tenureMonths: 24,
          emiAmount: 23404,
          outstanding: 420000,
          startDate: new Date(),
          nextPaymentDue: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
        }
      }
    }
  });

  console.log(`Seeded ${admin.email} and ${user.email}. Password for both: LedgrNow@123`);
}

main().finally(async () => prisma.$disconnect());
