"use client";

import { useId } from "react";
import { Check } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { INPUT_MAX_CHARS, INPUT_MIN_CHARS } from "@/lib/types";

interface InputFieldProps {
  step: number;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function InputField({ step, label, placeholder, value, onChange, disabled }: InputFieldProps) {
  const id = useId();
  const length = value.trim().length;
  const tooShort = length < INPUT_MIN_CHARS;
  const tooLong = length > INPUT_MAX_CHARS;

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-3 flex items-baseline gap-3 text-[17px] font-semibold">
        <span aria-hidden className="w-4 text-brand tabular-nums">
          {step}
        </span>
        {label}
      </label>

      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        spellCheck={false}
        aria-invalid={tooLong || undefined}
        aria-describedby={`${id}-count`}
        className="min-h-56 w-full resize-y rounded-[10px] border border-line bg-mist px-4 py-3.5 text-[15px] leading-relaxed text-ink transition-colors placeholder:text-ink-subtle hover:border-line-strong focus:border-brand focus:bg-paper focus:ring-3 focus:ring-brand/15 focus:outline-none disabled:opacity-60 aria-invalid:border-critical sm:min-h-80"
      />

      <p
        id={`${id}-count`}
        aria-live="polite"
        className="mt-2 flex items-center justify-end gap-1.5 text-sm tabular-nums"
      >
        {tooLong ? (
          <span className="text-critical">
            Liiga pikk: {formatNumber(length)} / {formatNumber(INPUT_MAX_CHARS)} tähemärki
          </span>
        ) : tooShort ? (
          <span className="text-ink-subtle">
            {formatNumber(length)} / {formatNumber(INPUT_MIN_CHARS)} tähemärki
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-ink-muted">
            <Check aria-hidden className="size-4 text-good" strokeWidth={2.5} />
            {formatNumber(length)} tähemärki
          </span>
        )}
      </p>
    </div>
  );
}

export function isValidInput(value: string): boolean {
  const length = value.trim().length;
  return length >= INPUT_MIN_CHARS && length <= INPUT_MAX_CHARS;
}
