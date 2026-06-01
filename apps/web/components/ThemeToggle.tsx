"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("ledgrnow_theme") === "dark";
    setDark(saved);
    document.documentElement.classList.toggle("dark", saved);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("ledgrnow_theme", next ? "dark" : "light");
  }

  return (
    <button aria-label="Toggle dark mode" title="Toggle dark mode" onClick={toggle} className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 bg-white text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-white">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
