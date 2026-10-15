export function KeywordChips({ keywords }: { keywords: string[] }) {
  if (keywords.length === 0) {
    return <p className="text-ink-muted">Kõik kuulutuse märksõnad on CV-s olemas.</p>;
  }

  return (
    <>
      <p className="mb-4 max-w-[65ch] leading-relaxed text-ink-muted">
        Need sõnad on kuulutuses, aga mitte su CV-s. Lisa need ainult siis, kui need
        sinu kohta päriselt kehtivad.
      </p>
      <ul className="flex flex-wrap gap-x-4 gap-y-2.5">
        {keywords.map((keyword, index) => (
          <li key={index}>
            <mark className="marker inline-block px-1.5 py-0.5 text-[16px] leading-snug font-medium">
              {keyword}
            </mark>
          </li>
        ))}
      </ul>
    </>
  );
}
