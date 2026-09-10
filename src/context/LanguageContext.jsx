import { createContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  useEffect(() => {
    document.documentElement.lang = isAr ? 'ar' : 'en';
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [isAr]);

  const value = useMemo(
    () => ({
      language: isAr ? 'ar' : 'en',
      isAr,
      toggle: () => i18n.changeLanguage(isAr ? 'en' : 'ar'),
    }),
    [isAr, i18n]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
