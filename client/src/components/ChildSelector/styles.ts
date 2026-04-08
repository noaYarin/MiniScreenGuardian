import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    gap: 20,
      marginBottom: 16,

  },

  section: {
    gap: 12,
  },

  sectionTitle: {
    fontSize: 16,
    color: "#1F2937",
  },

  childrenViewport: {
    marginHorizontal: -4,
  },

  childrenRow: {
    gap: 10,
    paddingHorizontal: 4,
  },

  childrenRowLtr: {
    flexDirection: "row",
  },

  childrenRowRtl: {
    flexDirection: "row-reverse",
  },

  childCard: {
    minHeight: 110, 
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E7ECF4",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },

  childCardSelected: {
    borderWidth: 1.8,
    shadowOpacity: 0.12,
    elevation: 4,
  },

  childAvatarWrap: {
    marginBottom: 8,
  },

  childAvatarWrapSelected: {
    transform: [{ scale: 1.02 }],
  },

  childAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  childAvatarImage: {
    width: "100%",
    height: "100%",
  },

  childAvatarText: {
    fontSize: 18,
    color: "#FFFFFF",
  },

  childName: {
    width: "100%",
    textAlign: "center",
    fontSize: 14,
    color: "#111827",
    marginTop: 2,
  },

  childSubtitle: {
    width: "100%",
    textAlign: "center",
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },

  selectedBadge: {
    position: "absolute",
    top: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  selectedBadgeLtr: {
    right: 10,
  },

  selectedBadgeRtl: {
    left: 10,
  },

  pressed: {
    opacity: 0.85,
  },



childrenRowCentered: {
  justifyContent: "center",
  flexGrow: 1,
},



});