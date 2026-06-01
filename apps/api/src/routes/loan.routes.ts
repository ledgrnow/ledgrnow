import { Router } from "express";
import { body } from "express-validator";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/errorHandler.js";
import { generateFinancialReport } from "../services/openai.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

const router = Router();
router.use(requireAuth);

function calculateEmi(principal: number, annualRate: number, tenureMonths: number) {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return principal / tenureMonths;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
}

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const loans = await prisma.loan.findMany({ where: { userId: req.user!.id }, include: { payments: true }, orderBy: { createdAt: "desc" } });
    res.json({ loans });
  })
);

router.post(
  "/",
  body("lenderName").isLength({ min: 2 }),
  body("principal").isFloat({ min: 1 }),
  body("interestRate").isFloat({ min: 0 }),
  body("tenureMonths").isInt({ min: 1 }),
  body("startDate").isISO8601(),
  validateRequest,
  asyncHandler(async (req, res) => {
    const principal = Number(req.body.principal);
    const emiAmount = calculateEmi(principal, Number(req.body.interestRate), Number(req.body.tenureMonths));
    const loan = await prisma.loan.create({
      data: {
        userId: req.user!.id,
        lenderName: req.body.lenderName,
        principal,
        interestRate: req.body.interestRate,
        tenureMonths: req.body.tenureMonths,
        emiAmount,
        outstanding: principal,
        startDate: new Date(req.body.startDate),
        nextPaymentDue: req.body.nextPaymentDue ? new Date(req.body.nextPaymentDue) : undefined,
        notes: req.body.notes
      }
    });
    res.status(201).json({ loan });
  })
);

router.post(
  "/emi",
  body("principal").isFloat({ min: 1 }),
  body("interestRate").isFloat({ min: 0 }),
  body("tenureMonths").isInt({ min: 1 }),
  validateRequest,
  asyncHandler(async (req, res) => {
    const emi = calculateEmi(Number(req.body.principal), Number(req.body.interestRate), Number(req.body.tenureMonths));
    res.json({ emi: Number(emi.toFixed(2)), totalPayable: Number((emi * Number(req.body.tenureMonths)).toFixed(2)) });
  })
);

router.post(
  "/:id/payments",
  body("amount").isFloat({ min: 0.01 }),
  body("paidAt").isISO8601(),
  validateRequest,
  asyncHandler(async (req, res) => {
    const loan = await prisma.loan.findFirst({ where: { id: String(req.params.id), userId: req.user!.id } });
    if (!loan) throw new HttpError(404, "Loan not found");
    const amount = Number(req.body.amount);
    const outstanding = Math.max(0, Number(loan.outstanding) - amount);
    const payment = await prisma.loanPayment.create({
      data: { loanId: loan.id, amount, paidAt: new Date(req.body.paidAt), note: req.body.note }
    });
    await prisma.loan.update({
      where: { id: loan.id },
      data: { outstanding, status: outstanding === 0 ? "PAID" : "ACTIVE" }
    });
    await prisma.transaction.create({
      data: { userId: req.user!.id, type: "LOAN_PAYMENT", title: `Loan payment to ${loan.lenderName}`, amount, occurredAt: new Date(req.body.paidAt), referenceId: payment.id }
    });
    res.status(201).json({ payment, outstanding });
  })
);

router.get(
  "/analytics",
  asyncHandler(async (req, res) => {
    const loans = await prisma.loan.findMany({ where: { userId: req.user!.id, status: "ACTIVE" } });
    const summary = loans.map((loan: { lenderName: string; outstanding: unknown; emiAmount: unknown; interestRate: unknown; nextPaymentDue: Date | null }) => ({
      lender: loan.lenderName,
      outstanding: Number(loan.outstanding),
      emi: Number(loan.emiAmount),
      interestRate: Number(loan.interestRate),
      due: loan.nextPaymentDue
    }));
    const report = await generateFinancialReport(`Loan portfolio JSON: ${JSON.stringify(summary)}`);
    res.json({ loans: summary, report });
  })
);

export default router;
