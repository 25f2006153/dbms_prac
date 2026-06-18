import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-cyan-500/15 bg-cyan-500/5 text-cyan-600 dark:border-cyan-300/18 dark:bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] dark:text-cyan-100 transition-colors duration-300",
        className
      )}
      {...props}
    />
  );
}
