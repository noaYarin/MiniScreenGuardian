import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/theme";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 28,
    backgroundColor: COLORS.light.background,
  },

  inner: {
    width: "100%",
    alignSelf: "center",
  },

  heroCard: {
    width: "100%",
    backgroundColor: "#BDE0FE",
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 20,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E7EFF7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 3,
  },

  avatarTouchable: {
    width: 116,
    height: 116,
    marginBottom: 14,
    alignSelf: "center",
    position: "relative",
  },

  avatarCircle: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: "#EEF7FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DDECF9",
    overflow: "hidden",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarEditBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#315AEF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  avatarUploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },

  childName: {
    fontSize: 28,
    color: "#223548",
    marginBottom: 6,
  },

  childMeta: {
    fontSize: 17,
    color: "#6B7A8C",
    marginBottom: 16,
  },

  profileActionsRow: {
    width: "100%",
    marginTop: 14,
    gap: 10,
    alignItems: "stretch",
    flexDirection: "row",
  },

  editButton: {
    flex: 1,
    minHeight: 46,
    backgroundColor: "#F3F8FD",
    borderRadius: 14,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DCEAF7",
  },

  editButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  editButtonText: {
    fontSize: 15,
    color: "#3B5B7A",
  },

  deleteButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FFF1F2",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },

  deleteButtonDisabled: {
    opacity: 0.6,
  },

  deleteButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  deleteButtonText: {
    color: "#B42318",
    fontSize: 15,
  },

  cardsGrid: {
    width: "100%",
    gap: 14,
  },

  cardsGridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  actionCard: {
    width: "100%",
    minHeight: 112,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E9F0F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
  },

  actionCardTablet: {
    width: "48.8%",
  },

  actionContent: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    flexDirection: "row",
  },

  actionTextWrap: {
    flex: 1,
  },

  actionTitle: {
    fontSize: 19,
    color: "#243447",
    marginBottom: 4,
  },

  actionSubtitle: {
    fontSize: 14,
    color: "#7A8796",
    lineHeight: 20,
  },

  iconBubble: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#EEF7FF",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderWidth: 1,
    borderColor: "#DCEBFA",
  },

  chevronWrap: {
    width: 26,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  pressed: {
    opacity: 0.72,
  },

  pressedSoft: {
    opacity: 0.82,
  },

  pressedCard: {
    opacity: 0.9,
    backgroundColor: "#F8FBFF",
  },
});