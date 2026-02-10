
import { useState, useEffect, useCallback } from 'react';
import { Language, translations } from '../lib/i18n';

export const useTranslation = () => {
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem('visionpath_lang');
        return (saved as Language) || 'pt';
    });

    const t = useCallback((key: keyof typeof translations['pt']) => {
        return translations[language][key] || translations['en'][key] || key;
    }, [language]);

    const changeLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('visionpath_lang', lang);
    };

    return { t, language, changeLanguage };
};
