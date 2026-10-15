// POST /api/analyze { job_text, cv_text } -> analysis (contract: plan section 4).
// Env (.env.local / Vercel): SUPABASE_URL, SUPABASE_SECRET_KEY, IP_HASH_SALT, LLM_API_KEY (empty = demo mode).
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { analyze, validateInput } from "@/lib/analyze";

export const maxDuration = 60; // LLM call + one retry can take ~30 s

const DAILY_LIMIT = 5;

export async function POST(req: Request) {
  const { SUPABASE_URL, SUPABASE_SECRET_KEY, IP_HASH_SALT, LLM_API_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY || !IP_HASH_SALT) {
    console.error("analyze: missing SUPABASE_URL, SUPABASE_SECRET_KEY or IP_HASH_SALT");
    return Response.json({ error: "Proovi uuesti" }, { status: 500 });
  }

  const input = validateInput(await req.json().catch(() => null));
  if (typeof input === "string") return Response.json({ error: input }, { status: 400 });

  // Secret key bypasses RLS: server only, never NEXT_PUBLIC_.
  const db = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, { auth: { persistSession: false } });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  // Salted, because a plain SHA-256 of an IPv4 address can be brute-forced back to the IP.
  const ip_hash = createHash("sha256").update(ip + IP_HASH_SALT).digest("hex");

  // The limit protects the AI bill, so demo mode (no key) skips it.
  if (LLM_API_KEY) {
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const { count, error } = await db.from("analyses")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ip_hash).gte("created_at", since);
    if (error) {
      console.error(error); // fail closed: no limit check, no AI call
      return Response.json({ error: "Proovi uuesti" }, { status: 500 });
    }
    if ((count ?? 0) >= DAILY_LIMIT) {
      return Response.json({ error: `Tänane limiit (${DAILY_LIMIT} analüüsi) on täis. Proovi homme uuesti.` }, { status: 429 });
    }
  }

  try {
    const { result, tokens } = await analyze(LLM_API_KEY, input.job_text, input.cv_text);
    const { job_title, ...publicResult } = result;
    // CV raw text is never stored, only the AI result.
    const { data, error } = await db.from("analyses").insert({
      ip_hash,
      job_title_guess: job_title,
      match_score: result.match_score,
      language: result.language,
      result: publicResult,
      tokens_used: tokens,
    }).select("id").single();
    if (error) throw error;
    console.log(JSON.stringify({ analysis_id: data.id, tokens }));
    return Response.json({ id: data.id, ...publicResult });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Proovi uuesti" }, { status: 500 });
  }
}
