// Run every job x CV pair through the real prompt and print results for manual review.
// Run after every prompt change:  npm run eval   (needs LLM_API_KEY in .env.local)
// Check by hand: is the score sensible, and does the cover letter claim anything the CV doesn't say?
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { analyze } from "../lib/analyze.ts";

const read = (sub: string) => {
  const dir = join(import.meta.dirname, sub);
  return readdirSync(dir).filter((f) => f.endsWith(".txt"))
    .map((name) => ({ name, text: readFileSync(join(dir, name), "utf8") }));
};

const apiKey = process.env.LLM_API_KEY;
if (!apiKey) throw new Error("Pane LLM_API_KEY faili .env.local");

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
