import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },

  outer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },

  heroSurface: {
    width: "100%",
    maxWidth: 560,
    position: "relative",
    overflow: "hidden",
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D6E6FF",
    padding: 18,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
  },

  heroAccentTop: {
    position: "absolute",
    top: -70,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: "#EAF2FF",
  },

  heroAccentBottom: {
    position: "absolute",
    bottom: -90,
    left: -50,
    width: 210,
    height: 210,
    borderRadius: 999,
    backgroundColor: "#F5F9FF",
  },

  headerBlock: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 18,
  },

  subTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 8,
  },

  subTitleIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#CFE3FF",
    borderWidth: 1,
    borderColor: "#D6E6FF",
  },

  subTitle: {
    fontSize: 18,
    color: "#2F6DEB",
    includeFontPadding: false,
  },

  question: {
    textAlign: "center",
    fontSize: 28,
    color: "#0F172A",
    lineHeight: 34,
    includeFontPadding: false,
  },

  helperText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#64748B",
    textAlign: "center",
    includeFontPadding: false,
  },

  grid: {
    marginTop: 4,
  },

  rowTwo: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  customRow: {
    width: "100%",
    alignItems: "center",
  },

  minuteCard: {
    flex: 1,
    minHeight: 124,
    minWidth: 0,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E7EFFA",
    backgroundColor: "#FFFFFF",
    position: "relative",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
    }),
  },

  customCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFE6BA",
    backgroundColor: "#FFF3DD",
    position: "relative",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
    }),
  },

  cardOverlayPressable: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },

  cardPressed: {
    opacity: 0.88,
  },

  cardActive: {
    borderColor: "#2F6DEB",
    borderWidth: 2,
    transform: [{ scale: 1.01 }],
  },

  tileBlue: {
    backgroundColor: "#EAF2FF",
    borderColor: "#D6E6FF",
  },

  tileGreen: {
    backgroundColor: "#E9FFF3",
    borderColor: "#D7F7E8",
  },

  tileIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7EFFA",
    marginBottom: 12,
  },

  minutesValue: {
    fontSize: 28,
    lineHeight: 32,
    color: "#0F172A",
    letterSpacing: 0.2,
    includeFontPadding: false,
  },

  minutesLabel: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 16,
    color: "#1E2A39",
    opacity: 0.75,
    includeFontPadding: false,
  },

  customTopRow: {
    marginBottom: 8,
  },

  orangeBadge: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFE1A8",
    borderWidth: 1,
    borderColor: "#FFE6BA",
  },

  customLabel: {
    fontSize: 18,
    lineHeight: 22,
    color: "#B46B00",
    textAlign: "center",
    includeFontPadding: false,
  },

  customValueRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },

  customControlBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFE6BA",
  },

  pressedOpacity: {
    opacity: 0.7,
  },

  customValue: {
    minWidth: 42,
    fontSize: 34,
    lineHeight: 38,
    color: "#B46B00",
    textAlign: "center",
    includeFontPadding: false,
  },

  customUnit: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 16,
    color: "#1E2A39",
    opacity: 0.75,
    includeFontPadding: false,
  },

  summaryBar: {
    marginTop: 14,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#E9FFF3",
    borderWidth: 1,
    borderColor: "#D7F7E8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  summaryBadge: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C9F5DE",
    borderWidth: 1,
    borderColor: "#D7F7E8",
  },

  summaryText: {
    fontSize: 16,
    lineHeight: 20,
    color: "#0F5132",
    textAlign: "center",
    includeFontPadding: false,
  },

  messageBlock: {
    marginTop: 18,
  },

  messageLabel: {
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 18,
    color: "#1E2A39",
    opacity: 0.82,
    includeFontPadding: false,
  },

  messageInput: {
    backgroundColor: "#FFFFFF",
  },

  messageInputContent: {
    minHeight: 96,
    textAlignVertical: "top",
    paddingTop: 10,
    paddingBottom: 10,
    color: "#1E2A39",
    fontSize: 16,
  },

  messageInputOutline: {
    borderRadius: 18,
    borderWidth: 1,
  },

  sendBtn: {
    marginTop: 18,
    borderRadius: 20,
  },

  sendBtnContent: {
    minHeight: 58,
  },

  sendBtnText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
    color: "#FFFFFF",
  },
  sendBtnDisabled: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },

  sendBtnTextDisabled: {
    color: "#475569",
    fontSize: 14,
  },
});