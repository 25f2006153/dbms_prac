"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { DataTable } from "@/lib/types";

export function TableView({
  table,
  className,
  highlightRows = [],
  highlightColumns = [],
  compact = false
}: {
  table: DataTable;
  className?: string;
  highlightRows?: number[];
  highlightColumns?: string[];
  compact?: boolean;
}) {
  return (
    <div 
      className={cn(
        "overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slateNight/45 backdrop-blur-md shadow-2xl relative w-full transition-all duration-500",
        "perspective-1000 transform-gpu hover:rotate-x-3 hover:rotate-y-3 hover:-translate-y-1 hover:shadow-[0_25px_50px_-12px_rgba(108,245,255,0.25)] dark:hover:shadow-[0_25px_50px_-12px_rgba(108,245,255,0.35)]",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* 3D Glassmorphic overlay highlights */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-cyan-500/10 pointer-events-none rounded-3xl" />
      {/* Glow highlight for the active table */}
      {highlightRows.length > 0 && (
        <div className="absolute inset-0 bg-neonCyan/5 pointer-events-none transition-opacity duration-300 animate-pulse-glow" />
      )}
      
      <div className={cn("border-b border-slate-200 dark:border-white/8 relative z-10", compact ? "px-4 py-2.5" : "px-6 py-4")}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className={cn("font-display font-bold uppercase tracking-[0.2em] text-gradient", compact ? "text-xs" : "text-sm")}>
              {table.name}
            </p>
            <p className={cn("mt-1 text-slate-500 dark:text-slate-400 font-sans", compact ? "text-[10px]" : "text-xs")}>{table.caption}</p>
          </div>
          <div className={cn("rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2 py-0.5 font-medium font-mono text-slate-600 dark:text-slate-300", compact ? "text-[10px]" : "text-xs")}>
            {table.rows.length} rows
          </div>
        </div>
      </div>

      <div className="overflow-x-auto relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <table className="min-w-full divide-y divide-slate-100 dark:divide-white/5 text-left text-sm font-sans">
          <thead className="bg-slate-50/70 dark:bg-white/5 font-display">
            <tr>
              {table.columns.map((column) => (
                <th
                  key={column}
                  className={cn(
                    "font-mono uppercase transition-colors duration-300 font-bold",
                    compact 
                      ? "px-3 py-2 text-[10px] tracking-wider text-slate-500 dark:text-slate-450" 
                      : "px-6 py-4 text-xs tracking-[0.16em] text-slate-500 dark:text-slate-450",
                    highlightColumns.includes(column) && "text-cyan-600 dark:text-neonCyan border-b-2 border-cyan-500 dark:border-neonCyan"
                  )}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            <AnimatePresence mode="popLayout">
              {table.rows.map((row, rowIndex) => {
                const isHighlighted = highlightRows.includes(rowIndex);
                return (
                  <motion.tr
                    key={`${table.name}-${row.join("-")}`}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      delay: rowIndex * 0.05
                    }}
                    className={cn(
                      "transition-all duration-300 relative group",
                      isHighlighted 
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 dark:from-neonCyan/20 dark:to-neonBlue/10 text-cyan-950 dark:text-white font-semibold shadow-[0_0_15px_rgba(6,182,212,0.25)] border-l-4 border-cyan-500" 
                        : "text-slate-800 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-white/5"
                    )}
                    style={{
                      transform: isHighlighted ? "translateZ(15px) scale(1.02)" : "translateZ(0px)",
                      transformStyle: "preserve-3d"
                    }}
                  >
                    {row.map((cell, cellIndex) => {
                      const colName = table.columns[cellIndex];
                      const isColHighlighted = highlightColumns.includes(colName);
                      return (
                        <motion.td
                          key={`${table.name}-${rowIndex}-${cellIndex}`}
                          layout
                          className={cn(
                            "font-mono transition-colors duration-300 relative",
                            compact ? "px-3 py-2 text-xs" : "px-6 py-4",
                            isColHighlighted && "text-slate-900 dark:text-white bg-slate-200/50 dark:bg-white/5",
                            isHighlighted && "text-cyan-600 dark:text-neonCyan font-bold"
                          )}
                        >
                          {isHighlighted && cellIndex === 0 && (
                            <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 dark:bg-neonCyan animate-ping" />
                          )}
                          {cell}
                        </motion.td>
                      );
                    })}
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
