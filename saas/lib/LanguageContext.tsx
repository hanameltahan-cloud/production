import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Language, getTranslation, Translations } from "./i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize with a function to avoid hydration mismatch
  const [language, setLanguageState] = useState<Language>(() => {
    // Only access localStorage on client side
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("language") as Language | null;
      if (savedLang && (savedLang === "en" || savedLang === "ar")) {
        return savedLang;
      }
    }
    return "en";
  });
  
  const [t, setT] = useState<Translations>(() => getTranslation(language));
  const [dir, setDir] = useState<"ltr" | "rtl">(() => language === "ar" ? "rtl" : "ltr");

  // Set document direction on mount and language change
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
    setT(getTranslation(language));
    setDir(language === "ar" ? "rtl" : "ltr");
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setT(getTranslation(lang));
    setDir(lang === "ar" ? "rtl" : "ltr");
    localStorage.setItem("language", lang);

    // Update document direction
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
