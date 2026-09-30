import { useUIStore } from '../stores/useUIStore';
import { translations, TranslationKey, SupportedLanguage } from './translations';

export function useTranslation() {
  const language = useUIStore((state) => state.language);
  const setLanguage = useUIStore((state) => state.setLanguage);

  const t = (key: TranslationKey): string => {
    const dict = translations[language] || translations.en;
    const value = dict[key];
    if (value !== undefined) {
      return value;
    }
    // Fallback to English
    return translations.en[key] || String(key);
  };

  return { t, language, setLanguage };
}
