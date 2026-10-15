const numberFormat = new Intl.NumberFormat("et-EE");

export function formatNumber(value: number): string {
  return numberFormat.format(value);
}

/**
 * Keeps Estonian case endings attached to abbreviations (CV-s, SQL-i, CV-d)
 * by swapping the hyphen for a non-breaking one. Display only, never for copied text.
 */
export function keepCaseEndings(text: string): string {
  return text.replace(/(\S)-(\p{Ll}{1,3})(?=[\s.,;:!?)»“”"]|$)/gu, "$1‑$2");
}
