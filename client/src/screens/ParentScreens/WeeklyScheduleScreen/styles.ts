import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 28,
  },

  container: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  contentMaxWidth: {
    width: "100%",
    maxWidth: 980,
    gap: 16,
  },

  heroCard: {
    backgroundColor: "#F7FAFF",
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2ECFF",
    shadowColor: "#9CB8E8",
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    gap: 16,
  },

  heroTopRow: {
    alignItems: "center",
    gap: 12,
  },

  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#EAF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  heroTextWrap: {
    flex: 1,
    gap: 4,
  },

  heroTitle: {
    fontSize: 22,
    color: "#1D2A44",
  },

  heroSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: "#667189",
  },

  heroStatsRow: {
    gap: 12,
  },

  heroStatsColumn: {
    gap: 12,
  },

  statCard: {
    flex: 1,
    minHeight: 82,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderWidth: 1,
    borderColor: "#EBF1FB",
    justifyContent: "center",
    gap: 6,
  },

  statLabel: {
    fontSize: 13,
    color: "#7A8498",
  },

  statValue: {
    fontSize: 24,
    color: "#23324F",
  },

  daysRailSection: {
    gap: 10,
  },

  sectionHeaderRow: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  sectionTitle: {
    fontSize: 18,
    color: "#1F2B46",
  },

  sectionHint: {
    fontSize: 13,
    color: "#7A8599",
  },

  dayRailWrapLtr: {
    justifyContent: "flex-start",
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  dayRailWrapRtl: {
    justifyContent: "flex-start",
    width: "100%",
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 10,
  },
  dayRailOuterLtr: {
  width: "100%",
  alignItems: "flex-start",
},

dayRailOuterRtl: {
  width: "100%",
  alignItems: "flex-end",
},

  dayRailChip: {
    minWidth: 78,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    gap: 4,
  },

  dayRailChipActive: {
    backgroundColor: "#F3F8FF",
    borderColor: "#2F6BFF",
  },

  dayRailChipInactive: {
    backgroundColor: "#F5F6F8",
    borderColor: "#D8DEE8",
  },

  dayRailChipFocused: {
    transform: [{ scale: 1.02 }],
    shadowColor: "#2F6BFF",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  dayRailChipPressed: {
    opacity: 0.84,
  },

  dayRailChipLetter: {
    fontSize: 18,
  },

  dayRailChipLetterActive: {
    color: "#2F6BFF",
  },

  dayRailChipLetterInactive: {
    color: "#9AA3B5",
  },

  dayRailChipLabel: {
    fontSize: 12,
  },

  dayRailChipLabelActive: {
    color: "#244B9A",
  },

  dayRailChipLabelInactive: {
    color: "#99A1B3",
  },

  cardsSection: {
    gap: 14,
  },

  dayCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EAF0FA",
    shadowColor: "#B7C5DA",
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    gap: 16,
  },

  dayCardActive: {
    borderColor: "#BFD4FF",
    backgroundColor: "#FCFDFF",
  },

  dayCardDisabled: {
    opacity: 0.72,
  },

  dayCardHeader: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  dayIdentityRow: {
    alignItems: "center",
    gap: 12,
    flexShrink: 1,
    flex: 1,
  },

  dayBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#59A9F8",
    alignItems: "center",
    justifyContent: "center",
  },

  dayBadgeDisabled: {
    backgroundColor: "#B7C3D3",
  },

  dayBadgeText: {
    fontSize: 22,
    color: "#FFFFFF",
  },

  dayNameWrap: {
    gap: 3,
    flexShrink: 1,
    flex: 1,
  },

  dayName: {
    fontSize: 22,
    color: "#24324D",
  },

  dayStatus: {
    fontSize: 13,
    color: "#7A8598",
  },

  toggleWrap: {
    padding: 4,
  },

  toggleWrapPressed: {
    opacity: 0.8,
  },

  toggleTrack: {
    width: 56,
    height: 32,
    borderRadius: 999,
    backgroundColor: "#DCE4EF",
    justifyContent: "center",
    paddingHorizontal: 4,
  },

  toggleTrackOn: {
    backgroundColor: "#69B5F9",
  },

  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-start",
  },

  toggleThumbOn: {
    alignSelf: "flex-end",
  },

  timeGrid: {
    gap: 12,
  },

  timeGridTablet: {
    flexDirection: "row",
  },

  timeCard: {
    flex: 1,
    backgroundColor: "#F9FBFE",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EDF2F9",
    gap: 10,
  },

  timeLabelRow: {
    alignItems: "center",
    gap: 6,
  },

  timeLabel: {
    fontSize: 14,
    color: "#6F7A8D",
  },

  timeValueBox: {
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8E0EC",
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  timeValue: {
    flex: 1,
    fontSize: 18,
    color: "#24324A",
    textAlign: "center",
  },

  timeAdjustButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#EEF5FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D7E6FF",
  },

  timeAdjustButtonPressed: {
    opacity: 0.82,
  },

  dayFooter: {
    justifyContent: "flex-start",
  },

  totalHoursPill: {
    minHeight: 38,
    borderRadius: 999,
    backgroundColor: "#EEF5FF",
    paddingHorizontal: 14,
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
  },

  totalHoursText: {
    fontSize: 14,
    color: "#2B4D94",
  },

  bottomActionsWrap: {
    gap: 12,
    paddingTop: 4,
  },

  secondaryActionButton: {
    minHeight: 52,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#CFE0FF",
    backgroundColor: "#F6FAFF",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  secondaryActionButtonPressed: {
    opacity: 0.86,
  },

  secondaryActionText: {
    fontSize: 15,
    color: "#2F6BFF",
  },

  primaryActionButton: {
    minHeight: 56,
    borderRadius: 20,
    backgroundColor: "#2F6BFF",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#2F6BFF",
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },

  primaryActionButtonPressed: {
    opacity: 0.88,
  },

  primaryActionText: {
    fontSize: 16,
    color: "#FFFFFF",
  },



});