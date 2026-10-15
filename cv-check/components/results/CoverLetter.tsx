"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

const COPIED_RESET_MS = 2_000;

interface CoverLetterProps {
  text: string;
  language: string;
}

export function CoverLetter({ text, language }: CoverLetterProps) {
  // Editable so the user can fix details before copying.
  const [value, setValue] = useState(text);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard API is blocked in some in-app browsers (e.g. Facebook); select the text instead.
      textareaRef.current?.select();
      document.execCommand("copy");
    }
    setCopied(true);
  }

  return (
    <div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        lang={language}
        aria-label="Kaaskiri"
        rows={16}
        className="w-full resize-y rounded-[10px] border border-line bg-mist px-5 py-4 text-[15px] leading-[1.7] text-ink transition-colors hover:border-line-strong focus:border-brand focus:bg-paper focus:ring-3 focus:ring-brand/15 focus:outline-none"
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[52ch] text-sm leading-snug text-ink-muted">
          Vaata kaaskiri enne saatmist üle. Tehisintellekt võib eksida.
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[10px] bg-ink px-5 text-[15px] font-semibold text-paper transition-colors hover:bg-[color-mix(in_srgb,var(--ink)_85%,var(--paper))]"
        >
          {copied ? (
            <Check aria-hidden className="size-4" strokeWidth={2.5} />
          ) : (
            <Copy aria-hidden className="size-4" />
          )}
          {copied ? "Kopeeritud" : "Kopeeri kaaskiri"}
        </button>
      </div>
      <p aria-live="polite" className="sr-only">
        {copied ? "Kaaskiri kopeeritud" : ""}
      </p>
    </div>
  );
}
