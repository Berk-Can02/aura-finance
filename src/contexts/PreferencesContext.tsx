import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, SupportedLanguage } from "@/i18n";

export type SupportedCurrency = "TRY" | "USD" | "EUR" | "GBP";

interface UserPreferences {
  language: SupportedLanguage;
  currency: SupportedCurrency;
}

interface PreferencesContextValue extends UserPreferences {
  setLanguage: (lang: SupportedLanguage) => void;
  setCurrency: (currency: SupportedCurrency) => void;
  formatCurrency: (amount: number, options?: Intl.NumberFormatOptions) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  locale: string;
}

const STORAGE_KEY = "aura.preferences";
const LANG_TO_LOCALE: Record<SupportedLanguage, string> = {
  en: "en-US",
  de: "de-DE",
  tr: "tr-TR",
};

const DEFAULT_PREFS: UserPreferences = { language: "en", currency: "USD" };

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

// Mock UserPreferences API — swap with real backend (Lovable Cloud) when wired
const userPreferencesApi = {
  async fetch(): Promise<UserPreferences> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_PREFS;
      const parsed = JSON.parse(raw) as Partial<UserPreferences>;
      return {
        language: SUPPORTED_LANGUAGES.includes(parsed.language as SupportedLanguage)
          ? (parsed.language as SupportedLanguage)
          : DEFAULT_PREFS.language,
        currency: (parsed.currency as SupportedCurrency) ?? DEFAULT_PREFS.currency,
      };
    } catch {
      return DEFAULT_PREFS;
    }
  },
  async save(prefs: UserPreferences): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  },
};

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFS);
  const [hydrated, setHydrated] = useState(false);

  // Fetch on startup
  useEffect(() => {
    userPreferencesApi.fetch().then((p) => {
      setPrefs(p);
      i18n.changeLanguage(p.language);
      setHydrated(true);
    });
  }, [i18n]);

  // Persist whenever prefs change
  useEffect(() => {
    if (hydrated) userPreferencesApi.save(prefs);
  }, [prefs, hydrated]);

  const setLanguage = useCallback(
    (language: SupportedLanguage) => {
      setPrefs((p) => ({ ...p, language }));
      i18n.changeLanguage(language);
    },
    [i18n]
  );

  const setCurrency = useCallback((currency: SupportedCurrency) => {
    setPrefs((p) => ({ ...p, currency }));
  }, []);

  const locale = LANG_TO_LOCALE[prefs.language];

  const formatCurrency = useCallback(
    (amount: number, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: prefs.currency,
        maximumFractionDigits: 2,
        ...options,
      }).format(amount),
    [locale, prefs.currency]
  );

  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale, options).format(value),
    [locale]
  );

  const formatDate = useCallback(
    (date: Date | string, options?: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(locale, options ?? { month: "short", day: "numeric" }).format(
        typeof date === "string" ? new Date(date) : date
      ),
    [locale]
  );

  const value = useMemo<PreferencesContextValue>(
    () => ({
      ...prefs,
      setLanguage,
      setCurrency,
      formatCurrency,
      formatNumber,
      formatDate,
      locale,
    }),
    [prefs, setLanguage, setCurrency, formatCurrency, formatNumber, formatDate, locale]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}
