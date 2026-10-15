import { supabaseHeaders, supabaseUrl, useMockApi } from "./config";
import { mockAnalysis } from "./mock";
import { isAnalysisResult, type AnalysisResult, type AnalyzeRequest } from "./types";

export type AnalyzeErrorKind = "invalid_input" | "rate_limited" | "server" | "network";

export class AnalyzeError extends Error {
  constructor(public readonly kind: AnalyzeErrorKind) {
    super(kind);
    this.name = "AnalyzeError";
  }
}

// Long enough in mock mode to see every loading step.
const MOCK_DELAY_MS = 9_000;

export async function analyze(
  request: AnalyzeRequest,
  signal?: AbortSignal,
): Promise<AnalysisResult> {
  if (useMockApi) {
    await wait(MOCK_DELAY_MS, signal);
    return mockAnalysis;
  }

  let response: Response;
  try {
    response = await fetch(`${supabaseUrl}/functions/v1/analyze`, {
      method: "POST",
      headers: supabaseHeaders(),
      body: JSON.stringify(request),
      signal,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new AnalyzeError("network");
  }

  if (response.status === 400) throw new AnalyzeError("invalid_input");
  if (response.status === 429) throw new AnalyzeError("rate_limited");
  if (!response.ok) throw new AnalyzeError("server");

  const body: unknown = await response.json().catch(() => null);
  if (!isAnalysisResult(body)) throw new AnalyzeError("server");
  return body;
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(signal.reason);
    });
  });
}
