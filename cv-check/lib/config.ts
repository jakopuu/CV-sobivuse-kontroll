// Public Supabase settings. When either is missing the app falls back to mock data.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const useMockApi = !supabaseUrl || !supabaseAnonKey;

export function supabaseHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
  };
}
