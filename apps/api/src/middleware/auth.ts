import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { HttpError } from "../utils/httpError.js";
import { verifyToken } from "../utils/tokens.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: "USER" | "ADMIN" | "SUPER_ADMIN";
      };
    }
  }
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw new HttpError(401, "Authentication required");
    const payload = verifyToken(header.slice(7));
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, role: true }
    });
    if (!user) throw new HttpError(401, "User not found");
    req.user = user;
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired token"));
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user || !["ADMIN", "SUPER_ADMIN"].includes(req.user.role)) {
    return next(new HttpError(403, "Admin access required"));
  }
  next();
}