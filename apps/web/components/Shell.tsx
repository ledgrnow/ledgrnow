"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Bot, CreditCard, LayoutDashboard, LogOut, ReceiptText, ShieldCheck } from "lucide-react";
import { clearToken } from "@/lib/api";
import { AuthGuard } from "./AuthGuard";
import { ThemeToggle } from "./ThemeToggle";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/expenses", label: "Expenses", icon: ReceiptText },
  { href: "/loans", label: "Loans", icon: CreditCard },
  { href: "/ai", label: "AI Assistant", icon: Bot },
  { href: "/billing", label: "Billing", icon: BarChart3 },
  { href: "/admin", label: "Admin", icon: ShieldCheck }
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <AuthGuard>
    <main className="min-h-screen bg-slate-50 text-ink dark:bg-ink dark:text-white">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 lg:block">
        <Link href="/" className="text-xl font-black tracking-tight">LedgrNow</Link>
        <nav className="mt-8 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold ${active ? "bg-mint text-ink" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"}`}>
                <Icon size={18} /> {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <section className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Finance OS</p>
            <h1 className="text-lg font-bold">LedgrNow Workspace</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button title="Sign out" className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900" onClick={() => { clearToken(); router.push("/auth/login"); }}>
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <div className="p-4 lg:p-8">{children}</div>
      </section>
    </main>
    </AuthGuard>
  );
}
