import { slugify } from "@/lib/utils";
import type { DataTable, ExecutionStep, LessonScene, LessonTopic, ModuleData, TopicFamily, VisualKind } from "@/lib/types";

type TopicBlueprint = {
  id: number;
  slug?: string;
  title: string;
  shortTitle: string;
  moduleId: "module-11" | "module-12" | "module-13" | "module-14" | "module-15";
  family: TopicFamily;
  conceptDescription: string;
  overview: string;
  learningGoal: string;
  analogy: string;
  analogyVisual: string;
  sceneCue: string;
  quizCue: string;
  query: string;
  tables: DataTable[];
  resultTable: DataTable;
  interactiveExample: string;
  commonMistakes: string[];
  examNotes: string[];
  interviewQuestions: string[];
  finalSummary: string;
};

const moduleMeta = {
  "module-11": {
    title: "Module 11: SQL Examples",
    number: 11,
    summary: "Build fluency with core SQL retrieval operators by watching tables move, filter, merge, sort, and summarize.",
    accent: "from-cyan-400/35 via-sky-500/20 to-blue-600/25"
  },
  "module-12": {
    title: "Module 12: Intermediate SQL",
    number: 12,
    summary: "Step into layered SQL thinking with subqueries, temporary result sets, and data-changing statements.",
    accent: "from-emerald-400/30 via-teal-400/18 to-rose-500/22"
  },
  "module-13": {
    title: "Module 13: Joins & Views",
    number: 13,
    summary: "Connect multiple tables with various joins and abstract queries into reusable views.",
    accent: "from-violet-400/30 via-purple-400/18 to-fuchsia-500/22"
  },
  "module-14": {
    title: "Module 14: Transactions & Constraints",
    number: 14,
    summary: "Ensure data integrity and handle atomic transactions with SQL constraints.",
    accent: "from-amber-400/30 via-orange-400/18 to-red-500/22"
  },
  "module-15": {
    title: "Module 15: Advanced SQL",
    number: 15,
    summary: "Extend SQL with procedural routines, custom functions, and automated triggers.",
    accent: "from-indigo-400/30 via-blue-400/18 to-cyan-500/22"
  }
} as const;

function table(name: string, caption: string, columns: string[], rows: string[][]): DataTable {
  return { name, caption, columns, rows };
}

const students = table(
  "students",
  "Primary learner roster used across most retrieval examples.",
  ["id", "name", "dept", "city", "cgpa"],
  [
    ["1", "Asha", "CS", "Pune", "8.9"],
    ["2", "Bharat", "EE", "Delhi", "7.4"],
    ["3", "Charu", "CS", "Pune", "9.1"],
    ["4", "Dev", "ME", "Chennai", "6.8"],
    ["5", "Esha", "EE", "Delhi", "8.4"]
  ]
);

const clubs = table(
  "clubs",
  "Small second table for Cartesian product and join-style intuition.",
  ["club_id", "club_name"],
  [
    ["10", "Robotics"],
    ["20", "Coding"]
  ]
);

const departments = table(
  "departments",
  "Department directory for subquery and EXISTS style checks.",
  ["dept_name", "hod", "intake", "top_cgpa"],
  [
    ["CS", "Dr. Rao", "120", "9.1"],
    ["EE", "Dr. Shah", "110", "8.4"],
    ["ME", "Dr. Iyer", "75", "6.8"],
    ["CE", "Dr. Khan", "60", "0.0"]
  ]
);

const scholarshipCutoffs = table(
  "scholarship_cutoffs",
  "Comparison values used for SOME and ALL.",
  ["cutoff"],
  [["7.0"], ["8.5"]]
);

const courses = table(
  "courses",
  "Course catalog used in aggregate and update examples.",
  ["course_id", "title", "credits"],
  [
    ["DB101", "DBMS", "4"],
    ["SE201", "Software Eng", "3"],
    ["OS301", "Operating Sys", "3"],
    ["AI210", "AI Basics", "4"],
    ["UX110", "UX Studio", "2"]
  ]
);

const classA = table(
  "evening_batch",
  "First set for set operations.",
  ["city"],
  [["Pune"], ["Delhi"], ["Mumbai"]]
);

const classB = table(
  "weekend_batch",
  "Second set for set operations.",
  ["city"],
  [["Delhi"], ["Chennai"], ["Pune"]]
);

const feePlan = table(
  "scholarships",
  "Fee support records used for CASE updates.",
  ["student_id", "cgpa", "amount"],
  [
    ["1", "8.9", "0"],
    ["3", "9.1", "0"],
    ["5", "8.4", "0"]
  ]
);

const prereq = table(
  "prereq",
  "Prerequisite relationships for join examples.",
  ["course_id", "prereq_id"],
  [
    ["DB101", "CS100"],
    ["OS301", "CS100"],
    ["AI210", "DB101"],
    ["CS-315", "CS-101"]
  ]
);

const instructor = table(
  "instructor",
  "Instructor table used for views and constraints.",
  ["ID", "name", "dept_name", "salary"],
  [
    ["10101", "Srinivasan", "Comp. Sci.", "65000"],
    ["12121", "Wu", "Finance", "90000"],
    ["15151", "Mozart", "Music", "40000"],
    ["22222", "Einstein", "Physics", "95000"],
    ["32343", "El Said", "History", "60000"]
  ]
);

const conceptBank = [
  "keeping only the requested columns from a relation",
  "removing duplicate values before the result table appears",
  "checking rows against a condition before they move ahead",
  "merging or comparing sets from multiple query outputs",
  "reducing many rows into one summary value",
  "using the output of one query inside another query",
  "changing the stored data inside a table",
  "connecting rows from multiple tables based on a matching condition",
  "creating a virtual table that abstracts a complex query",
  "bundling multiple operations into an all-or-nothing atomic action",
  "enforcing rules on data to maintain database integrity",
  "restricting access through privileges and roles",
  "running procedural logic natively inside the database",
  "automatically executing actions when specific data changes occur"
];

function getVisualKind(family: TopicFamily): VisualKind {
  switch (family) {
    case "projection":
      return "projection";
    case "distinct":
      return "distinct";
    case "cartesian":
      return "cartesian";
    case "rename":
      return "rename";
    case "filter":
      return "filter";
    case "logic":
      return "logic";
    case "pattern":
      return "pattern";
    case "sort":
      return "sort";
    case "membership":
      return "membership";
    case "set-operation":
      return "set-operation";
    case "aggregate":
      return "aggregate";
    case "subquery":
      return "subquery";
    case "with-clause":
      return "with-clause";
    case "select-subquery":
      return "select-subquery";
    case "modification":
      return "modification";
    case "join":
      return "join";
    case "view":
      return "view";
    case "transaction":
      return "transaction";
    case "constraint":
      return "constraint";
    case "authorization":
      return "authorization";
    case "routine":
      return "routine";
    case "trigger":
      return "trigger";
    default:
      return "summary";
  }
}

function pluralizeRows(value: number) {
  return `${value} row${value === 1 ? "" : "s"}`;
}

function rotateOptions(values: string[], offset: number) {
  const shift = offset % values.length;
  return values.slice(shift).concat(values.slice(0, shift));
}

function buildRowOptions(count: number, topicId: number) {
  const base = new Set<number>([Math.max(1, count - 1), count, count + 1, count + 2]);
  const options = Array.from(base)
    .slice(0, 4)
    .map(pluralizeRows);

  while (options.length < 4) {
    options.push(pluralizeRows(count + options.length));
  }

  return rotateOptions(options, topicId);
}

function buildScenes(blueprint: TopicBlueprint): LessonScene[] {
  const visualKind = getVisualKind(blueprint.family);
  const primary = blueprint.tables[0];
  const supporting = blueprint.tables.slice(1).map((item) => item.name);
  const qUpper = blueprint.query.toUpperCase();

  const scenes: LessonScene[] = [];
  let sceneIndex = 1;

  // Scene 1: FROM
  scenes.push({
    id: `${blueprint.id}-scene-${sceneIndex}`,
    title: `Scene ${sceneIndex}: FROM (Table Load)`,
    animation: `Load relation ${primary.name} into memory. DBMS allocates space and reads schema.${supporting.length ? ` Supporting tables ${supporting.join(", ")} are cached.` : ""}`,
    visualElements: ["Disk table load", "Memory allocation", "Schema check"],
    narration: `Logical execution begins at the FROM clause. We locate and cache the table ${primary.name} containing ${primary.rows.length} rows.`,
    learningOutcome: `Understand that SQL engines always evaluate the FROM clause first.`,
    kind: "hook"
  });
  sceneIndex++;

  // Scene 2: WHERE (Optional)
  if (qUpper.includes("WHERE") || qUpper.includes("ON") || qUpper.includes("HAVING")) {
    scenes.push({
      id: `${blueprint.id}-scene-${sceneIndex}`,
      title: `Scene ${sceneIndex}: WHERE (Row Filter)`,
      animation: `Evaluate predicates row-by-row. Columns used in condition blink; qualifying rows are selected.`,
      visualElements: ["Filter gate", "Row scanning", "Predicate evaluation"],
      narration: `Next, the WHERE clause evaluates predicates. Rows failing the conditions are discarded, while matching records proceed.`,
      learningOutcome: `Learn how row-level filtering happens before column projection.`,
      kind: "filter"
    });
    sceneIndex++;
  }

  // Scene 3: SELECT
  scenes.push({
    id: `${blueprint.id}-scene-${sceneIndex}`,
    title: `Scene ${sceneIndex}: SELECT (Column Project)`,
    animation: `Project selected attributes. Column headers blink and values clone into the output projection.`,
    visualElements: ["Column projection", "Attribute selection", "Data peel-off"],
    narration: `The SELECT clause is now evaluated. We extract only the required columns and discard other fields.`,
    learningOutcome: `Understand column projection and how SELECT limits attributes.`,
    kind: visualKind
  });
  sceneIndex++;

  // Scene 4: DISTINCT (Optional)
  if (qUpper.includes("DISTINCT")) {
    scenes.push({
      id: `${blueprint.id}-scene-${sceneIndex}`,
      title: `Scene ${sceneIndex}: DISTINCT (Deduplicate)`,
      animation: `Scan projected set. Identical row values blink, collide, and collapse to preserve uniqueness.`,
      visualElements: ["Duplicate scan", "Set compaction", "Tuple collapse"],
      narration: `If DISTINCT is set, the DBMS scans the output set to collapse duplicate tuples.`,
      learningOutcome: `See how duplicate records are compacted into unique sets.`,
      kind: "distinct"
    });
    sceneIndex++;
  }

  // Scene 5: RESULT
  scenes.push({
    id: `${blueprint.id}-scene-${sceneIndex}`,
    title: `Scene ${sceneIndex}: RESULT (Compilation)`,
    animation: `Generate the final returned dataset. Output is buffered for user retrieval.`,
    visualElements: ["Final cursor", "Dataset compile", "Parity check"],
    narration: `The final result set is successfully compiled. Output ready for user retrieval.`,
    learningOutcome: `Analyze the final returned DBMS dataset.`,
    kind: "summary"
  });
  sceneIndex++;

  // Scene 6: PITFALL
  scenes.push({
    id: `${blueprint.id}-scene-${sceneIndex}`,
    title: `Scene ${sceneIndex}: PITFALL (Common Errors)`,
    animation: `Shaking red warning card highlights wrong syntax, while emerald card snaps right version in.`,
    visualElements: ["Split query view", "Warning badge", "Correct query highlight"],
    narration: blueprint.commonMistakes[0] || "Be careful with syntax constraints.",
    learningOutcome: `Spot common test and interview pitfalls early.`,
    kind: "pitfall"
  });

  return scenes;
}

function buildExecutionSteps(blueprint: TopicBlueprint): ExecutionStep[] {
  const primary = blueprint.tables[0];
  const allRows = primary.rows.map((_, index) => index);
  const resultPreview = blueprint.resultTable.rows.slice(0, Math.min(3, blueprint.resultTable.rows.length));
  const visualKind = getVisualKind(blueprint.family);

  const middleDetail =
    blueprint.family === "set-operation" || blueprint.family === "cartesian"
      ? "The query compares multiple tables together and animates how rows are paired, kept, removed, or combined."
      : blueprint.family === "aggregate"
        ? "Every contributing value flows into a single accumulator so we can see how one summary cell is produced."
        : blueprint.family === "subquery" || blueprint.family === "with-clause" || blueprint.family === "select-subquery"
          ? "An inner result appears first, then feeds the outer query as if it were a temporary mini-table."
          : blueprint.family === "modification"
            ? "Target rows are identified first, then the table state changes and the new snapshot replaces the old one."
            : "Rows and columns are tested against the operator rule before anything moves into the result lane.";

  return [
    {
      id: `${blueprint.id}-step-1`,
      label: "Scan the source",
      detail: `Start with ${primary.name} and its ${primary.rows.length} visible rows.`,
      activeRows: allRows,
      focusColumns: primary.columns
    },
    {
      id: `${blueprint.id}-step-2`,
      label: "Focus the rule",
      detail: `The engine reads the query and focuses on the relevant columns for ${blueprint.shortTitle}.`,
      activeRows: allRows,
      focusColumns: blueprint.resultTable.columns
    },
    {
      id: `${blueprint.id}-step-3`,
      label: "Animate the operator",
      detail: middleDetail,
      activeRows: allRows,
      focusColumns: blueprint.resultTable.columns,
      resultRows: resultPreview
    },
    {
      id: `${blueprint.id}-step-4`,
      label: "Reveal the result",
      detail: `${blueprint.title} ends with ${pluralizeRows(blueprint.resultTable.rows.length)} in the result table.`,
      resultRows: blueprint.resultTable.rows
    },
    {
      id: `${blueprint.id}-step-5`,
      label: "Validate the outcome",
      detail: `Check the output against the intent of the query so the visual pattern and the syntax stay connected.`,
      resultRows: blueprint.resultTable.rows.slice(0, Math.min(5, blueprint.resultTable.rows.length))
    }
  ].map((step) => ({
    ...step,
    detail: visualKind === "modification" && step.id.endsWith("4")
      ? `The updated table snapshot is now stored. ${blueprint.title} changed persistent data rather than just displaying it.`
      : step.detail
  }));
}

function buildQuiz(blueprint: TopicBlueprint) {
  const resultRowCount = blueprint.resultTable.rows.length;
  const countOptions = buildRowOptions(resultRowCount, blueprint.id);
  const correctCount = pluralizeRows(resultRowCount);
  const conceptOptions = rotateOptions(
    [
      blueprint.conceptDescription,
      ...conceptBank.filter((item) => item !== blueprint.conceptDescription).slice(0, 3)
    ],
    blueprint.id + 1
  );
  const mistakeOptions = rotateOptions(
    [
      blueprint.commonMistakes[0],
      "Using lowercase SQL keywords changes the result",
      "A query always fails if a table has more than one row",
      "Every SQL operator returns rows in sorted order by default"
    ],
    blueprint.id + 2
  );

  return [
    {
      id: `${blueprint.id}-quiz-1`,
      prompt: "When the animation finishes, how many rows land in the result lane?",
      animation: `A counter ticks upward as the ${blueprint.shortTitle} operator processes the rows.`,
      visualSetup: `${blueprint.tables[0].name} begins with ${pluralizeRows(blueprint.tables[0].rows.length)}. Predict the final output size.`,
      options: countOptions,
      correctAnswer: correctCount,
      explanation: `${blueprint.title} in this example produces ${correctCount}, which matches the result table on the lesson page.`
    },
    {
      id: `${blueprint.id}-quiz-2`,
      prompt: `Which description best matches what ${blueprint.title} is doing?`,
      animation: blueprint.quizCue,
      visualSetup: "Three competing interpretations appear as floating cards beside the query.",
      options: conceptOptions,
      correctAnswer: blueprint.conceptDescription,
      explanation: blueprint.learningGoal
    },
    {
      id: `${blueprint.id}-quiz-3`,
      prompt: "Which red-lane mistake would most likely break or distort this query?",
      animation: "A wrong query drifts into the warning lane while the correct query stays neon green.",
      visualSetup: "Focus on the misconception that would change the output, not harmless style choices.",
      options: mistakeOptions,
      correctAnswer: blueprint.commonMistakes[0],
      explanation: blueprint.commonMistakes[1]
    }
  ];
}

function buildTopic(blueprint: TopicBlueprint): LessonTopic {
  const module = moduleMeta[blueprint.moduleId];
  const slug = blueprint.slug ?? slugify(blueprint.title);

  return {
    id: blueprint.id,
    slug,
    title: blueprint.title,
    shortTitle: blueprint.shortTitle,
    moduleId: blueprint.moduleId,
    moduleTitle: module.title,
    family: blueprint.family,
    overview: blueprint.overview,
    learningGoal: blueprint.learningGoal,
    analogy: blueprint.analogy,
    analogyVisual: blueprint.analogyVisual,
    sceneCue: blueprint.sceneCue,
    quizCue: blueprint.quizCue,
    query: blueprint.query,
    overviewStats: [
      { label: "Source tables", value: String(blueprint.tables.length) },
      { label: "Input rows", value: String(blueprint.tables.reduce((sum, item) => sum + item.rows.length, 0)) },
      { label: "Output rows", value: String(blueprint.resultTable.rows.length) }
    ],
    tables: blueprint.tables,
    resultTable: blueprint.resultTable,
    scenes: buildScenes(blueprint),
    interactiveExample: blueprint.interactiveExample,
    executionSteps: buildExecutionSteps(blueprint),
    quiz: buildQuiz(blueprint),
    commonMistakes: blueprint.commonMistakes,
    examNotes: blueprint.examNotes,
    interviewQuestions: blueprint.interviewQuestions,
    finalSummary: blueprint.finalSummary
  };
}

const blueprints: TopicBlueprint[] = [
  {
    id: 1,
    title: "SELECT",
    shortTitle: "Column projection",
    moduleId: "module-11",
    family: "projection",
    conceptDescription: "keeping only the requested columns from a relation",
    overview: "SELECT is the basic spotlight operator. It lets us project just the columns we care about from a bigger table.",
    learningGoal: "Learn how SELECT creates a smaller view of a table by choosing only the needed columns.",
    analogy: "Like opening a report card and reading only the name and department columns instead of the entire sheet.",
    analogyVisual: "Rows illuminate one by one, and the selected columns peel away into a floating result table.",
    sceneCue: "Rows illuminate one-by-one while the name and department columns slide into the result panel.",
    quizCue: "Predict which columns survive when the glowing query beam finishes scanning the table.",
    query: "SELECT name, dept FROM students;",
    tables: [students],
    resultTable: table("result_select", "Projected result for the SELECT query.", ["name", "dept"], [["Asha", "CS"], ["Bharat", "EE"], ["Charu", "CS"], ["Dev", "ME"], ["Esha", "EE"]]),
    interactiveExample: "Toggle between source and result to watch how projection keeps row count the same while shrinking the column list.",
    commonMistakes: [
      "Forgetting that SELECT chooses columns, not rows. Row filtering belongs to WHERE.",
      "If you expect fewer rows from SELECT alone, the mistake is usually confusing projection with filtering."
    ],
    examNotes: ["SELECT without WHERE keeps all rows.", "The number of output columns equals the number of selected expressions."],
    interviewQuestions: ["What is projection in relational algebra and how does SELECT mirror it?", "Why can SELECT reduce width without reducing row count?"],
    finalSummary: "SELECT is your column spotlight: same rows unless a filter is added, fewer visible attributes, clearer output."
  },
  {
    id: 2,
    slug: "select-distinct",
    title: "SELECT DISTINCT",
    shortTitle: "Duplicate removal",
    moduleId: "module-11",
    family: "distinct",
    conceptDescription: "removing duplicate values before the result table appears",
    overview: "DISTINCT cleans repeated values out of the result, making the output represent unique records only.",
    learningGoal: "Understand how DISTINCT removes duplicates after projection and before the result is shown.",
    analogy: "Like a bouncer at an event who lets only one copy of each invite code enter the hall.",
    analogyVisual: "Duplicate city cards glow red, merge into one token, and only unique cards stay neon cyan.",
    sceneCue: "Duplicate city rows glow red and disappear until each city appears only once.",
    quizCue: "Guess which cards remain after the duplicate detector finishes scanning the result lane.",
    query: "SELECT DISTINCT city FROM students;",
    tables: [students],
    resultTable: table("result_distinct", "Unique cities produced by DISTINCT.", ["city"], [["Pune"], ["Delhi"], ["Chennai"]]),
    interactiveExample: "Tap duplicate values in the source table and watch the duplicate detector collapse them into one result row.",
    commonMistakes: [
      "Assuming DISTINCT checks duplicates in the original table instead of the selected columns only.",
      "DISTINCT compares the final selected value combinations, so changing the selected columns changes what counts as a duplicate."
    ],
    examNotes: ["DISTINCT works on the projected output, not the full base row.", "DISTINCT can be costly on large result sets because duplicates must be detected."],
    interviewQuestions: ["What changes if you add one more column to a DISTINCT query?", "Why can DISTINCT return more rows than expected when multiple columns are selected?"],
    finalSummary: "SELECT DISTINCT keeps just one copy of each projected value combination."
  },
  {
    id: 3,
    slug: "select-all",
    title: "SELECT ALL",
    shortTitle: "Explicit duplicates allowed",
    moduleId: "module-11",
    family: "projection",
    conceptDescription: "keeping all projected values exactly as they appear, including duplicates",
    overview: "ALL is the default behavior of SELECT. It preserves every projected value, even repeated ones.",
    learningGoal: "See that ALL means do not remove duplicates from the result.",
    analogy: "Like printing every attendance slip exactly as it came in, even if several students share the same department.",
    analogyVisual: "Every dept card flows through untouched, including repeats that stack visibly in the result lane.",
    sceneCue: "Duplicate department cards remain visible and stack in order because ALL preserves every entry.",
    quizCue: "Compare the ALL animation with DISTINCT and predict whether repeated values stay or vanish.",
    query: "SELECT ALL dept FROM students;",
    tables: [students],
    resultTable: table("result_all", "Projected departments with duplicates intact.", ["dept"], [["CS"], ["EE"], ["CS"], ["ME"], ["EE"]]),
    interactiveExample: "Switch between ALL and DISTINCT modes to see why ALL keeps the repeated department cards.",
    commonMistakes: [
      "Thinking ALL adds something new to SELECT when it mostly makes the default behavior explicit.",
      "ALL does not sort or clean the result; it simply keeps duplicates instead of removing them."
    ],
    examNotes: ["SELECT and SELECT ALL behave the same unless DISTINCT is involved.", "ALL is useful mainly to contrast with DISTINCT in theory questions."],
    interviewQuestions: ["Why is SELECT ALL rarely written in practice?", "How would you explain SELECT ALL to someone who only knows SELECT DISTINCT?"],
    finalSummary: "SELECT ALL is the no-dedup version: project values exactly as they arrive."
  },
  {
    id: 4,
    slug: "cartesian-product",
    title: "Cartesian Product",
    shortTitle: "Every row paired",
    moduleId: "module-11",
    family: "cartesian",
    conceptDescription: "pairing every row of one table with every row of another table",
    overview: "A Cartesian product multiplies tables together. Every row on the left connects to every row on the right.",
    learningGoal: "Visualize how row counts multiply when no join condition restricts the pairing.",
    analogy: "Like matching every student with every club for a fair brochure mockup.",
    analogyVisual: "Two tables float apart while connector lines fan out from each student row to each club row.",
    sceneCue: "Students on the left connect to every club on the right, and the result table grows automatically.",
    quizCue: "Count how many pair lines appear before the result table completes.",
    query: "SELECT s.name, c.club_name FROM students AS s, clubs AS c;",
    tables: [table("students_small", "Reduced student sample for Cartesian product.", ["name"], [["Asha"], ["Bharat"], ["Charu"]]), clubs],
    resultTable: table("result_cartesian", "Every student paired with every club.", ["name", "club_name"], [["Asha", "Robotics"], ["Asha", "Coding"], ["Bharat", "Robotics"], ["Bharat", "Coding"], ["Charu", "Robotics"], ["Charu", "Coding"]]),
    interactiveExample: "Adjust the left or right table size and notice how the output grows by multiplication, not addition.",
    commonMistakes: [
      "Forgetting a join condition and accidentally creating a Cartesian product when you wanted matched rows only.",
      "If the output is far larger than expected, a missing join predicate is one of the first things to check."
    ],
    examNotes: ["If table A has m rows and table B has n rows, the Cartesian product has m x n rows.", "Cartesian product is the foundation that joins later restrict."],
    interviewQuestions: ["Why can an accidental Cartesian product be expensive?", "How is a join related to a Cartesian product plus a condition?"],
    finalSummary: "Cartesian product means every-left-with-every-right, so row counts multiply fast."
  },
  {
    id: 5,
    slug: "as-rename",
    title: "AS (Rename Operation)",
    shortTitle: "Alias naming",
    moduleId: "module-11",
    family: "rename",
    conceptDescription: "renaming a table or column temporarily inside a query",
    overview: "AS gives shorter, clearer names inside a query. It is especially useful when queries get longer or reuse the same table.",
    learningGoal: "Understand how aliases improve readability without changing the stored schema.",
    analogy: "Like giving a teammate a nickname on a whiteboard so the discussion stays fast and clear.",
    analogyVisual: "The table label students morphs into the alias s while the rows remain the same.",
    sceneCue: "Table names morph into aliases, and the query immediately starts referencing the shorter label.",
    quizCue: "Match the glowing alias token to the table it stands for in the animation.",
    query: "SELECT s.name, s.cgpa FROM students AS s;",
    tables: [students],
    resultTable: table("result_alias", "Projected output using a table alias.", ["name", "cgpa"], [["Asha", "8.9"], ["Bharat", "7.4"], ["Charu", "9.1"], ["Dev", "6.8"], ["Esha", "8.4"]]),
    interactiveExample: "Hover the alias to see that only the label changes. The underlying rows and columns remain identical.",
    commonMistakes: [
      "Using the alias in one part of the query but forgetting to replace the original table name consistently.",
      "Once you define an alias in a query block, stick with it to avoid ambiguous or invalid references."
    ],
    examNotes: ["AS does not rename the physical table permanently.", "Aliases improve readability and are essential in self-joins and subqueries."],
    interviewQuestions: ["Why are aliases especially helpful in nested SQL?", "Can AS be omitted for table aliases in many SQL dialects?"],
    finalSummary: "AS changes the label you type, not the underlying data you store."
  },
  {
    id: 6,
    slug: "where-clause",
    title: "WHERE Clause",
    shortTitle: "Row filtering",
    moduleId: "module-11",
    family: "filter",
    conceptDescription: "checking rows against a condition before they move ahead",
    overview: "WHERE is the row gate. It keeps only the rows that satisfy a condition and removes the rest from the result.",
    learningGoal: "See how WHERE filters rows while leaving the selected columns untouched.",
    analogy: "Like a security gate that allows only students with high enough CGPA into a scholarship line.",
    analogyVisual: "Rows approach a glowing filter gate; qualifying rows pass through while rejected rows fade out.",
    sceneCue: "Rows pass through a filter gate. Valid rows stay bright, invalid rows disappear.",
    quizCue: "Predict which rows make it through the gate when the condition cgpa > 8.0 lights up.",
    query: "SELECT name, cgpa FROM students WHERE cgpa > 8.0;",
    tables: [students],
    resultTable: table("result_where", "Rows that satisfy the WHERE condition.", ["name", "cgpa"], [["Asha", "8.9"], ["Charu", "9.1"], ["Esha", "8.4"]]),
    interactiveExample: "Slide the threshold up and down to watch the gate keep or reject different students instantly.",
    commonMistakes: [
      "Forgetting that WHERE decides which rows survive before the result is displayed.",
      "If the row count changed unexpectedly, recheck the condition logic before blaming SELECT."
    ],
    examNotes: ["WHERE is evaluated before the final result set is shown.", "Conditions can compare numbers, text, dates, and more."],
    interviewQuestions: ["How is WHERE different from SELECT?", "Why do developers describe WHERE as a row-level filter?"],
    finalSummary: "WHERE is a row gate: only qualifying records reach the result."
  },
  {
    id: 7,
    slug: "and-or-conditions",
    title: "AND / OR Conditions",
    shortTitle: "Logic gates",
    moduleId: "module-11",
    family: "logic",
    conceptDescription: "combining multiple conditions with logical gates before rows qualify",
    overview: "AND and OR let us combine multiple conditions. The query behaves like a logic circuit that opens or closes row paths.",
    learningGoal: "Understand how compound conditions widen or narrow the result set.",
    analogy: "Like a campus access system that checks both department and performance, but also lets in a special city list.",
    analogyVisual: "Two logic gates pulse: rows need both signals for AND, but only one bright path for OR.",
    sceneCue: "Logic gates open and close while each row tests both the AND path and the OR bypass path.",
    quizCue: "Follow the logic gate animation and predict which rows satisfy the compound condition.",
    query: "SELECT name, dept, cgpa FROM students WHERE (dept = 'CS' AND cgpa > 8.5) OR city = 'Delhi';",
    tables: [students],
    resultTable: table("result_logic", "Rows that satisfy the compound logic rule.", ["name", "dept", "cgpa"], [["Asha", "CS", "8.9"], ["Bharat", "EE", "7.4"], ["Charu", "CS", "9.1"], ["Esha", "EE", "8.4"]]),
    interactiveExample: "Toggle parentheses on and off to feel how operator precedence changes the result path immediately.",
    commonMistakes: [
      "Ignoring parentheses and assuming SQL evaluates AND and OR exactly the way you intended.",
      "When compound conditions feel confusing, add parentheses so the logic path is explicit."
    ],
    examNotes: ["AND usually narrows a result, OR usually widens it.", "Parentheses are the safest way to control complex condition order."],
    interviewQuestions: ["Why do parentheses matter in SQL condition logic?", "How would you explain AND vs OR using a gate analogy?"],
    finalSummary: "AND demands multiple green lights, OR opens the door when any allowed path is bright."
  },
  {
    id: 8,
    slug: "string-operations-like",
    title: "String Operations (LIKE)",
    shortTitle: "Pattern match",
    moduleId: "module-11",
    family: "pattern",
    conceptDescription: "matching text values against a pattern instead of an exact string",
    overview: "LIKE turns string comparison into pattern matching with wildcards such as % and _.",
    learningGoal: "See how pattern matching can pull text values that share a prefix, suffix, or shape.",
    analogy: "Like scanning a shelf for every file name that starts with the letter A.",
    analogyVisual: "A pattern scanner moves across the names column and matching values glow neon green.",
    sceneCue: "The scanner sweeps over the text column, and only names that match A% stay lit.",
    quizCue: "Predict which strings glow green when the pattern beam checks A%.",
    query: "SELECT name FROM students WHERE name LIKE 'A%';",
    tables: [students],
    resultTable: table("result_like", "Names matching the pattern A%.", ["name"], [["Asha"]]),
    interactiveExample: "Swap the wildcard pattern to see how prefix, suffix, and contains matching change instantly.",
    commonMistakes: [
      "Treating LIKE as exact equality instead of a pattern operator with wildcards.",
      "The % wildcard means any sequence of characters, so forgetting it often makes the filter too strict."
    ],
    examNotes: ["% matches any number of characters.", "_ matches exactly one character."],
    interviewQuestions: ["When would LIKE be preferable to exact equality?", "What is the difference between % and _ in LIKE patterns?"],
    finalSummary: "LIKE is a pattern scanner: wildcards define the text shape you want to catch."
  },
  {
    id: 9,
    slug: "order-by",
    title: "ORDER BY",
    shortTitle: "Sorting rows",
    moduleId: "module-11",
    family: "sort",
    conceptDescription: "rearranging result rows into a chosen ascending or descending order",
    overview: "ORDER BY changes how the result is arranged, not which rows are included.",
    learningGoal: "Understand that sorting is a presentation step applied to the result set.",
    analogy: "Like lining up scorecards from highest CGPA to lowest after all qualifying students are collected.",
    analogyVisual: "Rows physically slide up and down until the table settles into descending CGPA order.",
    sceneCue: "Rows physically rearrange while the sort arrow flips to descending.",
    quizCue: "Track the row movement and predict the final top-to-bottom order.",
    query: "SELECT name, cgpa FROM students ORDER BY cgpa DESC;",
    tables: [students],
    resultTable: table("result_order", "Rows sorted by descending CGPA.", ["name", "cgpa"], [["Charu", "9.1"], ["Asha", "8.9"], ["Esha", "8.4"], ["Bharat", "7.4"], ["Dev", "6.8"]]),
    interactiveExample: "Flip between ASC and DESC to watch the same rows settle into two different final orders.",
    commonMistakes: [
      "Assuming the database returns rows in a predictable order when ORDER BY is missing.",
      "Without ORDER BY, result ordering is not guaranteed even if it looked sorted once."
    ],
    examNotes: ["ORDER BY can use multiple columns.", "ASC is default in many SQL dialects, but writing it explicitly improves clarity."],
    interviewQuestions: ["Why is ORDER BY considered a presentation concern?", "Can ORDER BY change the number of rows in a query result?"],
    finalSummary: "ORDER BY changes the arrangement of rows, not the membership of rows."
  },
  {
    id: 10,
    slug: "in-operator",
    title: "IN Operator",
    shortTitle: "Membership check",
    moduleId: "module-11",
    family: "membership",
    conceptDescription: "testing whether a value belongs to a chosen list or set",
    overview: "IN makes list-style filtering easy. A row passes if its value belongs to the allowed set.",
    learningGoal: "Visualize IN as a membership checker instead of many repeated OR conditions.",
    analogy: "Like checking whether a student belongs to an approved department list on a clipboard.",
    analogyVisual: "Department tokens enter a glowing set container and valid values receive a green membership check.",
    sceneCue: "Values enter a membership checker and only rows whose department is in the approved set remain.",
    quizCue: "Watch the set container and predict which values belong to it.",
    query: "SELECT name, dept FROM students WHERE dept IN ('CS', 'EE');",
    tables: [students],
    resultTable: table("result_in", "Rows whose department belongs to the approved set.", ["name", "dept"], [["Asha", "CS"], ["Bharat", "EE"], ["Charu", "CS"], ["Esha", "EE"]]),
    interactiveExample: "Add or remove allowed values from the set capsule and see rows enter or leave the result table.",
    commonMistakes: [
      "Expanding a simple membership test into a long OR chain when IN would be clearer and easier to read.",
      "IN is best thought of as set membership, which keeps the condition compact and readable."
    ],
    examNotes: ["IN is often equivalent to multiple OR comparisons on the same column.", "IN can also work with a subquery instead of a fixed list."],
    interviewQuestions: ["When is IN clearer than OR?", "How would you explain IN visually to a beginner?"],
    finalSummary: "IN is a membership test: values either belong to the allowed set or they do not."
  },
  {
    id: 11,
    title: "UNION",
    shortTitle: "Merge sets uniquely",
    moduleId: "module-11",
    family: "set-operation",
    conceptDescription: "merging multiple query outputs while removing duplicates from the combined set",
    overview: "UNION combines two compatible result sets and keeps only unique rows in the final output.",
    learningGoal: "Understand how set merging differs from table joins and from UNION ALL.",
    analogy: "Like combining two class attendance lists into one master list without counting duplicate city names twice.",
    analogyVisual: "Two result streams merge into one lane while duplicate city cards fade away before landing.",
    sceneCue: "Two result sets merge, and duplicate city cards are removed before the final list settles.",
    quizCue: "Predict the final combined output after duplicates disappear from the merge lane.",
    query: "SELECT city FROM evening_batch UNION SELECT city FROM weekend_batch;",
    tables: [classA, classB],
    resultTable: table("result_union", "Union of both city sets.", ["city"], [["Pune"], ["Delhi"], ["Mumbai"], ["Chennai"]]),
    interactiveExample: "Toggle duplicate removal on and off to compare UNION with the mental model of UNION ALL.",
    commonMistakes: [
      "Expecting UNION to keep duplicates when it actually removes them by default.",
      "If every row from both queries must stay, UNION ALL is the correct operator, not UNION."
    ],
    examNotes: ["UNION needs compatible column counts and data types.", "UNION removes duplicates across the combined result."],
    interviewQuestions: ["What is the difference between UNION and UNION ALL?", "Why must both UNION branches be schema-compatible?"],
    finalSummary: "UNION stacks compatible results together and keeps one copy of each row."
  },
  {
    id: 12,
    title: "INTERSECT",
    shortTitle: "Common set",
    moduleId: "module-11",
    family: "set-operation",
    conceptDescription: "keeping only the rows that appear in both query outputs",
    overview: "INTERSECT finds the overlap between two result sets.",
    learningGoal: "See how SQL keeps only the shared rows from two compatible queries.",
    analogy: "Like comparing two club lists and keeping only the cities that appear in both.",
    analogyVisual: "Only cards that glow in both streams survive and move to the center overlap zone.",
    sceneCue: "Only common rows survive as both tables project matching city cards into the overlap lane.",
    quizCue: "Identify which rows receive a double glow and remain in the final result.",
    query: "SELECT city FROM evening_batch INTERSECT SELECT city FROM weekend_batch;",
    tables: [classA, classB],
    resultTable: table("result_intersect", "Cities common to both sets.", ["city"], [["Pune"], ["Delhi"]]),
    interactiveExample: "Hover either source set and watch only the shared values remain connected to the center lane.",
    commonMistakes: [
      "Confusing INTERSECT with UNION and expecting every row from both inputs to appear.",
      "INTERSECT keeps only the overlap, so any row that appears in just one side is excluded."
    ],
    examNotes: ["INTERSECT returns common rows only.", "Like UNION, both query branches must be compatible."],
    interviewQuestions: ["How would you explain INTERSECT visually?", "What happens to rows that appear on only one side of an INTERSECT?"],
    finalSummary: "INTERSECT is the overlap operator: only shared rows survive."
  },
  {
    id: 13,
    title: "EXCEPT",
    shortTitle: "Left-only set",
    moduleId: "module-11",
    family: "set-operation",
    conceptDescription: "keeping rows from the first query that do not appear in the second query",
    overview: "EXCEPT subtracts one result set from another. It keeps left-side rows that the right side cannot erase.",
    learningGoal: "Understand EXCEPT as a set difference operator.",
    analogy: "Like taking the evening batch list and scratching out any city already present in the weekend batch.",
    analogyVisual: "Rows from the second set sweep across and erase matching rows from the first set.",
    sceneCue: "Rows from the second set erase matching rows from the first until only left-only values remain.",
    quizCue: "Predict which rows survive after the erase beam passes over the first result set.",
    query: "SELECT city FROM evening_batch EXCEPT SELECT city FROM weekend_batch;",
    tables: [classA, classB],
    resultTable: table("result_except", "Values present only in the first set.", ["city"], [["Mumbai"]]),
    interactiveExample: "Watch the right-side rows act like erasers and see which left-side cards remain untouched.",
    commonMistakes: [
      "Reversing the query order and expecting the same answer from EXCEPT.",
      "Set difference is directional: first minus second is not the same as second minus first."
    ],
    examNotes: ["EXCEPT is order-sensitive.", "Rows in the first query that also appear in the second query are removed."],
    interviewQuestions: ["Why is EXCEPT directional?", "How does EXCEPT differ visually from INTERSECT?"],
    finalSummary: "EXCEPT means first set minus second set: only left-only rows stay."
  },
  {
    id: 14,
    title: "AVG",
    shortTitle: "Average value",
    moduleId: "module-11",
    family: "aggregate",
    conceptDescription: "reducing many rows into one summary value",
    overview: "AVG compresses multiple numeric values into one representative average.",
    learningGoal: "Visualize how many input values collapse into a single mean value.",
    analogy: "Like pouring several CGPA values into one balancing beaker to find the class average.",
    analogyVisual: "Numeric values flow into an accumulator and settle at a single average gauge reading of 8.12.",
    sceneCue: "CGPA values stream into one accumulator, combine, and settle at the average value.",
    quizCue: "Estimate the final gauge reading after all values flow into the AVG chamber.",
    query: "SELECT AVG(cgpa) FROM students;",
    tables: [students],
    resultTable: table("result_avg", "Average CGPA across the class.", ["avg(cgpa)"], [["8.12"]]),
    interactiveExample: "Switch individual values on and off to see how the average changes when the input mix changes.",
    commonMistakes: [
      "Forgetting that AVG returns one summary value, not one output row per input record.",
      "Aggregate functions collapse many values into fewer rows, often just one row without GROUP BY."
    ],
    examNotes: ["AVG works on numeric columns.", "Without GROUP BY, AVG usually returns a single row."],
    interviewQuestions: ["Why does AVG often return one row?", "How would GROUP BY change the behavior of AVG?"],
    finalSummary: "AVG turns many numbers into one mean value."
  },
  {
    id: 15,
    title: "MIN",
    shortTitle: "Lowest value",
    moduleId: "module-11",
    family: "aggregate",
    conceptDescription: "reducing many rows into one summary value",
    overview: "MIN finds the smallest value in a column.",
    learningGoal: "See how SQL scans all values to highlight the lowest one.",
    analogy: "Like highlighting the smallest score card in a stack.",
    analogyVisual: "All CGPA values rise briefly, then the smallest one remains glowing at the bottom.",
    sceneCue: "The lowest value is highlighted while all other values dim around it.",
    quizCue: "Spot the minimum value before the highlight ring locks onto it.",
    query: "SELECT MIN(cgpa) FROM students;",
    tables: [students],
    resultTable: table("result_min", "Minimum CGPA in the class.", ["min(cgpa)"], [["6.8"]]),
    interactiveExample: "Reorder the input list and observe that MIN never changes unless the actual smallest value changes.",
    commonMistakes: [
      "Assuming MIN depends on row order instead of the actual lowest value in the data.",
      "MIN is value-based, so sorting the input visually does not change the answer."
    ],
    examNotes: ["MIN ignores the physical order of rows.", "MIN can work with numbers, dates, and other comparable values."],
    interviewQuestions: ["Why does MIN not care about row order?", "How would MIN behave with grouped data?"],
    finalSummary: "MIN scans the set and returns the smallest comparable value."
  },
  {
    id: 16,
    title: "MAX",
    shortTitle: "Highest value",
    moduleId: "module-11",
    family: "aggregate",
    conceptDescription: "reducing many rows into one summary value",
    overview: "MAX finds the largest value in a column.",
    learningGoal: "Understand how one highlighted maximum value can summarize a whole set quickly.",
    analogy: "Like marking the tallest bar in a chart after all bars appear.",
    analogyVisual: "The highest CGPA card rises above the others and receives a bright crown pulse.",
    sceneCue: "The highest value is highlighted and floats above the rest of the values.",
    quizCue: "Predict which value ends up at the top of the maximum tower.",
    query: "SELECT MAX(cgpa) FROM students;",
    tables: [students],
    resultTable: table("result_max", "Maximum CGPA in the class.", ["max(cgpa)"], [["9.1"]]),
    interactiveExample: "Drag values upward or downward and see that MAX only changes when the top value changes.",
    commonMistakes: [
      "Confusing MAX with the last row in a sorted-looking table that was not actually sorted.",
      "MAX is computed from data values, not from where a row happens to appear visually."
    ],
    examNotes: ["MAX returns the highest comparable value.", "Without GROUP BY, MAX typically returns one row."],
    interviewQuestions: ["What is the difference between MAX and ordering with LIMIT 1?", "Why is MAX often more direct than sorting?"],
    finalSummary: "MAX scans the set and returns the single highest value."
  },
  {
    id: 17,
    title: "COUNT",
    shortTitle: "Row counting",
    moduleId: "module-11",
    family: "aggregate",
    conceptDescription: "reducing many rows into one summary value",
    overview: "COUNT tracks how many rows or values qualify for the query.",
    learningGoal: "See COUNT as a live counter that increments when a row contributes.",
    analogy: "Like a turnstile that clicks once for every valid student entering a hall.",
    analogyVisual: "A counter increases by one every time a row reaches the counting chamber.",
    sceneCue: "The counter increases for every row until the final total appears in one result cell.",
    quizCue: "Watch the counter animation and predict the final total before it stops.",
    query: "SELECT COUNT(*) FROM students;",
    tables: [students],
    resultTable: table("result_count", "Total number of students.", ["count(*)"], [["5"]]),
    interactiveExample: "Hide and reveal rows to see how COUNT responds immediately to the visible qualifying set.",
    commonMistakes: [
      "Mixing up COUNT(*) with selecting all rows directly; COUNT returns one number, not the rows themselves.",
      "COUNT summarizes the qualifying rows into a total instead of displaying each row."
    ],
    examNotes: ["COUNT(*) counts rows.", "COUNT(column) can ignore NULL values depending on the column."],
    interviewQuestions: ["How is COUNT(*) different from SELECT *?", "Why is COUNT an aggregate function?"],
    finalSummary: "COUNT is a live row counter that ends as a single numeric result."
  },
  {
    id: 18,
    title: "SUM",
    shortTitle: "Total accumulation",
    moduleId: "module-11",
    family: "aggregate",
    conceptDescription: "reducing many rows into one summary value",
    overview: "SUM adds numeric values together and returns a total.",
    learningGoal: "Visualize numeric values flowing into an accumulator to form one final total.",
    analogy: "Like dropping course credits into one jar until the total credit load is visible.",
    analogyVisual: "Credit values flow into a totalizer and the final display lands on 16.",
    sceneCue: "Values stream into an accumulator and the total cell updates after each addition.",
    quizCue: "Predict the total shown on the accumulator after the last value is added.",
    query: "SELECT SUM(credits) FROM courses;",
    tables: [courses],
    resultTable: table("result_sum", "Total credits across the course list.", ["sum(credits)"], [["16"]]),
    interactiveExample: "Remove one course and notice exactly how much the total decreases in the accumulator.",
    commonMistakes: [
      "Expecting SUM to return each input value instead of one combined total.",
      "SUM collapses many numeric rows into one total unless grouped."
    ],
    examNotes: ["SUM works on numeric data.", "SUM without GROUP BY usually returns one row."],
    interviewQuestions: ["How is SUM different from selecting a numeric column directly?", "What changes when GROUP BY is added to SUM?"],
    finalSummary: "SUM pours many values into one accumulator and outputs the total."
  },
  {
    id: 19,
    slug: "nested-subqueries",
    title: "Nested Subqueries",
    shortTitle: "Query inside query inside query",
    moduleId: "module-12",
    family: "subquery",
    conceptDescription: "using the output of one query inside another query",
    overview: "Nested subqueries stack one inner query inside another so values can bubble outward in layers.",
    learningGoal: "Track the execution order of inner-to-outer queries and understand how each layer feeds the next.",
    analogy: "Like opening a box, finding another box inside it, and using the inner note to unlock the final answer.",
    analogyVisual: "An innermost department lookup runs first, then an average CGPA bubble rises into the outer filter.",
    sceneCue: "The inner query executes first, its result bubbles upward, and the outer query uses it to finish filtering rows.",
    quizCue: "Predict which query layer executes first when three glowing cards stack inside each other.",
    query: "SELECT name FROM students WHERE cgpa > (SELECT AVG(cgpa) FROM students WHERE dept = (SELECT dept_name FROM departments WHERE hod = 'Dr. Rao'));",
    tables: [students, departments],
    resultTable: table("result_nested", "Students whose CGPA beats the nested department average.", ["name"], [["Asha"], ["Charu"]]),
    interactiveExample: "Step through the nested layers one at a time and watch the inner result become input for the next layer.",
    commonMistakes: [
      "Reading a nested query from left to right and forgetting that the deepest subquery usually resolves first.",
      "Nested SQL becomes easier when you identify the innermost question first and move outward layer by layer."
    ],
    examNotes: ["Innermost subqueries often execute first conceptually.", "Nested subqueries are useful when one derived value depends on another derived value."],
    interviewQuestions: ["How do you reason about the order of execution in a nested subquery?", "When might a nested subquery be clearer than a join?"],
    finalSummary: "Nested subqueries resolve from the inside out, with each inner answer feeding the outer layer."
  },
  {
    id: 20,
    slug: "subqueries-in-where-clause",
    title: "Subqueries in WHERE Clause",
    shortTitle: "Filter with a derived value",
    moduleId: "module-12",
    family: "subquery",
    conceptDescription: "using the output of one query inside another query",
    overview: "A WHERE clause can depend on a subquery result, letting SQL filter rows based on a derived benchmark.",
    learningGoal: "Understand how a subquery can compute a threshold before the outer WHERE filter runs.",
    analogy: "Like calculating the class average first, then letting only above-average students pass the gate.",
    analogyVisual: "An average gauge appears from the inner query and snaps into the outer filter gate as the cutoff value.",
    sceneCue: "The subquery computes a threshold first, then the outer WHERE clause uses it as a filter gate.",
    quizCue: "Predict which rows survive once the dynamic threshold arrives from the inner query.",
    query: "SELECT name FROM students WHERE cgpa > (SELECT AVG(cgpa) FROM students);",
    tables: [students],
    resultTable: table("result_where_subquery", "Students above the class average.", ["name"], [["Asha"], ["Charu"], ["Esha"]]),
    interactiveExample: "Change the average threshold by adding or removing one student and watch the outer filter react instantly.",
    commonMistakes: [
      "Treating the subquery result as if it were optional when the outer filter depends on it directly.",
      "If the subquery value changes, the rows passing the WHERE condition can change too."
    ],
    examNotes: ["A subquery in WHERE often provides a dynamic comparison value.", "Scalar subqueries pair naturally with comparison operators in WHERE."],
    interviewQuestions: ["Why is a WHERE subquery useful for dynamic thresholds?", "What kind of value should a scalar subquery return in a comparison?"],
    finalSummary: "A WHERE subquery computes a value first, then the outer filter uses that value to keep or reject rows."
  },
  {
    id: 21,
    slug: "set-membership-using-in",
    title: "Set Membership using IN",
    shortTitle: "IN with a subquery",
    moduleId: "module-12",
    family: "subquery",
    conceptDescription: "using the output of one query inside another query",
    overview: "IN becomes more powerful when the allowed set comes from another query instead of a hardcoded list.",
    learningGoal: "See how a subquery can generate the membership set for an outer filter.",
    analogy: "Like asking the admin office for the approved department list before checking which students belong to it.",
    analogyVisual: "The inner query builds a live department set capsule, then student rows check themselves against it.",
    sceneCue: "A subquery constructs the allowed set first, and the outer query checks row membership against it.",
    quizCue: "Predict which rows stay once the inner query populates the IN set capsule.",
    query: "SELECT name FROM students WHERE dept IN (SELECT dept_name FROM departments WHERE intake > 100);",
    tables: [students, departments],
    resultTable: table("result_in_subquery", "Students whose department belongs to the high-intake set.", ["name"], [["Asha"], ["Bharat"], ["Charu"], ["Esha"]]),
    interactiveExample: "Raise or lower the intake cutoff in the inner query and watch the membership set update live.",
    commonMistakes: [
      "Forgetting that the outer query only sees the subquery output values, not the full inner table.",
      "When using IN with a subquery, focus on what column the inner query returns because that becomes the membership set."
    ],
    examNotes: ["IN with a subquery works well when the allowed values come from another table.", "The inner query should return one compatible column for the membership test."],
    interviewQuestions: ["Why is IN with a subquery cleaner than copying values manually?", "What must be compatible between the outer column and the inner query output?"],
    finalSummary: "IN plus subquery means a live membership list built by SQL itself."
  },
  {
    id: 22,
    slug: "some-clause",
    title: "SOME Clause",
    shortTitle: "At least one match",
    moduleId: "module-12",
    family: "subquery",
    conceptDescription: "using the output of one query inside another query",
    overview: "SOME checks whether a comparison is true for at least one value returned by the subquery.",
    learningGoal: "Understand SOME as an any-match operator over subquery results.",
    analogy: "Like asking whether a student's CGPA beats at least one scholarship cutoff on the board.",
    analogyVisual: "Multiple cutoff bulbs appear, and one green match is enough to light the row path.",
    sceneCue: "At least one matching value lights up, turning the row path green for the SOME condition.",
    quizCue: "Watch the comparison bulbs and decide whether one successful match is enough for the row to pass.",
    query: "SELECT name, cgpa FROM students WHERE cgpa > SOME (SELECT cutoff FROM scholarship_cutoffs);",
    tables: [students, scholarshipCutoffs],
    resultTable: table("result_some", "Students whose CGPA beats at least one cutoff.", ["name", "cgpa"], [["Asha", "8.9"], ["Bharat", "7.4"], ["Charu", "9.1"], ["Esha", "8.4"]]),
    interactiveExample: "Hover each cutoff bulb and see that a single successful comparison is enough to approve the row.",
    commonMistakes: [
      "Confusing SOME with ALL and assuming every comparison must pass.",
      "SOME needs only one true comparison, which usually makes it less strict than ALL."
    ],
    examNotes: ["SOME is often read as any.", "Its behavior depends on the comparison operator you pair with it."],
    interviewQuestions: ["How would you explain SOME without using jargon?", "Why is SOME typically less strict than ALL?"],
    finalSummary: "SOME means at least one successful comparison is enough."
  },
  {
    id: 23,
    slug: "all-clause",
    title: "ALL Clause",
    shortTitle: "Every comparison must pass",
    moduleId: "module-12",
    family: "subquery",
    conceptDescription: "using the output of one query inside another query",
    overview: "ALL checks whether the comparison is true for every value returned by the subquery.",
    learningGoal: "Feel the stricter nature of ALL compared with SOME.",
    analogy: "Like clearing every hurdle on a track instead of just one.",
    analogyVisual: "Every cutoff bulb must glow green; one red failure immediately blocks the row.",
    sceneCue: "Every value must pass the comparison. One failure turns the entire path red.",
    quizCue: "Predict whether the row survives once each comparison checkpoint lights up.",
    query: "SELECT name, cgpa FROM students WHERE cgpa > ALL (SELECT cutoff FROM scholarship_cutoffs);",
    tables: [students, scholarshipCutoffs],
    resultTable: table("result_all_clause", "Students whose CGPA beats every cutoff.", ["name", "cgpa"], [["Asha", "8.9"], ["Charu", "9.1"]]),
    interactiveExample: "Toggle one cutoff higher or lower and see how ALL reacts much more sharply than SOME.",
    commonMistakes: [
      "Treating ALL like SOME and forgetting that every comparison must succeed.",
      "One failed comparison is enough to reject the row under ALL."
    ],
    examNotes: ["ALL is stricter than SOME for the same comparison.", "The outer value must satisfy the condition against every returned subquery value."],
    interviewQuestions: ["How is ALL different from SOME?", "Why does one failing comparison reject the row under ALL?"],
    finalSummary: "ALL is the strict gate: every comparison checkpoint must turn green."
  },
  {
    id: 24,
    title: "EXISTS",
    shortTitle: "Does any row exist?",
    moduleId: "module-12",
    family: "subquery",
    conceptDescription: "using the output of one query inside another query",
    overview: "EXISTS asks a yes-or-no question: does the subquery return at least one row?",
    learningGoal: "Understand EXISTS as a boolean existence check rather than a value comparison.",
    analogy: "Like checking whether any student is present in a department before opening that department's desk.",
    analogyVisual: "The subquery searches quickly; finding even one row triggers a green check on the outer row.",
    sceneCue: "The subquery searches. If any row appears, the EXISTS check flashes green immediately.",
    quizCue: "Watch the search beam and decide whether the first found row is enough to approve the outer record.",
    query: "SELECT dept_name FROM departments d WHERE EXISTS (SELECT 1 FROM students s WHERE s.dept = d.dept_name);",
    tables: [departments, students],
    resultTable: table("result_exists", "Departments that have at least one student.", ["dept_name"], [["CS"], ["EE"], ["ME"]]),
    interactiveExample: "Focus each department and watch the inner scan stop as soon as one matching student is found.",
    commonMistakes: [
      "Thinking EXISTS compares returned values when it only cares whether at least one row exists.",
      "EXISTS is about row presence, not about what specific values those rows contain."
    ],
    examNotes: ["EXISTS returns TRUE if the subquery returns at least one row.", "It is often used with correlated subqueries."],
    interviewQuestions: ["Why can EXISTS short-circuit after one match?", "How would you explain EXISTS to a beginner visually?"],
    finalSummary: "EXISTS is a yes-or-no presence check: one matching row is enough."
  },
  {
    id: 25,
    slug: "not-exists",
    title: "NOT EXISTS",
    shortTitle: "Absence check",
    moduleId: "module-12",
    family: "subquery",
    conceptDescription: "using the output of one query inside another query",
    overview: "NOT EXISTS flips the logic of EXISTS. It keeps outer rows only when the subquery returns nothing.",
    learningGoal: "Visualize absence as an empty search result rather than a failed value comparison.",
    analogy: "Like opening a locker only if the search confirms nobody is assigned to it.",
    analogyVisual: "The search beam scans the subquery lane; only empty lanes receive the green approval pulse.",
    sceneCue: "The subquery must return no rows. An empty result is the success condition for NOT EXISTS.",
    quizCue: "Predict which outer rows survive when the search lane must stay empty.",
    query: "SELECT dept_name FROM departments d WHERE NOT EXISTS (SELECT 1 FROM students s WHERE s.dept = d.dept_name);",
    tables: [departments, students],
    resultTable: table("result_not_exists", "Departments with no students assigned.", ["dept_name"], [["CE"]]),
    interactiveExample: "Remove or add one matching student and watch the empty-lane test flip instantly.",
    commonMistakes: [
      "Reading NOT EXISTS like a comparison instead of an emptiness check on the subquery result.",
      "For NOT EXISTS to pass, the inner query must return no rows at all."
    ],
    examNotes: ["NOT EXISTS is useful for finding missing relationships.", "It is common in anti-join style logic."],
    interviewQuestions: ["When would you use NOT EXISTS in real projects?", "How is NOT EXISTS related to finding missing matches?"],
    finalSummary: "NOT EXISTS approves the outer row only when the inner result stays empty."
  },
  {
    id: 26,
    title: "UNIQUE",
    shortTitle: "No duplicate subquery rows",
    moduleId: "module-12",
    family: "subquery",
    conceptDescription: "using the output of one query inside another query",
    overview: "UNIQUE checks whether a subquery result contains duplicate rows. If duplicates appear, the predicate fails.",
    learningGoal: "Understand UNIQUE as a duplicate detector over a subquery result set.",
    analogy: "Like checking whether every passcode in a box is different before approving the box.",
    analogyVisual: "A duplicate detector scans the subquery output; repeated values flash red while unique runs stay green.",
    sceneCue: "The duplicate detector scans the subquery result and only duplicate-free outputs earn a green check.",
    quizCue: "Watch the scan and predict whether repeated values will make the UNIQUE predicate fail.",
    query: "SELECT dept_name FROM departments d WHERE UNIQUE (SELECT city FROM students s WHERE s.dept = d.dept_name);",
    tables: [departments, students],
    resultTable: table("result_unique", "Departments whose student-city subquery is duplicate-free.", ["dept_name"], [["ME"], ["CE"]]),
    interactiveExample: "Inspect each department's subquery result and see why repeated city values make UNIQUE fail.",
    commonMistakes: [
      "Assuming UNIQUE behaves like DISTINCT in the outer query when it actually tests duplicates in a subquery result.",
      "UNIQUE is about whether the subquery output has repeated rows, not about removing those repeats automatically."
    ],
    examNotes: ["UNIQUE is a predicate on subquery output.", "It returns TRUE when the subquery contains no duplicate rows."],
    interviewQuestions: ["How is UNIQUE different from DISTINCT?", "What is the subquery property that UNIQUE tests?"],
    finalSummary: "UNIQUE is a duplicate detector for subquery output, not a duplicate remover for the final result."
  },
  {
    id: 27,
    slug: "subqueries-in-from-clause",
    title: "Subqueries in FROM Clause",
    shortTitle: "Derived table",
    moduleId: "module-12",
    family: "subquery",
    conceptDescription: "using the output of one query inside another query",
    overview: "A subquery in FROM behaves like a temporary table that the outer query can read from.",
    learningGoal: "See a derived table as a reusable intermediate table inside one query block.",
    analogy: "Like building a mini summary sheet first, then handing that sheet to the final decision-maker.",
    analogyVisual: "An aggregate summary table materializes in the center, then the outer query filters it like any regular table.",
    sceneCue: "A temporary table appears from the inner query, and the outer query treats it like a normal table input.",
    quizCue: "Predict which rows remain after the outer query reads the derived table.",
    query: "SELECT dept, avg_cgpa FROM (SELECT dept, AVG(cgpa) AS avg_cgpa FROM students GROUP BY dept) AS dept_scores WHERE avg_cgpa > 7.5;",
    tables: [students],
    resultTable: table("result_from_subquery", "Derived table rows that survive the outer filter.", ["dept", "avg_cgpa"], [["CS", "9.0"], ["EE", "7.9"]]),
    interactiveExample: "Pause after the inner GROUP BY and notice how the outer query sees only the derived summary table.",
    commonMistakes: [
      "Forgetting that the outer query cannot directly see columns that the derived table did not project.",
      "Only the columns exposed by the subquery alias are available to the outer query."
    ],
    examNotes: ["A subquery in FROM is often called a derived table.", "Aliases are essential because the outer query needs a name for the derived table."],
    interviewQuestions: ["Why is an alias required for a subquery in FROM?", "How does a derived table simplify multi-step SQL?"],
    finalSummary: "A FROM subquery materializes a temporary table that the outer query can query like any other source."
  },
  {
    id: 28,
    slug: "with-clause",
    title: "WITH Clause",
    shortTitle: "Named temporary result",
    moduleId: "module-12",
    family: "with-clause",
    conceptDescription: "using the output of one query inside another query",
    overview: "WITH gives a temporary result set a name, which makes a multi-step query easier to read and reason about.",
    learningGoal: "Learn how a named common table expression can clarify SQL flow.",
    analogy: "Like drafting a labeled sticky note before using it in the final solution.",
    analogyVisual: "A temporary table named high_cgpa appears in its own glass card and feeds the main query.",
    sceneCue: "A temporary table appears, gets a name, and the main query reuses that named result.",
    quizCue: "Watch the named temporary card appear and predict how the main query reads from it.",
    query: "WITH high_cgpa AS (SELECT name, dept, cgpa FROM students WHERE cgpa >= 8.4) SELECT dept, COUNT(*) FROM high_cgpa GROUP BY dept;",
    tables: [students],
    resultTable: table("result_with", "Counts computed from the named temporary result.", ["dept", "count(*)"], [["CS", "2"], ["EE", "1"]]),
    interactiveExample: "Toggle between the base query and the CTE view to see how the named step improves readability.",
    commonMistakes: [
      "Thinking WITH stores data permanently when it only names a temporary result for the current query.",
      "A CTE improves structure, but it does not create a permanent table unless you explicitly store it."
    ],
    examNotes: ["WITH defines a common table expression.", "A CTE improves readability for multi-step queries."],
    interviewQuestions: ["Why do developers use WITH instead of nesting everything directly?", "What is the lifetime of a CTE?"],
    finalSummary: "WITH names a temporary result so the final query reads like a sequence instead of a maze."
  },
  {
    id: 29,
    slug: "complex-queries-with-clause",
    title: "Complex Queries using WITH Clause",
    shortTitle: "Multi-CTE flow",
    moduleId: "module-12",
    family: "with-clause",
    conceptDescription: "using the output of one query inside another query",
    overview: "Complex queries often become readable once you split them into named CTE stages.",
    learningGoal: "Break a complicated SQL problem into smaller named steps you can animate and debug one by one.",
    analogy: "Like turning a long recipe into labeled prep bowls before cooking the final dish.",
    analogyVisual: "One CTE creates department averages, another ranks them, and the final query picks the winner.",
    sceneCue: "Multiple temporary tables appear in sequence, each feeding the next until the final answer lands.",
    quizCue: "Track how many named stages the query uses before the final result is produced.",
    query: "WITH dept_scores AS (SELECT dept, AVG(cgpa) AS avg_cgpa FROM students GROUP BY dept), top_dept AS (SELECT dept, avg_cgpa FROM dept_scores WHERE avg_cgpa = (SELECT MAX(avg_cgpa) FROM dept_scores)) SELECT * FROM top_dept;",
    tables: [students],
    resultTable: table("result_complex_with", "Top department selected through layered CTEs.", ["dept", "avg_cgpa"], [["CS", "9.0"]]),
    interactiveExample: "Step through each CTE stage separately so the final query feels like a composed pipeline, not a monolith.",
    commonMistakes: [
      "Writing a huge nested query when named stages would make the logic far easier to validate.",
      "Complex SQL becomes more maintainable when each CTE answers one clear sub-problem."
    ],
    examNotes: ["Multiple CTEs can be chained in one WITH clause.", "Each CTE can build on previous CTEs in sequence."],
    interviewQuestions: ["How do multiple CTEs improve maintainability?", "When does a CTE pipeline beat deep nesting for readability?"],
    finalSummary: "Complex WITH queries turn one hard problem into a readable chain of temporary named steps."
  },
  {
    id: 30,
    slug: "subqueries-in-select-clause",
    title: "Subqueries in SELECT Clause",
    shortTitle: "Extra computed column",
    moduleId: "module-12",
    family: "select-subquery",
    conceptDescription: "using the output of one query inside another query",
    overview: "A subquery in SELECT adds a derived value as an extra output column for each outer row.",
    learningGoal: "See how SQL can decorate each row with a computed value from another query.",
    analogy: "Like printing each student's row and then attaching a department average note beside it.",
    analogyVisual: "A new column grows on the right, and a mini subquery fills it row by row.",
    sceneCue: "The subquery computes a value and inserts it into a new output column beside each outer row.",
    quizCue: "Predict what value will be written into the new computed column for each row.",
    query: "SELECT s1.name, s1.dept, (SELECT AVG(s2.cgpa) FROM students s2 WHERE s2.dept = s1.dept) AS dept_avg FROM students s1;",
    tables: [students],
    resultTable: table("result_select_subquery", "Each row enriched with its department average.", ["name", "dept", "dept_avg"], [["Asha", "CS", "9.0"], ["Bharat", "EE", "7.9"], ["Charu", "CS", "9.0"], ["Dev", "ME", "6.8"], ["Esha", "EE", "7.9"]]),
    interactiveExample: "Hover each row to see the matching subquery calculation that fills the derived column.",
    commonMistakes: [
      "Forgetting that the SELECT-clause subquery should return a single value for each outer row position.",
      "If a SELECT subquery returns more than one value for one row slot, the query shape breaks."
    ],
    examNotes: ["SELECT-clause subqueries often return scalar values.", "Correlated subqueries in SELECT can vary by outer row."],
    interviewQuestions: ["What is a practical use of a SELECT-clause subquery?", "Why must the subquery fit one output cell per outer row?"],
    finalSummary: "A SELECT-clause subquery paints an extra computed value into each output row."
  },
  {
    id: 31,
    slug: "scalar-subquery",
    title: "Scalar Subquery",
    shortTitle: "One value from a subquery",
    moduleId: "module-12",
    family: "select-subquery",
    conceptDescription: "using the output of one query inside another query",
    overview: "A scalar subquery returns exactly one value, which can be plugged into comparisons or shown directly.",
    learningGoal: "Develop a strong intuition for subqueries that produce just one value cell.",
    analogy: "Like grabbing one official class average number and printing it beside every student's record.",
    analogyVisual: "The inner query shrinks into one glowing number bubble, then slots into a new column on every row.",
    sceneCue: "The subquery produces one value, and that scalar value is inserted directly into the main query output.",
    quizCue: "Predict the single value bubble produced by the inner query before it spreads across the result.",
    query: "SELECT name, cgpa, (SELECT AVG(cgpa) FROM students) AS class_avg FROM students;",
    tables: [students],
    resultTable: table("result_scalar", "Each student row decorated with the scalar class average.", ["name", "cgpa", "class_avg"], [["Asha", "8.9", "8.12"], ["Bharat", "7.4", "8.12"], ["Charu", "9.1", "8.12"], ["Dev", "6.8", "8.12"], ["Esha", "8.4", "8.12"]]),
    interactiveExample: "Watch one scalar value bubble emerge from the inner query and copy itself into each row.",
    commonMistakes: [
      "Using a scalar subquery in a place where the inner query might return multiple rows.",
      "A scalar subquery must resolve to one value for the location where it is used."
    ],
    examNotes: ["Scalar subqueries return one row and one column.", "They are common in comparisons and SELECT expressions."],
    interviewQuestions: ["What makes a subquery scalar?", "What error pattern appears when a scalar subquery returns multiple rows?"],
    finalSummary: "A scalar subquery is a one-value generator that feeds a single output cell or comparison."
  },
  {
    id: 32,
    slug: "database-modification-overview",
    title: "Database Modification Overview",
    shortTitle: "INSERT, DELETE, UPDATE map",
    moduleId: "module-12",
    family: "modification",
    conceptDescription: "changing the stored data inside a table",
    overview: "Modification queries do not just display data. They change table state by adding, removing, or updating rows.",
    learningGoal: "Separate read-only SQL from write operations that permanently alter stored data.",
    analogy: "Like editing a class register with a pen instead of just photocopying it.",
    analogyVisual: "Three lanes appear: one drops a row in, one erases a row, and one morphs a cell value in place.",
    sceneCue: "INSERT, DELETE, and UPDATE animate side by side so the learner can compare how each changes table state.",
    quizCue: "Choose which lane adds rows, removes rows, or transforms values when the three operations animate together.",
    query: "INSERT / DELETE / UPDATE change stored table contents;",
    tables: [students],
    resultTable: table("result_modification_overview", "High-level view of modification commands.", ["operation", "effect"], [["INSERT", "Adds new rows"], ["DELETE", "Removes existing rows"], ["UPDATE", "Changes values in existing rows"]]),
    interactiveExample: "Switch among the three write operations and compare whether the table grows, shrinks, or mutates in place.",
    commonMistakes: [
      "Treating modification commands like read-only queries and forgetting they change persistent state.",
      "Before running modification SQL, always identify the target rows carefully because the table itself will change."
    ],
    examNotes: ["Modification statements alter stored data.", "WHERE clauses are especially important for targeted DELETE and UPDATE operations."],
    interviewQuestions: ["How are modification queries different from retrieval queries?", "Why is a careful WHERE clause critical for UPDATE and DELETE?"],
    finalSummary: "Modification SQL changes the table itself: INSERT grows it, DELETE shrinks it, UPDATE reshapes values."
  },
  {
    id: 33,
    title: "INSERT",
    shortTitle: "Add a new row",
    moduleId: "module-12",
    family: "modification",
    conceptDescription: "changing the stored data inside a table",
    overview: "INSERT adds a brand-new row to a table.",
    learningGoal: "See how new data enters the table structure and increases its row count.",
    analogy: "Like dropping a fresh admission form into the class register.",
    analogyVisual: "A new row card descends from above and snaps into the table as row six.",
    sceneCue: "A new row drops into the table and the row counter increases immediately.",
    quizCue: "Predict where the new row lands and how the table size changes after the insertion.",
    query: "INSERT INTO students (id, name, dept, city, cgpa) VALUES (6, 'Farah', 'CE', 'Kolkata', 8.2);",
    tables: [students],
    resultTable: table("result_insert", "Student table after the new row is inserted.", ["id", "name", "dept", "city", "cgpa"], [["1", "Asha", "CS", "Pune", "8.9"], ["2", "Bharat", "EE", "Delhi", "7.4"], ["3", "Charu", "CS", "Pune", "9.1"], ["4", "Dev", "ME", "Chennai", "6.8"], ["5", "Esha", "EE", "Delhi", "8.4"], ["6", "Farah", "CE", "Kolkata", "8.2"]]),
    interactiveExample: "Trigger the insertion and watch the new row animate into the table instead of replacing an old row.",
    commonMistakes: [
      "Providing values in an order that does not match the listed columns.",
      "INSERT is safest when you name the target columns explicitly so the values map cleanly."
    ],
    examNotes: ["INSERT adds rows to a table.", "Explicit column lists reduce mistakes and improve clarity."],
    interviewQuestions: ["Why is naming columns in INSERT a good practice?", "How would you explain what INSERT changes visually?"],
    finalSummary: "INSERT grows the table by adding a brand-new row."
  },
  {
    id: 34,
    title: "DELETE",
    shortTitle: "Remove rows",
    moduleId: "module-12",
    family: "modification",
    conceptDescription: "changing the stored data inside a table",
    overview: "DELETE removes rows that match a condition.",
    learningGoal: "Understand how targeted row removal changes table size and table state.",
    analogy: "Like erasing entries from a register that no longer qualify.",
    analogyVisual: "Rows that match the condition fade out and collapse, leaving a smaller table behind.",
    sceneCue: "Matching rows fade out and disappear while the remaining rows close the gap.",
    quizCue: "Predict which rows vanish when the delete condition lights up red.",
    query: "DELETE FROM students WHERE cgpa < 7.0;",
    tables: [students],
    resultTable: table("result_delete", "Student table after low-CGPA rows are removed.", ["id", "name", "dept", "city", "cgpa"], [["1", "Asha", "CS", "Pune", "8.9"], ["2", "Bharat", "EE", "Delhi", "7.4"], ["3", "Charu", "CS", "Pune", "9.1"], ["5", "Esha", "EE", "Delhi", "8.4"]]),
    interactiveExample: "Slide the delete threshold and watch rows disappear from the persistent table snapshot.",
    commonMistakes: [
      "Running DELETE without a WHERE clause when the intention was to remove only specific rows.",
      "Without WHERE, DELETE can remove every row in the table, so target conditions matter enormously."
    ],
    examNotes: ["DELETE removes rows from a table.", "WHERE controls which rows are removed."],
    interviewQuestions: ["Why is DELETE without WHERE risky?", "How would you visualize DELETE for beginners?"],
    finalSummary: "DELETE shrinks the table by removing matching rows from storage."
  },
  {
    id: 35,
    title: "UPDATE",
    shortTitle: "Change existing values",
    moduleId: "module-12",
    family: "modification",
    conceptDescription: "changing the stored data inside a table",
    overview: "UPDATE changes values inside existing rows without adding or removing rows.",
    learningGoal: "Distinguish value mutation from row insertion or deletion.",
    analogy: "Like correcting a CGPA entry on an existing form instead of filing a new form.",
    analogyVisual: "A targeted cell morphs from the old value to the new value while the row frame stays in place.",
    sceneCue: "Cells transform from old values to new values, showing that the row remains but its data changes.",
    quizCue: "Predict which cells change color and text when the UPDATE query runs.",
    query: "UPDATE students SET cgpa = 8.7 WHERE name = 'Esha';",
    tables: [students],
    resultTable: table("result_update", "Student table after one CGPA value is updated.", ["id", "name", "dept", "city", "cgpa"], [["1", "Asha", "CS", "Pune", "8.9"], ["2", "Bharat", "EE", "Delhi", "7.4"], ["3", "Charu", "CS", "Pune", "9.1"], ["4", "Dev", "ME", "Chennai", "6.8"], ["5", "Esha", "EE", "Delhi", "8.7"]]),
    interactiveExample: "Replay the update and focus on how the row stays in place while one cell morphs to the new value.",
    commonMistakes: [
      "Forgetting the WHERE clause and unintentionally updating every row.",
      "UPDATE keeps the rows but changes the stored values, so target precision matters."
    ],
    examNotes: ["UPDATE modifies existing rows.", "WHERE limits the rows whose values change."],
    interviewQuestions: ["How is UPDATE different from INSERT and DELETE?", "Why is WHERE critical in UPDATE statements?"],
    finalSummary: "UPDATE mutates existing data in place without changing row count."
  },
  {
    id: 36,
    slug: "case-statement-updates",
    title: "CASE Statement Updates",
    shortTitle: "Conditional updates",
    moduleId: "module-12",
    family: "modification",
    conceptDescription: "changing the stored data inside a table",
    overview: "CASE inside UPDATE lets one statement apply different new values to different rows based on conditions.",
    learningGoal: "See how conditional branches can drive different updates in one pass.",
    analogy: "Like a scholarship clerk assigning different award amounts based on each student's CGPA band.",
    analogyVisual: "Rows enter branching lanes, and each lane writes a different scholarship amount before rejoining the table.",
    sceneCue: "Each row follows a CASE branch, then its target amount updates based on the matching condition.",
    quizCue: "Predict which branch each row follows and what value gets written back.",
    query: "UPDATE scholarships SET amount = CASE WHEN cgpa >= 9.0 THEN 15000 WHEN cgpa >= 8.5 THEN 10000 ELSE 5000 END;",
    tables: [feePlan],
    resultTable: table("result_case_update", "Scholarship rows after CASE-based amount assignment.", ["student_id", "cgpa", "amount"], [["1", "8.9", "10000"], ["3", "9.1", "15000"], ["5", "8.4", "5000"]]),
    interactiveExample: "Pause each row at the CASE split to see exactly why it chose its branch and resulting value.",
    commonMistakes: [
      "Writing overlapping CASE branches without thinking about which condition is checked first.",
      "CASE evaluation order matters because the first matching branch usually wins."
    ],
    examNotes: ["CASE allows conditional logic inside UPDATE.", "Branch order matters when conditions can overlap."],
    interviewQuestions: ["Why is CASE useful inside UPDATE?", "How would you explain CASE branch order to a teammate?"],
    finalSummary: "CASE updates let one statement write different values based on row-by-row conditions."
  },
  {
    id: 37,
    slug: "updates-using-scalar-subqueries",
    title: "Updates using Scalar Subqueries",
    shortTitle: "Update from derived value",
    moduleId: "module-12",
    family: "modification",
    conceptDescription: "changing the stored data inside a table",
    overview: "An UPDATE can use a scalar subquery to compute the new value before writing it back into each target row.",
    learningGoal: "Combine value derivation and persistent updates in one mental model.",
    analogy: "Like computing the top score per department and then writing that score into the department record sheet.",
    analogyVisual: "Each department row waits while a scalar subquery bubble computes the maximum CGPA and drops it into the target cell.",
    sceneCue: "A scalar subquery produces one value for each target row, and that value updates the stored cell.",
    quizCue: "Predict which derived value bubble lands in each department row during the update.",
    query: "UPDATE departments SET top_cgpa = (SELECT MAX(cgpa) FROM students WHERE students.dept = departments.dept_name);",
    tables: [departments, students],
    resultTable: table("result_update_scalar", "Department table after top CGPA values are refreshed from a scalar subquery.", ["dept_name", "top_cgpa"], [["CS", "9.1"], ["EE", "8.4"], ["ME", "6.8"], ["CE", "null"]]),
    interactiveExample: "Select one department and watch the inner query compute exactly one value that gets written into its target cell.",
    commonMistakes: [
      "Using a subquery that could return multiple rows for one target cell during an UPDATE.",
      "For scalar-subquery updates, each target cell needs one derived value, not a whole set of rows."
    ],
    examNotes: ["Scalar subqueries can provide new values inside UPDATE.", "The subquery must resolve compatibly for each target row."],
    interviewQuestions: ["What makes a scalar subquery safe inside an UPDATE?", "How would you debug an UPDATE that uses a subquery for its new value?"],
    finalSummary: "Scalar-subquery updates compute one new value per target row and write it back into storage."
  },
  {
    id: 30,
    slug: "inner-join",
    title: "Inner Join",
    shortTitle: "Equi-join & Natural",
    moduleId: "module-13",
    family: "join",
    conceptDescription: "connecting rows from multiple tables based on a matching condition",
    overview: "An INNER JOIN matches rows from two tables using a condition (usually equality). If specified as NATURAL, duplicate columns are removed automatically.",
    learningGoal: "Visualize how matching pairs form the joined result, while non-matching rows are discarded.",
    analogy: "Like matching students to courses only if they meet the exact prerequisite requirement.",
    analogyVisual: "Lines connect matching student IDs to course IDs, forming new combined rows.",
    sceneCue: "Only rows with matching keys merge; the rest fade away.",
    quizCue: "Identify which rows will merge successfully and appear in the final table.",
    query: "SELECT * FROM course INNER JOIN prereq ON course.course_id = prereq.course_id;",
    tables: [courses, prereq],
    resultTable: table("result_inner_join", "Inner join of course and prereq.", ["course_id", "title", "credits", "prereq_id"], [["DB101", "DBMS", "4", "CS100"], ["OS301", "Operating Sys", "3", "CS100"], ["AI210", "AI Basics", "4", "DB101"]]),
    interactiveExample: "Toggle between an ON condition and a NATURAL JOIN to see how the duplicate course_id column is handled.",
    commonMistakes: [
      "Forgetting the ON clause, which turns the join into a Cartesian product.",
      "Assuming rows without matches will appear in the result with NULLs."
    ],
    examNotes: ["Inner joins only keep rows that satisfy the join condition.", "Trick: NATURAL JOIN removes duplicate matching columns implicitly."],
    interviewQuestions: ["What's the difference between an Equi-join and a Natural Join?", "Why would you choose explicit ON over NATURAL?"],
    finalSummary: "Inner joins keep only the matched pairs. No match, no row."
  },
  {
    id: 31,
    slug: "left-outer-join",
    title: "Left Outer Join",
    shortTitle: "Left-side preserved",
    moduleId: "module-13",
    family: "join",
    conceptDescription: "connecting rows from multiple tables based on a matching condition",
    overview: "A LEFT OUTER JOIN returns all rows from the left table, and matching rows from the right table. Missing right-side values become NULL.",
    learningGoal: "Understand how left outer joins prevent loss of information for the primary (left) table.",
    analogy: "Like listing all courses in the catalog, and showing prerequisites where they exist.",
    analogyVisual: "All left-side rows move forward. Those without right-side matches get 'NULL' placeholders.",
    sceneCue: "Every course proceeds; missing prereqs are filled with NULLs.",
    quizCue: "Count how many rows will have NULLs in the prereq column.",
    query: "SELECT course.course_id, prereq.prereq_id FROM courses LEFT OUTER JOIN prereq ON courses.course_id = prereq.course_id;",
    tables: [courses, prereq],
    resultTable: table("result_left_join", "Left outer join keeping all courses.", ["course_id", "prereq_id"], [["DB101", "CS100"], ["SE201", "null"], ["OS301", "CS100"], ["AI210", "DB101"], ["UX110", "null"]]),
    interactiveExample: "Swap the tables to see how 'LEFT' strictly means the first table named in the query.",
    commonMistakes: [
      "Placing a left-table condition in the WHERE clause instead of the ON clause, accidentally turning it into an inner join.",
      "Confusing which table is preserved (it's the one before the JOIN keyword)."
    ],
    examNotes: ["Left Outer Join guarantees at least one row per left-table record.", "Trick: IS NULL checks in the WHERE clause are great for finding 'unmatched' left rows."],
    interviewQuestions: ["How do you find rows in table A that have no match in table B?", "Why does moving an outer join's ON condition to the WHERE clause change the result?"],
    finalSummary: "Left outer join: keep everything from the left, match what you can from the right."
  },
  {
    id: 32,
    slug: "full-outer-join",
    title: "Full Outer Join",
    shortTitle: "All sides preserved",
    moduleId: "module-13",
    family: "join",
    conceptDescription: "connecting rows from multiple tables based on a matching condition",
    overview: "A FULL OUTER JOIN combines the effects of left and right outer joins. All rows from both tables are kept, padded with NULLs where matches fail.",
    learningGoal: "Visualize how the union of left-unmatched, right-unmatched, and matched rows creates the full picture.",
    analogy: "Like merging two contact lists, keeping everyone even if they are missing a phone number or an email.",
    analogyVisual: "Both tables slide together; unmatched rows on either side get NULL placeholders.",
    sceneCue: "Both left and right rows survive; NULLs fill the gaps on both sides.",
    quizCue: "Predict which columns will contain NULLs for the unmatched records.",
    query: "SELECT * FROM courses FULL OUTER JOIN prereq USING (course_id);",
    tables: [courses, prereq],
    resultTable: table("result_full_join", "Full outer join of courses and prereqs.", ["course_id", "title", "credits", "prereq_id"], [["DB101", "DBMS", "4", "CS100"], ["SE201", "Software Eng", "3", "null"], ["OS301", "Operating Sys", "3", "CS100"], ["AI210", "AI Basics", "4", "DB101"], ["UX110", "UX Studio", "2", "null"], ["CS-315", "null", "null", "CS-101"]]),
    interactiveExample: "Toggle between INNER and FULL outer join to see the 'orphan' rows appear with NULLs.",
    commonMistakes: [
      "Assuming FULL OUTER JOIN is the same as a Cartesian product. (It matches rows on a key!)",
      "Using FULL OUTER JOIN when a LEFT JOIN is sufficient."
    ],
    examNotes: ["Full Outer Join = Left Join UNION Right Join.", "Trick: The USING clause merges the join keys into a single column automatically."],
    interviewQuestions: ["When would a Full Outer Join be strictly necessary?", "What is the difference between FULL OUTER JOIN and CROSS JOIN?"],
    finalSummary: "Full outer join leaves no row behind, filling the voids with NULLs."
  },
  {
    id: 33,
    slug: "sql-views",
    title: "Views",
    shortTitle: "Virtual tables",
    moduleId: "module-13",
    family: "view",
    conceptDescription: "creating a virtual table that abstracts a complex query",
    overview: "A VIEW is a virtual relation defined by a query. It hides complexity and restricts data access (e.g., hiding salaries). Materialized views physically store the result.",
    learningGoal: "Understand view expansion and how virtual tables operate.",
    analogy: "Like creating a filtered dashboard for a specific user so they only see what they need.",
    analogyVisual: "A complex query wraps into a single 'View' object that acts just like a regular table.",
    sceneCue: "The base tables are queried and the result is wrapped in a transparent 'View' layer.",
    quizCue: "If a base table changes, what happens to the standard view?",
    query: "CREATE VIEW faculty AS SELECT ID, name, dept_name FROM instructor;",
    tables: [instructor],
    resultTable: table("result_view", "The faculty view (salary hidden).", ["ID", "name", "dept_name"], [["10101", "Srinivasan", "Comp. Sci."], ["12121", "Wu", "Finance"], ["15151", "Mozart", "Music"], ["22222", "Einstein", "Physics"], ["32343", "El Said", "History"]]),
    interactiveExample: "Update a row in the base 'instructor' table and watch the 'faculty' view instantly reflect the change.",
    commonMistakes: [
      "Thinking a standard view stores data physically on disk.",
      "Trying to update a complex view (with aggregates or joins) and getting a database error."
    ],
    examNotes: ["View expansion happens at query runtime.", "Trick: Only simple views are updatable. Materialized views require maintenance/refresh."],
    interviewQuestions: ["What makes a view 'updatable'?", "Why use a materialized view over a standard view?"],
    finalSummary: "Views are saved queries that look and act like tables."
  },
  {
    id: 34,
    slug: "transactions",
    title: "Transactions",
    shortTitle: "Atomic unit of work",
    moduleId: "module-14",
    family: "transaction",
    conceptDescription: "bundling multiple operations into an all-or-nothing atomic action",
    overview: "Transactions ensure that a series of database operations either completely succeed (COMMIT) or completely fail (ROLLBACK), maintaining consistency.",
    learningGoal: "Visualize the 'all-or-nothing' nature of transactions.",
    analogy: "Like a bank transfer where money must leave one account AND enter another—if either fails, neither happens.",
    analogyVisual: "Multiple steps turn green, but if one turns red, the entire sequence rewinds to the start.",
    sceneCue: "Operations queue up in a transaction block. Upon an error, the block shatters and state reverts.",
    quizCue: "What happens to the first successful step if the second step fails before a COMMIT?",
    query: "BEGIN; UPDATE accounts SET balance = balance - 100 WHERE id = 1; UPDATE accounts SET balance = balance + 100 WHERE id = 2; COMMIT;",
    tables: [table("accounts", "Bank accounts for transaction demo.", ["id", "balance"], [["1", "500"], ["2", "300"]])],
    resultTable: table("result_transaction", "Accounts after successful commit.", ["id", "balance"], [["1", "400"], ["2", "400"]]),
    interactiveExample: "Trigger an error on the second update and watch the ROLLBACK undo the first update.",
    commonMistakes: [
      "Forgetting to COMMIT a transaction, leaving rows locked and changes invisible to others.",
      "Assuming auto-commit is off when testing scripts."
    ],
    examNotes: ["Transactions are Atomic, Consistent, Isolated, and Durable (ACID).", "Trick: Rollbacks only undo changes made within the uncommitted transaction window."],
    interviewQuestions: ["What are the ACID properties?", "What happens if a database crashes halfway through a transaction?"],
    finalSummary: "Transactions bundle operations: either everything happens, or nothing happens."
  },
  {
    id: 35,
    slug: "integrity-constraints",
    title: "Integrity Constraints",
    shortTitle: "Data rules",
    moduleId: "module-14",
    family: "constraint",
    conceptDescription: "enforcing rules on data to maintain database integrity",
    overview: "Constraints (NOT NULL, UNIQUE, CHECK, FOREIGN KEY) guard against accidental damage. Referential integrity with CASCADE ensures linked records stay synced.",
    learningGoal: "See how constraints block invalid data and how CASCADE deletes child records automatically.",
    analogy: "Like a bouncer at the database door checking IDs, and an eviction policy that removes a student's records if they leave.",
    analogyVisual: "Invalid row inserts hit a red wall (CHECK violation). Parent deletion triggers a domino effect on children.",
    sceneCue: "An invalid insert bounces off. A parent delete cascades down and removes child rows.",
    quizCue: "Predict what happens to a prereq row if its parent course is deleted using ON DELETE CASCADE.",
    query: "CREATE TABLE prereq (course_id char(5), prereq_id char(5), FOREIGN KEY (course_id) REFERENCES courses ON DELETE CASCADE);",
    tables: [courses, prereq],
    resultTable: table("result_cascade", "Prereq table after parent course DB101 is deleted.", ["course_id", "prereq_id"], [["OS301", "CS100"], ["CS-315", "CS-101"]]),
    interactiveExample: "Delete a course and watch its associated prereq rows disappear automatically via CASCADE.",
    commonMistakes: [
      "Trying to delete a parent row when RESTRICT is active, causing an error.",
      "Overusing CASCADE and accidentally deleting vast amounts of connected data."
    ],
    examNotes: ["Primary keys imply UNIQUE and NOT NULL.", "Trick: CHECK constraints can enforce specific domain values (e.g., semester IN ('Fall', 'Spring'))."],
    interviewQuestions: ["What is referential integrity?", "What is the difference between ON DELETE CASCADE and ON DELETE SET NULL?"],
    finalSummary: "Constraints are the database's immune system. They block bad data and sync deletions."
  },
  {
    id: 36,
    slug: "authorization",
    title: "Authorization & Roles",
    shortTitle: "Access control",
    moduleId: "module-14",
    family: "authorization",
    conceptDescription: "restricting access through privileges and roles",
    overview: "GRANT and REVOKE control who can SELECT, INSERT, UPDATE, or DELETE. Roles bundle privileges so they can be assigned easily to multiple users.",
    learningGoal: "Understand how privileges cascade and how roles simplify security.",
    analogy: "Like giving an employee a 'Manager' badge that grants access to multiple restricted rooms at once.",
    analogyVisual: "A golden key (role) is assigned to a user, unlocking specific tables but leaving others locked.",
    sceneCue: "The GRANT statement passes a key to a user. The REVOKE statement snatches it back.",
    quizCue: "If a user has a role revoked, what happens to their table access?",
    query: "CREATE ROLE instructor; GRANT SELECT ON courses TO instructor; GRANT instructor TO 'Amit';",
    tables: [courses],
    resultTable: table("result_auth", "User Amit queries the courses table successfully.", ["status"], [["Access Granted"]]),
    interactiveExample: "Toggle the 'instructor' role off for Amit and watch their query hit a red 'Access Denied' wall.",
    commonMistakes: [
      "Granting privileges on a view but forgetting the user needs no direct access to base tables (this is actually a feature, not a mistake, but often misunderstood!).",
      "Using REVOKE without understanding the CASCADE effect on users who were granted access by this user."
    ],
    examNotes: ["Roles can be granted to other roles, creating a hierarchy.", "Trick: Revoking a privilege with CASCADE removes it from all users who received it down the chain."],
    interviewQuestions: ["Why use Roles instead of granting privileges directly to users?", "How does view authorization hide underlying schema details?"],
    finalSummary: "Authorization ensures users only see and touch what they are allowed to."
  },
  {
    id: 37,
    slug: "functions-procedures",
    title: "Functions & Procedures",
    shortTitle: "Stored routines",
    moduleId: "module-15",
    family: "routine",
    conceptDescription: "running procedural logic natively inside the database",
    overview: "Functions and procedures let you write imperative code (IF/THEN, WHILE loops) directly in the database. Functions return values; procedures perform actions.",
    learningGoal: "Visualize how standard SQL expands into fully programmable logic.",
    analogy: "Like giving the database a specific recipe to follow, rather than just asking for an ingredient.",
    analogyVisual: "A block of code executes line-by-line, updating a variable counter and returning a result.",
    sceneCue: "The procedure executes step-by-step: loop, check condition, increment counter.",
    quizCue: "What happens when the WHILE loop condition turns false?",
    query: "CREATE FUNCTION dept_count(d_name VARCHAR) RETURNS integer BEGIN ... RETURN d_count; END;",
    tables: [instructor],
    resultTable: table("result_function", "Result of calling dept_count('Physics').", ["d_count"], [["1"]]),
    interactiveExample: "Step through the execution of a simple IF/THEN block to see the control flow.",
    commonMistakes: [
      "Using a stored procedure when a single declarative SQL query would be faster.",
      "Forgetting that external language routines (Java, C) carry security and memory overhead risks."
    ],
    examNotes: ["Functions must return a value; procedures use OUT parameters.", "Trick: Table-valued functions return relations and can be used in the FROM clause."],
    interviewQuestions: ["When would you write an external language routine instead of pure SQL?", "What is the difference between a function and a procedure?"],
    finalSummary: "Routines give SQL the power of loops, variables, and logic branches."
  },
  {
    id: 38,
    slug: "triggers",
    title: "Triggers",
    shortTitle: "Automated actions",
    moduleId: "module-15",
    family: "trigger",
    conceptDescription: "automatically executing actions when specific data changes occur",
    overview: "Triggers run automatically BEFORE or AFTER an INSERT, UPDATE, or DELETE. They enforce complex integrity, audit changes, or transform data.",
    learningGoal: "Understand the event-driven nature of triggers and the difference between BEFORE and AFTER.",
    analogy: "Like a motion-sensor light that turns on exactly when someone walks through a door.",
    analogyVisual: "An INSERT event trips a wire, waking up the Trigger block which instantly logs the event.",
    sceneCue: "A row attempts to insert. The BEFORE trigger intercepts it, modifies a value, and lets it pass.",
    quizCue: "Can an AFTER trigger modify the row that was just inserted?",
    query: "CREATE TRIGGER check_salary BEFORE UPDATE ON instructor FOR EACH ROW ...",
    tables: [instructor],
    resultTable: table("result_trigger", "Instructor table after trigger intercepts an invalid salary update.", ["ID", "name", "salary"], [["10101", "Srinivasan", "65000"], ["12121", "Wu", "90000"]]),
    interactiveExample: "Try to insert a negative salary and watch the BEFORE trigger reject it instantly.",
    commonMistakes: [
      "Creating recursive triggers that accidentally fire themselves in an infinite loop.",
      "Using triggers to enforce simple rules that a CHECK constraint could handle much faster."
    ],
    examNotes: ["BEFORE triggers can modify data before it hits the table. AFTER triggers cannot.", "Trick: Be careful of performance overhead when triggers execute FOR EACH ROW on massive updates."],
    interviewQuestions: ["Why might you choose an AFTER trigger over a BEFORE trigger?", "What are the performance risks of heavily relying on triggers?"],
    finalSummary: "Triggers are database tripwires that run custom code automatically."
  }
];

export const allTopics = blueprints.map(buildTopic);

export const modules: ModuleData[] = Object.entries(moduleMeta).map(([moduleId, module]) => ({
  id: moduleId,
  number: module.number,
  title: module.title,
  summary: module.summary,
  accent: module.accent,
  topics: allTopics.filter((topic) => topic.moduleId === moduleId)
}));

export const topicMap = Object.fromEntries(allTopics.map((topic) => [topic.slug, topic]));

export const courseStats = {
  modules: modules.length,
  topics: allTopics.length,
  scenes: allTopics.reduce((acc, topic) => acc + topic.scenes.length, 0),
  quizzes: allTopics.length * 3
};

export function getTopicBySlug(slug: string) {
  return topicMap[slug];
}

export function getModuleById(moduleId: string) {
  return modules.find((module) => module.id === moduleId);
}
