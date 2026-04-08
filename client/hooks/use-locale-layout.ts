import { useMemo } from "react";
import { useTranslation } from "./use-translation";
import {
  getRowDirection,
  getTextAlign,
  rowStyle,
  textAlignStyle,
  getStartEdge,
  getEndEdge,
} from "../src/locales/rtl";

export function useLocaleLayout() {
  const { isRTL } = useTranslation();

  return useMemo(
    () => ({
      isRTL,
      rowDirection: getRowDirection(isRTL),
      textAlign: getTextAlign(isRTL),
      row: rowStyle(isRTL),
      text: textAlignStyle(isRTL),
      start: getStartEdge(isRTL),
      end: getEndEdge(isRTL),
    }),
    [isRTL]
  );
}