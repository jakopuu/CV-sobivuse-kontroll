// Shapes of the /analyze contract agreed with the backend (plan, section 4).

export const INPUT_MIN_CHARS = 200;
export const INPUT_MAX_CHARS = 15_000;

export type Importance = "critical" | "important" | "nice_to_have";

export interface AnalyzeRequest {
  job_text: string;
  cv_text: string;
}

export interface MissingItem {
  item: string;
  importance: Importance;
  suggestion: string;
}

export interface CvImprovement {
  suggestion: string;
}

export interface AnalysisResult {
  id: string;
  match_score: number;
  language: "et" | "en";
  summary: string;
  missing: MissingItem[];
  cv_improvements: CvImprovement[];
  keywords_missing: string[];
  cover_letter: string;
}

const IMPORTANCE_VALUES: readonly Importance[] = ["critical", "important", "nice_to_have"];

const isString = (value: unknown): value is string => typeof value === "string";
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/**
 * Validates the response down to each list item so a malformed answer becomes
 * a "server" error instead of a crash mid-render. Normalizes values the model
 * may spell loosely ("Nice-to-have"), and falls back to "important" so no
 * missing item is silently hidden.
 */
export function parseAnalysisResult(value: unknown): AnalysisResult | null {
  if (!isRecord(value)) return null;
  const { id, match_score, language, summary, missing, cv_improvements, keywords_missing, cover_letter } =
    value;

  if (
    !isString(id) ||
    typeof match_score !== "number" ||
    !Number.isFinite(match_score) ||
    !isString(summary) ||
    !isString(cover_letter) ||
    !Array.isArray(missing) ||
    !Array.isArray(cv_improvements) ||
    !Array.isArray(keywords_missing)
  ) {
    return null;
  }

  if (!missing.every((m) => isRecord(m) && isString(m.item) && isString(m.suggestion))) return null;
  if (!cv_improvements.every((c) => isRecord(c) && isString(c.suggestion))) return null;
  if (!keywords_missing.every(isString)) return null;

  return {
    id,
    match_score,
    language: language === "en" ? "en" : "et",
    summary,
    cover_letter,
    keywords_missing,
    cv_improvements: cv_improvements.map((c) => ({ suggestion: c.suggestion as string })),
    missing: missing.map((m) => ({
      item: m.item as string,
      suggestion: m.suggestion as string,
      importance: normalizeImportance(m.importance),
    })),
  };
}

function normalizeImportance(value: unknown): Importance {
  const normalized = String(value).trim().toLowerCase().replace(/[\s-]+/g, "_");
  return IMPORTANCE_VALUES.find((v) => v === normalized) ?? "important";
}
