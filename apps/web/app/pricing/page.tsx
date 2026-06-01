import Link from "next/link";
import { Button } from "@/components/Button";
import { ThemeToggle } from "@/components/ThemeToggle";

const plans = [
  ["Starter", "₹999", "For founders and freelancers"],
  ["Growth", "₹2,499", "For growing businesses"],
  ["Scale", "₹5,999", "For teams that need admin controls"]
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 text-ink dark:bg-ink dark:text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between py-4"><Link href="/" className="text-2xl font-black">LedgrNow</Link><ThemeToggle /></div>
      <section className="mx-auto max-w-7xl py-16">
        <h1 className="text-5xl font-black">Pricing</h1>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {plans.map(([name, price, text]) => (
            <div key={name} className="rounded-md border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
              <h2 className="text-xl font-black">{name}</h2><p className="mt-4 text-4xl font-black">{price}</p><p className="mt-3 text-slate-500">{text}</p>
              <Link href="/auth/register"><Button className="mt-6 w-full">Start now</Button></Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
