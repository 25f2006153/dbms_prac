"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { useProgress } from "@/components/progress-provider";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { LessonTopic } from "@/lib/types";

export function TopicCard({ topic, index }: { topic: LessonTopic; index?: number }) {
  const { completedTopics, quizScores } = useProgress();
  const completed = completedTopics.includes(topic.slug);
  const bestScore = quizScores[topic.slug] ?? 0;

  return (
    <Link href={`/topics/${topic.slug}`}>
      <Card className="group h-full transition duration-200 hover:-translate-y-1 hover:border-cyan-300/25">
        <div className="flex items-center justify-between gap-3">
          <Badge>{index ? `Topic ${index}` : topic.moduleTitle}</Badge>
          {completed ? <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-200" /> : null}
        </div>
        <div className="mt-5">
          <h3 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">{topic.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{topic.overview}</p>
        </div>
        <div className="mt-6 flex items-center justify-between gap-4 text-sm text-slate-550 dark:text-slate-300">
          <span>{bestScore}/3 best quiz</span>
          <span className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-100">
            Open lesson
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </div>
      </Card>
    </Link>
  );
}
