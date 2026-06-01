import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { HttpError } from "../utils/httpError.js";

export function validateRequest(req: Request, _res: Response, next: NextFunction) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next(new HttpError(422, result.array().map((error) => error.msg).join(", ")));
  }
  next();
}

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  const status = error instanceof HttpError ? error.status : 500;
  res.status(status).json({
    error: {
      message: status === 500 ? "Internal server error" : error.message,
      status
    }
  });
}
