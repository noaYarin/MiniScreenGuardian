import { StyleSheet } from "react-native";

const COLORS = {
  white: "#FFFFFF",
  text: "#0F172A",
  muted: "#475569",
  border: "#E7EFFA",
  primaryBlue: "#3B82F6",
  babyBlueTileBg: "#EAF2FF",
  babyBlueTileBorder: "#D6E6FF",
  babyBlueBadge: "#CFE3FF",

  beigeTileBg: "#FFF3DD",
  beigeTileBorder: "#FFE6BA",
  beigeBadge: "#FFE1A8",

  greenTileBg: "#E9FFF3",
  greenTileBorder: "#D7F7E8",
  greenBadge: "#C9F5DE",

  shadow: "#000000",
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentMaxWidth: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },

  tabsWrapper: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 6,
    gap: 8,
    marginBottom: 14,
  },

  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  activeTab: {
    backgroundColor: COLORS.babyBlueTileBg,
    borderWidth: 1,
    borderColor: COLORS.babyBlueTileBorder,
  },

  inactiveTab: {
    backgroundColor: COLORS.white,
  },

  tabText: {
    fontSize: 15,
    color: COLORS.text,
  },

  listContent: {
    paddingTop: 6,
    paddingBottom: 22,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },

coinsBadge: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FFF3DD",
  borderWidth: 1,
  borderColor: "#FFE6BA",
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 999,
  gap: 6,
},

  coinsBadgeLTR: {
    left: 12,
  },

  coinsBadgeRTL: {
    right: 12,
  },

  coinsText: {
    fontSize: 14,
    color: "#B46B00",
  },

taskTitle: {
  fontSize: 20,
  color: "#0F172A",
  lineHeight: 26,
  flex: 1,
},

  statusBoxDone: {
    backgroundColor: COLORS.greenTileBg,
    borderWidth: 1,
    borderColor: COLORS.greenTileBorder,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    gap: 10,
  },

  statusTextDone: {
    color: "#0F8A5F",
    fontSize: 15,
  },

  todoArea: {
    gap: 10,
  },

  todoHint: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
  },

  uploadBtn: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.babyBlueTileBg,
    borderWidth: 1,
    borderColor: COLORS.babyBlueTileBorder,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 12,

    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 1,
  },

  uploadBtnInner: {
    alignItems: "center",
    gap: 10,
  },

  uploadText: {
    color: "#2F6DEB",
    fontSize: 15,
  },
uploadBtnLtr: {
  alignSelf: "flex-start",
},

uploadBtnRtl: {
  alignSelf: "flex-end",
},
  statusIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  statusIconCircleDone: {
    backgroundColor: COLORS.greenBadge,
  },

  statusIconCircleUpload: {
    backgroundColor: COLORS.babyBlueBadge,
  },

  weekBox: {
    marginTop: 8,
    backgroundColor: COLORS.beigeTileBg,
    borderWidth: 1,
    borderColor: COLORS.beigeTileBorder,
    borderRadius: 22,
    padding: 14,

    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },

  weekInner: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  weekIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.beigeBadge,
  },

  weekText: {
    fontSize: 16,
    color: "#9B5B00",
    lineHeight: 22,
  },
  cardHeader: {
  width: "100%",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 12,
},
});