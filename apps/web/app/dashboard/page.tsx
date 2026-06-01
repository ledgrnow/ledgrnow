"use client";

import { useEffect, useState } from "react";
import { CreditCard, IndianRupee, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { Shell } from "@/components/Shell";
import { StatCard } from "@/components/StatCard";
import { api, formatMoney } from "@/lib/api";

type Dashboard = {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  loansOutstanding: number;
  savings: { current: number; target: number };
  categorySpend: Array<{ category: string; amount: number }>;
  recentTransactions: Array<{ id: string; title: string; type: string; amount: string; occurredAt: string }>;
};

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    api<Dashboard>("/api/dashboard").then(setData).catch(() => setData({
      totalBalance: 842000,
      monthlyIncome: 310000,
      monthlyExpenses: 124000,
      loansOutstanding: 420000,
      savings: { current: 245000, target: 360000 },
      categorySpend: [
        { category: "Software", amount: 34000 },
        { category: "Marketing", amount: 52000 },
        { category: "Travel", amount: 18000 },
        { category: "Payroll", amount: 20000 }
      ],
      recentTransactions: []
    }));
  }, []);

  const max = Math.max(...(data?.categorySpend.map((item) => item.amount) ?? [1]));

  return (
    <Shell>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total balance" value={formatMoney(data?.totalBalance ?? 0)} detail="Income less expenses this month" icon={<IndianRupee size={20} />} />
        <StatCard label="Monthly income" value={formatMoney(data?.monthlyIncome ?? 0)} detail="Recorded income transactions" icon={<TrendingUp size={20} />} />
        <StatCard label="Monthly expenses" value={formatMoney(data?.monthlyExpenses ?? 0)} detail="Tracked expenses this month" icon={<TrendingDown size={20} />} />
        <StatCard label="Loans outstanding" value={formatMoney(data?.loansOutstanding ?? 0)} detail="Active principal remaining" icon={<CreditCard size={20} />} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-md border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-xl font-black">Expense analytics</h2>
          <div className="mt-6 space-y-4">
            {data?.categorySpend.map((item) => (
              <div key={item.category}>
                <div className="mb-2 flex justify-between text-sm"><span>{item.category}</span><span>{formatMoney(item.amount)}</span></div>
                <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-3 rounded-full bg-coral" style={{ width: `${(item.amount / max) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-md border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <PiggyBank className="text-mint" />
          <h2 className="mt-4 text-xl font-black">Savings tracker</h2>
          <p className="mt-2 text-4xl font-black">{Math.round(((data?.savings.current ?? 0) / Math.max(data?.savings.target ?? 1, 1)) * 100)}%</p>
          <p className="mt-2 text-sm text-slate-500">{formatMoney(data?.savings.current ?? 0)} saved toward {formatMoney(data?.savings.target ?? 0)}</p>
          <div className="mt-5 h-4 rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-4 rounded-full bg-mint" style={{ width: `${Math.min(100, ((data?.savings.current ?? 0) / Math.max(data?.savings.target ?? 1, 1)) * 100)}%` }} />
          </div>
        </section>
      </div>
    </Shell>
  );
}
