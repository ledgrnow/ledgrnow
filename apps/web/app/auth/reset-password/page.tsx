"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { api } from "@/lib/api";

function ResetPasswordForm() {
  const params = useSearchParams();
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    const result = await api<{ message: string }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        email: params.get("email"),
        token: params.get("token"),
        password: formData.get("password")
      })
    });
    setMessage(result.message);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 dark:bg-ink dark:text-white">
      <form action={submit} className="w-full max-w-md rounded-md border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-3xl font-black">Choose a new password</h1>
        <input name="password" type="password" required placeholder="New password" className="mt-8 h-12 w-full rounded-md border border-slate-200 px-4 dark:border-slate-700 dark:bg-slate-900" />
        {message && <p className="mt-4 rounded-md bg-mint/10 p-3 text-sm text-emerald-700">{message} <Link className="font-bold" href="/auth/login">Sign in</Link></p>}
        <Button className="mt-5 w-full">Update password</Button>
      </form>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-slate-50 px-4 dark:bg-ink dark:text-white">Loading reset form</main>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
