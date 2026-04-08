import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import he from "./he.json";

const resources = {
  en: { translation: en },
  he: { translation: he },
};

export type SupportedLanguage = keyof typeof resources;

const FALLBACK_LANG: SupportedLanguage = "en";

export const isRTLLanguage = (lang?: string) => (lang ?? i18n.language) === "he";

export const changeLanguage = async (lang: SupportedLanguage) => {
  await i18n.changeLanguage(lang);
};

export const initLanguage = async () => {
  const lang: SupportedLanguage = FALLBACK_LANG;

  await i18n.use(initReactI18next).init({
    resources,
    lng: lang,
    fallbackLng: FALLBACK_LANG,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
};

export default i18n;