const base = import.meta.env.BASE_URL || '/';

export const LOGOS = {
  en: `${base}logos/bosco-logo-en.png`,
  ar: `${base}logos/bosco-logo-ar.png`,
};

export function logoForLanguage(language = 'en') {
  return String(language || 'en').startsWith('ar') ? LOGOS.ar : LOGOS.en;
}
