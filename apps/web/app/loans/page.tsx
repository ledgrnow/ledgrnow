"use client";

import { useEffect, useState } from "react";
import { Calculator, Plus } from "lucide-react";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/Button";
import { api, formatMoney } from "@/lib/api";

type Loan = { id: string; lenderName: string; principal: string; outstanding: string; emiAmount: string; interestRate: string; status: string; nextPaymentDue?: string };

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [emi, setEmi] = useState("");
  async function load() {
    const result = await api<{ loans: Loan[] }>("/api/loans");
    setLoans(result.loans);
  }
  useEffect(() => { load().catch(() => setLoans([])); }, []);

  async function createLoan(formData: FormData) {
    await api("/api/loans", {
      method: "POST",
      body: JSON.stringify({
        lenderName: formData.get("lenderName"),
        principal: Number(formData.get("principal")),
        interestRate: Number(formData.get("interestRate")),
        tenureMonths: Number(formData.get("tenureMonths")),
        startDate: formData.get("startDate")
      })
    });
    await load();
  }

  async function calculate(formData: FormData) {
    const result = await api<{ emi: number; totalPayable: number }>("/api/loans/emi", {
      method: "POST",
      body: JSON.stringify({ principal: Number(formData.get("principal")), interestRate: Number(formData.get("interestRate")), tenureMonths: Number(formData.get("tenureMonths")) })
    });
    setEmi(`${formatMoney(result.emi)} EMI, ${formatMoney(result.totalPayable)} total`);
  }

  return (
    <Shell>
      <div className="grid gap-4 xl:grid-cols-[380px_1fr]">
        <div className="space-y-4">
          <form action={createLoan} className="rounded-md border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-xl font-black">Track loan</h2>
            <div className="mt-5 space-y-3">
              <input name="lenderName" required placeholder="Lender" className="h-11 w-full rounded-md border border-slate-200 px-3 dark:border-slate-700 dark:bg-slate-900" />
              <input name="principal" required type="number" placeholder="Principal" className="h-11 w-full rounded-md border border-slate-200 px-3 dark:border-slate-700 dark:bg-slate-900" />
              <input name="interestRate" required type="number" step="0.01" placeholder="Annual interest %" className="h-11 w-full rounded-md border border-slate-200 px-3 dark:border-slate-700 dark:bg-slate-900" />
              <input name="tenureMonths" required type="number" placeholder="Tenure months" className="h-11 w-full rounded-md border border-slate-200 px-3 dark:border-slate-700 dark:bg-slate-900" />
              <input name="startDate" required type="date" className="h-11 w-full rounded-md border border-slate-200 px-3 dark:border-slate-700 dark:bg-slate-900" />
              <Button className="w-full"><Plus size={17} /> Add loan</Button>
            </div>
          </form>
          <form action={calculate} className="rounded-md border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <h2 className="flex items-center gap-2 text-xl font-black"><Calculator size={19} /> EMI calculator</h2>
            <div className="mt-5 grid gap-3">
              <input name="principal" required type="number" placeholder="Principal" className="h-11 rounded-md border border-slate-200 px-3 dark:border-slate-700 dark:bg-slate-900" />
              <input name="interestRate" required type="number" step="0.01" placeholder="Interest %" className="h-11 rounded-md border border-slate-200 px-3 dark:border-slate-700 dark:bg-slate-900" />
              <input name="tenureMonths" required type="number" placeholder="Months" className="h-11 rounded-md border border-slate-200 px-3 dark:border-slate-700 dark:bg-slate-900" />
              <Button variant="secondary">Calculate</Button>
            </div>
            {emi && <p className="mt-4 rounded-md bg-mint/10 p-3 text-sm font-semibold text-emerald-700">{emi}</p>}
          </form>
        </div>
        <section className="rounded-md border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-xl font-black">Loan tracker</h2>
          <div className="mt-5 grid gap-3">
            {loans.map((loan) => (
              <div key={loan.id} className="rounded-md bg-slate-50 p-4 dark:bg-slate-900">
                <div className="flex flex-wrap justify-between gap-3"><p className="font-black">{loan.lenderName}</p><span className="text-sm font-bold text-coral">{loan.status}</span></div>
                <p className="mt-2 text-sm text-slate-500">Outstanding {formatMoney(Number(loan.outstanding))} · EMI {formatMoney(Number(loan.emiAmount))} · {loan.interestRate}%</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
