
import React, { createContext, useContext, useState } from 'react';
import en from '../i18n/en.json';
import fa from '../i18n/fa.json';

const translations = { en, fa };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
    const t = (key) => translations[lang][key] || key;

    const changeLang = (l) => {
        setLang(l);
        localStorage.setItem('lang', l);
    };

    return (
        <LanguageContext.Provider value={{ lang, t, changeLang }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
