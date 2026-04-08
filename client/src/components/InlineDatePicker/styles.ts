import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  pickerWrap: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    alignSelf: "stretch",
    overflow: "hidden",
  },

  footer: {
    marginTop: 12,
    alignItems: "flex-end",
  },

  doneButton: {
    minWidth: 96,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  doneText: {
    color: "#FFFFFF",
    fontSize: 14,
  },

  pressed: {
    opacity: 0.9,
  },
});
