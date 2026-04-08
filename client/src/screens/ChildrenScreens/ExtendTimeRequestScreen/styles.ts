import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  flex: { flex: 1 },

  /** Outer wrapper: keeps content nice on iPad/Web */
  outer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 16,
  },

  /** Main card-like page container */
  container: {
    width: "100%",
    maxWidth: 520, // ✅ prevents huge stretch on iPad/web
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 14,
  },

  subTitleRow: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 6,
    marginBottom: 6,
  },

  subTitleIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#CFE3FF", // Blue badge
    borderWidth: 1,
    borderColor: "#D6E6FF",
  },

  subTitle: {
    fontSize: 18,
    color: "#2F6DEB",
  },

  question: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 28,
    color: "#1E2A39",
    lineHeight: 34,
  },

  /** 2x2 grid */
  grid: {
    marginTop: 18,
  },

  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 12,
  },

  cardBase: {
    flex: 1,
    maxWidth: 220, // ✅ tile doesn't inflate on iPad/web
    minWidth: 150,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E7EFFA",
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 2 },
      web: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
    }),
    position: "relative",
    overflow: "hidden",
  },

  /** overlay pressable (web-safe nested pressables) */
  cardOverlayPressable: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
  },

  cardPressed: { opacity: 0.86 },

  /** Active state */
  cardActive: {
    transform: [{ scale: 1.01 }],
    borderColor: "#D6E6FF",
  },

  /** Tiles palette (from your procedure) */
  tileBlue: {
    backgroundColor: "#EAF2FF",
    borderColor: "#D6E6FF",
  },
  tilePurple: {
    backgroundColor: "#F3EDFF",
    borderColor: "#E7DBFF",
  },
  tileGreen: {
    backgroundColor: "#E9FFF3",
    borderColor: "#D7F7E8",
  },
  tileOrange: {
    backgroundColor: "#FFF3DD",
    borderColor: "#FFE6BA",
  },

  tileIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7EFFA",
    marginBottom: 10,
  },

  minutesValue: {
    fontSize: 30,
    color: "#1E2A39",
    letterSpacing: 0.2,
  },

  minutesLabel: {
    marginTop: 4,
    fontSize: 13,
    color: "#1E2A39",
    opacity: 0.75,
  },

  /** Custom tile */
  customTopRow: { marginBottom: 6 },

  orangeBadge: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFE1A8",
    borderWidth: 1,
    borderColor: "#FFE6BA",
  },

  customLabel: {
    fontSize: 18,
    color: "#B46B00",
    textAlign: "center",
  },

  customValueRow: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },

  customControlBtn: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFE6BA",
  },

  pressedOpacity: { opacity: 0.7 },

  customValue: {
    fontSize: 34,
    color: "#B46B00",
    minWidth: 40,
    textAlign: "center",
  },

  customUnit: {
    marginTop: 4,
    fontSize: 13,
    color: "#1E2A39",
    opacity: 0.75,
  },

  /** Summary */
  summaryBar: {
    marginTop: 16,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#E9FFF3",
    borderWidth: 1,
    borderColor: "#D7F7E8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  summaryBadge: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C9F5DE",
    borderWidth: 1,
    borderColor: "#D7F7E8",
  },

  summaryText: {
    fontSize: 16,
    color: "#0F5132",
  },

  /** Message */
  messageBlock: { marginTop: 16 },

  messageLabel: {
    fontSize: 13,
    color: "#1E2A39",
    opacity: 0.8,
    marginBottom: 8,
  },

  messageInput: {
    minHeight: 96,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E7EFFA",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1E2A39",
    ...Platform.select({
      web: {
        outlineStyle: "none" as any,
      },
    }),
  },

  /** CTA */
  sendBtn: {
    marginTop: 16,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#16A34A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 8 },
      },
      android: { elevation: 2 },
      web: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 8 },
      },
    }),
  },

  sendBtnPressed: { opacity: 0.9 },

  sendIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  sendBtnText: { fontSize: 18, color: "#FFFFFF" },
});