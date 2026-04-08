// client/src/screens/ChildrenScreens/HomeScreen/styles.ts
import { StyleSheet } from "react-native";
import { APP_COLORS } from "../../../../constants/theme";

export const TILE_COLORS = {
  apps: { bg: "#EAF2FF", badge: "#CFE3FF", icon: "#2F6DEB", border: "#D6E6FF" },
  extend: { bg: "#EAF2FF", badge: "#CFE3FF", icon: "#2F6DEB", border: "#D6E6FF" },
  shop: { bg: "#FFF3DD", badge: "#FFE1A8", icon: "#B46B00", border: "#FFE6BA" },
  tasks: { bg: "#E9FFF3", badge: "#C9F5DE", icon: "#0F8A5F", border: "#D7F7E8" },
  achievements: { bg: "#F3EDFF", badge: "#E0D2FF", icon: "#6D28D9", border: "#E7DBFF" },
  goals: { bg: "#FFEAF0", badge: "#FFC9D8", icon: "#D81B60", border: "#FFD6E2" },
  encouragement: { bg: "#FFEFF0", badge: "#FFD0D4", icon: "#E11D48", border: "#FFD9DC" },
  ideas: { bg: "#EEFFF4", badge: "#CFF7DD", icon: "#16A34A", border: "#DAF9E6" },
  help: { bg: "#EAF2FF", badge: "#CFE3FF", icon: "#2563EB", border: "#D6E6FF" },
} as const;

export const styles = StyleSheet.create({
  page: {
    width: "100%",
    alignItems: "stretch",
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 16,
  },

  pageSmall: {
    paddingHorizontal: 10,
  },

  topRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 12,
  },

  topCol: {
    flex: 1,
  },

  topColCenter: {
    flex: 1,
    alignItems: "center",
  },

  circleBtn: {
    width: 52,
    height: 52,
    borderRadius: 999,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#D6E6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  circleBtnPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  headerCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E7EFFA",
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  headerRow: {
    width: "100%",
    alignItems: "center",
  },

  avatarWrap: {
    borderRadius: 999,
    overflow: "hidden",
  },

  avatarGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarPhoto: {
    width: "100%",
    height: "100%",
  },

  avatarLetter: {
    color: "#FFFFFF",
    fontSize: 42,
    lineHeight: 46,
    includeFontPadding: false,
    textAlign: "center",
  },

  helloBlock: {
    flex: 1,
    paddingHorizontal: 12,
    minWidth: 0,
  },

  hello: {
    color: "#0F172A",
    includeFontPadding: false,
  },

statsRow: {
  width: "100%",
  marginTop: 12,
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "center",
},

statPill: {
  minWidth: 0,
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderRadius: 999,
  marginBottom: 8,
},

statPillDesktop: {
  width: "31.5%",
},

statPillTablet: {
  width: "31.5%",
},

statPillMobile: {
  width: "100%",
  maxWidth: 280,
  alignSelf: "center",
},

  statText: {
    marginHorizontal: 8,
    fontSize: 14,
    lineHeight: 18,
    color: "#0F172A",
    flexShrink: 1,
    textAlign: "center",
    includeFontPadding: false,
  },

  statPillBlue: {
    backgroundColor: "#EAF2FF",
    borderWidth: 1,
    borderColor: "#D6E6FF",
  },

  statPillBeige: {
    backgroundColor: APP_COLORS.beige,
    borderWidth: 1,
    borderColor: "#F6E4C7",
  },

  statPillPrimary: {
    backgroundColor: "#E9FFF3",
    borderWidth: 1,
    borderColor: "#D7F7E8",
  },

  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E7EFFA",
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  cardTitleRow: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardTitleLeft: {
    alignItems: "center",
  },

  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#EAF2FF",
    borderWidth: 1,
    borderColor: "#D6E6FF",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },

  cardTitle: {
    color: "#0F172A",
    fontSize: 16,
    includeFontPadding: false,
  },

  timerValue: {
    marginTop: 10,
    color: "#0F172A",
    textAlign: "center",
    includeFontPadding: false,
  },

  progressTrack: {
    width: "100%",
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E6EEF9",
    overflow: "hidden",
    marginTop: 12,
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#3B82F6",
  },

  timerSub: {
    marginTop: 10,
    textAlign: "center",
    color: "#2563EB",
    includeFontPadding: false,
  },

  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    rowGap: 12,
    marginBottom: 10,
  },

  tile: {
    width: "31.5%",
    maxWidth: 250,
    aspectRatio: 1,
    borderRadius: 22,
    borderWidth: 2,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  },

  tileInner: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },

  tileIconZone: {
    flex: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  tileLabelZone: {
    flex: 4,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 6,
  },

  tileIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },

  tileText: {
    color: "#0F172A",
    textAlign: "center",
    fontSize: 13,
    lineHeight: 16,
    includeFontPadding: false,
  },

  tileBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    paddingHorizontal: 10,
  },

  tileFooter: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  tilePressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },

  panicBtn: {
    width: "100%",
    marginTop: 10,
    backgroundColor: "#E85A68",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  panicPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.995 }],
  },

  panicIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },

  panicText: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 20,
    includeFontPadding: false,
    textAlign: "center",
  },
});