import { useLanguage, type Locale } from '@/contexts/LanguageContext';
import ko from './ko';
import en from './en';

export type { Locale };

const translations: Record<Locale, Record<string, unknown>> = { ko, en };

function resolve(obj: unknown, keys: string[]): unknown {
  let current = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return current;
}

export function useTranslation() {
  const { locale, setLocale } = useLanguage();

  const t = (key: string): string => {
    if (!key) return '';
    const keys = key.split('.');
    const result = resolve(translations[locale], keys);
    return typeof result === 'string' ? result : key;
  };

  return { t, locale, setLocale };
}
