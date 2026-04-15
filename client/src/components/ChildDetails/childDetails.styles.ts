import { StyleSheet } from "react-native";
import { APP_COLORS, COLORS } from "@/constants/theme";

export const childDetailsIconColors = {
  deleteTrash: "#ffffff",
  detailAccent: APP_COLORS.primaryBlue,
} as const;

export const childDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: COLORS.light.background,
    alignItems: "stretch",
  },

  scrollRoot: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.light.background,
  },

  scrollContent: {
    flexGrow: 1,
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    alignItems: "stretch",
    backgroundColor: COLORS.light.background,
  },

  content: {
    width: "100%",
    alignSelf: "center",
  },

  childrenStrip: {
    marginBottom: 14,
    maxHeight: 44,
  },

  childrenStripContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },

  childChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  childChipSelected: {
    backgroundColor: "#DBEAFE",
    borderColor: "#2563EB",
  },

  childChipPressed: {
    opacity: 0.85,
  },

  childChipText: {
    fontSize: 14,
    color: "#475569",
  },

  childChipTextSelected: {
    color: "#1D4ED8",
  },

  headerIconButton: {
    padding: 8,
  },

  headerIconButtonPressed: {
    opacity: 0.65,
  },

  profileCard: {
    width: "100%",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E7EFFA",
    backgroundColor: "#FFFFFF",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },

  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatarColumn: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  childProfileButton: {
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },

  childProfileButtonPressed: {
    opacity: 0.8,
  },

  childProfileButtonText: {
    fontSize: 13,
    color: "#1D4ED8",
  },

  profileTextWrap: {
    flex: 1,
  },

  childName: {
    fontSize: 24,
    lineHeight: 30,
    color: "#0F172A",
  },

  childMeta: {
    marginTop: 6,
    fontSize: 14,
    color: "#475569",
  },

  sectionHeader: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  devicesToggleButton: {
    flex: 1,
    minHeight: 44,
    justifyContent: "center",
  },

  devicesToggleButtonPressed: {
    opacity: 0.75,
  },

  devicesToggleInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  sectionTitle: {
    fontSize: 20,
    color: "#0F172A",
  },

  addDeviceButton: {
    borderRadius: 14,
    backgroundColor: APP_COLORS.primaryBlue,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },

  addDeviceButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
  },

  devicesList: {
    marginTop: 14,
    gap: 14,
  },

  deviceCard: {
    width: "100%",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E7EFFA",
    backgroundColor: "#FFFFFF",
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },

  deviceHeaderRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },

  deviceMainInfo: {
    flex: 1,
    minWidth: 0,
  },

  deviceName: {
    fontSize: 18,
    color: "#1F2937",
  },

  deviceStatusRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  deviceStatusText: {
    fontSize: 14,
    color: "#475569",
  },

  deviceInfoStrip: {
    marginTop: 12,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",

    paddingVertical: 14,
    alignItems: "stretch",
  },

  deviceDetailRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    paddingVertical: 12,
  },

  deviceDetailIconColumn: {
    width: 28,
    alignItems: "center",
    paddingTop: 4,
  },

  deviceDetailTextColumn: {
    flex: 1,
    minWidth: 0,
  },

  deviceDetailLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: "#64748B",
    letterSpacing: 0.15,
    marginBottom: 8,
  },

  deviceDetailValue: {
    fontSize: 15,
    lineHeight: 22,
    color: "#111827",
  },

  deviceDetailNameInput: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
    minHeight: 24,
  },

  deviceDetailRowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 2,
    alignSelf: "stretch",
  },
  deviceLockActionButton: {

    marginTop: 8,
    direction: "ltr",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  deviceLockActionButtonRed: {
    backgroundColor: "#E45454",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    shadowColor: "#E45454",
  },

  deviceLockActionButtonGreen: {
    backgroundColor: "#16A34A",
    borderWidth: 1,
    borderColor: "#16A34A",
  },

  deviceLockActionTextRed: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },

  deviceLockActionTextGreen: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },

  deviceLockActionButtonLimit: {
    backgroundColor: "#FFF7ED",
    borderWidth: 1.5,
    borderColor: "#FDBA74",
  },

  deviceLockActionTextLimit: {
    fontSize: 15,
    color: "#C2410C",
  },

  infoMiniRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  infoMiniText: {
    fontSize: 14,
    color: "#374151",
  },

  deleteButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E45454",
    borderWidth: 1,
    borderColor: "#E45454",
  },

  bottomSpacer: {
    height: 20,
  },

  reduxSyncRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
    paddingVertical: 4,
  },

  reduxErrorBox: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
  },

  reduxRetryPressable: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },

  reduxRetryText: {
    fontSize: 15,
    fontWeight: "600",
    color: APP_COLORS.primaryBlue,
  },

  loadingHint: {
    marginTop: 14,
    textAlign: "center",
    fontSize: 15,
    color: "#6B7280",
  },
});