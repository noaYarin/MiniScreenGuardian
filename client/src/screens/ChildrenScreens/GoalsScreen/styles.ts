import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  page: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  inner: {
    width: "100%",
  },

  // --- Header card ---
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7EFFA",
    padding: 16,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,

    marginBottom: 12,
  },

  headerTop: {
    width: "100%",
    alignItems: "center",
  },

  headerIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,

    backgroundColor: "#CFE3FF",
    borderWidth: 1,
    borderColor: "#D6E6FF",

    alignItems: "center",
    justifyContent: "center",
    marginEnd: 10,
  },

  headerTextWrap: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 26,
    lineHeight: 30,
    color: "#0F172A",
  },

  headerSubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 18,
    color: "#64748B",
  },

  // --- Progress card ---
  progressCard: {
    backgroundColor: "#EAF2FF", // Blue tile bg
    borderWidth: 1,
    borderColor: "#D6E6FF",
    padding: 16,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,

    marginBottom: 14,
  },

  progressTopRow: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  progressLabel: {
    fontSize: 16,
    color: "#0F172A",
  },

  progressBadge: {
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#CFE3FF",
    borderWidth: 1,
    borderColor: "#D6E6FF",
  },

  progressPercent: {
    fontSize: 16,
    color: "#2F6DEB",
    lineHeight: 18,
  },

  progressBarBackground: {
    height: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D6E6FF",
    position: "relative",
  },

  progressBarFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    backgroundColor: "#3B82F6", // primaryBlue
    borderRadius: 10,
  },

  progressHint: {
    marginTop: 10,
    fontSize: 13,
    color: "#475569",
    opacity: 0.9,
  },

  // --- Goals list ---
  list: {
    gap: 12,
  },

  goalCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7EFFA",
    padding: 14,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  goalCardDisabled: {
    backgroundColor: "#F8FAFC",
  },

  goalRow: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  goalTextWrap: {
    flex: 1,
  },

  goalTitle: {
    fontSize: 16,
    lineHeight: 20,
    color: "#0F172A",
  },

  textMuted: {
    color: "#334155",
    opacity: 0.85,
  },

  daysRow: {
    marginTop: 10,
    alignItems: "center",
  },

  daysPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,

    backgroundColor: "#FFF3DD", // Beige tile bg
    borderWidth: 1,
    borderColor: "#FFE6BA",
  },

  daysPillDisabled: {
    backgroundColor: "#EEF2F7",
    borderColor: "#E2E8F0",
  },

  daysText: {
    fontSize: 13,
    color: "#334155",
  },

  statusIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  statusDone: {
    backgroundColor: "#E9FFF3", // Green tile bg
    borderColor: "#D7F7E8",
  },

  statusTodo: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },

  bottomSpacer: {
    height: Platform.OS === "web" ? 24 : 18,
  },
});