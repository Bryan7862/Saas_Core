import { createContext, useContext, useState, ReactNode } from 'react';
import { esTranslations, TranslationKeys } from './es';
import { enTranslations } from './en';

type Language = 'es' | 'en';

interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: TranslationKeys;
}

const translations: Record<Language, TranslationKeys> = {
    es: esTranslations,
    en: enTranslations,
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
    // Get initial language from localStorage or default to Spanish
    const getInitialLanguage = (): Language => {
        const saved = localStorage.getItem('language');
        if (saved === 'es' || saved === 'en') return saved;
        return 'es';
    };

    const [language, setLanguageState] = useState<Language>(getInitialLanguage);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    return (
        <I18nContext.Provider value={{
            language,
            setLanguage,
            t: translations[language]
        }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(I18nContext);
    if (!context) {
        // Return default translations if provider not available
        return {
            language: 'es' as Language,
            setLanguage: () => { },
            t: esTranslations
        };
    }
    return context;
};

// Helper for translations with parameters
export const interpolate = (text: string, params: Record<string, string | number>): string => {
    return Object.entries(params).reduce(
        (result, [key, value]) => result.replace(`{{${key}}}`, String(value)),
        text
    );
};
