import Link from "next/link";

import { Badge } from "@/components/ui/badge";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <Badge>404</Badge>
      <h1 className="mt-5 font-display text-5xl font-black text-white">Lesson not found</h1>
      <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">
        The topic route does not exist yet or the slug was typed incorrectly.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/modules"
          className="rounded-2xl bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 px-6 py-3 text-base font-semibold text-slate-950 shadow-glow"
        >
          Back to modules
        </Link>
      </div>
    </div>
  );
}
