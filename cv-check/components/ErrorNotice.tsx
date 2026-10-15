import { CircleAlert } from "lucide-react";
import type { AnalyzeErrorKind } from "@/lib/api";
import { INPUT_MIN_CHARS } from "@/lib/types";

// Each message says what happened and what to do next.
const MESSAGES: Record<AnalyzeErrorKind, { title: string; body: string }> = {
  invalid_input: {
    title: "Tekst on liiga lühike või puudu",
    body: `Kontrolli, et mõlemas kastis oleks vähemalt ${INPUT_MIN_CHARS} tähemärki, ja proovi uuesti.`,
  },
  rate_limited: {
    title: "Tänased analüüsid on otsas",
    body: "Ühest ühendusest saab päevas teha piiratud arvu analüüse. Proovi homme uuesti.",
  },
  server: {
    title: "Analüüs ei õnnestunud",
    body: "Tehisintellekt ei andnud seekord kasutatavat vastust. Su tekst on alles, proovi uuesti.",
  },
  network: {
    title: "Ühendus katkes",
    body: "Kontrolli internetiühendust ja proovi uuesti. Su tekst on alles.",
  },
};

// The submit button right below acts as the retry action.
export function ErrorNotice({ kind }: { kind: AnalyzeErrorKind }) {
  const message = MESSAGES[kind];

  return (
    <div
      role="alert"
      className="mt-8 flex max-w-2xl gap-3 rounded-[10px] border border-line border-l-[3px] border-l-critical bg-mist px-4 py-4"
    >
      <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-critical" />
      <div>
        <p className="font-semibold">{message.title}</p>
        <p className="mt-1 leading-relaxed text-ink-muted">{message.body}</p>
      </div>
    </div>
  );
}
