import { useMemo } from "react";

export function useLocaleLayout() {
  return useMemo(
    () => ({
      isRTL: false,
      rowDirection: "row",
      textAlign: "left",
      row: { flexDirection: "row" },
      text: { textAlign: "left" },
      start: "left",
      end: "right",
    }),
    []
  );
}