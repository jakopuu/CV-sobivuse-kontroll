import type { Importance, MissingItem } from "@/lib/types";
import { KeepCaseEndings } from "../KeepCaseEndings";

const GROUPS: { importance: Importance; label: string; color: string }[] = [
  { importance: "critical", label: "Kriitiline", color: "var(--critical)" },
  { importance: "important", label: "Oluline", color: "var(--important)" },
  { importance: "nice_to_have", label: "Boonus", color: "var(--optional)" },
];

export function MissingList({ items }: { items: MissingItem[] }) {
  if (items.length === 0) {
    return <p className="text-ink-muted">CV-s on olemas kõik, mida kuulutus nõuab.</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      {GROUPS.map(({ importance, label, color }) => {
        const group = items.filter((item) => item.importance === importance);
        if (group.length === 0) return null;

        return (
          <section key={importance} aria-label={label}>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color }}>
              <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: color }} />
              {label}
              <span className="font-normal text-ink-subtle tabular-nums">{group.length}</span>
            </h3>

            <ul className="flex flex-col gap-4">
              {group.map((item, index) => (
                <li
                  key={index}
                  className="border-l-[3px] pl-4"
                  style={{ borderColor: color }}
                >
                  <p className="font-semibold"><KeepCaseEndings text={item.item} /></p>
                  <p className="mt-1 max-w-[65ch] leading-relaxed text-ink-muted">
                    <KeepCaseEndings text={item.suggestion} />
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
