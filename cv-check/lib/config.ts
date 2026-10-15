// NEXT_PUBLIC_MOCK_API=1 runs the whole UI on mock data, no backend or Supabase needed.
export const useMockApi = process.env.NEXT_PUBLIC_MOCK_API === "1";

// Public Supabase settings, used only for the feedback and waitlist inserts.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function supabaseHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
  };
}
