import type { TextStyle, ViewStyle } from "react-native";

export const getRowDirection = (isRTL: boolean): ViewStyle["flexDirection"] =>
  isRTL ? "row-reverse" : "row";

export const getTextAlign = (isRTL: boolean): TextStyle["textAlign"] =>
  isRTL ? "right" : "left";

export const getStartEdge = (isRTL: boolean) => (isRTL ? "right" : "left");
export const getEndEdge = (isRTL: boolean) => (isRTL ? "left" : "right");

export const logicalMarginStart = (isRTL: boolean, value: number): ViewStyle =>
  isRTL ? { marginRight: value } : { marginLeft: value };

export const pickRTL = <T,>(isRTL: boolean, rtlValue: T, ltrValue: T): T =>
  isRTL ? rtlValue : ltrValue;

export const logicalMarginEnd = (isRTL: boolean, value: number): ViewStyle =>
  isRTL ? { marginLeft: value } : { marginRight: value };

export const logicalPaddingStart = (isRTL: boolean, value: number): ViewStyle =>
  isRTL ? { paddingRight: value } : { paddingLeft: value };

export const logicalPaddingEnd = (isRTL: boolean, value: number): ViewStyle =>
  isRTL ? { paddingLeft: value } : { paddingRight: value };

export const rowStyle = (isRTL: boolean): ViewStyle => ({
  flexDirection: isRTL ? "row-reverse" : "row",
});

export const textAlignStyle = (isRTL: boolean): TextStyle => ({
  textAlign: isRTL ? "right" : "left",
});