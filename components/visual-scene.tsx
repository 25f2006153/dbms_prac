"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { LessonScene, LessonTopic } from "@/lib/types";
import { 
  Database, ArrowRight, RefreshCw, 
  Sparkles, CheckCircle, AlertCircle
} from "lucide-react";
import { TableView } from "@/components/table-view";

type ExecPhase = "FROM" | "WHERE" | "SELECT" | "DISTINCT" | "RESULT" | "PITFALL";

export function VisualScene({
  scene,
  topic
}: {
  scene: LessonScene;
  topic: LessonTopic;
}) {
  const primary = topic.tables[0];
  const secondary = topic.tables[1];

  // Map the active scene directly to the execution phase
  const activePhase = (() => {
    if (scene.kind === "hook") return "FROM";
    if (["filter", "logic", "pattern", "membership"].includes(scene.kind)) return "WHERE";
    if (scene.kind === "distinct") return "DISTINCT";
    if (scene.kind === "summary") return "RESULT";
    if (scene.kind === "pitfall") return "PITFALL";
    return "SELECT"; // default for projection/cartesian/rename/sort/aggregate/etc.
  })();

  // Dynamic Stepper Steps present in the query
  const phases = (() => {
    const list: ExecPhase[] = ["FROM"];
    const qUpper = topic.query.toUpperCase();
    if (qUpper.includes("WHERE") || qUpper.includes("ON") || qUpper.includes("HAVING")) {
      list.push("WHERE");
    }
    list.push("SELECT");
    if (qUpper.includes("DISTINCT")) {
      list.push("DISTINCT");
    }
    list.push("RESULT");
    return list;
  })();

  // Cartesian scan loop
  const [cartesianIndex, setCartesianIndex] = useState({ a: 0, b: 0 });
  useEffect(() => {
    if (activePhase !== "SELECT" || scene.kind !== "cartesian" || !secondary) return;
    const interval = setInterval(() => {
      setCartesianIndex((prev) => {
        const nextB = (prev.b + 1) % secondary.rows.length;
        const nextA = nextB === 0 ? (prev.a + 1) % primary.rows.length : prev.a;
        return { a: nextA, b: nextB };
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [activePhase, scene.kind, primary, secondary]);

  // Sort loop
  const [isSorted, setIsSorted] = useState(false);
  useEffect(() => {
    if (activePhase !== "SELECT" || scene.kind !== "sort") return;
    const interval = setInterval(() => {
      setIsSorted((prev) => !prev);
    }, 2500);
    return () => clearInterval(interval);
  }, [activePhase, scene.kind]);

  // Filter scan loop
  const [filterScanIndex, setFilterScanIndex] = useState(0);
  useEffect(() => {
    if (activePhase !== "WHERE") return;
    const interval = setInterval(() => {
      setFilterScanIndex((prev) => (prev + 1) % primary.rows.length);
    }, 1400);
    return () => clearInterval(interval);
  }, [activePhase, primary]);

  // Find columns in primary table that are inside WHERE clause
  const getWhereColumns = () => {
    const qUpper = topic.query.toUpperCase();
    return primary.columns.filter(col => qUpper.includes(col.toUpperCase()));
  };

  // Find columns selected in SELECT clause
  const getSelectColumns = () => {
    const qUpper = topic.query.toUpperCase();
    // Get everything before FROM
    const selectPart = qUpper.split("FROM")[0];
    return primary.columns.filter(col => selectPart.includes(col.toUpperCase()));
  };

  // Syntax highlighting helper for query display
  const highlightQueryByPhase = (queryText: string, currentPhase: ExecPhase) => {
    const keywords = ["SELECT", "FROM", "WHERE", "JOIN", "ON", "AND", "OR", "ORDER BY", "GROUP BY", "DISTINCT", "HAVING", "LIMIT"];
    const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");
    const parts = queryText.split(regex);

    return parts.map((part, index) => {
      const isKeyword = keywords.includes(part);
      let highlight = false;

      if (isKeyword) {
        if (currentPhase === "FROM" && part === "FROM") highlight = true;
        if (currentPhase === "WHERE" && ["WHERE", "ON", "AND", "OR", "HAVING"].includes(part)) highlight = true;
        if (currentPhase === "SELECT" && part === "SELECT") highlight = true;
        if (currentPhase === "DISTINCT" && part === "DISTINCT") highlight = true;
      }

      return (
        <span
          key={index}
          className={
            highlight
              ? "text-neonCyan font-extrabold underline decoration-neonCyan decoration-2 drop-shadow-[0_0_10px_rgba(108,245,255,0.6)] transition-all duration-300"
              : isKeyword
              ? "text-neonRose font-semibold opacity-70"
              : "text-slate-300 opacity-60"
          }
        >
          {part}
        </span>
      );
    });
  };

  // Determine highlighted rows in primary table during WHERE filter
  const getFilteredRowIndices = () => {
    return primary.rows
      .map((row, idx) => (topic.resultTable.rows.some(r => r[0] === row[0]) ? idx : -1))
      .filter(idx => idx !== -1);
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-b from-slateNight to-ink border-white/10 p-0 relative min-h-[580px] flex flex-col justify-between shadow-2xl">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid bg-[size:32px_32px] opacity-[0.03] pointer-events-none" />

      {/* TOP HEADER: Prominent Query Box */}
      <div className="border-b border-white/10 bg-slateNight/80 backdrop-blur-md p-6 relative z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 text-left w-full">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold font-mono">SQL Query Definition</span>
          <pre className="font-mono text-base leading-relaxed break-all bg-black/40 border border-white/5 p-4 rounded-xl w-full text-left select-all">
            {highlightQueryByPhase(topic.query, activePhase)}
          </pre>
        </div>
      </div>

      {/* MAIN CONTAINER: Split view */}
      <div className="grid gap-0 lg:grid-cols-[1.3fr_0.7fr] flex-1">
        
        {/* Left: Logical Execution Animation Stage */}
        <div className="relative overflow-hidden border-b border-white/10 p-8 lg:border-b-0 lg:border-r flex flex-col justify-center min-h-[420px]">
          
          {/* Phase Stepper Flow Header */}
          <div className="flex gap-2 mb-8 overflow-x-auto justify-start pb-2 shrink-0">
            {phases.map((p, idx) => {
              const active = p === activePhase;
              const completed = phases.indexOf(activePhase) > phases.indexOf(p) && activePhase !== "PITFALL";
              return (
                <div 
                  key={p}
                  className={`px-3 py-1.5 rounded-full border text-[10px] font-mono font-bold tracking-wider uppercase transition-all duration-500 shrink-0 ${
                    active 
                      ? "bg-neonCyan/20 text-neonCyan border-neonCyan shadow-[0_0_15px_rgba(108,245,255,0.25)]" 
                      : completed 
                      ? "bg-white/5 border-white/10 text-white/60" 
                      : "border-white/5 text-slate-600"
                  }`}
                >
                  {idx + 1}. {p}
                </div>
              );
            })}
            {activePhase === "PITFALL" && (
              <div className="px-3 py-1.5 rounded-full border bg-rose-500/20 text-rose-300 border-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.25)] text-[10px] font-mono font-bold tracking-wider uppercase shrink-0">
                ⚠ PITFALL LAYER
              </div>
            )}
          </div>

          <div className="relative z-10 w-full flex-1 flex flex-col justify-center">
            
            {/* Phase 1: FROM (Target table lights up) */}
            {activePhase === "FROM" && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 text-center"
              >
                <div className="flex justify-center mb-2 animate-bounce">
                  <Database className="w-10 h-10 text-neonCyan drop-shadow-[0_0_20px_rgba(108,245,255,0.4)]" />
                </div>
                <p className="text-xs font-mono text-neonCyan uppercase tracking-widest">Loading Relation FROM Disk</p>
                
                <div className="w-full max-w-md mx-auto">
                  <TableView 
                    table={primary} 
                    highlightRows={[]} 
                    highlightColumns={[]} 
                    className="border-neonCyan shadow-[0_0_35px_rgba(108,245,255,0.15)] transition-all duration-500"
                  />
                </div>
              </motion.div>
            )}

            {/* Phase 2: WHERE (Filter columns blink) */}
            {activePhase === "WHERE" && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <p className="text-xs font-mono text-neonGold uppercase tracking-widest text-center">Evaluating Row Filters (WHERE Clause)</p>
                
                <div className="w-full max-w-md mx-auto relative">
                  {/* Laser Scan beam effect */}
                  <div className="absolute inset-x-0 h-0.5 bg-neonGold/50 top-1/3 shadow-[0_0_15px_rgba(250,204,21,0.8)] animate-scan pointer-events-none z-20" />
                  
                  <TableView 
                    table={primary}
                    highlightRows={getFilteredRowIndices()}
                    highlightColumns={getWhereColumns()}
                    className="border-neonGold/40 shadow-[0_0_30px_rgba(250,204,21,0.08)]"
                  />
                </div>
              </motion.div>
            )}

            {/* Phase 3: SELECT (Target columns blink and float) */}
            {activePhase === "SELECT" && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <p className="text-xs font-mono text-neonCyan uppercase tracking-widest text-center">Projecting Columns (SELECT projection)</p>
                                {scene.kind === "cartesian" && secondary ? (
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 max-w-4xl mx-auto">
                    <TableView 
                      table={primary} 
                      highlightRows={[cartesianIndex.a]} 
                      highlightColumns={[]}
                      className="text-xs shadow-inner"
                      compact
                    />

                    <div className="h-[120px] relative overflow-hidden flex flex-col justify-center items-center px-4">
                      <svg className="w-full h-full absolute inset-0 overflow-visible pointer-events-none">
                        <motion.path
                          key={`${cartesianIndex.a}-${cartesianIndex.b}`}
                          d={`M 0,${35 + cartesianIndex.a * 35} L 150,${35 + cartesianIndex.b * 35}`}
                          stroke="#facc15"
                          strokeWidth="2.5"
                          fill="none"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                        />
                      </svg>
                      <div className="z-10 rounded-full bg-neonGold/25 border border-neonGold/30 px-3 py-1 text-[9px] font-mono text-neonGold font-bold animate-pulse">
                        A[{cartesianIndex.a}] × B[{cartesianIndex.b}]
                      </div>
                    </div>

                    <TableView 
                      table={secondary} 
                      highlightRows={[cartesianIndex.b]} 
                      highlightColumns={[]}
                      className="text-xs shadow-inner"
                      compact
                    />
                  </div>
                ) : scene.kind === "sort" ? (
                  <div className="w-full max-w-2xl mx-auto">
                    <TableView 
                      table={{
                        ...topic.resultTable,
                        rows: isSorted ? [...topic.resultTable.rows].reverse() : topic.resultTable.rows
                      }}
                      highlightRows={[]}
                      highlightColumns={topic.resultTable.columns}
                      className="border-neonCyan shadow-[0_0_20px_rgba(108,245,255,0.1)]"
                      compact
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 max-w-4xl mx-auto">
                    {/* Source Table highlighting projected columns */}
                    <TableView 
                      table={primary}
                      highlightRows={[]}
                      highlightColumns={getSelectColumns()}
                      className="text-xs border-white/5 opacity-80"
                      compact
                    />

                    <div className="text-neonCyan animate-pulse px-2">
                      <ArrowRight className="w-5 h-5" />
                    </div>

                    {/* Result Table displaying projected result */}
                    <TableView 
                      table={topic.resultTable}
                      highlightRows={[]}
                      highlightColumns={topic.resultTable.columns}
                      className="text-xs border-neonCyan/40 shadow-[0_0_30px_rgba(108,245,255,0.1)]"
                      compact
                    />
                  </div>
                )}
              </motion.div>
            )}

            {/* Phase 4: DISTINCT (Collapse duplicates) */}
            {activePhase === "DISTINCT" && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <p className="text-xs font-mono text-neonRose uppercase tracking-widest text-center">Filtering Duplicates (DISTINCT set)</p>
                <div className="max-w-4xl mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                  
                  {/* Raw table (with duplicate rows highlighted) */}
                  <TableView 
                    table={primary}
                    highlightRows={[1, 3]} // Mock row duplicates
                    highlightColumns={[]}
                    className="text-xs opacity-70"
                    compact
                  />

                  <RefreshCw className="w-5 h-5 text-neonCyan animate-spin" />

                  {/* Clean Result table */}
                  <TableView 
                    table={topic.resultTable}
                    highlightRows={[]}
                    highlightColumns={[]}
                    className="text-xs border-neonMint shadow-[0_0_25px_rgba(139,255,216,0.1)]"
                    compact
                  />
                </div>
              </motion.div>
            )}

            {/* Phase 5: RESULT (Final output) */}
            {activePhase === "RESULT" && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center max-w-md mx-auto"
              >
                <div className="inline-flex p-4 rounded-full bg-neonMint/15 border border-neonMint/30 text-neonMint animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-display text-lg font-bold text-slate-900 dark:text-white tracking-tight">Final result set compiled</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                    Query successfully evaluated across logical DBMS layers. Output matches expectations.
                  </p>
                </div>

                <TableView 
                  table={topic.resultTable}
                  highlightRows={[]}
                  highlightColumns={topic.resultTable.columns}
                  className="border-neonMint/40 shadow-[0_0_35px_rgba(139,255,216,0.15)] text-xs"
                />
              </motion.div>
            )}

            {/* Phase 6: PITFALL (Warning/Correction) */}
            {activePhase === "PITFALL" && (
              <div className="grid gap-4 md:grid-cols-2 pt-4 max-w-md mx-auto">
                <motion.div
                  animate={{ x: [0, -3, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2 }}
                  className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-5 space-y-4 text-left"
                >
                  <div className="flex items-center gap-2 text-rose-500">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="text-[10px] uppercase font-mono font-bold">Common Exam Mistake</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-sans">{topic.commonMistakes[0] || "Warning: Avoid syntax clashes."}</p>
                </motion.div>

                <motion.div
                  className="rounded-3xl border border-neonMint/30 bg-neonMint/5 p-5 space-y-4 text-left shadow-[0_0_20px_rgba(139,255,216,0.08)]"
                >
                  <div className="flex items-center gap-2 text-neonMint">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <span className="text-[10px] uppercase font-mono font-bold">Correct SQL Query</span>
                  </div>
                  <code className="text-[10px] leading-relaxed text-neonMint font-mono block break-all">{topic.query}</code>
                </motion.div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Scene descriptions & outcomes */}
        <div className="space-y-6 p-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-2 text-left">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold font-mono">Concept Narration</span>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-sans">{scene.narration}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-5 text-left">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold font-mono">Active Scene Focus</span>
              <p className="mt-2 text-sm leading-relaxed text-cyan-600 dark:text-neonCyan font-sans">{scene.learningOutcome}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-5 text-left space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold font-mono">Visual Elements Active</span>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-cyan-500/10 dark:bg-neonCyan/20 text-cyan-700 dark:text-neonCyan border border-cyan-500/20 dark:border-neonCyan/30 rounded-full px-2.5 py-1 text-[10px] uppercase font-bold">
                {activePhase} Step
              </Badge>
              {scene.visualElements.map((element) => (
                <Badge key={element} className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white rounded-full px-2.5 py-1 text-[10px]">
                  {element}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
