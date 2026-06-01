"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/Button";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  async function submit(formData: FormData) {
    const email = formData.get("email");
    const result = await api<{ message: string }>("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
    setMessage(result.message);
  }
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 dark:bg-ink dark:text-white">
      <form action={submit} className="w-full max-w-md rounded-md border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-3xl font-black">Reset password</h1>
        <input name="email" type="email" required placeholder="Email address" className="mt-8 h-12 w-full rounded-md border border-slate-200 px-4 dark:border-slate-700 dark:bg-slate-900" />
        {message && <p className="mt-4 rounded-md bg-mint/10 p-3 text-sm text-emerald-700">{message}</p>}
        <Button className="mt-5 w-full">Send reset link</Button>
      </form>
    </main>
  );
}
