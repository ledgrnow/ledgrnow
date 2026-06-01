import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/Button";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 text-ink dark:bg-ink dark:text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between py-4"><Link href="/" className="text-2xl font-black">LedgrNow</Link><ThemeToggle /></div>
      <section className="mx-auto grid max-w-7xl gap-8 py-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h1 className="text-5xl font-black">Contact</h1>
          <p className="mt-4 text-slate-500">Talk to the LedgrNow team about finance operations, AI reporting, and rollout planning.</p>
          <div className="mt-8 space-y-4 text-sm font-semibold">
            <p className="flex items-center gap-3"><Mail className="text-coral" /> hello@ledgrnow.com</p>
            <p className="flex items-center gap-3"><Phone className="text-coral" /> +91 80 4567 1090</p>
            <p className="flex items-center gap-3"><MapPin className="text-coral" /> Bengaluru, India</p>
          </div>
        </div>
        <form className="rounded-md border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <div className="grid gap-3">
            <input required placeholder="Name" className="h-12 rounded-md border border-slate-200 px-4 dark:border-slate-700 dark:bg-slate-900" />
            <input required type="email" placeholder="Email" className="h-12 rounded-md border border-slate-200 px-4 dark:border-slate-700 dark:bg-slate-900" />
            <textarea required placeholder="Message" rows={6} className="rounded-md border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-900" />
            <Button>Send message</Button>
          </div>
        </form>
      </section>
    </main>
  );
}
