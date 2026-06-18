"use client";

import { useState } from "react";
import { Eye, GraduationCap, Layers2, NotebookTabs } from "lucide-react";

import { QuizEngine } from "@/components/quiz-engine";
import { ScenePlayer } from "@/components/scene-player";
import { SqlExecutionPanel } from "@/components/sql-execution-panel";
import { TableView } from "@/components/table-view";
import { WhiteboardStudio } from "@/components/whiteboard-studio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { LessonTopic } from "@/lib/types";

export function TopicLearningModes({ topic }: { topic: LessonTopic }) {
  const [mode, setMode] = useState<"visual" | "exam">("visual");
  const [showNotes, setShowNotes] = useState(false);

  const visualMode = (
    <div className="space-y-14">
      <ScenePlayer topic={topic} />

      <section className="space-y-5">
        <div>
          <Badge>Source tables</Badge>
          <h2 className="mt-3 font-display text-3xl font-semibold text-white">
            Data before the animation runs
          </h2>
        </div>
        <div className={`grid gap-4 ${topic.tables.length > 1 ? "xl:grid-cols-2" : ""}`}>
          {topic.tables.map((table) => (
            <TableView key={table.name} table={table} />
          ))}
        </div>
      </section>

      <SqlExecutionPanel topic={topic} />
      <QuizEngine topic={topic} />
      <WhiteboardStudio topicTitle={topic.title} />
    </div>
  );

  const examMode = (
    <div className="space-y-8">
      <Card className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge>Exam revision mode</Badge>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white">
              View Original Notes
            </h2>
          </div>
          <Button variant="secondary" onClick={() => setShowNotes((current) => !current)}>
            <Eye className="mr-2 h-4 w-4" />
            {showNotes ? "Hide original notes" : "View Original Notes"}
          </Button>
        </div>
        <p className="text-sm leading-7 text-slate-300">
          This mode preserves the concept definition, SQL query, example, and exam-oriented notes
          in a note-first layout. The visual lesson remains available, but accuracy stays primary.
        </p>
      </Card>

      {showNotes ? (
        <div className="grid gap-6">
          <Card className="space-y-4">
            <div className="flex items-center gap-3">
              <NotebookTabs className="h-5 w-5 text-cyan-100" />
              <h3 className="font-display text-2xl font-semibold text-white">Original concept</h3>
            </div>
            <p className="text-sm leading-7 text-slate-200">{topic.overview}</p>
            <p className="text-sm leading-7 text-cyan-50">{topic.learningGoal}</p>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center gap-3">
              <Layers2 className="h-5 w-5 text-cyan-100" />
              <h3 className="font-display text-2xl font-semibold text-white">Original SQL query</h3>
            </div>
            <pre className="overflow-x-auto rounded-[24px] border border-cyan-300/15 bg-slate-950/60 p-4 font-mono text-sm leading-7 text-cyan-100">
              {topic.query}
            </pre>
          </Card>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card className="space-y-4">
              <h3 className="font-display text-2xl font-semibold text-white">Original example</h3>
              <div className="space-y-4">
                {topic.tables.map((table) => (
                  <TableView key={table.name} table={table} />
                ))}
              </div>
            </Card>

            <Card className="space-y-4">
              <h3 className="font-display text-2xl font-semibold text-white">Answer explanation</h3>
              <TableView table={topic.resultTable} />
              <div className="space-y-3">
                {topic.examNotes.map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-white/8 bg-white/4 px-4 py-3 text-sm leading-7 text-slate-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="space-y-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-cyan-100" />
              <h3 className="font-display text-2xl font-semibold text-white">Faithfulness notes</h3>
            </div>
            <p className="text-sm leading-7 text-slate-200">
              Visual animation supports the lesson, but it does not replace the DBMS concept.
              Keep the query logic, result interpretation, and exam notes as the primary truth.
            </p>
            <div className="rounded-[22px] border border-cyan-300/14 bg-cyan-300/8 px-4 py-3 text-sm leading-7 text-cyan-50">
              Visual aid used: {topic.sceneCue}
            </div>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-cyan-100" />
              <h3 className="font-display text-2xl font-semibold text-white">
                Interactive questions with answer explanation
              </h3>
            </div>
            <div className="space-y-4">
              {topic.quiz.map((question, index) => (
                <div
                  key={question.id}
                  className="rounded-[24px] border border-white/8 bg-white/4 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Question {index + 1}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">{question.prompt}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{question.visualSetup}</p>
                  <p className="mt-3 text-sm text-cyan-100">
                    Correct answer: {question.correctAnswer}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-200">{question.explanation}</p>
                </div>
              ))}
            </div>
          </Card>

          <WhiteboardStudio topicTitle={`${topic.title} notes`} />
        </div>
      ) : null}
    </div>
  );

  return (
    <section className="space-y-6">
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Badge>Dual learning mode</Badge>
          <h2 className="mt-3 font-display text-3xl font-semibold text-white">
            Switch how you study this topic
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant={mode === "visual" ? "primary" : "secondary"}
            onClick={() => setMode("visual")}
          >
            Visual Learning
          </Button>
          <Button
            variant={mode === "exam" ? "primary" : "secondary"}
            onClick={() => {
              setMode("exam");
              setShowNotes(true);
            }}
          >
            Exam Revision
          </Button>
        </div>
      </Card>

      {mode === "visual" ? visualMode : examMode}
    </section>
  );
}
