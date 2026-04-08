// client/src/components/LanguageToggle.tsx
import React from "react";
import { Button } from "react-native";

import type { SupportedLanguage } from "../locales/i18n";
import { useTranslation } from "../../hooks/use-translation";

export interface LanguageToggleProps {
  currentLanguage: SupportedLanguage;
  onToggle: () => void | Promise<void>;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  currentLanguage,
  onToggle,
}) => {
  const { t } = useTranslation();

  const labelKey = currentLanguage === "en" ? "language.he" : "language.en";
  const label = t(labelKey);

  return <Button title={label} onPress={() => void onToggle()} />;
};