import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 dark:bg-ink dark:text-white">
      <section className="w-full max-w-md rounded-md border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-3xl font-black">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to continue managing your finances.</p>
        <div className="mt-8"><GoogleLoginButton /></div>
        <div className="my-5 h-px bg-slate-200 dark:bg-slate-800" />
        <AuthForm mode="login" />
        <div className="mt-5 flex justify-between text-sm">
          <Link href="/auth/forgot-password" className="font-semibold text-coral">Forgot password?</Link>
          <Link href="/auth/register" className="font-semibold text-mint">Create account</Link>
        </div>
      </section>
    </main>
  );
}
