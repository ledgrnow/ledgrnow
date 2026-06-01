import { Router } from "express";
import { body, query } from "express-validator";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  query("type").optional().isIn(["INCOME", "EXPENSE", "TRANSFER", "LOAN_PAYMENT"]),
  validateRequest,
  asyncHandler(async (req, res) => {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user!.id, type: req.query.type ? (req.query.type as any) : undefined },
      orderBy: { occurredAt: "desc" },
      take: 100
    });
    res.json({ transactions });
  })
);

router.post(
  "/",
  body("type").isIn(["INCOME", "EXPENSE", "TRANSFER", "LOAN_PAYMENT"]),
  body("title").isLength({ min: 2 }),
  body("amount").isFloat({ min: 0.01 }),
  body("occurredAt").isISO8601(),
  validateRequest,
  asyncHandler(async (req, res) => {
    const transaction = await prisma.transaction.create({
      data: {
        userId: req.user!.id,
        type: req.body.type,
        title: req.body.title,
        amount: req.body.amount,
        category: req.body.category,
        occurredAt: new Date(req.body.occurredAt)
      }
    });
    res.status(201).json({ transaction });
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const existing = await prisma.transaction.findFirst({ where: { id: String(req.params.id), userId: req.user!.id } });
    if (!existing) throw new HttpError(404, "Transaction not found");
    await prisma.transaction.delete({ where: { id: existing.id } });
    res.status(204).send();
  })
);

export default router;
