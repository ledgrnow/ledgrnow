import { Router } from "express";
import { body } from "express-validator";
import { prisma } from "../config/prisma.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.use(requireAuth, requireAdmin);

router.get(
  "/analytics",
  asyncHandler(async (_req, res) => {
    const [users, subscriptions, revenue, expenses, aiChats] = await Promise.all([
      prisma.user.count(),
      prisma.subscription.groupBy({ by: ["status"], _count: true }),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.expense.count(),
      prisma.aiChat.count()
    ]);
    res.json({ users, subscriptions, activeSubscriptions: revenue, expenses, aiChats });
  })
);

router.get(
  "/users",
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true, subscriptions: true },
      orderBy: { createdAt: "desc" }
    });
    res.json({ users });
  })
);

router.patch(
  "/users/:id/role",
  body("role").isIn(["USER", "ADMIN", "SUPER_ADMIN"]),
  validateRequest,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.update({ where: { id: String(req.params.id) }, data: { role: req.body.role } });
    await prisma.adminAuditLog.create({ data: { actorId: req.user!.id, action: "USER_ROLE_UPDATED", entity: "User", entityId: user.id, metadata: { role: req.body.role } } });
    res.json({ user });
  })
);

router.get(
  "/subscriptions",
  asyncHandler(async (_req, res) => {
    const subscriptions = await prisma.subscription.findMany({ include: { user: { select: { name: true, email: true } } }, orderBy: { createdAt: "desc" } });
    res.json({ subscriptions });
  })
);

export default router;
