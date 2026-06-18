export type TopicFamily =
  | "projection"
  | "distinct"
  | "cartesian"
  | "rename"
  | "filter"
  | "logic"
  | "pattern"
  | "sort"
  | "membership"
  | "set-operation"
  | "aggregate"
  | "subquery"
  | "with-clause"
  | "select-subquery"
  | "modification";

export type VisualKind =
  | "projection"
  | "distinct"
  | "cartesian"
  | "rename"
  | "filter"
  | "logic"
  | "pattern"
  | "sort"
  | "membership"
  | "set-operation"
  | "aggregate"
  | "subquery"
  | "with-clause"
  | "select-subquery"
  | "modification"
  | "hook"
  | "pitfall"
  | "summary";

export interface DataTable {
  name: string;
  caption: string;
  columns: string[];
  rows: string[][];
}

export interface LessonScene {
  id: string;
  title: string;
  animation: string;
  visualElements: string[];
  narration: string;
  learningOutcome: string;
  kind: VisualKind;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  animation: string;
  visualSetup: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ExecutionStep {
  id: string;
  label: string;
  detail: string;
  activeRows?: number[];
  focusColumns?: string[];
  resultRows?: string[][];
}

export interface TopicStat {
  label: string;
  value: string;
}

export interface LessonTopic {
  id: number;
  slug: string;
  title: string;
  shortTitle: string;
  moduleId: string;
  moduleTitle: string;
  family: TopicFamily;
  overview: string;
  learningGoal: string;
  analogy: string;
  analogyVisual: string;
  sceneCue: string;
  quizCue: string;
  query: string;
  overviewStats: TopicStat[];
  tables: DataTable[];
  resultTable: DataTable;
  scenes: LessonScene[];
  interactiveExample: string;
  executionSteps: ExecutionStep[];
  quiz: QuizQuestion[];
  commonMistakes: string[];
  examNotes: string[];
  interviewQuestions: string[];
  finalSummary: string;
}

export interface ModuleData {
  id: string;
  number: number;
  title: string;
  summary: string;
  accent: string;
  topics: LessonTopic[];
}
