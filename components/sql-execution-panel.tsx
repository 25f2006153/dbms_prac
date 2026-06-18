"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, CheckCircle, Search } from "lucide-react";

import { TableView } from "@/components/table-view";
import { Badge } from "@/components/ui/badge";
import { AnimatedButton } from "@/components/ui/animated-button";
import { GlowingCard } from "@/components/ui/glowing-card";
import type { LessonTopic } from "@/lib/types";

type CinemaState = 
  | "idle"
  | "query-appearing"
  | "syntax-highlighting"
  | "beam-scanning"
  | "scanning-rows"
  | "matching-glow"
  | "forming-result"
  | "success";

export function SqlExecutionPanel({ topic }: { topic: LessonTopic }) {
  const [cinemaState, setCinemaState] = useState<CinemaState>("idle");
  const [activeRowScanIndex, setActiveRowScanIndex] = useState<number>(-1);
  const [formedRows, setFormedRows] = useState<string[][]>([]);
  const [highlightedRows, setHighlightedRows] = useState<number[]>([]);
  
  const primaryTable = topic.tables[0];
  const finalResultTable = topic.resultTable;
  const executionSteps = topic.executionSteps;

  // Simple query syntax highlighting
  const renderHighlightedQuery = (queryText: string) => {
    const keywords = ["SELECT", "FROM", "WHERE", "JOIN", "ON", "AND", "OR", "ORDER BY", "GROUP BY", "INSERT", "UPDATE", "DELETE", "UNION", "HAVING", "AS"];
    const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");
    const parts = queryText.split(regex);

    return parts.map((part, index) => {
      if (part === "AND" || part === "OR") {
        return (
          <span 
            key={index} 
            className="px-1.5 py-0.5 rounded mx-0.5 font-black bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-pulse inline-block"
            title={`${part} Logical Operator Evaluation`}
          >
            {part}
          </span>
        );
      }
      if (keywords.includes(part)) {
        return (
          <span key={index} className="text-neonRose font-extrabold drop-shadow-[0_0_10px_rgba(251,113,133,0.4)]">
            {part}
          </span>
        );
      }
      if (part.startsWith("'") || part.startsWith('"') || (!isNaN(Number(part.trim())) && part.trim() !== "")) {
        return <span key={index} className="text-neonGold font-semibold">{part}</span>;
      }
      return <span key={index} className="text-slate-200">{part}</span>;
    });
  };

  // Cinema Auto-Play Routine
  useEffect(() => {
    if (cinemaState === "idle") {
      setFormedRows([]);
      setHighlightedRows([]);
      setActiveRowScanIndex(-1);
      return;
    }

    let timer: NodeJS.Timeout;

    if (cinemaState === "query-appearing") {
      timer = setTimeout(() => setCinemaState("syntax-highlighting"), 1000);
    } else if (cinemaState === "syntax-highlighting") {
      timer = setTimeout(() => setCinemaState("beam-scanning"), 800);
    } else if (cinemaState === "beam-scanning") {
      timer = setTimeout(() => {
        setCinemaState("scanning-rows");
        setActiveRowScanIndex(0);
      }, 1200);
    } else if (cinemaState === "scanning-rows") {
      if (activeRowScanIndex < primaryTable.rows.length) {
        timer = setTimeout(() => {
          setActiveRowScanIndex(prev => prev + 1);
        }, 500);
      } else {
        // Finished scanning, determine matching rows
        const matched = executionSteps.flatMap(step => step.activeRows || []);
        const uniqueMatched = Array.from(new Set(matched));
        setHighlightedRows(uniqueMatched);
        setCinemaState("matching-glow");
      }
    } else if (cinemaState === "matching-glow") {
      timer = setTimeout(() => {
        setCinemaState("forming-result");
      }, 1000);
    } else if (cinemaState === "forming-result") {
      if (formedRows.length < finalResultTable.rows.length) {
        timer = setTimeout(() => {
          setFormedRows(prev => [...prev, finalResultTable.rows[prev.length]]);
        }, 400);
      } else {
        setCinemaState("success");
      }
    }

    return () => clearTimeout(timer);
  }, [cinemaState, activeRowScanIndex, formedRows.length, primaryTable.rows.length, finalResultTable.rows.length, executionSteps]);

  const startCinema = () => {
    setFormedRows([]);
    setHighlightedRows([]);
    setActiveRowScanIndex(-1);
    setCinemaState("query-appearing");
  };

  const resetCinema = () => {
    setCinemaState("idle");
  };

  return (
    <section className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Badge className="bg-cyan-500/10 dark:bg-neonCyan/20 text-cyan-700 dark:text-neonCyan border border-cyan-500/20 dark:border-neonCyan/30 px-3 py-1 text-xs rounded-full">
            Step-by-Step SQL Execution Cinema
          </Badge>
          <h2 className="mt-4 font-display text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Watch SQL Execute Live
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-sans mt-2">
            See the parser read, scan, match, and construct database results in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {cinemaState === "idle" || cinemaState === "success" ? (
            <AnimatedButton variant="secondary" onClick={startCinema} className="px-6 py-3 font-bold text-white dark:text-slate-950">
              <Play className="w-5 h-5 mr-2" /> Play Visual Cinema
            </AnimatedButton>
          ) : (
            <AnimatedButton variant="outline" onClick={resetCinema} className="px-6 py-3 font-semibold text-slate-800 dark:text-white">
              <RotateCcw className="w-5 h-5 mr-2" /> Stop & Reset
            </AnimatedButton>
          )}
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
        
        {/* Left Side: Cinema Stage Controller & Steps */}
        <div className="space-y-6">
          <GlowingCard glowColor="blue" className="bg-slateNight/50 p-6 space-y-6 relative overflow-hidden">
            {cinemaState === "beam-scanning" && (
              <div className="absolute inset-x-0 h-1 bg-neonCyan/50 shadow-[0_0_20px_rgba(108,245,255,0.8)] z-20 top-0 animate-scan" />
            )}
            
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3">SQL Parser Code block</p>
              <div className="relative rounded-2xl bg-ink border border-white/5 p-6 font-mono text-sm leading-relaxed overflow-hidden min-h-[100px] flex items-center">
                {cinemaState === "idle" ? (
                  <span className="text-slate-500 font-sans italic">Click "Play Visual Cinema" above to begin.</span>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full text-left"
                  >
                    {cinemaState === "query-appearing" ? (
                      <span className="text-slate-400">{topic.query}</span>
                    ) : (
                      renderHighlightedQuery(topic.query)
                    )}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Stepper progress indicator */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              {[
                { state: "query-appearing", label: "Step 1: SQL query loading", desc: "Parser extracts SQL statement parameters." },
                { state: "syntax-highlighting", label: "Step 2: Semantic syntax validation", desc: "Highlighting SELECT, FROM, WHERE expressions." },
                { state: "beam-scanning", label: "Step 3: Database scanning beam", desc: "Preparing sequence scan of relations." },
                { state: "scanning-rows", label: "Step 4: Row-by-row scanner active", desc: "Filtering matching rows in real time." },
                { state: "matching-glow", label: "Step 5: Matching records glow", desc: "Highlighting qualifying keys & attributes." },
                { state: "forming-result", label: "Step 6: Dynamic result construction", desc: "Writing output dataset rows." },
                { state: "success", label: "Step 7: Sequence success", desc: "Execution finished with 100% database parity." }
              ].map((step, idx) => {
                const isActive = cinemaState === step.state;
                const isCompleted = [
                  "query-appearing", "syntax-highlighting", "beam-scanning", "scanning-rows", "matching-glow", "forming-result", "success"
                ].indexOf(cinemaState) > idx;

                return (
                  <div key={idx} className={`flex gap-4 items-start transition-all duration-300 ${isActive ? "opacity-100 scale-100" : isCompleted ? "opacity-60" : "opacity-30"}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold border mt-1 shrink-0 transition-all ${
                      isActive 
                        ? "bg-neonCyan text-ink border-neonCyan shadow-[0_0_15px_rgba(108,245,255,0.4)]" 
                        : isCompleted 
                        ? "bg-slate-200 dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-800 dark:text-white" 
                        : "border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500"
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="text-left">
                      <p className={`font-display text-sm font-bold transition-colors ${isActive ? "text-cyan-600 dark:text-neonCyan" : "text-slate-800 dark:text-white"}`}>
                        {step.label}
                      </p>
                      {isActive && (
                        <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-1">
                          {step.desc}
                        </motion.p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </GlowingCard>
        </div>

        {/* Right Side: Virtual Database Environment & Tables */}
        <div className="space-y-8 relative min-h-[500px]">
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Primary Table Scan view */}
            <div className="relative">
              {cinemaState === "scanning-rows" && activeRowScanIndex >= 0 && activeRowScanIndex < primaryTable.rows.length && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neonCyan/10 border border-neonCyan/30 rounded-3xl p-4 flex items-center gap-2 pointer-events-none backdrop-blur-md z-30 shadow-2xl animate-pulse">
                  <Search className="w-5 h-5 text-neonCyan animate-spin" />
                  <span className="text-neonCyan font-mono text-xs font-bold">Scanning Row {activeRowScanIndex + 1}...</span>
                </div>
              )}
              
              <TableView
                table={primaryTable}
                highlightRows={
                  cinemaState === "scanning-rows" && activeRowScanIndex < primaryTable.rows.length
                    ? [activeRowScanIndex]
                    : cinemaState === "matching-glow" || cinemaState === "forming-result" || cinemaState === "success"
                    ? highlightedRows
                    : []
                }
              />
            </div>

            {/* Virtual Result Construction view */}
            <div className="relative">
              <AnimatePresence>
                {cinemaState === "success" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 bg-ink/85 backdrop-blur-md rounded-3xl border border-neonMint/30 flex flex-col items-center justify-center gap-4 z-40 p-6 shadow-2xl"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <CheckCircle className="w-16 h-16 text-neonMint drop-shadow-[0_0_20px_rgba(139,255,216,0.4)]" />
                    </motion.div>
                    <div className="text-center space-y-1">
                      <p className="font-display text-2xl font-black text-slate-900 dark:text-white tracking-tight">Execution Completed</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-sans">100% matches validated (+15 XP)</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <TableView
                table={{
                  ...finalResultTable,
                  rows: cinemaState === "forming-result" || cinemaState === "success" ? formedRows : []
                }}
                className={cinemaState === "forming-result" ? "border-neonCyan/30 shadow-[0_0_30px_rgba(108,245,255,0.15)]" : ""}
              />
            </div>
          </div>

          {/* Secondary table if exists (like JOIN tables) */}
          {topic.tables[1] && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <TableView table={topic.tables[1]} />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
