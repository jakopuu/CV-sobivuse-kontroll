"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import { CoverLetter } from "./CoverLetter";
import { Improvements } from "./Improvements";
import { KeywordChips } from "./KeywordChips";
import { MissingList } from "./MissingList";
import { ScoreRing } from "./ScoreRing";

interface ResultViewProps {
  result: AnalysisResult;
  onEdit: () => void;
}

export function ResultView({ result, onEdit }: ResultViewProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus and view to the result so keyboard and screen reader users land on it.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    rootRef.current?.scrollIntoView({ block: "start" });
  }, []);

  return (
    <div ref={rootRef} className="mt-10 scroll-mt-6 sm:mt-12">
      <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <h2 ref={headingRef} tabIndex={-1} className="sr-only">
            Analüüsi tulemus
          </h2>
          <ScoreRing score={result.match_score} />
          <p lang={result.language} className="mt-6 text-[19px] leading-snug font-medium text-pretty">
            {result.summary}
          </p>
          <button
            type="button"
            onClick={onEdit}
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink-muted underline decoration-line-strong underline-offset-4 hover:text-ink hover:decoration-ink"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Muuda kuulutust või CV-d
          </button>
        </aside>

        <div className="flex flex-col">
          <Section title="Mis puudu on">
            <MissingList items={result.missing} />
          </Section>
          <Section title="Kuidas CV-d parandada">
            <Improvements items={result.cv_improvements} />
          </Section>
          <Section title="Puuduvad märksõnad">
            <KeywordChips keywords={result.keywords_missing} />
          </Section>
          <Section title="Kaaskiri">
            <CoverLetter text={result.cover_letter} language={result.language} />
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line py-8 first:border-t-0 first:pt-0">
      <h2 className="mb-5 text-[21px] font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}
