export function formatDate(
  iso: string,
  opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' },
): string {
  return new Date(iso).toLocaleDateString('en-US', opts);
}
