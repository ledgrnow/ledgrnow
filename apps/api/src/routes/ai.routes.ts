import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/errorHandler.js";
import { askFinancialAssistant, categorizeExpense, generateFinancialReport } from "../services/openai.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

router.post(
  "/chat",

  (req: Request, res: Response, next: NextFunction) => {
    console.log("BODY:", req.body);
    next();
  },

  body("message").isLength({ min: 2 }),

  body("chatId")
    .optional({ nullable: true })
    .isString(),

  validateRequest,

  asyncHandler(async (req, res) => {
    const chat = req.body.chatId
      ? await prisma.aiChat.findFirst({
          where: {
            id: req.body.chatId,
            userId: req.user!.id,
          },
          include: {
            messages: {
              orderBy: { createdAt: "asc" },
              take: 20,
            },
          },
        })
      : await prisma.aiChat.create({
          data: {
            userId: req.user!.id,
            title: req.body.message.slice(0, 64),
          },
          include: {
            messages: true,
          },
        });

    if (!chat) {
      throw new HttpError(404, "Chat not found");
    }

    await prisma.aiMessage.create({
      data: {
        chatId: chat.id,
        role: "USER",
        content: req.body.message,
      },
    });

    const context = chat.messages.map((message) => ({
      role: message.role.toLowerCase() as
        | "user"
        | "assistant"
        | "system",
      content: message.content,
    }));

    const answer = await askFinancialAssistant([
      ...context,
      {
        role: "user",
        content: req.body.message,
      },
    ]);

    const assistant = await prisma.aiMessage.create({
      data: {
        chatId: chat.id,
        role: "ASSISTANT",
        content: answer,
      },
    });

    await prisma.aiChat.update({
      where: {
        id: chat.id,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    res.json({
      chatId: chat.id,
      message: assistant,
    });
  })
);
export default router;