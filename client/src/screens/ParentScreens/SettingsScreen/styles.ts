import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/theme";

export const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: COLORS.light.background,
    gap: 16,
  },

  containerTablet: {
    maxWidth: 860,
  },

  mainScroll: {
    flex: 1,
  },

  mainScrollContent: {
    flexGrow: 1,
    gap: 16,
    paddingBottom: 8,
  },

  heroIconOnly: {
    alignItems: "center",
    justifyContent: "center",
  },

  heroIconBadge: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8EEFF",
  },

  deviceAppButton: {
    borderRadius: 18,
    backgroundColor: "#F8FAFF",
    borderWidth: 1,
    borderColor: "#E4EAF7",
    padding: 14,
    minHeight: 56,
    justifyContent: "center",
  },

  deviceAppButtonPressed: {
    opacity: 0.85,
  },

  deviceAppButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  deviceAppButtonMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  deviceAppIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#315AEF",
  },

  deviceAppTexts: {
    flex: 1,
    gap: 2,
  },

  deviceAppTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: "#22324D",
  },

  deviceAppSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: "#7A8599",
  },

  logoutButton: {
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: "#E45454",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    shadowColor: "#E45454",
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  logoutPressed: {
    opacity: 0.85,
  },

  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  logoutText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#FFFFFF",
  },
});