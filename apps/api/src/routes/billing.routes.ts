import { Router } from "express";
import { body } from "express-validator";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/errorHandler.js";
import { razorpay, verifyRazorpayWebhook } from "../services/razorpay.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

const router = Router();

router.post(
  "/checkout",
  requireAuth,
  body("plan").isIn(["starter", "growth", "scale"]),
  body("billingCycle").isIn(["MONTHLY", "YEARLY"]),
  validateRequest,
  asyncHandler(async (req, res) => {
    const amount = { starter: 99900, growth: 249900, scale: 599900 }[req.body.plan as "starter" | "growth" | "scale"];
    const order = await razorpay.orders.create({
      amount: req.body.billingCycle === "YEARLY" ? amount * 10 : amount,
      currency: "INR",
      receipt: `ledgrnow_${Date.now()}`,
      notes: { userId: req.user!.id, plan: req.body.plan, billingCycle: req.body.billingCycle }
    });
    res.json({ order });
  })
);

router.post(
  "/activate",
  requireAuth,
  body("plan").isString(),
  body("billingCycle").isIn(["MONTHLY", "YEARLY"]),
  body("razorpaySubscriptionId").optional().isString(),
  validateRequest,
  asyncHandler(async (req, res) => {
    const subscription = await prisma.subscription.create({
      data: {
        userId: req.user!.id,
        plan: req.body.plan,
        billingCycle: req.body.billingCycle,
        status: "ACTIVE",
        razorpaySubscriptionId: req.body.razorpaySubscriptionId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + (req.body.billingCycle === "YEARLY" ? 365 : 30) * 24 * 60 * 60 * 1000)
      }
    });
    res.status(201).json({ subscription });
  })
);

router.post(
  "/webhook",
  asyncHandler(async (req, res) => {
    const rawBody = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : JSON.stringify(req.body);
    if (!verifyRazorpayWebhook(rawBody, req.headers["x-razorpay-signature"] as string | undefined)) {
      throw new HttpError(401, "Invalid Razorpay signature");
    }
    const event = JSON.parse(rawBody);
    if (event.event === "subscription.cancelled" && event.payload?.subscription?.entity?.id) {
      await prisma.subscription.updateMany({
        where: { razorpaySubscriptionId: event.payload.subscription.entity.id },
        data: { status: "CANCELED" }
      });
    }
    res.json({ received: true });
  })
);

export default router;
