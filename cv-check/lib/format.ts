const numberFormat = new Intl.NumberFormat("et-EE");

export function formatNumber(value: number): string {
  return numberFormat.format(value);
}
