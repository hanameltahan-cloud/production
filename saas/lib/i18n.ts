export type Language = "en" | "ar";

export interface Translations {
  categories: {
    "AI Agents": string;
    "E-commerce": string;
    Healthcare: string;
    Education: string;
    Finance: string;
    Entertainment: string;
    Productivity: string;
    "Social Media": string;
  };
  header: {
    poweredBy: string;
    title: string;
    subtitle: string;
  };
  categorySelector: {
    label: string;
    categoriesCount: string;
  };
  buttons: {
    generate: string;
    generating: string;
    copy: string;
    copied: string;
  };
  loading: {
    generatingFor: string;
  };
  placeholder: {
    clickToStart: string;
  };
  stats: {
    streaming: string;
    words: string;
  };
  footer: {
    text: string;
  };
  errors: {
    generateFailed: string;
    copyFailed: string;
  };
  success: {
    copied: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    categories: {
      "AI Agents": "AI Agents",
      "E-commerce": "E-commerce",
      Healthcare: "Healthcare",
      Education: "Education",
      Finance: "Finance",
      Entertainment: "Entertainment",
      Productivity: "Productivity",
      "Social Media": "Social Media",
    },
    header: {
      poweredBy: "Powered by AI",
      title: "Business Idea Generator",
      subtitle:
        "Generate innovative, AI-powered business ideas tailored to your chosen industry. Get detailed insights and actionable plans instantly.",
    },
    categorySelector: {
      label: "Select Industry Category",
      categoriesCount: "Categories",
    },
    buttons: {
      generate: "Generate New Idea",
      generating: "Generating...",
      copy: "Copy to Clipboard",
      copied: "Copied!",
    },
    loading: {
      generatingFor: "Generating your business idea for",
    },
    placeholder: {
      clickToStart: 'Click "Generate New Idea" to get started',
    },
    stats: {
      streaming: "Real-time streaming",
      words: "words",
    },
    footer: {
      text: "Powered by Advanced AI • Instant Generation • Always Free",
    },
    errors: {
      generateFailed: "Failed to generate idea. Please try again.",
      copyFailed: "Failed to copy to clipboard",
    },
    success: {
      copied: "Copied to clipboard!",
    },
  },
  ar: {
    categories: {
      "AI Agents": "وكلاء الذكاء الاصطناعي",
      "E-commerce": "التجارة الإلكترونية",
      Healthcare: "الرعاية الصحية",
      Education: "التعليم",
      Finance: "المالية",
      Entertainment: "الترفيه",
      Productivity: "الإنتاجية",
      "Social Media": "وسائل التواصل الاجتماعي",
    },
    header: {
      poweredBy: "مدعوم بالذكاء الاصطناعي",
      title: "مولد أفكار الأعمال",
      subtitle:
        "قم بتوليد أفكار أعمال مبتكرة ومدعومة بالذكاء الاصطناعي مصممة خصيصاً لصناعتك المختارة. احصل على رؤى تفصيلية وخطط قابلة للتنفيذ على الفور.",
    },
    categorySelector: {
      label: "اختر فئة الصناعة",
      categoriesCount: "فئات",
    },
    buttons: {
      generate: "توليد فكرة جديدة",
      generating: "جارٍ التوليد...",
      copy: "نسخ إلى الحافظة",
      copied: "تم النسخ!",
    },
    loading: {
      generatingFor: "جارٍ توليد فكرة عملك في مجال",
    },
    placeholder: {
      clickToStart: 'انقر على "توليد فكرة جديدة" للبدء',
    },
    stats: {
      streaming: "البث المباشر",
      words: "كلمة",
    },
    footer: {
      text: "مدعوم بالذكاء الاصطناعي المتقدم • توليد فوري • مجاني دائماً",
    },
    errors: {
      generateFailed: "فشل في توليد الفكرة. يرجى المحاولة مرة أخرى.",
      copyFailed: "فشل في النسخ إلى الحافظة",
    },
    success: {
      copied: "تم النسخ إلى الحافظة!",
    },
  },
};

export function getTranslation(lang: Language): Translations {
  return translations[lang];
}
