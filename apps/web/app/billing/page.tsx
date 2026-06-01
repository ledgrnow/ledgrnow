"use client";

import { useState } from "react";
import { Check, CreditCard } from "lucide-react";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/Button";
import { api } from "@/lib/api";

const plans = [
  { id: "starter", name: "Starter", price: "₹999", features: ["Expense AI", "Dashboard", "Monthly reports"] },
  { id: "growth", name: "Growth", price: "₹2,499", features: ["Loan analytics", "Budget AI", "Razorpay billing"] },
  { id: "scale", name: "Scale", price: "₹5,999", features: ["Admin panel", "Audit controls", "Priority support"] }
];

export default function BillingPage() {
  const [message, setMessage] = useState("");
  async function checkout(plan: string) {
    const result = await api<{ order: { id: string } }>("/api/billing/checkout", { method: "POST", body: JSON.stringify({ plan, billingCycle: "MONTHLY" }) });
    setMessage(`Razorpay order created: ${result.order.id}`);
  }
  return (
    <Shell>
      <div className="mb-6 flex items-center gap-3"><CreditCard className="text-coral" /><h2 className="text-2xl font-black">Subscription plans</h2></div>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className="rounded-md border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-xl font-black">{plan.name}</h3>
            <p className="mt-3 text-4xl font-black">{plan.price}<span className="text-sm text-slate-500">/mo</span></p>
            <div className="mt-6 space-y-3">
              {plan.features.map((feature) => <p key={feature} className="flex items-center gap-2 text-sm"><Check size={16} className="text-mint" /> {feature}</p>)}
            </div>
            <Button className="mt-6 w-full" onClick={() => checkout(plan.id)}>Create checkout</Button>
          </div>
        ))}
      </div>
      {message && <p className="mt-5 rounded-md bg-mint/10 p-4 text-sm font-semibold text-emerald-700">{message}</p>}
    </Shell>
  );
}
