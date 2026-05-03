'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_LOCALE,
  DICTIONARIES,
  HTML_LANG,
  LOCALES,
  type Dictionary,
  type Locale,
} from './dictionaries';

const STORAGE_KEY = 'ippinkyo.locale';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (LOCALES as readonly string[]).includes(v);
}

/**
 * Wrap the entire tree so any component can read the current locale and the
 * matching dictionary via {@link useLocale}. The server renders the default
 * Japanese strings; on hydration we read the user preference from
 * localStorage and (optionally) the browser language.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    let next: Locale | null = null;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLocale(stored)) next = stored;
    } catch {
      // localStorage may be blocked; fall back to navigator.
    }
    if (!next && typeof navigator !== 'undefined') {
      const lang = navigator.language.toLowerCase();
      if (lang.startsWith('zh')) next = 'zh';
      else if (lang.startsWith('en')) next = 'en';
    }
    if (next && next !== locale) setLocaleState(next);
    // We intentionally don't include `locale` so this only runs on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the document <html lang> attribute in sync so AT and SEO tools see
  // the right language even when the user switches client-side.
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = HTML_LANG[locale];
    }
  }, [locale]);

  const setLocale = useCallback((loc: Locale) => {
    setLocaleState(loc);
    try {
      window.localStorage.setItem(STORAGE_KEY, loc);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t: DICTIONARIES[locale] }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

/**
 * Read the active locale + dictionary. Throws when used outside of a provider
 * so missing setup is caught immediately rather than producing silently-empty
 * strings.
 */
export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used inside <LocaleProvider>');
  }
  return ctx;
}
