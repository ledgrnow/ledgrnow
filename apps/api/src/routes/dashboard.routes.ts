import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [income, expenses, loans, savings, recentTransactions, categorySpend] = await Promise.all([
      prisma.transaction.aggregate({ where: { userId, type: "INCOME", occurredAt: { gte: start, lt: end } }, _sum: { amount: true } }),
      prisma.expense.aggregate({ where: { userId, spentAt: { gte: start, lt: end } }, _sum: { amount: true } }),
      prisma.loan.aggregate({ where: { userId, status: "ACTIVE" }, _sum: { outstanding: true } }),
      prisma.savingsGoal.aggregate({ where: { userId }, _sum: { currentAmount: true, targetAmount: true } }),
      prisma.transaction.findMany({ where: { userId }, orderBy: { occurredAt: "desc" }, take: 8 }),
      prisma.expense.groupBy({ by: ["category"], where: { userId, spentAt: { gte: start, lt: end } }, _sum: { amount: true } })
    ]);

    const monthlyIncome = Number(income._sum.amount ?? 0);
    const monthlyExpenses = Number(expenses._sum.amount ?? 0);
    res.json({
      totalBalance: monthlyIncome - monthlyExpenses,
      monthlyIncome,
      monthlyExpenses,
      savings: {
        current: Number(savings._sum.currentAmount ?? 0),
        target: Number(savings._sum.targetAmount ?? 0)
      },
      loansOutstanding: Number(loans._sum.outstanding ?? 0),
      recentTransactions,
      categorySpend: categorySpend.map((item: { category: string; _sum: { amount: unknown } }) => ({ category: item.category, amount: Number(item._sum.amount ?? 0) }))
    });
  })
);

export default router;
