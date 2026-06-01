"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Users } from "lucide-react";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";

type User = { id: string; name: string; email: string; role: string; createdAt: string };
type Analytics = { users: number; activeSubscriptions: number; expenses: number; aiChats: number };

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  useEffect(() => {
    api<{ users: User[] }>("/api/admin/users").then((result) => setUsers(result.users)).catch(() => setUsers([]));
    api<Analytics>("/api/admin/analytics").then(setAnalytics).catch(() => setAnalytics(null));
  }, []);
  return (
    <Shell>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Users", analytics?.users ?? 0],
          ["Active subscriptions", analytics?.activeSubscriptions ?? 0],
          ["Expenses", analytics?.expenses ?? 0],
          ["AI chats", analytics?.aiChats ?? 0]
        ].map(([label, value]) => (
          <div key={label} className="rounded-md border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <ShieldCheck className="text-mint" /><p className="mt-4 text-sm text-slate-500">{label}</p><p className="text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>
      <section className="mt-6 rounded-md border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
        <h2 className="flex items-center gap-2 text-xl font-black"><Users size={19} /> User management</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500"><tr><th className="py-3">Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
            <tbody>{users.map((user) => <tr key={user.id} className="border-t border-slate-100 dark:border-slate-800"><td className="py-3 font-semibold">{user.name}</td><td>{user.email}</td><td>{user.role}</td><td>{new Date(user.createdAt).toLocaleDateString()}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </Shell>
  );
}
