"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, PauseCircle, PlayCircle } from "lucide-react";

import { VisualScene } from "@/components/visual-scene";
import { AITutor } from "@/components/ai-tutor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { LessonTopic } from "@/lib/types";

export function ScenePlayer({ topic }: { topic: LessonTopic }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const activeScene = topic.scenes[activeIndex];

  useEffect(() => {
    if (!autoPlay) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % topic.scenes.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [autoPlay, topic.scenes.length]);

  return (
    <section id="scene-player-container" className="space-y-5 scroll-mt-24">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Badge>Animated scenes</Badge>
          <h2 className="mt-3 font-display text-3xl font-semibold text-slate-900 dark:text-white">6-scene concept journey</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setAutoPlay((current) => !current)}
          >
            {autoPlay ? (
              <>
                <PauseCircle className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-4 w-4" />
                Play all
              </>
            )}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveIndex((current) => Math.max(0, current - 1))}
            disabled={activeIndex === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Prev
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveIndex((current) => Math.min(topic.scenes.length - 1, current + 1))}
            disabled={activeIndex === topic.scenes.length - 1}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="space-y-3 p-3">
          {topic.scenes.map((scene, index) => (
            <button
              key={scene.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`w-full rounded-[22px] border px-4 py-4 text-left transition ${
                index === activeIndex
                  ? "border-cyan-500/30 dark:border-cyan-300/30 bg-cyan-500/10 dark:bg-cyan-300/10"
                  : "border-slate-200 dark:border-white/8 bg-slate-50/50 dark:bg-white/4 hover:bg-slate-100/50 dark:hover:bg-white/8"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={`font-display text-base font-semibold ${index === activeIndex ? "text-cyan-700 dark:text-cyan-100" : "text-slate-800 dark:text-white"}`}>{scene.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{scene.learningOutcome}</p>
                </div>
                {index === activeIndex ? (
                  <PlayCircle className="mt-1 h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-100" />
                ) : null}
              </div>
            </button>
          ))}
        </Card>

        <VisualScene scene={activeScene} topic={topic} />
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">AI Audio Tutor</h2>
        <AITutor 
          topic={topic} 
          onStartLesson={() => {
            // Removed scrolling to prevent the bug!
            setAutoPlay(true);
            setActiveIndex(0);
          }} 
        />
      </div>
    </section>
  );
}
