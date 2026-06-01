import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { Router } from "express";
import { body } from "express-validator";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { createOpaqueToken, hashToken, signToken } from "../utils/tokens.js";
import { sendPasswordResetEmail } from "../services/mail.js";

const router = Router();
const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

function publicUser(user: { id: string; name: string; email: string; role: string; avatarUrl: string | null; currency: string }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl, currency: user.currency };
}

router.post(
  "/register",
  body("name").isLength({ min: 2 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isStrongPassword({ minLength: 8, minNumbers: 1, minSymbols: 1, minUppercase: 1 }),
  validateRequest,
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new HttpError(409, "Email already registered");
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { name, email, passwordHash, emailVerifiedAt: new Date() } });
    const token = signToken({ sub: user.id, role: user.role });
    res.status(201).json({ token, user: publicUser(user) });
  })
);

router.post(
  "/login",
  body("email").isEmail().normalizeEmail(),
  body("password").isString().notEmpty(),
  validateRequest,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.passwordHash) throw new HttpError(401, "Invalid email or password");
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new HttpError(401, "Invalid email or password");
    const token = signToken({ sub: user.id, role: user.role });
    res.json({ token, user: publicUser(user) });
  })
);

router.post(
  "/google",
  body("credential").isString().notEmpty(),
  validateRequest,
  asyncHandler(async (req, res) => {
    const ticket = await googleClient.verifyIdToken({ idToken: req.body.credential, audience: env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload?.email) throw new HttpError(401, "Invalid Google account");

    const user = await prisma.user.upsert({
      where: { email: payload.email },
      update: {
        googleId: payload.sub,
        provider: "GOOGLE",
        name: payload.name ?? payload.email.split("@")[0],
        avatarUrl: payload.picture,
        emailVerifiedAt: payload.email_verified ? new Date() : undefined
      },
      create: {
        email: payload.email,
        googleId: payload.sub,
        provider: "GOOGLE",
        name: payload.name ?? payload.email.split("@")[0],
        avatarUrl: payload.picture,
        emailVerifiedAt: payload.email_verified ? new Date() : undefined
      }
    });

    const token = signToken({ sub: user.id, role: user.role });
    res.json({ token, user: publicUser(user) });
  })
);

router.post(
  "/forgot-password",
  body("email").isEmail().normalizeEmail(),
  validateRequest,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (user) {
      const token = createOpaqueToken();
      await prisma.user.update({
        where: { id: user.id },
        data: { resetTokenHash: token.hash, resetTokenExpires: new Date(Date.now() + 30 * 60 * 1000) }
      });
      await sendPasswordResetEmail(user.email, `${env.FRONTEND_URL}/auth/reset-password?token=${token.raw}&email=${encodeURIComponent(user.email)}`);
    }
    res.json({ message: "If that email exists, a reset link has been sent." });
  })
);

router.post(
  "/reset-password",
  body("email").isEmail().normalizeEmail(),
  body("token").isString().notEmpty(),
  body("password").isStrongPassword({ minLength: 8, minNumbers: 1, minSymbols: 1, minUppercase: 1 }),
  validateRequest,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (!user?.resetTokenHash || !user.resetTokenExpires) throw new HttpError(400, "Invalid reset token");
    if (user.resetTokenExpires < new Date()) throw new HttpError(400, "Reset token expired");
    if (hashToken(req.body.token) !== user.resetTokenHash) throw new HttpError(400, "Invalid reset token");
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await bcrypt.hash(req.body.password, 12), resetTokenHash: null, resetTokenExpires: null }
    });
    res.json({ message: "Password updated successfully" });
  })
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.id } });
    res.json({ user: publicUser(user) });
  })
);

export default router;
