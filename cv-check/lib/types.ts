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

/** Shallow runtime check so a malformed response fails loudly, not mid-render. */
export function isAnalysisResult(value: unknown): value is AnalysisResult {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.match_score === "number" &&
    typeof v.summary === "string" &&
    typeof v.cover_letter === "string" &&
    Array.isArray(v.missing) &&
    Array.isArray(v.cv_improvements) &&
    Array.isArray(v.keywords_missing)
  );
}
