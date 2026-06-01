import { Router } from "express";
import { body, query } from "express-validator";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/errorHandler.js";
import { categorizeExpense } from "../services/openai.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  query("search").optional().isString(),
  query("category").optional().isString(),
  validateRequest,
  asyncHandler(async (req, res) => {
    const search = String(req.query.search ?? "");
    const category = String(req.query.category ?? "");
    const expenses = await prisma.expense.findMany({
      where: {
        userId: req.user!.id,
        ...(category ? { category } : {}),
        ...(search ? { OR: [{ title: { contains: search, mode: "insensitive" } }, { merchant: { contains: search, mode: "insensitive" } }] } : {})
      },
      orderBy: { spentAt: "desc" }
    });
    res.json({ expenses });
  })
);

router.post(
  "/",
  body("title").isLength({ min: 2 }),
  body("amount").isFloat({ min: 0.01 }),
  body("category").optional().isString(),
  body("merchant").optional().isString(),
  body("spentAt").isISO8601(),
  validateRequest,
  asyncHandler(async (req, res) => {
    const ai = req.body.category ? null : await categorizeExpense(req.body.title, Number(req.body.amount), req.body.merchant);
    const category = req.body.category ?? ai?.category ?? "Other";
    const expense = await prisma.expense.create({
      data: {
        userId: req.user!.id,
        title: req.body.title,
        amount: req.body.amount,
        category,
        merchant: req.body.merchant,
        notes: req.body.notes,
        spentAt: new Date(req.body.spentAt),
        aiCategory: ai?.category
      }
    });
    await prisma.transaction.create({
      data: {
        userId: req.user!.id,
        type: "EXPENSE",
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        occurredAt: expense.spentAt,
        referenceId: expense.id
      }
    });
    res.status(201).json({ expense });
  })
);

router.put(
  "/:id",
  body("title").optional().isLength({ min: 2 }),
  body("amount").optional().isFloat({ min: 0.01 }),
  body("spentAt").optional().isISO8601(),
  validateRequest,
  asyncHandler(async (req, res) => {
    const existing = await prisma.expense.findFirst({ where: { id: String(req.params.id), userId: req.user!.id } });
    if (!existing) throw new HttpError(404, "Expense not found");
    const expense = await prisma.expense.update({
      where: { id: existing.id },
      data: { ...req.body, spentAt: req.body.spentAt ? new Date(req.body.spentAt) : undefined }
    });
    res.json({ expense });
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const existing = await prisma.expense.findFirst({ where: { id: String(req.params.id), userId: req.user!.id } });
    if (!existing) throw new HttpError(404, "Expense not found");
    await prisma.expense.delete({ where: { id: existing.id } });
    res.status(204).send();
  })
);

router.get(
  "/reports/monthly",
  asyncHandler(async (req, res) => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const rows = await prisma.expense.groupBy({
      by: ["category"],
      where: { userId: req.user!.id, spentAt: { gte: start } },
      _sum: { amount: true },
      _count: true
    });
    res.json({ report: rows.map((row: { category: string; _sum: { amount: unknown }; _count: number }) => ({ category: row.category, amount: Number(row._sum.amount ?? 0), count: row._count })) });
  })
);

export default router;
