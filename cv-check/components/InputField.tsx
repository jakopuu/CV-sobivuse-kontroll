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
  const status = inputStatus(value);
  const tooShort = status === "short";
  const tooLong = status === "long";

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
        className="field min-h-56 w-full resize-y px-4 py-3.5 leading-relaxed disabled:opacity-60 aria-invalid:border-critical sm:min-h-80"
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

export function inputStatus(value: string): "short" | "ok" | "long" {
  const length = value.trim().length;
  if (length < INPUT_MIN_CHARS) return "short";
  if (length > INPUT_MAX_CHARS) return "long";
  return "ok";
}
