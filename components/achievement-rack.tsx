"use client";

import { Medal, Sparkles, Trophy, Star } from "lucide-react";

import { useProgress } from "@/components/progress-provider";
import { Badge } from "@/components/ui/badge";
import { GlowingCard } from "@/components/ui/glowing-card";

export function AchievementRack() {
  const { badges, xp, level, levelProgress, xpInLevel, xpNeededForNextLevel } = useProgress();

  return (
    <section className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Badge className="bg-neonGold/20 text-neonGold border border-neonGold/30">
            Gamification & Badges
          </Badge>
          <h2 className="mt-4 font-display text-4xl font-black text-white tracking-tight">
            Your Learning Profile
          </h2>
          <p className="text-slate-400 font-sans mt-2">
            Unlock achievements, earn XP, and level up your SQL query execution knowledge.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        
        {/* Left Side: Glowing XP & Level Dashboard */}
        <GlowingCard glowColor="gold" className="bg-slateNight/50 p-8 flex flex-col justify-between min-h-[300px]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-neonGold/10 border border-neonGold/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-neonGold" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white leading-none">Database Champion</h3>
                <p className="text-xs text-slate-500 font-sans mt-1">Level {level} SQL Architect</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end text-sm">
                <span className="text-slate-400 font-sans">Level Progress</span>
                <span className="font-mono font-bold text-white">{xpInLevel} / {xpNeededForNextLevel} XP</span>
              </div>
              <div className="w-full h-3 bg-ink border border-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-neonGold via-neonRose to-neonGold transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-between items-center">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Cumulative Experience</p>
              <p className="font-display text-3xl font-black text-gradient-gold">{xp} XP</p>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2">
              <Star className="w-4 h-4 text-neonGold fill-neonGold" />
              <span className="font-display text-base font-bold text-white">Tier {Math.min(5, Math.floor(level/2) + 1)}</span>
            </div>
          </div>
        </GlowingCard>

        {/* Right Side: Badges */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge) => (
            <GlowingCard
              key={badge.id}
              glowColor="blue"
              className={`p-6 flex flex-col justify-between ${badge.unlocked ? "border-neonCyan/30 bg-neonCyan/5" : "bg-slateNight/30 border-white/5 opacity-60"}`}
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-2xl border p-3 ${
                  badge.unlocked 
                    ? "border-neonCyan/30 bg-neonCyan/10 text-neonCyan" 
                    : "border-white/10 bg-white/5 text-slate-500"
                }`}>
                  {badge.unlocked ? (
                    <Sparkles className="h-5 w-5 drop-shadow-[0_0_8px_rgba(108,245,255,0.4)]" />
                  ) : (
                    <Medal className="h-5 w-5" />
                  )}
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-widest ${
                  badge.unlocked ? "text-neonCyan" : "text-slate-500"
                }`}>
                  {badge.unlocked ? "Unlocked" : "Locked"}
                </span>
              </div>
              <div className="mt-6">
                <p className="font-display text-lg font-bold text-white tracking-tight">{badge.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-400 font-sans">{badge.detail}</p>
              </div>
            </GlowingCard>
          ))}
        </div>
      </div>
    </section>
  );
}
