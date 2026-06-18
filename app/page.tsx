import Link from "next/link";
import { ArrowRight, BrainCircuit, Database, Sparkles, Trophy, PlayCircle } from "lucide-react";

import { AchievementRack } from "@/components/achievement-rack";
import { ModuleCard } from "@/components/module-card";
import { TopicCard } from "@/components/topic-card";
import { Badge } from "@/components/ui/badge";
import { AnimatedButton } from "@/components/ui/animated-button";
import { GlowingCard } from "@/components/ui/glowing-card";
import { allTopics, courseStats, modules } from "@/lib/course-data";

const highlights = [
  {
    icon: Database,
    title: "SQL Execution Cinema",
    detail: "Watch rows filter, merge, sort, and mutate instead of reading dense text. Experience databases visually."
  },
  {
    icon: BrainCircuit,
    title: "Mini Lesson Rhythm",
    detail: "Every topic includes goals, analogy, animated scenes, quiz checks, and exam notes."
  },
  {
    icon: Trophy,
    title: "Visible Momentum",
    detail: "Track completion, unlock badges, and print a completion certificate for each topic."
  }
];

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-32 px-6 py-20 sm:px-10 lg:py-28 relative">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-neonBlue/10 blur-[120px] -z-10 animate-pulse-glow" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neonCyan/10 blur-[120px] -z-10 animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <section className="grid gap-16 xl:grid-cols-[1.1fr_0.9fr] xl:items-center min-h-[70vh]">
        <div className="space-y-10 z-10">
          <Badge className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-cyan-700 dark:text-neonCyan px-4 py-1.5 text-sm rounded-full backdrop-blur-md transition-colors">
            <Sparkles className="w-4 h-4 mr-2 inline text-neonGold" /> Premium Animation-first DBMS Prep
          </Badge>
          <div className="space-y-6">
            <h1 className="max-w-4xl font-display text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] text-slate-900 dark:text-white tracking-tight">
              Kajal How are you! could you like to be friend of with me?
            </h1>
            <p className="max-w-2xl text-xl leading-relaxed text-slate-650 dark:text-slate-300 font-sans">
              Stop reading dry textbooks. Watch SQL execute live. Explore 37 DBMS topics through interactive animations, dynamic glowing tables, and an infinite practice whiteboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 items-center">
            <Link href="/topics/select" className="inline-block">
              <AnimatedButton variant="secondary" className="text-lg px-8 py-4">
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </AnimatedButton>
            </Link>
            <Link href="/modules" className="inline-block">
              <AnimatedButton variant="outline" className="text-lg px-8 py-4">
                <PlayCircle className="mr-2 h-5 w-5" />
                View Demo
              </AnimatedButton>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-4 pt-10 border-t border-white/10">
            {[
              { label: "Modules", value: courseStats.modules },
              { label: "Topics", value: courseStats.topics },
              { label: "Scenes", value: courseStats.scenes },
              { label: "Quizzes", value: courseStats.quizzes }
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="font-display text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
                <p className="text-sm font-medium uppercase tracking-wider text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <GlowingCard glowColor="cyan" hoverEffect={false} className="p-0 border-white/10 relative shadow-2xl xl:scale-110 xl:origin-left">
          <div className="absolute inset-0 bg-glass z-0" />
          <div className="relative z-10 p-10 space-y-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <Badge className="bg-neonCyan/20 text-neonCyan border border-neonCyan/30">Live Execution Preview</Badge>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-slateNight/80 backdrop-blur-xl p-6 shadow-inner">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-4">Output Table</p>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm font-semibold text-slate-300 px-4">
                    <span>Name</span>
                    <span>CGPA</span>
                  </div>
                  {["Asha | 8.9", "Charu | 9.1", "Esha | 8.4"].map((item, index) => {
                    const [name, cgpa] = item.split(" | ");
                    return (
                      <div
                        key={item}
                        className="grid grid-cols-2 gap-4 rounded-xl px-4 py-3 text-sm font-mono border border-neonCyan/20 bg-neonCyan/5 text-neonCyan shadow-[0_0_15px_rgba(108,245,255,0.1)] relative overflow-hidden"
                      >
                         {/* Fake scanline effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                        <span>{name}</span>
                        <span>{cgpa}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              <div className="rounded-xl bg-ink/90 border border-white/5 p-4 font-mono text-sm shadow-inner">
                <span className="text-neonRose">SELECT</span> <span className="text-white">name, cgpa</span> <br/>
                <span className="text-neonRose">FROM</span> <span className="text-neonMint">students</span> <br/>
                <span className="text-neonRose">WHERE</span> <span className="text-white">cgpa &gt; <span className="text-neonGold">8</span>;</span>
              </div>
            </div>
          </div>
        </GlowingCard>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        {highlights.map((item) => (
          <GlowingCard key={item.title} glowColor="blue" className="space-y-6 p-8 bg-slateNight/50">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-neonBlue/20 bg-neonBlue/10 shadow-[0_0_30px_rgba(96,165,250,0.2)]">
              <item.icon className="h-8 w-8 text-neonBlue" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{item.title}</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">{item.detail}</p>
            </div>
          </GlowingCard>
        ))}
      </section>

      <section className="space-y-12 pt-10 border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <Badge className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-650 dark:text-slate-300">Curriculum</Badge>
            <h2 className="mt-4 font-display text-5xl font-bold text-slate-900 dark:text-white tracking-tight">The ultimate learning path.</h2>
            <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 font-sans">Structured modules designed to build intuition before syntax.</p>
          </div>
          <Link href="/modules" className="inline-flex items-center text-cyan-600 dark:text-neonCyan font-semibold hover:text-slate-950 dark:hover:text-white transition-colors">
            See full topic map <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {modules.map((module) => (
            <div key={module.id} className="transition-transform duration-300 hover:-translate-y-1">
              <ModuleCard module={module} />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-12">
        <div>
          <Badge className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-650 dark:text-slate-300">Start Here</Badge>
          <h2 className="mt-4 font-display text-5xl font-bold text-slate-900 dark:text-white tracking-tight">Featured mini lessons.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {["select", "where-clause", "union", "nested-subqueries", "with-clause", "update"].map((slug, index) => {
            const topic = allTopics.find((item) => item.slug === slug);
            return topic ? (
              <div key={topic.slug} className="transition-transform duration-300 hover:-translate-y-2">
                <TopicCard topic={topic} index={index + 1} />
              </div>
            ) : null;
          })}
        </div>
      </section>

      <section className="pt-10">
        <AchievementRack />
      </section>
    </div>
  );
}
