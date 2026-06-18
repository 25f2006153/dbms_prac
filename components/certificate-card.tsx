"use client";

import { useMemo } from "react";
import { Download, ScrollText } from "lucide-react";

import { useProgress } from "@/components/progress-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { LessonTopic } from "@/lib/types";

export function CertificateCard({ topic }: { topic: LessonTopic }) {
  const { completedTopics, learnerName, quizScores, setLearnerName } = useProgress();
  const unlocked = completedTopics.includes(topic.slug);
  const quizScore = quizScores[topic.slug] ?? 0;

  const certificateText = useMemo(
    () =>
      `${learnerName} completed ${topic.title} with a quiz score of ${quizScore}/3 in DBMS Visual Lab.`,
    [learnerName, quizScore, topic.title]
  );

  return (
    <Card className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-4">
        <Badge>{unlocked ? "Certificate unlocked" : "Locked until quiz submission"}</Badge>
        <h2 className="font-display text-3xl font-semibold text-white">Topic completion certificate</h2>
        <p className="text-sm leading-7 text-slate-300">
          Every topic acts like a mini lesson milestone. Finish the quiz, and the certificate card becomes printable.
        </p>
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-slate-400">
            Learner name
          </span>
          <input
            value={learnerName}
            onChange={(event) => setLearnerName(event.target.value)}
            className="w-full rounded-2xl border border-white/12 bg-white/6 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500"
            placeholder="Query Explorer"
          />
        </label>
        <Button
          variant="secondary"
          onClick={() => window.print()}
          disabled={!unlocked}
        >
          <Download className="mr-2 h-4 w-4" />
          Print certificate
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-[30px] border border-cyan-300/18 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.18),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.05))] p-8">
        <div className="absolute inset-0 bg-grid bg-[size:26px_26px] opacity-10" />
        <div className="relative space-y-5">
          <div className="flex items-center justify-between">
            <ScrollText className="h-10 w-10 text-cyan-100" />
            <span className="text-xs uppercase tracking-[0.26em] text-cyan-100/80">DBMS Visual Lab</span>
          </div>
          <div className="pt-6">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-300">Certificate of Topic Mastery</p>
            <p className="mt-5 font-display text-4xl font-semibold text-white">{learnerName}</p>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-100">{certificateText}</p>
          </div>
          <div className="grid gap-4 pt-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Topic</p>
              <p className="mt-2 text-sm font-semibold text-white">{topic.title}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Quiz score</p>
              <p className="mt-2 text-sm font-semibold text-white">{quizScore}/3</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Status</p>
              <p className="mt-2 text-sm font-semibold text-white">{unlocked ? "Completed" : "In progress"}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
