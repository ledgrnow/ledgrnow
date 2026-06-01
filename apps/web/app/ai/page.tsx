"use client";

import { useState } from "react";
import { Bot, Send } from "lucide-react";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/Button";
import { api } from "@/lib/api";

type Message = { role: "USER" | "ASSISTANT"; content: string };

export default function AiPage() {
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ASSISTANT", content: "Ask me about budget planning, loan pressure, expense trends, or monthly financial reports." }
  ]);

  async function send(formData: FormData) {
    const message = String(formData.get("message") ?? "");
    if (!message.trim()) return;
    setMessages((items) => [...items, { role: "USER", content: message }]);
    const result = await api<{ chatId: string; message: { content: string } }>("/api/ai/chat", { method: "POST", body: JSON.stringify({ message, chatId }) });
    setChatId(result.chatId);
    setMessages((items) => [...items, { role: "ASSISTANT", content: result.message.content }]);
  }

  return (
    <Shell>
      <section className="mx-auto max-w-4xl rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-slate-800">
          <div className="grid h-11 w-11 place-items-center rounded-md bg-mint/15 text-mint"><Bot /></div>
          <div><h2 className="text-xl font-black">AI financial assistant</h2><p className="text-sm text-slate-500">Financial advice, reports, budgets, and smart recommendations</p></div>
        </div>
        <div className="h-[58vh] space-y-4 overflow-y-auto p-5">
          {messages.map((message, index) => (
            <div key={index} className={`max-w-[82%] rounded-md p-4 text-sm leading-6 ${message.role === "USER" ? "ml-auto bg-ink text-white dark:bg-mint dark:text-ink" : "bg-slate-100 dark:bg-slate-900"}`}>
              {message.content}
            </div>
          ))}
        </div>
        <form action={send} className="flex gap-2 border-t border-slate-200 p-4 dark:border-slate-800">
          <input name="message" placeholder="Ask for budget, loan, or cash-flow advice" className="h-12 flex-1 rounded-md border border-slate-200 px-4 dark:border-slate-700 dark:bg-slate-900" />
          <Button><Send size={17} /></Button>
        </form>
      </section>
    </Shell>
  );
}
