"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Sparkles, XCircle } from "lucide-react";

import { useProgress } from "@/components/progress-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LessonTopic } from "@/lib/types";

export function QuizEngine({ topic }: { topic: LessonTopic }) {
  const { markTopicComplete, quizScores, saveQuizScore } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const activeQuestion = topic.quiz[currentIndex];
  const score = useMemo(
    () =>
      topic.quiz.reduce((total, question) => {
        return total + (answers[question.id] === question.correctAnswer ? 1 : 0);
      }, 0),
    [answers, topic.quiz]
  );

  const progress = ((currentIndex + (submitted ? 1 : 0)) / topic.quiz.length) * 100;
  const bestScore = quizScores[topic.slug] ?? 0;

  function handleSubmit() {
    setSubmitted(true);
    saveQuizScore(topic.slug, score);
    markTopicComplete(topic.slug);
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Badge>Animated quiz</Badge>
          <h2 className="mt-3 font-display text-3xl font-semibold text-slate-900 dark:text-white">3 quick checks</h2>
        </div>
        <div className="min-w-[180px]">
          <Progress value={progress} />
        </div>
      </div>

      <Card className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle>{activeQuestion.prompt}</CardTitle>
            <CardDescription className="mt-2">{activeQuestion.visualSetup}</CardDescription>
          </div>
          <Badge className="bg-slate-200 dark:bg-white/8 text-slate-800 dark:text-white border-slate-350 dark:border-white/10">Best score: {bestScore}/3</Badge>
        </div>

        <div className="rounded-[24px] border border-cyan-500/15 dark:border-cyan-300/15 bg-cyan-500/5 dark:bg-cyan-300/8 p-4 text-sm leading-7 text-cyan-800 dark:text-cyan-50">
          <p className="font-semibold text-cyan-950 dark:text-cyan-100">Animation cue</p>
          <p className="mt-1">{activeQuestion.animation}</p>
        </div>

        <div className="grid gap-3">
          {activeQuestion.options.map((option) => {
            const chosen = answers[activeQuestion.id] === option;
            const isCorrect = submitted && option === activeQuestion.correctAnswer;
            const isIncorrect = submitted && chosen && option !== activeQuestion.correctAnswer;

            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  !submitted &&
                  setAnswers((current) => ({
                    ...current,
                    [activeQuestion.id]: option
                  }))
                }
                className={`rounded-[22px] border px-4 py-4 text-left transition ${
                  isCorrect
                    ? "border-emerald-500/35 bg-emerald-500/10 dark:border-emerald-300/30 dark:bg-emerald-300/10 text-emerald-950 dark:text-white"
                    : isIncorrect
                      ? "border-rose-500/35 bg-rose-500/10 dark:border-rose-300/30 dark:bg-rose-300/10 text-rose-950 dark:text-white"
                      : chosen
                        ? "border-cyan-500/35 bg-cyan-500/10 dark:border-cyan-300/30 dark:bg-cyan-300/10 text-cyan-950 dark:text-white"
                        : "border-slate-200 dark:border-white/8 bg-slate-50/50 dark:bg-white/4 hover:bg-slate-100/50 dark:hover:bg-white/8 text-slate-800 dark:text-slate-100"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm leading-6 text-slate-800 dark:text-slate-100">{option}</span>
                  {isCorrect ? <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-250" /> : null}
                  {isIncorrect ? <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-250" /> : null}
                </div>
              </button>
            );
          })}
        </div>

        {submitted ? (
          <div className="rounded-[24px] border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/6 p-5">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-cyan-600 dark:text-cyan-100" />
              <p className="font-display text-xl font-semibold text-slate-900 dark:text-white">Quiz complete</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
              You scored {score}/3. {activeQuestion.explanation}
            </p>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() => setCurrentIndex((current) => Math.max(0, current - 1))}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              setCurrentIndex((current) => Math.min(topic.quiz.length - 1, current + 1))
            }
            disabled={currentIndex === topic.quiz.length - 1}
          >
            Next question
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitted || topic.quiz.some((question) => !answers[question.id])}
          >
            Submit quiz
          </Button>
        </div>
      </Card>
    </section>
  );
}
