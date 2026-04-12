import { StyleSheet } from "react-native";

export const ALERT_COLORS = {
  critical: {
    accent: "#EF4444",
    soft: "#FEE2E2",
  },
  warning: {
    accent: "#F59E0B",
    soft: "#FEF3C7",
  },
  info: {
    accent: "#3B82F6",
    soft: "#DBEAFE",
  },
  success: {
    accent: "#10B981",
    soft: "#D1FAE5",
  },
} as const;

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 28,
  },

  container: {
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 16,
  },

  heroCard: {
    width: "100%",
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: 18,
    gap: 16,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },

  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  heroTextWrap: {
    flex: 1,
    gap: 6,
  },

  heroTitle: {
    fontSize: 24,
    color: "#111827",
  },

  heroSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6B7280",
  },

  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
  },

  statCard: {
    flex: 1,
    minHeight: 82,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    gap: 4,
  },

  statValue: {
    fontSize: 22,
    color: "#111827",
  },

  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  sectionHeader: {
    width: "100%",
  },

  listTitleRow: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },

  markAllReadPressable: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },

  markAllReadText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3D5AFE",
  },

  alertListItemWrap: {
    width: "100%",
    marginBottom: 12,
    paddingHorizontal: 10,
  },

  alertCardInner: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },

  alertCardInnerColumn: {
    width: "100%",
    gap: 10,
  },

  alertUnreadDotRow: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  alertCardEndSpacer: {
    flex: 1,
    minWidth: 0,
  },

  alertTrashTrack: {
    width: 38,
    alignItems: "center",
  },

  alertCardMainPressable: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  alertDeleteFooter: {
    padding: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  alertDeleteFooterPressed: {
    backgroundColor: "#FEF2F2",
  },

  alertFooterMetaGroup: {
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    minWidth: 0,
  },

  sectionTitle: {
    fontSize: 16,
    color: "#111827",
  },

  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  filterChip: {
    minHeight: 42,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  filterChipSelected: {
    backgroundColor: "#EEF2FF",
    borderColor: "#C7D2FE",
  },

  filterChipText: {
    fontSize: 13,
    color: "#4B5563",
    textTransform: "capitalize",
  },

  filterChipTextSelected: {
    color: "#3D5AFE",
  },

  listWrap: {
    gap: 12,
  },

  alertCard: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEF2F7",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },

  alertCardRead: {
    opacity: 0.94,
  },

  alertIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  alertTextWrap: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },

  alertHeaderRow: {
    minWidth: 0,
  },

  alertTitle: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: "#0F172A",
    letterSpacing: -0.2,
  },

  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#3B82F6",
  },

  alertDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#64748B",
    marginTop: 2,
  },

  alertFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },

  timeBadge: {
    minHeight: 30,
    borderRadius: 999,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  timeText: {
    fontSize: 12,
    color: "#6B7280",
  },

  severityBadge: {
    minHeight: 30,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  severityText: {
    fontSize: 12,
    letterSpacing: 0.2,
  },

  alertDeleteButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginLeft: 2,
  },

  alertDeleteButtonPressed: {
    backgroundColor: "#F8FAFC",
  },

  emptyState: {
    width: "100%",
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 32,
    gap: 10,
    marginTop: 12,
    marginHorizontal: 10,
  },

  emptyTitle: {
    fontSize: 16,
    color: "#111827",
  },

  emptySubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
    textAlign: "center",
  },

  pressed: {
    opacity: 0.88,
  },
  
  alertAccent: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 5,
  },
});