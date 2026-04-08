import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 32,
  },

  container: {
    width: "100%",
    maxWidth: 920,
    alignSelf: "center",
    gap: 22,
  },

  heroCard: {
    width: "100%",
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 18,
    backgroundColor: "#F7FAFF",
    borderWidth: 1,
    borderColor: "#E5EEFF",
    shadowColor: "#AFC6F9",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  heroHeader: {
    alignItems: "center",
    gap: 14,
  },

  heroAvatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },

  heroAvatarText: {
    fontSize: 26,
    color: "#FFFFFF",
    textAlign: "center",
  },

  heroTextBlock: {
    flex: 1,
    gap: 4,
  },

  heroTitle: {
    fontSize: 20,
    color: "#1C274C",
  },

  heroSubtitle: {
    fontSize: 14,
    color: "#6B7890",
    lineHeight: 20,
  },

  cardsList: {
    gap: 18,
  },

  limitCard: {
    width: "100%",
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: "#E8EEF8",
    shadowColor: "#102040",
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  limitTopRow: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
  },

  limitTitleWrap: {
    flex: 1,
    gap: 4,
  },

  limitTitle: {
    fontSize: 19,
    color: "#1F2A44",
  },

  limitMeta: {
    fontSize: 13,
    color: "#7B879C",
  },

  limitIconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
  },

  timePillsRow: {
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 16,
  },

  timePill: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: "#F8FAFD",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },

  timePillLabel: {
    fontSize: 12,
    color: "#7B879C",
    marginBottom: 6,
  },

  timePillValue: {
    fontSize: 18,
    color: "#1F2A44",
    textAlign: "left",
  },

  timePillValueRtl: {
    textAlign: "right",
  },

  progressMetaRow: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  progressMetaRowRtl: {
    flexDirection: "row-reverse",
  },

  progressMetaText: {
    fontSize: 13,
    color: "#6E7A90",
  },

  progressMetaValue: {
    fontSize: 14,
    color: "#3D6BF2",
  },

  progressTrack: {
    width: "100%",
    height: 12,
    borderRadius: 999,
    backgroundColor: "#E8EEF8",
    overflow: "hidden",
    marginBottom: 14,
    position: "relative",
  },

  progressFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    borderRadius: 999,
    backgroundColor: "#3D6BF2",
  },

  progressFillLtr: {
    left: 0,
  },

  progressFillRtl: {
    right: 0,
  },

  summaryText: {
    fontSize: 15,
    color: "#53627C",
    marginBottom: 18,
    lineHeight: 22,
  },

  actionsRow: {
    gap: 12,
  },

  statusChip: {
    alignSelf: "flex-start",
    minHeight: 34,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  statusChipNormal: {
    backgroundColor: "#EAF8F2",
  },

  statusChipReached: {
    backgroundColor: "#FEE2E2",
  },

  statusChipTextReached: {
    color: "#DC2626",
  },
  statusChipWarning: {
    backgroundColor: "#FFF4E5",
  },

  statusChipText: {
    fontSize: 12,
  },

  statusChipTextNormal: {
    color: "#1C8C5E",
  },

  statusChipTextWarning: {
    color: "#C67A18",
  },

  editButtonWrap: {
    width: "100%",
  },

  editButton: {
    alignSelf: "stretch",
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: "#3D6BF2",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
    shadowColor: "#3D6BF2",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  editButtonPressed: {
    opacity: 0.85,
  },

  editButtonText: {
    fontSize: 17,
    color: "#FFFFFF",
    textAlign: "center",
  },

  editorWrap: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#F8FAFF",
    borderWidth: 1,
    borderColor: "#E6EEFF",
    padding: 14,
    gap: 12,
  },

  editorHeaderRow: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  editorTitle: {
    fontSize: 15,
    color: "#1F2A44",
  },

  doneButton: {
    minHeight: 34,
    borderRadius: 999,
    backgroundColor: "#EAF1FF",
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  doneButtonPressed: {
    opacity: 0.8,
  },

  doneButtonText: {
    fontSize: 13,
    color: "#3D6BF2",
  },

  editorControlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  editorControlsRowRtl: {
    flexDirection: "row-reverse",
  },

  stepButton: {
    minWidth: 76,
    minHeight: 48,
    borderRadius: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  stepButtonPrimary: {
    backgroundColor: "#3D6BF2",
  },

  stepButtonSecondary: {
    backgroundColor: "#EEF3FB",
    borderWidth: 1,
    borderColor: "#D9E4F6",
  },

  stepButtonPressed: {
    opacity: 0.85,
  },

  stepButtonDisabled: {
    opacity: 0.55,
  },

  stepButtonTextPrimary: {
    fontSize: 15,
    color: "#FFFFFF",
  },

  stepButtonTextSecondary: {
    fontSize: 15,
    color: "#1F2A44",
  },

  stepButtonTextDisabled: {
    color: "#A8B3C7",
  },

  currentValueBox: {
    flex: 1,
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8EEF8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  currentValueLabel: {
    fontSize: 11,
    color: "#7B879C",
    marginBottom: 3,
  },

  currentValueText: {
    fontSize: 18,
    color: "#1F2A44",
    textAlign: "center",
  },
  emptyState: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
    gap: 8,
  },

  emptyTitle: {
    fontSize: 16,
    color: "#1F2A44",
    textAlign: "center",
  },

  editorHint: {
    fontSize: 13,
    color: "#6B7890",
    lineHeight: 19,
  },

  emptySubtitle: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 18,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },

  switchTextWrap: {
    flex: 1,
  },

  switchHint: {
    fontSize: 13,
    color: "#6B7890",
    lineHeight: 18,
    marginTop: 4,
  },

  saveButtonStrong: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: "#2563EB",
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  saveButtonStrongPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  saveButtonStrongText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});