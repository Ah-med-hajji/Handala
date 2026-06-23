export const LOCALES = ['ar', 'en', 'fr', 'es'] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
  fr: 'Français',
  es: 'Español',
};

// Data rows have *_ar / *_en columns. For ar, return the Arabic value;
// for any other locale (en, fr, es), return the English value, falling back
// to Arabic if English is empty. Once *_fr / *_es columns are added to the
// schema, switch this helper to pick those when available.
export function pickLocaleField(
  record: object | null | undefined,
  field: string,
  locale: string,
): string {
  if (!record) return '';
  const rec = record as Record<string, unknown>;
  const ar = rec[`${field}_ar`];
  const en = rec[`${field}_en`];
  if (locale === 'ar') return typeof ar === 'string' ? ar : '';
  if (typeof en === 'string' && en.length > 0) return en;
  return typeof ar === 'string' ? ar : '';
}
