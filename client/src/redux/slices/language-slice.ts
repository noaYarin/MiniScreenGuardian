import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { SupportedLanguage } from "../../locales/i18n";
import { changeLanguage } from "../../locales/i18n";

export interface LanguageState {
  currentLanguage: SupportedLanguage;
}

const initialState: LanguageState = {
  currentLanguage: "he",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<SupportedLanguage>) {
      const newLanguage = action.payload;
      state.currentLanguage = newLanguage;

      changeLanguage(newLanguage);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;