import { supabaseHeaders, supabaseUrl, useMockApi } from "./config";
import { mockAnalysis } from "./mock";
import { parseAnalysisResult, type AnalysisResult, type AnalyzeRequest } from "./types";

export type AnalyzeErrorKind = "invalid_input" | "rate_limited" | "server" | "network";

export class AnalyzeError extends Error {
  constructor(public readonly kind: AnalyzeErrorKind) {
    super(kind);
    this.name = "AnalyzeError";
  }
}

// Long enough in mock mode to see every loading step.
const MOCK_DELAY_MS = 9_000;
// Upper bound for a stuck edge function or LLM call; normal runs take 10-20 s.
const REQUEST_TIMEOUT_MS = 60_000;

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

  // Own controller so both the user's cancel and the timeout abort the request.
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort, { once: true });
  const timer = setTimeout(abort, REQUEST_TIMEOUT_MS);

  try {
    let response: Response;
    try {
      response = await fetch(`${supabaseUrl}/functions/v1/analyze`, {
        method: "POST",
        headers: supabaseHeaders(),
        body: JSON.stringify(request),
        signal: controller.signal,
      });
    } catch (error) {
      if (signal?.aborted) throw error;
      // Aborted without a user cancel means the timeout fired.
      throw new AnalyzeError(controller.signal.aborted ? "server" : "network");
    }

    if (response.status === 400) throw new AnalyzeError("invalid_input");
    if (response.status === 429) throw new AnalyzeError("rate_limited");
    if (!response.ok) throw new AnalyzeError("server");

    const result = parseAnalysisResult(await response.json().catch(() => null));
    if (!result) throw new AnalyzeError("server");
    return result;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abort);
  }
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);
    const onAbort = () => {
      clearTimeout(timer);
      reject(signal?.reason);
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    signal?.addEventListener("abort", onAbort, { once: true });
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
