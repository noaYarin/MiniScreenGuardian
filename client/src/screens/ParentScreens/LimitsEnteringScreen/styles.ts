import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 32,
  },

  container: 
  {
    width: "100%",
    alignSelf: "center",
    gap: 24,
  },

  introCard: {
    width: "100%",
    borderRadius: 24,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  introTitle: {
    fontSize: 22,
    lineHeight: 28,
    color: "#0F172A",
    marginBottom: 6,
  },

  introSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#64748B",
  },

  sectionBlock: {
    gap: 10,
  },

  sectionTitle: {
    fontSize: 15,
    color: "#475569",
    paddingHorizontal: 4,
  },

  groupCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },

  rowButton: {
    width: "100%",
    minHeight: 78,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
  },

  rowPressed: {
    backgroundColor: "#F8FAFC",
  },

  rowContent: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  rowMain: {
    flex: 1,
    alignItems: "center",
    gap: 12,
  },

  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  textWrap: {
    flex: 1,
    gap: 2,
  },

  rowTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: "#0F172A",
  },

  rowTitleDisabled: {
    color: "#94A3B8",
  },

  rowDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: "#64748B",
  },

  rowDescriptionDisabled: {
    color: "#CBD5E1",
  },

  rowEnd: {
    minWidth: 52,
    alignItems: "center",
    justifyContent: "center",
  },

  soonText: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
  },
});