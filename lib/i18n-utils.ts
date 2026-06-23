export const LOCALES = ['ar', 'en', 'fr', 'es'] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
  fr: 'Français',
  es: 'Español',
};

// Picks a translated field off a DB row that carries *_ar / *_en / *_fr / *_es
// columns. For the requested locale, prefer that locale's column. Otherwise
// walk a fallback chain: locale → en → ar. Treats null / empty strings as
// "not translated" so a half-populated row still renders the AR/EN source.
export function pickLocaleField(
  record: object | null | undefined,
  field: string,
  locale: string,
): string {
  if (!record) return '';
  const rec = record as Record<string, unknown>;
  const get = (suffix: string) => {
    const v = rec[`${field}_${suffix}`];
    return typeof v === 'string' && v.length > 0 ? v : '';
  };

  if (locale === 'ar') return get('ar');
  const preferred = get(locale);
  if (preferred) return preferred;
  const english = get('en');
  if (english) return english;
  return get('ar');
}
