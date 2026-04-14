import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  container: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 18,
  },

  heroCard: {
    borderRadius: 28,
    padding: 18,
    backgroundColor: "#F8FAFF",
    borderWidth: 1,
    borderColor: "#E5ECFF",
    shadowColor: "#1E3A8A",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
    gap: 18,
  },

  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },

  heroTitleBlock: {
    flex: 1,
    gap: 6,
  },

  heroTitle: {
    fontSize: 28,
    color: "#111827",
  },

  heroSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
  },

  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
  },

  summaryGrid: {
    gap: 10,
  },

  summaryGridTablet: {
    flexDirection: "row",
  },

  summaryCard: {
    flex: 1,
    minHeight: 88,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEF2FF",
    justifyContent: "center",
    gap: 6,
  },

  summaryLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  summaryValue: {
    fontSize: 24,
    color: "#111827",
  },

  selectorSection: {
    gap: 12,
  },

  filtersSection: {
    gap: 12,
  },

  sectionTitle: {
    fontSize: 18,
    color: "#111827",
  },

  filtersRow: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  filterChip: {
    minHeight: 42,
    borderRadius: 999,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  filterChipActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#C7D2FE",
  },

  filterChipText: {
    fontSize: 14,
    color: "#4B5563",
  },

  filterChipTextActive: {
    color: "#4338CA",
  },

  listSection: {
    gap: 14,
  },

  listHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },

  resultCount: {
    fontSize: 13,
    color: "#6B7280",
  },

  activityCard: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#111827",
    shadowOpacity: 0.04,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },

  activityTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  activityMainContent: {
    flex: 1,
  },

  activityTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  activityTitleRowSpacing: {
    gap: 12,
  },

  activityIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  activityTextWrap: {
    flex: 1,
    gap: 4,
  },

  activityTitle: {
    fontSize: 18,
    color: "#111827",
  },

  activityDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 21,
  },

  timeWrap: {
    minWidth: 58,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  timeText: {
    fontSize: 15,
    color: "#9CA3AF",
  },

  emptyState: {
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 28,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    gap: 12,
  },

  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    fontSize: 18,
    color: "#111827",
  },

  emptySubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
    textAlign: "center",
  },

  pressed: {
    opacity: 0.82,
  },
  
});