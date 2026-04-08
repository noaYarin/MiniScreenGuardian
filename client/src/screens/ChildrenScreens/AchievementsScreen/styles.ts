import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  headerIconButton: {
    padding: 8,
  },

  headerIconButtonPressed: {
    opacity: 0.65,
  },

  page: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 24,
    backgroundColor: "#FFFFFF",
  },

  heroCard: {
    backgroundColor: "#F8FBFF",
    borderWidth: 1,
    borderColor: "#E7EFFA",
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  heroIconWrap: {
    backgroundColor: "#FFF3DD",
    borderWidth: 1,
    borderColor: "#FFE6BA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  heroTextBlock: {
    width: "100%",
    marginBottom: 14,
  },

  heroTitle: {
    fontSize: 24,
    lineHeight: 30,
    color: "#111827",
    marginBottom: 6,
  },

  heroSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
  },

  heroSummaryRow: {
    width: "100%",
    gap: 12,
  },

  heroSummaryCard: {
    flex: 1,
    minWidth: 0,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    minHeight: 82,
  },

  heroSummaryCardGold: {
    backgroundColor: "#FFF3DD",
    borderColor: "#FFE6BA",
  },

  heroSummaryCardGreen: {
    backgroundColor: "#E9FFF3",
    borderColor: "#D7F7E8",
  },

  heroSummaryTop: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 8,
  },

  heroSummaryIconGold: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFE1A8",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  heroSummaryIconGreen: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#C9F5DE",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  heroSummaryValueGold: {
    flex: 1,
    fontSize: 20,
    color: "#B46B00",
  },

  heroSummaryValueGreen: {
    flex: 1,
    fontSize: 20,
    color: "#0F8A5F",
  },

  heroSummaryLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  statsGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
    marginBottom: 18,
  },

  statCard: {
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 110,
    paddingVertical: 14,
    paddingHorizontal: 14,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  statCardBlue: {
    backgroundColor: "#EAF2FF",
    borderColor: "#D6E6FF",
  },

  statCardPink: {
    backgroundColor: "#FFEAF0",
    borderColor: "#FFD6E2",
  },

  statHeader: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  statIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  statIconBadgeBlue: {
    backgroundColor: "#CFE3FF",
  },

  statIconBadgePink: {
    backgroundColor: "#FFC9D8",
  },

  statLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: "#4B5563",
  },

  statValue: {
    fontSize: 18,
    lineHeight: 24,
  },

  statValueBlue: {
    color: "#2F6DEB",
  },

  statValuePink: {
    color: "#D81B60",
  },

  achievementsList: {
    width: "100%",
    gap: 14,
  },

  achievementCard: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  achievementCardGold: {
    backgroundColor: "#FFF8E8",
    borderColor: "#F9E7AF",
  },

  achievementCardLight: {
    backgroundColor: "#F8F7FF",
    borderColor: "#E7DBFF",
  },

  achievementCardPressed: {
    opacity: 0.9,
  },

  achievementInner: {
    justifyContent: "space-between",
    gap: 14,
  },

  achievementIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  achievementIconBoxGold: {
    backgroundColor: "#FFE8A3",
  },

  achievementIconBoxLight: {
    backgroundColor: "#E9DDFF",
  },

  achievementTextArea: {
    flex: 1,
    alignItems: "stretch",
  },

  achievementTitleRow: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 6,
  },

  achievementTitle: {
    flex: 1,
    fontSize: 20,
    lineHeight: 25,
    color: "#374151",
  },

  achievementTitleGold: {
    color: "#6B4E00",
  },

  achievementSubtitle: {
    fontSize: 15,
    lineHeight: 21,
    color: "#4B5563",
    marginBottom: 12,
  },

  achievementSubtitleGold: {
    color: "#7A6640",
  },

  achievementBottomArea: {
    minHeight: 34,
    position: "relative",
    justifyContent: "center",
  },

  rewardPill: {
    position: "absolute",
    top: 0,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  rewardPillGold: {
    backgroundColor: "#FFF0C7",
  },

  rewardPillLight: {
    backgroundColor: "#F3EDFF",
  },

  rewardPillLtr: {
    left: 0,
  },

  rewardPillRtl: {
    right: 0,
  },

  pointsPill: {
    position: "absolute",
    top: 0,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  pointsPillGold: {
    backgroundColor: "#FFE8A3",
  },

  pointsPillLight: {
    backgroundColor: "#E7DBFF",
  },

  pointsPillLtr: {
    right: 0,
  },

  pointsPillRtl: {
    left: 0,
  },

  rewardText: {
    fontSize: 12,
    color: "#6B7280",
  },

  rewardTextGold: {
    color: "#8A6500",
  },

  progressText: {
    fontSize: 13,
    color: "#5B21B6",
  },

  progressTextGold: {
    color: "#7C5A00",
  },

  completedBadge: {
    backgroundColor: "#10D98B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },

  completedBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
});