import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 28,
  },

  container: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 16,
  },

  heroCard: {
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingVertical: 18,
    shadowColor: "#2B4C9B",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },

  heroTopRow: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },

  heroTextWrap: {
    flex: 1,
  },

  heroTitle: {
    fontSize: 24,
    lineHeight: 30,
    color: "#FFFFFF",
    marginBottom: 6,
  },

  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(255,255,255,0.92)",
  },

  heroIconBadge: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E9EEF8",
    shadowColor: "#19325A",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  sectionHeaderRow: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },

  sectionTitleWrap: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 19,
    lineHeight: 25,
    color: "#22324A",
    marginBottom: 4,
  },

  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: "#6E7A90",
  },

  sectionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },

  statsRowTablet: {
    flexWrap: "nowrap",
  },

  statCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: "#F7FAFF",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E7EEF9",
  },

  statLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: "#7A869A",
    marginBottom: 8,
  },

  statValue: {
    fontSize: 24,
    lineHeight: 28,
    color: "#22324A",
  },

  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 14,
  },

  legendItem: {
    alignItems: "center",
    gap: 8,
  },

  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 5,
  },

  legendDotActive: {
    backgroundColor: "#5AA7E5",
  },

  legendDotInactive: {
    backgroundColor: "#F2F5FA",
    borderWidth: 1,
    borderColor: "#D8E1EE",
  },

  legendText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#617086",
  },

  gridShell: {
    backgroundColor: "#F8FAFD",
    borderRadius: 22,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E8EEF7",
  },

  gridHeaderRow: {
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  dayHeaderCell: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: "#64A9E8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },

  dayHeaderText: {
    fontSize: 15,
    lineHeight: 18,
    color: "#FFFFFF",
  },

  timeAxisSpacer: {
    width: 64,
  },

  gridRow: {
    alignItems: "stretch",
    gap: 8,
    marginBottom: 8,
  },

  gridRowTablet: {
    minHeight: 72,
  },

  gridCell: {
    flex: 1,
    minHeight: 58,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },

  gridCellTablet: {
    minHeight: 72,
  },

  gridCellActive: {
    backgroundColor: "#5AA0DA",
    borderWidth: 1,
    borderColor: "#4A92CE",
  },

  gridCellInactive: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4EBF4",
  },

  gridCellInner: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  gridCellText: {
    fontSize: 10,
    lineHeight: 12,
    color: "#FFFFFF",
    textAlign: "center",
  },

  timeAxisCell: {
    width: 64,
    alignItems: "center",
    justifyContent: "center",
  },

  timeAxisText: {
    fontSize: 14,
    lineHeight: 18,
    color: "#66758C",
  },


  presetChipLtr: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  presetChipRtl: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-start",
  },



  presetChipTextWrap: {
    flex: 1,
    minWidth: 0,
  },

  presetChipTextWrapLtr: {
    alignItems: "flex-start",
  },

  presetChipTextWrapRtl: {
    alignItems: "flex-end",
  },


  presetChipTextRtl: {
    textAlign: "right",
  },


  formCard: {
    backgroundColor: "#F8FAFD",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E8EEF7",
    gap: 12,
  },

  inputMock: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6EDF7",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  inlineTwoCols: {
    gap: 12,
  },

  inlineTwoColsTablet: {
    flexDirection: "row",
  },

  inputLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: "#7C889A",
    marginBottom: 6,
  },

  inputValue: {
    fontSize: 15,
    lineHeight: 20,
    color: "#24364E",
  },

  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EEF4FF",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  infoBannerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: "#466287",
  },

  primaryButton: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: "#58A8EA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 18,
    shadowColor: "#3E89CB",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  primaryButtonText: {
    fontSize: 17,
    lineHeight: 20,
    color: "#FFFFFF",
  },


  presetsScrollContent: {
  gap: 10,
  paddingVertical: 2,
},

presetsScrollContentLtr: {
  flexDirection: "row",
},

presetsScrollContentRtl: {
  flexDirection: "row-reverse",
},

presetChip: {
  minWidth: 185,
  backgroundColor: "#F7FAFF",
  borderWidth: 1,
  borderColor: "#E4ECF8",
  borderRadius: 16,
  paddingHorizontal: 12,
  paddingVertical: 12,
  alignItems: "center",
  gap: 10,
},

presetChipSelected: {
  backgroundColor: "#EEF4FF",
  borderColor: "#BFD6FF",
},

presetIconWrap: {
  width: 34,
  height: 34,
  borderRadius: 12,
  backgroundColor: "#EAF1FF",
  alignItems: "center",
  justifyContent: "center",
},

presetIconWrapSelected: {
  backgroundColor: "#3D6BF2",
},

presetTextWrap: {
  flex: 1,
},

presetChipText: {
  fontSize: 13,
  lineHeight: 18,
  color: "#5F6E84",
},


 presetChipTextSelected: {
    color: "#355FEA",
  },

  pressed: {
    opacity: 0.72,
  },
});