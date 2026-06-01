"use client";

import { motion } from "framer-motion";
import type { MouseEventHandler, ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export function Button({ children, variant = "primary", className = "", type = "submit", disabled, onClick }: Props) {
  const styles = {
    primary: "bg-ink text-white dark:bg-mint dark:text-ink shadow-glow",
    secondary: "bg-white text-ink border border-slate-200 dark:bg-slate-900 dark:text-white dark:border-slate-700",
    ghost: "bg-transparent text-ink dark:text-white"
  };
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </motion.button>
  );
}
