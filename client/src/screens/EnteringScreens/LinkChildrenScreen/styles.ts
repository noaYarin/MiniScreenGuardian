import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },

  card: {
    width: "100%",
    alignSelf: "center",
    borderRadius: 26,
    padding: 18,
    backgroundColor: "#DCEBFF",
    minHeight: 700,
    },

  segmentWrap: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  segmentBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  segmentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  segmentActive: {
    backgroundColor: "#0B4DFF",
  },
  segmentInactive: {
    backgroundColor: "transparent",
  },

  segmentText: {
    fontSize: 16,
  },
  segmentTextActive: {
    color: "#FFFFFF",
  },
  segmentTextInactive: {
    color: "#4B5563",
  },

  iconCircle: {
    alignSelf: "center",
    marginTop: 18,
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#9FD0FF",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 24,
    color: "#0F172A",
  },

  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#334155",
    marginBottom: 10,
  },

  qrCard: {
    marginTop: 18,
    width: "100%",
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  qrBox: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 18,
    backgroundColor: "#9FD0FF",
    borderWidth: 4,
    borderColor: "#1E3A8A",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  qrIconOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  cameraView: {
    flex: 1,
    width: "100%",
  },

  cameraFallback: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  codeArea: {
    marginTop: 18,
    minHeight: 300,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  inputWrap: {
    width: "100%",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    marginTop: 20,
  },

  input: {
    fontSize: 16,
    color: "#0F172A",
    textAlign: "center",
  },

  primaryBtn: {
    marginTop: 14,
    width: "100%",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B4DFF",
  },

  primaryBtnDisabled: {
    backgroundColor: "#93B4FF",
  },

  primaryBtnText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});