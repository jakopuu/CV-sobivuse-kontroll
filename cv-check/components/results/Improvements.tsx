import type { CvImprovement } from "@/lib/types";
import { keepCaseEndings } from "@/lib/format";

export function Improvements({ items }: { items: CvImprovement[] }) {
  if (items.length === 0) {
    return <p className="text-ink-muted">Selle kuulutuse jaoks pole CV-s midagi parandada.</p>;
  }

  return (
    <ol className="flex flex-col gap-3">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <span aria-hidden className="w-5 shrink-0 font-semibold text-brand tabular-nums">
            {index + 1}.
          </span>
          <p className="max-w-[65ch] leading-relaxed">{keepCaseEndings(item.suggestion)}</p>
        </li>
      ))}
    </ol>
  );
}
