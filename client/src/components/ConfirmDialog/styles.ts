import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.45)",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
  title: { fontSize: 18, color: "#0F172A", marginBottom: 8 },
  message: { fontSize: 15, color: "#475569", marginBottom: 20, lineHeight: 22 },
  row: { flexDirection: "row", justifyContent: "flex-end" },
  btnFirst: { marginEnd: 10 },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 88,
    alignItems: "center",
  },
  btnSecondary: { backgroundColor: "#F1F5F9" },
  btnSecondaryText: { color: "#334155", fontSize: 15 },
  btnPrimary: { backgroundColor: "#2563EB" },
  btnDanger: { backgroundColor: "#DC2626" },
  btnPrimaryText: { color: "#FFFFFF", fontSize: 15 },
  pressed: { opacity: 0.85 },
});
