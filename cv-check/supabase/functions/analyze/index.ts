// POST /analyze { job_text, cv_text } -> analysis (see contract in the plan, section 4).
// Secrets: LLM_API_KEY, ALLOWED_ORIGIN (Vercel domain), IP_HASH_SALT. SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are provided by Supabase.
import { createClient } from "npm:@supabase/supabase-js@2";
import { analyze, validateInput } from "./lib.ts";

const DAILY_LIMIT = 5;

const cors = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

async function hashIp(ip: string) {
  // Salted, because a plain SHA-256 of an IPv4 address can be brute-forced back to the IP.
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip + Deno.env.get("IP_HASH_SALT")));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json(405, { error: "Ainult POST" });

  const input = validateInput(await req.json().catch(() => null));
  if (typeof input === "string") return json(400, { error: input });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const ip_hash = await hashIp(ip);
  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { count, error: countErr } = await db.from("analyses")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ip_hash).gte("created_at", since);
  if (countErr) {
    console.error(countErr); // fail closed: no limit check, no AI call
    return json(500, { error: "Proovi uuesti" });
  }
  if ((count ?? 0) >= DAILY_LIMIT) {
    return json(429, { error: `Tänane limiit (${DAILY_LIMIT} analüüsi) on täis. Proovi homme uuesti.` });
  }

  try {
    const { result, tokens } = await analyze(Deno.env.get("LLM_API_KEY")!, input.job_text, input.cv_text);
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
    return json(200, { id: data.id, ...publicResult });
  } catch (e) {
    console.error(e);
    return json(500, { error: "Proovi uuesti" });
  }
});
