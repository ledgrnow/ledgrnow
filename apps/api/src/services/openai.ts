import OpenAI from "openai";
import { env } from "../config/env.js";

export const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export async function askFinancialAssistant(messages: Array<{ role: "user" | "assistant" | "system"; content: string }>) {
  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content:
          "You are LedgrNow, a careful financial assistant for small businesses and individuals. Provide practical, concise guidance. Avoid guarantees and recommend professional advice for legal, tax, or investment decisions."
      },
      ...messages
    ]
  });

  return response.choices[0]?.message?.content ?? "I could not generate a response. Please try again.";
}

export async function categorizeExpense(title: string, amount: number, merchant?: string) {
  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Return JSON only with keys category and confidence. Category must be one of Food, Travel, Utilities, Rent, Payroll, Marketing, Software, Insurance, Taxes, Healthcare, Shopping, Education, Loan, Other."
      },
      { role: "user", content: `Title: ${title}\nAmount: ${amount}\nMerchant: ${merchant ?? "unknown"}` }
    ]
  });

  return JSON.parse(response.choices[0]?.message?.content ?? "{\"category\":\"Other\",\"confidence\":0}");
}

export async function generateFinancialReport(summary: string) {
  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content:
          "Create a clear financial report with cash-flow observations, expense risks, savings opportunities, and next actions. Be specific and use markdown headings."
      },
      { role: "user", content: summary }
    ]
  });
  return response.choices[0]?.message?.content ?? "No report generated.";
}
