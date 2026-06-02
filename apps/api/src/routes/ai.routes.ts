import { Router } from "express";
import { body } from "express-validator";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/errorHandler.js";
import { askFinancialAssistant, categorizeExpense, generateFinancialReport } from "../services/openai.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

const router = Router();
router.use(requireAuth);

router.get(
  "/chats",
  asyncHandler(async (req, res) => {
    const chats = await prisma.aiChat.findMany({ where: { userId: req.user!.id }, include: { messages: true }, orderBy: { updatedAt: "desc" } });
    res.json({ chats });
  })
);

router.post(
  "/chat",
  body("message").isLength({ min: 2 }),
  body("chatId").optional().isString(),
  validateRequest,
  asyncHandler(async (req, res) => {
    const chat = req.body.chatId
      ? await prisma.aiChat.findFirst({ where: { id: req.body.chatId, userId: req.user!.id }, include: { messages: { orderBy: { createdAt: "asc" }, take: 20 } } })
      : await prisma.aiChat.create({ data: { userId: req.user!.id, title: req.body.message.slice(0, 64) }, include: { messages: true } });
    if (!chat) throw new HttpError(404, "Chat not found");

    await prisma.aiMessage.create({ data: { chatId: chat.id, role: "USER", content: req.body.message } });
    const context = chat.messages.map((message: { role: string; content: string }) => ({ role: message.role.toLowerCase() as "user" | "assistant" | "system", content: message.content }));
    const answer = await askFinancialAssistant([...context, { role: "user", content: req.body.message }]);
    const assistant = await prisma.aiMessage.create({ data: { chatId: chat.id, role: "ASSISTANT", content: answer } });
    await prisma.aiChat.update({ where: { id: chat.id }, data: { updatedAt: new Date() } });
    res.json({ chatId: chat.id, message: assistant });
  })
);

rrouter.post(
  "/chat",
  (req, res, next) => {
    console.log("BODY:", req.body);
    next();
  },
  body("message").isLength({ min: 2 }),
  body("chatId").optional().isString(),
  validateRequest,
  asyncHandler(async (req, res) => {
    res.json(await categorizeExpense(req.body.title, Number(req.body.amount), req.body.merchant));
  })
);

router.get(
  "/budget-recommendations",
  asyncHandler(async (req, res) => {
    const [expenses, income] = await Promise.all([
      prisma.expense.groupBy({ by: ["category"], where: { userId: req.user!.id }, _sum: { amount: true } }),
      prisma.transaction.aggregate({ where: { userId: req.user!.id, type: "INCOME" }, _sum: { amount: true } })
    ]);
    const report = await generateFinancialReport(
      `Income total: ${Number(income._sum.amount ?? 0)}. Expense categories: ${JSON.stringify(expenses.map((item: { category: string; _sum: { amount: unknown } }) => ({ category: item.category, amount: Number(item._sum.amount ?? 0) })))}`
    );
    res.json({ recommendations: report });
  })
);

router.get(
  "/financial-report",
  asyncHandler(async (req, res) => {
    const [expenses, transactions, loans] = await Promise.all([
      prisma.expense.findMany({ where: { userId: req.user!.id }, orderBy: { spentAt: "desc" }, take: 100 }),
      prisma.transaction.findMany({ where: { userId: req.user!.id }, orderBy: { occurredAt: "desc" }, take: 100 }),
      prisma.loan.findMany({ where: { userId: req.user!.id } })
    ]);
    const report = await generateFinancialReport(JSON.stringify({ expenses, transactions, loans }));
    res.json({ report });
  })
);

export default router;
