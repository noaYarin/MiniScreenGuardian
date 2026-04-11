import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/theme";

export const styles = StyleSheet.create({
  scrollRoot: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.light.background,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 28,
    backgroundColor: COLORS.light.background,
  },

  container: {
    width: "100%",
    alignSelf: "center",
  },

  menuCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#EAF1F7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
  },

  menuItem: {
    width: "100%",
    minHeight: 74,
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 20,
  },

  menuItemPressed: {
    opacity: 0.8,
    backgroundColor: "#F5FAFF",
  },

  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEF3F8",
  },

  menuItemRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  menuMainSide: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 14,
  },

  menuTextWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  menuText: {
    fontSize: 17,
    lineHeight: 24,
    color: "#243447",
  },

  menuIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF4FF",
    flexShrink: 0,
  },

  chevronWrap: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});