"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

const STEPS = ["Loen kuulutust", "Võrdlen CV-ga", "Kirjutan kaaskirja"];
const STEP_INTERVAL_MS = 3_500;

interface LoadingStepsProps {
  onCancel: () => void;
}

export function LoadingSteps({ onCancel }: LoadingStepsProps) {
  const [active, setActive] = useState(0);

  // The last step stays active until the response arrives.
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => Math.min(current + 1, STEPS.length - 1));
    }, STEP_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-10">
      <ol aria-label="Analüüsi edenemine" className="flex flex-col gap-3">
        {STEPS.map((label, index) => {
          const state = index < active ? "done" : index === active ? "active" : "pending";
          return (
            <li
              key={label}
              aria-current={state === "active" ? "step" : undefined}
              className="flex items-center gap-3 text-[16px]"
            >
              <StepMarker state={state} />
              <span
                className={
                  state === "pending"
                    ? "text-ink-subtle"
                    : state === "active"
                      ? "font-semibold text-ink"
                      : "text-ink-muted"
                }
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        onClick={onCancel}
        className="self-start text-sm font-medium text-ink-muted underline decoration-line-strong underline-offset-4 hover:text-ink hover:decoration-ink"
      >
        Katkesta
      </button>
    </div>
  );
}

function StepMarker({ state }: { state: "done" | "active" | "pending" }) {
  if (state === "done") {
    return (
      <span className="grid size-5 place-items-center rounded-full bg-good text-paper">
        <Check aria-hidden className="size-3.5" strokeWidth={3} />
      </span>
    );
  }
  if (state === "active") {
    return (
      <span
        aria-hidden
        className="size-5 animate-spin rounded-full border-2 border-line border-t-brand"
      />
    );
  }
  return <span aria-hidden className="size-5 rounded-full border-2 border-line" />;
}
