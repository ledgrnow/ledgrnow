"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api, setToken } from "@/lib/api";
import { Button } from "./Button";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData(e.currentTarget);
      const payload = Object.fromEntries(formData);
      const result = await api<{ token: string }>(`/api/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setToken(result.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {mode === "register" && (
        <input
          name="name"
          required
          minLength={2}
          placeholder="Full name"
          className="h-12 w-full rounded-md border border-slate-200 px-4 dark:border-slate-700 dark:bg-slate-900"
        />
      )}
      <input
        name="email"
        required
        type="email"
        placeholder="Email address"
        className="h-12 w-full rounded-md border border-slate-200 px-4 dark:border-slate-700 dark:bg-slate-900"
      />
      <input
        name="password"
        required
        type="password"
        placeholder="Password"
        className="h-12 w-full rounded-md border border-slate-200 px-4 dark:border-slate-700 dark:bg-slate-900"
      />
      {error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">
          {error}
        </p>
      )}
      <Button disabled={loading} className="w-full">
        {loading && <Loader2 className="animate-spin mr-2" size={16} />}
        {mode === "login" ? "Sign in" : "Create account"}
      </Button>
    </form>
  );
}
