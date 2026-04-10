import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  container: {
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },

  containerTablet: {
    maxWidth: 920,
  },

  heroCard: {
    width: "100%",
    borderRadius: 28,
    padding: 18,
    overflow: "hidden",
    backgroundColor: "#3C6EF3",
    gap: 16,
    shadowColor: "#2956C8",
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  heroGlowOne: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    top: -50,
    right: -40,
  },

  heroGlowTwo: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: -30,
    left: -30,
  },

  heroHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },

  heroTitleWrap: {
    flex: 1,
    gap: 6,
  },

  heroTitle: {
    fontSize: 26,
    lineHeight: 32,
    color: "#FFFFFF",
  },

  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(255,255,255,0.88)",
  },

  statusPill: {
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },

  statusPillWarn: {
    backgroundColor: "rgba(255,138,101,0.26)",
  },

  statusPillText: {
    fontSize: 13,
    color: "#FFFFFF",
  },

  selectorCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 10,
    shadowColor: "#102A43",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  mapCard: {
    width: "100%",
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    padding: 14,
    shadowColor: "#102A43",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    gap: 12,
  },

  mapTopRow: {
    width: "100%",
    minHeight: 36,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },

  liveBadge: {
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EEF7EF",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  liveDot: {
    width: 9,
    height: 9,
    borderRadius: 99,
    backgroundColor: "#1DB954",
  },

  liveBadgeText: {
    fontSize: 13,
    color: "#167A35",
  },

  cityPill: {
    backgroundColor: "#F3F5F9",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  cityPillText: {
    fontSize: 14,
    color: "#243447",
  },

  mapArea: {
    width: "100%",
    height: 360,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#E9DFD2",
    position: "relative",
  },

  mapBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#E9DFD2",
  },

  mapRoadRoad1: {
    position: "absolute",
    width: 540,
    height: 7,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.88)",
    top: 94,
    left: -90,
    transform: [{ rotate: "-32deg" }],
  },

  mapRoadRoad2: {
    position: "absolute",
    width: 520,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.82)",
    top: 210,
    left: -110,
    transform: [{ rotate: "12deg" }],
  },

  mapRoadRoad3: {
    position: "absolute",
    width: 420,
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.78)",
    top: 30,
    right: -90,
    transform: [{ rotate: "46deg" }],
  },

  mapRoadRoad4: {
    position: "absolute",
    width: 360,
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.8)",
    bottom: 42,
    right: -40,
    transform: [{ rotate: "-18deg" }],
  },

  mapWater: {
    position: "absolute",
    width: 110,
    height: 430,
    backgroundColor: "#9FC6F6",
    top: -20,
    left: "52%",
    borderRadius: 40,
    transform: [{ rotate: "18deg" }],
  },

  mapParkOne: {
    position: "absolute",
    width: 108,
    height: 78,
    backgroundColor: "#B9D89C",
    borderRadius: 18,
    top: 42,
    left: 18,
    transform: [{ rotate: "-12deg" }],
  },

  mapParkTwo: {
    position: "absolute",
    width: 122,
    height: 88,
    backgroundColor: "#B8DBA0",
    borderRadius: 20,
    bottom: 42,
    right: 24,
    transform: [{ rotate: "14deg" }],
  },

  markerWrap: {
    position: "absolute",
    marginLeft: -32,
    marginTop: -32,
    alignItems: "center",
    justifyContent: "center",
  },

  markerHalo: {
    position: "absolute",
    width: 86,
    height: 86,
    borderRadius: 999,
  },

  markerCore: {
    width: 64,
    height: 64,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1A1A1A",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },

  detailsCard: {
    width: "100%",
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: 16,
    gap: 14,
    shadowColor: "#102A43",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  sectionHeader: {
    width: "100%",
  },

  sectionTitle: {
    fontSize: 18,
    lineHeight: 24,
    color: "#243447",
  },

  infoGrid: {
    width: "100%",
    gap: 12,
  },

  infoItem: {
    width: "100%",
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#F7F9FC",
    gap: 6,
  },

  infoLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  infoLabel: {
    fontSize: 14,
    color: "#5B6B7A",
  },

  infoValue: {
    fontSize: 17,
    lineHeight: 24,
    color: "#243447",
  },

  infoHint: {
    fontSize: 13,
    lineHeight: 18,
    color: "#7B8794",
  },

  actionsWrap: {
    width: "100%",
    gap: 12,
  },

  primaryButton: {
    width: "100%",
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: "#4C7CF0",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  secondaryButton: {
    width: "100%",
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: "#EAF1FF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#D6E3FF",
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  primaryButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },

  secondaryButtonText: {
    fontSize: 16,
    color: "#2A63E8",
  },

  emptyState: {
    marginTop: 32,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 28,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    gap: 12,
  },

  emptyTitle: {
    fontSize: 20,
    color: "#243447",
    textAlign: "center",
  },

  emptySubtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#667085",
    textAlign: "center",
  },

  emptyActionButton: {
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: "#4C7CF0",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginTop: 8,
  },

  emptyActionButtonText: {
    fontSize: 15,
    color: "#FFFFFF",
  },

  buttonPressed: {
    opacity: 0.82,
  },
});