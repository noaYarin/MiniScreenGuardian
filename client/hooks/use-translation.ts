import { useCallback } from "react";
import { useTranslation as useI18NextTranslation } from "react-i18next";
import { changeLanguage, type SupportedLanguage } from "../src/locales/i18n";

export const useTranslation = () => {
  const { t, i18n } = useI18NextTranslation();

  const currentLanguage =
    (i18n.resolvedLanguage as SupportedLanguage) || "en";

  const isRTL = currentLanguage === "he";

  const setLanguage = useCallback(
    async (lang: SupportedLanguage) => {
      await changeLanguage(lang);
    },
    []
  );

  return {
    t,
    currentLanguage,
    isRTL,
    changeLanguage: setLanguage,
  };
};