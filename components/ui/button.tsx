"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

const variantClasses = {
  primary:
    "bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 dark:from-cyan-300 dark:via-sky-400 dark:to-blue-500 text-white dark:text-slate-950 shadow-sm dark:shadow-glow hover:brightness-105 dark:hover:shadow-pulse transition-all duration-300",
  secondary:
    "border border-slate-200 bg-slate-100/80 text-slate-800 hover:border-slate-300 hover:bg-slate-200 dark:border-white/12 dark:bg-white/6 dark:text-slate-50 dark:hover:border-cyan-300/40 dark:hover:bg-white/10",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/6 dark:hover:text-white"
};

const sizeClasses = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm sm:text-base",
  lg: "px-6 py-3 text-base"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";
