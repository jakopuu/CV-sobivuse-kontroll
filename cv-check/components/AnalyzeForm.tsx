"use client";

import type { FormEvent } from "react";
import { Lock } from "lucide-react";
import { INPUT_MIN_CHARS } from "@/lib/types";
import { InputField, isValidInput } from "./InputField";

interface AnalyzeFormProps {
  jobText: string;
  cvText: string;
  onJobTextChange: (value: string) => void;
  onCvTextChange: (value: string) => void;
  onSubmit: () => void;
}

export function AnalyzeForm({
  jobText,
  cvText,
  onJobTextChange,
  onCvTextChange,
  onSubmit,
}: AnalyzeFormProps) {
  const canSubmit = isValidInput(jobText) && isValidInput(cvText);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (canSubmit) onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 sm:mt-12">
      <div className="grid gap-8 md:grid-cols-2 md:gap-6">
        <InputField
          step={1}
          label="Kleebi töökuulutus"
          placeholder="Kopeeri kogu kuulutuse tekst CV.ee-st, LinkedInist või firma kodulehelt."
          value={jobText}
          onChange={onJobTextChange}
        />
        <InputField
          step={2}
          label="Kleebi oma CV"
          placeholder="Kopeeri oma CV tekst Wordist või PDF-ist. Kujundust pole vaja, piisab tekstist."
          value={cvText}
          onChange={onCvTextChange}
        />
      </div>

      <div className="mt-8 flex items-baseline gap-3">
        <span aria-hidden className="w-4 text-[17px] font-semibold text-brand tabular-nums">
          3
        </span>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <button
            type="submit"
            disabled={!canSubmit}
            aria-describedby="submit-hint"
            className="h-12 shrink-0 rounded-[10px] border border-transparent bg-brand px-6 text-[16px] font-semibold text-brand-ink transition-colors hover:bg-[color-mix(in_srgb,var(--brand)_88%,var(--ink))] disabled:cursor-not-allowed disabled:border-line disabled:bg-mist disabled:text-ink-subtle"
          >
            Analüüsi sobivust
          </button>

          <div id="submit-hint" className="flex flex-col gap-1 text-sm leading-snug">
            {!canSubmit && (
              <p className="text-ink">
                Mõlemas kastis peab olema vähemalt {INPUT_MIN_CHARS} tähemärki.
              </p>
            )}
            <p className="flex gap-2 text-ink-muted">
              <Lock aria-hidden className="mt-px size-4 shrink-0" />
              Me ei salvesta su CV-d. Andmeid kasutatakse ainult analüüsiks.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
