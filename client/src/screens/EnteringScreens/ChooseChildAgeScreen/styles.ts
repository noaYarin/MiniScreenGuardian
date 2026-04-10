import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 28,
  },

  container: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    flex: 1,
    justifyContent: "space-between",
    gap: 18,
  },

  containerTablet: {
    paddingTop: 10,
  },

  heroCard: {
    width: "100%",
    backgroundColor: "#F8FBFF",
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "#E2ECF7",
    shadowColor: "#16324F",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  title: {
    marginTop: 4,
    fontSize: 28,
    lineHeight: 34,
    color: "#1C2B3A",
    marginBottom: 10,
    textAlign: "center",
  },

  selectorCard: {
    marginTop: 12,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "#E8EEF6",
  },

  selectorCardWide: {
    paddingHorizontal: 18,
    paddingVertical: 22,
  },

  controlsCenter: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  agePickerButton: {
    borderRadius: 999,
  },

  ageCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  ageCircle: {
    width: 124,
    height: 124,
    borderRadius: 62,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#365486",
    shadowColor: "#365486",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    marginBottom: 12,
  },

  ageNumber: {
    fontSize: 42,
    lineHeight: 46,
    color: "#FFFFFF",
  },

  ageLabel: {
    marginTop: 7,
    fontSize: 16,
    color: "#1C2B3A",
  },

  agePickerHintRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  agePickerHintText: {
    fontSize: 13,
    color: "#6A7C92",
  },

  rangeCard: {
    marginTop: 22,
    backgroundColor: "#F8FBFF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E2ECF7",
  },

  rangeHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },

  rangeTitle: {
    fontSize: 14,
    color: "#2B3F55",
  },

  rangeValue: {
    fontSize: 13,
    color: "#5F738A",
  },

  track: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    backgroundColor: "#DCE8F5",
    overflow: "hidden",
    position: "relative",
  },

  trackFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    borderRadius: 999,
    backgroundColor: "#6FA8DC",
  },

  trackLabelsRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  trackEdgeLabel: {
    fontSize: 13,
    color: "#6A7C92",
  },

  recommendationButton: {
    marginTop: 16,
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: "#365486",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  recommendationButtonDisabled: {
    opacity: 0.7,
  },

  recommendationButtonText: {
    fontSize: 15,
    color: "#FFFFFF",
  },

  recommendationCard: {
    marginTop: 14,
    backgroundColor: "#F4F8FD",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#DCE7F3",
  },

  recommendationCardYoung: {
    backgroundColor: "#EEF9F6",
    borderColor: "#CFEDE4",
  },

  recommendationCardMiddle: {
    backgroundColor: "#F4F8FD",
    borderColor: "#DCE7F3",
  },

  recommendationCardTeen: {
    backgroundColor: "#F8F3FF",
    borderColor: "#E7D9FA",
  },

  recommendationTitle: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
    color: "#2B3F55",
  },

  recommendationTitleYoung: {
    color: "#216E5B",
  },

  recommendationTitleMiddle: {
    color: "#2B3F55",
  },

  recommendationTitleTeen: {
    color: "#6A3EA1",
  },

  recommendationMinutes: {
    fontSize: 28,
    lineHeight: 34,
    textAlign: "center",
    marginBottom: 6,
    color: "#243447",
  },

  recommendationMinutesYoung: {
    color: "#1F7A67",
  },

  recommendationMinutesMiddle: {
    color: "#243447",
  },

  recommendationMinutesTeen: {
    color: "#7A4BC2",
  },

  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#5F738A",
    textAlign: "center",
  },

  recommendationError: {
    fontSize: 14,
    lineHeight: 20,
    color: "#C84B31",
    textAlign: "center",
  },

  recommendationLoading: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6A7C92",
    textAlign: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(16, 24, 40, 0.38)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  modalCard: {
    width: "100%",
    maxWidth: 360,
    maxHeight: "72%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
    borderWidth: 1,
    borderColor: "#E8EEF6",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  modalTitle: {
    fontSize: 20,
    color: "#1C2B3A",
  },

  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F7FC",
  },

  modalScrollContent: {
    gap: 10,
    paddingBottom: 8,
  },

  ageOption: {
    minHeight: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FBFF",
    borderWidth: 1,
    borderColor: "#E2ECF7",
  },

  ageOptionSelected: {
    backgroundColor: "#365486",
    borderColor: "#365486",
  },

  ageOptionText: {
    fontSize: 16,
    color: "#243447",
  },

  ageOptionTextSelected: {
    color: "#FFFFFF",
  },

  continueButton: {
    width: "100%",
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: "#243447",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    shadowColor: "#243447",
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  continueButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});