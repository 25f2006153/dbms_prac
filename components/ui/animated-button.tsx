"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, className, variant = "primary", ...props }, ref) => {
    const baseStyles = "relative inline-flex items-center justify-center font-semibold rounded-2xl px-6 py-3 overflow-hidden transition-all duration-300";
    
    const variants = {
      primary: "bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-white shadow-sm dark:shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)]",
      secondary: "bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-neonCyan dark:to-neonBlue text-white dark:text-slate-950 shadow-sm dark:shadow-[0_0_20px_-5px_rgba(108,245,255,0.5)]",
      outline: "border border-slate-350 dark:border-white/20 bg-slate-100/50 dark:bg-white/5 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 hover:border-slate-400 dark:hover:border-white/40",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
        {variant !== "outline" && (
          <motion.div
            className="absolute inset-0 z-0 bg-white opacity-20"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        )}
      </motion.button>
    );
  }
);
AnimatedButton.displayName = "AnimatedButton";
