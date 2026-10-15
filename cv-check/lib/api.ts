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
    const forced = mockErrorFromUrl();
    if (forced) throw new AnalyzeError(forced);
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

const MOCK_ERRORS: Record<string, AnalyzeErrorKind> = {
  "400": "invalid_input",
  "429": "rate_limited",
  "500": "server",
  network: "network",
};

/** Mock mode only: `?mock_error=429` (or 400, 500, network) previews an error state. */
function mockErrorFromUrl(): AnalyzeErrorKind | null {
  const value = new URLSearchParams(window.location.search).get("mock_error");
  return value ? (MOCK_ERRORS[value] ?? null) : null;
}
