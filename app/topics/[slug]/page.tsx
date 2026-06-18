import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookMarked, BrainCircuit, GraduationCap, MessageSquareCode } from "lucide-react";

import { CertificateCard } from "@/components/certificate-card";
import { TopicLearningModes } from "@/components/topic-learning-modes";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { allTopics, getTopicBySlug } from "@/lib/course-data";

export function generateStaticParams() {
  return allTopics.map((topic) => ({ slug: topic.slug }));
}

export default async function TopicPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  const previous = allTopics[allTopics.findIndex((item) => item.slug === topic.slug) - 1];
  const next = allTopics[allTopics.findIndex((item) => item.slug === topic.slug) + 1];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/modules"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/6 px-4 py-2 text-sm font-semibold text-slate-800 dark:text-white transition hover:bg-slate-100 dark:hover:bg-white/10 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to modules
            </Link>
            
            {/* Quick Next/Prev Navigation at the top */}
            <div className="flex items-center gap-1 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-1 shadow-sm">
              {previous ? (
                <Link
                  href={`/topics/${previous.slug}`}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition"
                  title={`Previous: ${previous.title}`}
                >
                  ← Prev
                </Link>
              ) : null}
              {next ? (
                <Link
                  href={`/topics/${next.slug}`}
                  className="rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 dark:bg-neonCyan/10 dark:hover:bg-neonCyan/20 px-3 py-1.5 text-xs font-bold text-cyan-600 dark:text-neonCyan transition"
                  title={`Next: ${next.title}`}
                >
                  Next Topic: {next.title} →
                </Link>
              ) : null}
            </div>
          </div>
          <Badge>{topic.moduleTitle}</Badge>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <h1 className="font-display text-5xl font-black text-slate-900 dark:text-white">{topic.title}</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-650 dark:text-slate-300">{topic.overview}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {topic.overviewStats.map((stat) => (
                <Card key={stat.label} className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="font-display text-3xl font-semibold text-slate-900 dark:text-white">{stat.value}</p>
                </Card>
              ))}
            </div>
          </div>

          <Card className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400 font-bold">Learning goal</p>
              <p className="mt-3 text-base leading-7 text-cyan-700 dark:text-cyan-50 font-medium">{topic.learningGoal}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400 font-bold">Real-world analogy</p>
              <p className="mt-3 text-base leading-7 text-slate-700 dark:text-slate-200">{topic.analogy}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400 font-bold">Animation focus</p>
              <p className="mt-3 text-base leading-7 text-slate-700 dark:text-slate-200">{topic.sceneCue}</p>
            </div>
          </Card>
        </div>
      </section>

      <TopicLearningModes topic={topic} />

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-5 w-5 text-cyan-600 dark:text-cyan-100" />
            <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">Common mistakes</h2>
          </div>
          <div className="space-y-3">
            {topic.commonMistakes.map((item) => (
              <div key={item} className="rounded-[22px] border border-slate-200 dark:border-white/8 bg-white/40 dark:bg-white/4 px-4 py-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-cyan-600 dark:text-cyan-100" />
            <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">Exam-oriented notes</h2>
          </div>
          <div className="space-y-3">
            {topic.examNotes.map((item) => (
              <div key={item} className="rounded-[22px] border border-slate-200 dark:border-white/8 bg-white/40 dark:bg-white/4 px-4 py-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <MessageSquareCode className="h-5 w-5 text-cyan-600 dark:text-cyan-100" />
            <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">Interview questions</h2>
          </div>
          <div className="space-y-3">
            {topic.interviewQuestions.map((item) => (
              <div key={item} className="rounded-[22px] border border-slate-200 dark:border-white/8 bg-white/40 dark:bg-white/4 px-4 py-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <BookMarked className="h-5 w-5 text-cyan-600 dark:text-cyan-100" />
            <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">Final summary</h2>
          </div>
          <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">{topic.finalSummary}</p>
          <pre className="overflow-x-auto rounded-[24px] border border-slate-200 dark:border-cyan-300/15 bg-slate-150 dark:bg-slate-950/60 p-4 font-mono text-sm leading-7 text-slate-800 dark:text-cyan-100">
            {topic.query}
          </pre>
        </Card>

        <CertificateCard topic={topic} />
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-[30px] border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/6 px-6 py-5 shadow-sm">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400 font-bold">Continue the course</p>
          <p className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
            {next ? `Next up: ${next.title}` : "You reached the end of the course"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {previous ? (
            <Link
              href={`/topics/${previous.slug}`}
              className="rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/6 px-4 py-2 text-sm font-semibold text-slate-800 dark:text-white transition hover:bg-slate-100 dark:hover:bg-white/10 shadow-sm"
            >
              Previous topic
            </Link>
          ) : null}
          {next ? (
            <Link
              href={`/topics/${next.slug}`}
              className="rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 dark:from-cyan-300 dark:via-sky-400 dark:to-blue-500 px-4 py-2 text-sm font-semibold text-white dark:text-slate-950 shadow-sm dark:shadow-glow hover:brightness-105 transition-all duration-300"
            >
              Next topic
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}
