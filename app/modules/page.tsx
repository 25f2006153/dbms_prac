import { AchievementRack } from "@/components/achievement-rack";
import { ModuleCard } from "@/components/module-card";
import { TopicCard } from "@/components/topic-card";
import { Badge } from "@/components/ui/badge";
import { modules } from "@/lib/course-data";

export default function ModulesPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="space-y-5">
        <Badge>Module selection</Badge>
        <h1 className="font-display text-5xl font-black text-slate-900 dark:text-white">Choose a DBMS learning arc</h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Module 11 trains retrieval fluency. Module 12 layers in subqueries, temporary result
          sets, and write operations. Every topic is a self-contained mini lesson.
        </p>
      </section>

      <div className="grid gap-6">
        {modules.map((module) => (
          <section key={module.id} id={module.id} className="space-y-6 scroll-mt-24">
            <ModuleCard module={module} />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {module.topics.map((topic, index) => (
                <TopicCard key={topic.slug} topic={topic} index={index + 1} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <AchievementRack />
    </div>
  );
}
