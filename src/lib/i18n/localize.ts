import { LocalizedString, SupportedLanguage } from "../types";

export function getLocalized(
  value: LocalizedString | string | null | undefined,
  lang: SupportedLanguage = 'en'
): string {
  if (!value) return '';
  if (typeof value === 'string') return value;

  const target = value[lang];
  if (target && target.trim() !== '') {
    return target;
  }

  // Fallback to opposite language if current is missing
  const fallback = lang === 'en' ? value.bn : value.en;
  return fallback || '';
}
