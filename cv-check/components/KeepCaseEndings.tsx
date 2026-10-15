// Abbreviation plus Estonian case ending: CV-s, SQL-i, BI-d.
const ABBREVIATION_WITH_ENDING = /(?<![\p{L}\d])([\p{Lu}\d]{2,}-\p{Ll}{1,3})(?![\p{L}\d])/gu;

/**
 * Stops line breaks inside "CV-s" and similar. Uses nowrap rather than a
 * non-breaking hyphen so copied text keeps a plain "-".
 */
export function KeepCaseEndings({ text }: { text: string }) {
  // split() with a capture group puts the matches at odd indexes.
  const parts = text.split(ABBREVIATION_WITH_ENDING);
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <span key={index} className="whitespace-nowrap">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
