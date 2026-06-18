"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useProgress } from "@/components/progress-provider";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ModuleData } from "@/lib/types";

export function ModuleCard({ module }: { module: ModuleData }) {
  const { moduleCompletion } = useProgress();
  const progress = moduleCompletion[module.id] ?? 0;

  return (
    <Card className={`overflow-hidden bg-gradient-to-br ${module.accent}`}>
      <div className="rounded-[24px] bg-slate-950/70 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <Badge>{module.title}</Badge>
          <span className="text-xs uppercase tracking-[0.24em] text-slate-300">
            {module.topics.length} topics
          </span>
        </div>

        <h3 className="mt-5 font-display text-3xl font-semibold text-white">{module.title}</h3>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">{module.summary}</p>

        <div className="mt-6">
          <Progress value={progress} />
          <p className="mt-2 text-sm text-slate-300">{Math.round(progress)}% complete</p>
        </div>

        <Link
          href={`/modules#${module.id}`}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Explore module
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}
