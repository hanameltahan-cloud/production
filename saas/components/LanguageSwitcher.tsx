import { useLanguage } from "../lib/LanguageContext";
import { Languages } from "lucide-react";
import { Button } from "./ui/button";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="fixed top-3 sm:top-4 right-3 sm:right-4 z-50 shadow-lg hover:shadow-xl transition-all bg-white/90 backdrop-blur-sm text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2"
    >
      <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
      {language === "en" ? "العربية" : "English"}
    </Button>
  );
}
