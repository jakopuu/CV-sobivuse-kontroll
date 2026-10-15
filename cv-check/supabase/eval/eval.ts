// Run every job x CV pair through the real prompt and print results for manual review.
// Run after every prompt change:
//   LLM_API_KEY=sk-... deno run -A supabase/eval/eval.ts
// Check by hand: is the score sensible, and does the cover letter claim anything the CV doesn't say?
import { analyze } from "../functions/analyze/lib.ts";

const dir = new URL(".", import.meta.url).pathname;
const read = (sub: string) =>
  [...Deno.readDirSync(dir + sub)].filter((f) => f.name.endsWith(".txt")).map((f) => ({
    name: f.name,
    text: Deno.readTextFileSync(`${dir}${sub}/${f.name}`),
  }));

const apiKey = Deno.env.get("LLM_API_KEY");
if (!apiKey) throw new Error("Set LLM_API_KEY");

let totalTokens = 0;
for (const job of read("jobs")) {
  for (const cv of read("cvs")) {
    const { result: r, tokens } = await analyze(apiKey, job.text, cv.text);
    totalTokens += tokens;
    const words = r.cover_letter.split(/\s+/).filter(Boolean).length;
    const warn = words < 150 || words > 250 ? `  ⚠ kaaskiri ${words} sõna` : "";
    console.log(`\n===== ${job.name} × ${cv.name}: ${r.match_score}/100 [${r.language}] ${tokens} tokenit${warn}`);
    console.log(`Kokkuvõte: ${r.summary}`);
    for (const m of r.missing) console.log(`  - [${m.importance}] ${m.item}: ${m.suggestion}`);
    console.log(`Märksõnad: ${r.keywords_missing.join(", ")}`);
    console.log(`--- Kaaskiri ---\n${r.cover_letter}`);
  }
}
console.log(`\nKokku tokeneid: ${totalTokens}`);
