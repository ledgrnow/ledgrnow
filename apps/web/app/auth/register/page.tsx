import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 dark:bg-ink dark:text-white">
      <section className="w-full max-w-md rounded-md border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-3xl font-black">Create LedgrNow</h1>
        <p className="mt-2 text-sm text-slate-500">Start with a secure finance workspace.</p>
        <div className="mt-8"><GoogleLoginButton /></div>
        <div className="my-5 h-px bg-slate-200 dark:bg-slate-800" />
        <AuthForm mode="register" />
        <p className="mt-5 text-sm">Already have an account? <Link href="/auth/login" className="font-semibold text-mint">Sign in</Link></p>
      </section>
    </main>
  );
}
