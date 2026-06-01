"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/Button";
import { api, formatMoney } from "@/lib/api";

type Expense = { id: string; title: string; amount: string; category: string; merchant?: string; spentAt: string };

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState("");

  async function load() {
    const result = await api<{ expenses: Expense[] }>(`/api/expenses?search=${encodeURIComponent(search)}`);
    setExpenses(result.expenses);
  }

  useEffect(() => {
    load().catch(() => setExpenses([]));
  }, []);

  async function add(formData: FormData) {
    await api("/api/expenses", {
      method: "POST",
      body: JSON.stringify({
        title: formData.get("title"),
        amount: Number(formData.get("amount")),
        category: formData.get("category") || undefined,
        merchant: formData.get("merchant"),
        spentAt: formData.get("spentAt")
      })
    });
    await load();
  }

  return (
    <Shell>
      <div className="grid gap-4 xl:grid-cols-[380px_1fr]">
        <form action={add} className="rounded-md border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-xl font-black">Add expense</h2>
          <div className="mt-5 space-y-3">
            <input name="title" required placeholder="Expense title" className="h-11 w-full rounded-md border border-slate-200 px-3 dark:border-slate-700 dark:bg-slate-900" />
            <input name="amount" required type="number" min="1" placeholder="Amount" className="h-11 w-full rounded-md border border-slate-200 px-3 dark:border-slate-700 dark:bg-slate-900" />
            <input name="category" placeholder="Category or leave blank for AI" className="h-11 w-full rounded-md border border-slate-200 px-3 dark:border-slate-700 dark:bg-slate-900" />
            <input name="merchant" placeholder="Merchant" className="h-11 w-full rounded-md border border-slate-200 px-3 dark:border-slate-700 dark:bg-slate-900" />
            <input name="spentAt" required type="date" className="h-11 w-full rounded-md border border-slate-200 px-3 dark:border-slate-700 dark:bg-slate-900" />
            <Button className="w-full"><Plus size={17} /> Save expense</Button>
          </div>
        </form>
        <section className="rounded-md border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-black">Expense management</h2>
            <div className="flex h-11 items-center gap-2 rounded-md border border-slate-200 px-3 dark:border-slate-700">
              <Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") load(); }} placeholder="Search" className="bg-transparent outline-none" />
            </div>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500"><tr><th className="py-3">Title</th><th>Category</th><th>Merchant</th><th>Amount</th><th>Date</th></tr></thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="py-3 font-semibold">{expense.title}</td><td>{expense.category}</td><td>{expense.merchant ?? "-"}</td><td>{formatMoney(Number(expense.amount))}</td><td>{new Date(expense.spentAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Shell>
  );
}
