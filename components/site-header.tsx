"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, GraduationCap, Layers3, Sparkles, Sun, Moon } from "lucide-react";

import { useProgress } from "@/components/progress-provider";
import { Badge } from "@/components/ui/badge";
import { cn, formatPercent } from "@/lib/utils";

const links = [
  { href: "/", label: "Home", icon: GraduationCap },
  { href: "/modules", label: "Modules", icon: Layers3 },
  { href: "/topics/select", label: "Start Lesson", icon: BookOpen }
];

export function SiteHeader() {
  const pathname = usePathname();
  const { completionRate, learnerName, xp, level, levelProgress } = useProgress();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      if (saved === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-indigo-500/20 bg-ink/75 backdrop-blur-2xl transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-neonCyan to-transparent opacity-50" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-neonCyan bg-neonCyan/10 text-neonCyan shadow-[0_0_20px_rgba(0,240,255,0.4)] animate-pulse relative overflow-hidden">
            <span className="font-display text-lg font-black tracking-tight z-10">SQL</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-shimmer" />
          </div>
          <div className="text-left">
            <p className="font-display text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-neonRose tracking-tight sm:text-lg">
              DBMS Visual Lab
            </p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-mono">Premium Cinema learning</p>
          </div>
        </Link>

        {/* Links Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
                  active
                    ? "bg-slate-200/80 dark:bg-white/10 text-slate-900 dark:text-white shadow-inner"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Gamified Stat indicators */}
        <div className="flex items-center gap-4">
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition hover:bg-slate-100 dark:hover:bg-white/10"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-neonGold animate-pulse" />
            ) : (
              <Moon className="h-4 w-4 text-neonBlue" />
            )}
          </button>
          
          {/* Duolingo style XP & Level tracking */}
          <div className="hidden sm:flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-neonGold animate-pulse" />
              <span>Lvl {level}</span>
              <span className="text-slate-400 dark:text-slate-500">•</span>
              <span className="text-neonCyan">{xp} XP</span>
            </div>
            
            {/* Level Mini Progress Bar */}
            <div className="w-24 h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden border border-slate-300/40 dark:border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-neonCyan to-neonBlue transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>

          <Badge className="bg-neonMint/10 border border-neonMint/20 text-neonMint hidden md:inline-flex rounded-full px-3 py-1">
            {formatPercent(completionRate)} Complete
          </Badge>

          <Link
            href="/topics/select"
            className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 inline-flex"
          >
            {learnerName}
          </Link>
        </div>
      </div>
    </header>
  );
}
