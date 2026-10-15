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
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const copied = copyState === "copied";
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopyState("idle"), COPIED_RESET_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopyState("copied");
    } catch {
      // Clipboard API is blocked in some in-app browsers (e.g. Facebook).
      // Fall back to the legacy command; if that fails too, leave the text selected.
      textareaRef.current?.select();
      setCopyState(document.execCommand("copy") ? "copied" : "failed");
    }
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
        className="field w-full resize-y px-5 py-4 leading-[1.7]"
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {copyState === "failed" ? (
          <p role="alert" className="max-w-[52ch] text-sm leading-snug text-critical">
            Brauser ei lubanud kopeerida. Tekst on valitud, kopeeri see käsitsi.
          </p>
        ) : (
          <p className="max-w-[52ch] text-sm leading-snug text-ink-muted">
            Vaata kaaskiri enne saatmist üle. Tehisintellekt võib eksida.
          </p>
        )}
        <button
          type="button"
          onClick={handleCopy}
          className="button-dark"
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
