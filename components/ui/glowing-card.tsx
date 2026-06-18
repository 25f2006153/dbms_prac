"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowingCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  glowColor?: "cyan" | "rose" | "mint" | "gold" | "blue";
  hoverEffect?: boolean;
}

export function GlowingCard({
  children,
  className,
  glowColor = "cyan",
  hoverEffect = true,
  ...props
}: GlowingCardProps) {
  const glowMap = {
    cyan: "hover:shadow-[0_0_40px_-10px_rgba(108,245,255,0.4)]",
    rose: "hover:shadow-[0_0_40px_-10px_rgba(251,113,133,0.4)]",
    mint: "hover:shadow-[0_0_40px_-10px_rgba(139,255,216,0.4)]",
    gold: "hover:shadow-[0_0_40px_-10px_rgba(250,204,21,0.4)]",
    blue: "hover:shadow-[0_0_40px_-10px_rgba(96,165,250,0.4)]",
  };

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative rounded-3xl glass-panel p-6 overflow-hidden group transition-all duration-500",
        hoverEffect && glowMap[glowColor],
        className
      )}
      {...props}
    >
      {/* Background Gradient Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
