import { supabaseHeaders, supabaseUrl, useMockApi } from "./config";

// RLS allows anonymous inserts only, so we never ask for the row back.
async function insertRow(table: string, row: Record<string, unknown>): Promise<Response> {
  return fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: "POST",
    headers: { ...supabaseHeaders(), Prefer: "return=minimal" },
    body: JSON.stringify(row),
  });
}

export interface FeedbackInput {
  analysisId: string;
  helpful: boolean;
  comment?: string;
}

export async function submitFeedback({ analysisId, helpful, comment }: FeedbackInput) {
  if (useMockApi) return mockDelay();

  const response = await insertRow("feedback", {
    analysis_id: analysisId,
    helpful,
    comment: comment?.trim() || null,
  });
  if (!response.ok) throw new Error(`feedback insert failed: ${response.status}`);
}

export async function joinWaitlist(email: string) {
  if (useMockApi) return mockDelay();

  const response = await insertRow("waitlist", { email: email.trim().toLowerCase() });
  // 409 means the email is already on the list, which is fine for the user.
  if (!response.ok && response.status !== 409) {
    throw new Error(`waitlist insert failed: ${response.status}`);
  }
}

function mockDelay() {
  return new Promise<void>((resolve) => setTimeout(resolve, 500));
}
