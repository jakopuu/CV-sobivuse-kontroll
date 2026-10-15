"use client";

import { useEffect, useState } from "react";

const SIZE = 132;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const LENGTH = 2 * Math.PI * RADIUS;
const DURATION_MS = 900;

// Thresholds from the spec: under 50 red, 50–75 yellow, over 75 green.
function scoreTone(score: number) {
  if (score > 75) return { color: "var(--good)", label: "Hea sobivus" };
  if (score >= 50) return { color: "var(--important)", label: "Osaline sobivus" };
  return { color: "var(--critical)", label: "Nõrk sobivus" };
}

export function ScoreRing({ score }: { score: number }) {
  const value = Math.max(0, Math.min(100, Math.round(score)));
  const tone = scoreTone(value);
  const displayed = useCountUp(value);

  return (
    <figure className="flex items-center gap-5">
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="-rotate-90"
          aria-hidden
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--line)"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={tone.color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={LENGTH}
            strokeDashoffset={LENGTH * (1 - value / 100)}
            style={
              {
                "--ring-length": LENGTH,
                animation: `ring-draw ${DURATION_MS}ms cubic-bezier(0.33, 1, 0.68, 1)`,
              } as React.CSSProperties
            }
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-[2.5rem] leading-none font-bold tracking-tight tabular-nums">
            {displayed}
          </span>
        </div>
      </div>

      <figcaption>
        <span className="sr-only">Sobivusskoor {value} punkti 100-st. </span>
        <span className="block text-[17px] font-semibold" style={{ color: tone.color }}>
          {tone.label}
        </span>
        <span aria-hidden className="text-sm text-ink-muted tabular-nums">
          {value} / 100 punkti
        </span>
      </figcaption>
    </figure>
  );
}

/** Counts from 0 to target in step with the ring; jumps straight to it under reduced motion. */
function useCountUp(target: number) {
  const [current, setCurrent] = useState(() => (prefersReducedMotion() ? target : 0));

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return current;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
