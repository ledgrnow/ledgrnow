"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, CheckCircle2, CreditCard, LineChart, Lock, ReceiptText, Sparkles } from "lucide-react";
import { Button } from "@/components/Button";
import { ThemeToggle } from "@/components/ThemeToggle";

const features = [
  { icon: ReceiptText, title: "Expense command center", text: "Capture, classify, search, and report business spending with AI-powered categories." },
  { icon: CreditCard, title: "Loan intelligence", text: "Track EMIs, due dates, outstanding balances, and repayment pressure in one place." },
  { icon: Bot, title: "AI financial assistant", text: "Ask for budget plans, risk checks, monthly reports, and cash-flow recommendations." },
  { icon: LineChart, title: "Analytics that move", text: "Understand income, expenses, savings, and category trends without spreadsheet sprawl." }
];

const plans = [
  ["Starter", "₹999", "Expense tracking, AI chat, dashboard analytics"],
  ["Growth", "₹2,499", "Loans, reports, budget recommendations, billing"],
  ["Scale", "₹5,999", "Admin controls, subscription analytics, premium support"]
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-ink dark:bg-ink dark:text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
        <Link href="/" className="text-2xl font-black">LedgrNow</Link>
        <div className="hidden items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300 md:flex">
          <a href="#features">Features</a>
          <Link href="/pricing">Pricing</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/auth/login"><Button variant="secondary">Login</Button></Link>
        </div>
      </nav>

      <section className="relative overflow-hidden border-y border-slate-200 bg-[url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center dark:border-slate-800">
        <div className="absolute inset-0 bg-white/82 dark:bg-ink/78" />
        <div className="relative mx-auto grid min-h-[640px] max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="mb-4 inline-flex items-center gap-2 rounded-md bg-mint/15 px-3 py-2 text-sm font-bold text-emerald-700 dark:text-mint"><Sparkles size={16} /> AI finance management</p>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-normal md:text-7xl">LedgrNow</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-200">Run expenses, loans, income, savings, billing, and AI financial insight from one premium fintech workspace built for fast-moving teams.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth/register"><Button>Start free <ArrowRight size={18} /></Button></Link>
              <Link href="/dashboard"><Button variant="secondary">View dashboard</Button></Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-md p-5 shadow-glow">
            <div className="grid gap-3 sm:grid-cols-2">
              {["Balance ₹8.42L", "Income ₹3.1L", "Expenses ₹1.24L", "Savings 68%"].map((item) => (
                <div key={item} className="rounded-md bg-white p-4 dark:bg-slate-950">
                  <p className="text-sm text-slate-500">{item.split(" ")[0]}</p>
                  <p className="mt-2 text-2xl font-black">{item.replace(item.split(" ")[0], "")}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-md bg-ink p-5 text-white dark:bg-slate-900">
              <p className="text-sm text-slate-300">AI report</p>
              <p className="mt-2 text-xl font-bold">Marketing spend rose 18%, but cash-flow remains healthy. Shift ₹42k to savings before loan cycle closes.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-4 md:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="rounded-md border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                <Icon className="text-coral" />
                <h3 className="mt-5 text-lg font-black">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{feature.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-slate-950">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-3">
          {plans.map(([name, price, text]) => (
            <div key={name} className="rounded-md border border-slate-200 p-6 dark:border-slate-800">
              <h3 className="text-xl font-black">{name}</h3>
              <p className="mt-3 text-4xl font-black">{price}<span className="text-base text-slate-500">/mo</span></p>
              <p className="mt-4 min-h-12 text-sm text-slate-500">{text}</p>
              <p className="mt-6 flex items-center gap-2 text-sm font-semibold"><CheckCircle2 size={17} className="text-mint" /> Razorpay billing ready</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Ananya Rao", "LedgrNow replaced three spreadsheets and gave us weekly AI finance summaries that the whole team can understand."],
            ["Kabir Mehta", "The loan tracker and EMI visibility helped us plan repayment without slowing growth spend."],
            ["Nisha Kapoor", "Expense categorization is fast, clean, and surprisingly accurate for our operating costs."]
          ].map(([name, quote]) => (
            <blockquote key={name} className="rounded-md border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">“{quote}”</p>
              <footer className="mt-4 font-black">{name}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md bg-ink p-8 text-white dark:bg-slate-950">
            <Lock className="text-mint" />
            <h2 className="mt-5 text-3xl font-black">Secure by design</h2>
            <p className="mt-3 text-slate-300">JWT auth, rate limiting, validation, Helmet headers, Prisma boundaries, and environment-based secrets are built into the starter architecture.</p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-3xl font-black">FAQ</h2>
            {["Can I use Google login?", "Does AI data persist?", "Can admins manage subscriptions?"].map((q) => (
              <details key={q} className="mt-4 rounded-md bg-slate-50 p-4 dark:bg-slate-900">
                <summary className="cursor-pointer font-bold">{q}</summary>
                <p className="mt-2 text-sm text-slate-500">Yes. The application includes the matching backend route, database model, and frontend surface for this workflow.</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
