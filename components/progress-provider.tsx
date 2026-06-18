"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { allTopics, modules } from "@/lib/course-data";

type ProgressState = {
  completedTopics: string[];
  quizScores: Record<string, number>;
  learnerName: string;
};

type BadgeInfo = {
  id: string;
  title: string;
  detail: string;
  unlocked: boolean;
};

type ProgressContextValue = {
  completedTopics: string[];
  quizScores: Record<string, number>;
  learnerName: string;
  xp: number;
  level: number;
  xpInLevel: number;
  xpNeededForNextLevel: number;
  levelProgress: number;
  setLearnerName: (name: string) => void;
  markTopicComplete: (slug: string) => void;
  saveQuizScore: (slug: string, score: number) => void;
  completionRate: number;
  completedCount: number;
  badges: BadgeInfo[];
  moduleCompletion: Record<string, number>;
};

const STORAGE_KEY = "dbms-visual-lab-progress";

const ProgressContext = createContext<ProgressContextValue | null>(null);

function getDefaultState(): ProgressState {
  return {
    completedTopics: [],
    quizScores: {},
    learnerName: "Query Explorer"
  };
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(getDefaultState);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<ProgressState>;
      setState({
        completedTopics: parsed.completedTopics ?? [],
        quizScores: parsed.quizScores ?? {},
        learnerName: parsed.learnerName ?? "Query Explorer"
      });
    } catch {
      setState(getDefaultState());
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<ProgressContextValue>(() => {
    const completionRate = (state.completedTopics.length / allTopics.length) * 100;
    const moduleCompletion = Object.fromEntries(
      modules.map((module) => {
        const completed = module.topics.filter((topic) => state.completedTopics.includes(topic.slug)).length;
        return [module.id, (completed / module.topics.length) * 100];
      })
    );

    const perfectQuizCount = Object.values(state.quizScores).filter((score) => score >= 3).length;
    
    // Dynamic XP Calculation
    // 100 XP per completed topic
    // 50 XP per perfect quiz score
    // 10 XP per quiz point otherwise
    const topicXp = state.completedTopics.length * 100;
    const quizXp = Object.values(state.quizScores).reduce((acc, score) => {
      return acc + (score === 3 ? 50 : score * 10);
    }, 0);
    const xp = topicXp + quizXp;
    
    // Level tracking: 500 XP per level
    const level = Math.floor(xp / 500) + 1;
    const xpInLevel = xp % 500;
    const xpNeededForNextLevel = 500;
    const levelProgress = (xpInLevel / xpNeededForNextLevel) * 100;

    const badges: BadgeInfo[] = [
      {
        id: "warm-start",
        title: "Warm Start",
        detail: "Complete any 3 topics.",
        unlocked: state.completedTopics.length >= 3
      },
      {
        id: "filter-pilot",
        title: "Filter Pilot",
        detail: "Finish the WHERE, LIKE, and IN lessons.",
        unlocked: ["where-clause", "string-operations-like", "in-operator"].every((slug) =>
          state.completedTopics.includes(slug)
        )
      },
      {
        id: "perfect-three",
        title: "Perfect Three",
        detail: "Score full marks on any 3 topic quizzes.",
        unlocked: perfectQuizCount >= 3
      },
      {
        id: "module-11",
        title: "SQL Examples Master",
        detail: "Finish all Module 11 topics.",
        unlocked: moduleCompletion["module-11"] === 100
      },
      {
        id: "course-complete",
        title: "Visual DBMS Finisher",
        detail: "Complete all 37 topics.",
        unlocked: state.completedTopics.length === allTopics.length
      }
    ];

    return {
      completedTopics: state.completedTopics,
      quizScores: state.quizScores,
      learnerName: state.learnerName,
      xp,
      level,
      xpInLevel,
      xpNeededForNextLevel,
      levelProgress,
      setLearnerName: (name) =>
        setState((current) => ({
          ...current,
          learnerName: name || "Query Explorer"
        })),
      markTopicComplete: (slug) =>
        setState((current) =>
          current.completedTopics.includes(slug)
            ? current
            : {
                ...current,
                completedTopics: [...current.completedTopics, slug]
              }
        ),
      saveQuizScore: (slug, score) =>
        setState((current) => ({
          ...current,
          quizScores: {
            ...current.quizScores,
            [slug]: Math.max(score, current.quizScores[slug] ?? 0)
          }
        })),
      completionRate,
      completedCount: state.completedTopics.length,
      badges,
      moduleCompletion
    };
  }, [state]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);

  if (!context) {
    throw new Error("useProgress must be used within ProgressProvider");
  }

  return context;
}
