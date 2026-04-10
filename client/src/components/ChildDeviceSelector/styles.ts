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
    flexDirection: "row",
  },

  childrenRowCentered: {
    flexGrow: 1,
    justifyContent: "center",
  },

  childCard: {
    minHeight: 110,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 12,
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
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  devicesViewport: {
    marginHorizontal: -4,
  },

  devicesRow: {
    gap: 10,
    paddingHorizontal: 4,
    flexDirection: "row",
  },

  devicesRowCentered: {
    flexGrow: 1,
    justifyContent: "center",
  },

  deviceChip: {
    maxWidth: 200,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E7ECF4",
    alignItems: "center",
    gap: 10,
  },

  deviceChipSelected: {
    borderColor: "#3D6BF2",
    backgroundColor: "#EEF4FF",
  },

  deviceIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  deviceIconWrapSelected: {
    backgroundColor: "#3D6BF2",
  },

  deviceTextWrap: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },

  deviceName: {
    fontSize: 13,
    color: "#111827",
  },

  deviceType: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },

  pressed: {
    opacity: 0.85,
  },
});