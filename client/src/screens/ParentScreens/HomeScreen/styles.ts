import { StyleSheet } from "react-native";
import { APP_COLORS, COLORS } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.light.background,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  content: {
    flex: 1,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },

  mainScroll: {
    flex: 1,
  },

  mainScrollContent: {
    flexGrow: 1,
    paddingBottom: 8,
  },
  header: {
    position: "relative",
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    paddingBottom: 6,
  },

  headerMenuLeft: {
    position: "absolute",
    left: 0,
    top: 8,
  },

  headerBellRight: {
    position: "absolute",
    right: 0,
    top: 8,
  },

  headerLeftActions: {
    position: "absolute",
    left: 0,
    top: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  headerMenuButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },

  headerMenuButtonPressed: {
    opacity: 0.72,
  },

  bellWrap: {
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "visible",
  },
  bellBadge: {
    position: "absolute",
    top: -8,
    right: -11,
    width: 28,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.light.background,
  },

  bellBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    includeFontPadding: false,
  },

  bigHello: {
    fontSize: 28,
    lineHeight: 34,
    color: "#0F172A",
    marginTop: 8,
    textAlign: "center",
  },

  overviewLink: {
    marginTop: 10,
    fontSize: 14,
    color: APP_COLORS.primaryBlue,
  },

  overviewLinkLtr: {
    alignSelf: "flex-start",
  },

  overviewLinkRtl: {
    alignSelf: "flex-end",
  },

  summaryCard: {
    marginTop: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E7EFFA",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  summaryChip: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },

  summaryChipText: {
    fontSize: 16,
    color: "#1D4ED8",
  },

  summaryTextWrap: {
    flex: 1,
    justifyContent: "center",
  },

  sectionTitle: {
    fontSize: 16,
    color: "#0F172A",
  },

  sectionSub: {
    marginTop: 4,
    fontSize: 13,
    color: "#334155",
    opacity: 0.75,
  },

  loaderWrap: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyState: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 20,
  },

  emptyStateCard: {
    marginTop: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E7EFFA",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  emptyIconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    fontSize: 18,
    color: "#0F172A",
    textAlign: "center",
  },

  emptySubtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },

  emptyButton: {
    marginTop: 6,
  },

  cardsWrap: {
    width: "100%",
    marginTop: 16,
    gap: 14,
  },

  card: {
    width: "100%",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E7EFFA",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  cardPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.995 }],
  },

  cardInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#F1F5F9",
    flexShrink: 0,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarGood: {
    backgroundColor: "#ECFDF5",
  },

  avatarWarn: {
    backgroundColor: "#FFFBEB",
  },

  avatarBad: {
    backgroundColor: "#FEF2F2",
  },

  cardCenter: {
    flex: 1,
    justifyContent: "center",
  },

  childName: {
    fontSize: 17,
    lineHeight: 22,
    color: "#0F172A",
  },

  childSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748B",
  },

  cardEdge: {
    minWidth: 86,
    alignItems: "flex-end",
    justifyContent: "center",
    flexShrink: 0,
  },

  cardEdgeLtr: {
    alignItems: "flex-end",
  },

  cardEdgeRtl: {
    alignItems: "flex-start",
  },

  timeMain: {
    fontSize: 18,
    lineHeight: 22,
    color: "#0F172A",
    textAlign: "right",
  },

  timeSub: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748B",
    textAlign: "right",
  },

  timeGood: {
    color: "#047857",
  },

  timeWarn: {
    color: "#B45309",
  },

  timeBad: {
    color: "#B91C1C",
  },

  actionsWrap: {
    width: "100%",
    marginTop: 16,
    paddingTop: 8,
    gap: 12,
  },

  btnPrimary: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: APP_COLORS.primaryBlue,
  },

  btnPrimaryText: {
    fontSize: 16,
    color: "#FFFFFF",
  },

  btnSecondary: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#D6E6FF",
  },

  btnSecondaryText: {
    fontSize: 16,
    color: "#1D4ED8",
  },

  buttonPressed: {
    opacity: 0.8,
  },

  bottomSpacer: {
    height: 18,
  },
});