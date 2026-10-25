"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { SupportedLanguage, LocalizedString } from "../lib/types";
import { translations } from "../lib/i18n/translations";
import { getLocalized } from "../lib/i18n/localize";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleLanguage: () => void;
  t: typeof translations.en;
  localize: (val: LocalizedString | string | null | undefined) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "aronyok_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage | null;
      if (savedLang === 'en' || savedLang === 'bn') {
        setLanguageState(savedLang);
        document.documentElement.lang = savedLang;
      }
    } catch {
      // Ignore localStorage errors
    }
    setIsHydrated(true);
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      document.cookie = `aronyok_lang=${lang}; path=/; max-age=31536000`;
      document.documentElement.lang = lang;
    } catch {
      // Ignore storage errors
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  const t = translations[language] || translations.en;

  const localize = (val: LocalizedString | string | null | undefined): string => {
    return getLocalized(val, language);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        localize,
      }}
    >
      <div className={language === 'bn' ? 'font-bengali' : 'font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
