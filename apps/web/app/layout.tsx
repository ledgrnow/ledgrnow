import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LedgrNow | AI finance management",
  description: "AI-powered expenses, loans, savings, analytics, and financial insights for modern businesses."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
