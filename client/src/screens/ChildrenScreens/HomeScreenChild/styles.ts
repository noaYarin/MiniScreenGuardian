import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 28,
  },

  container: {
    width: "100%",
    alignSelf: "center",
    flex: 1,
  },

  heroSurface: {
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

  heroBackgroundAccentTop: {
    position: "absolute",
    top: -70,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: "#EAF2FF",
  },

  heroBackgroundAccentBottom: {
    position: "absolute",
    bottom: -80,
    left: -55,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: "#F5F9FF",
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  avatarShell: {
    width: 82,
    height: 82,
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#CFE3FF",
    backgroundColor: "#EAF2FF",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2F6DEB",
  },

  avatarLetter: {
    fontSize: 32,
    lineHeight: 34,
    color: "#FFFFFF",
    includeFontPadding: false,
    textAlign: "center",
  },

  nameBlock: {
    flex: 1,
    minWidth: 0,
    marginLeft: 14,
  },

  kicker: {
    fontSize: 13,
    lineHeight: 18,
    color: "#64748B",
    includeFontPadding: false,
    marginBottom: 4,
  },

  name: {
    fontSize: 28,
    lineHeight: 32,
    color: "#0F172A",
    includeFontPadding: false,
  },

  timePanel: {
    width: "100%",
    borderRadius: 26,
    backgroundColor: "#F8FBFF",
    borderWidth: 1,
    borderColor: "#D6E6FF",
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 18,
  },

  timePanelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  timeIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF2FF",
    borderWidth: 1,
    borderColor: "#CFE3FF",
    marginRight: 10,
  },

  timeLabel: {
    fontSize: 16,
    lineHeight: 20,
    color: "#0F172A",
    includeFontPadding: false,
  },

  timeValue: {
    color: "#0F172A",
    textAlign: "center",
    includeFontPadding: false,
    writingDirection: "ltr",
  },

  progressBar: {
    marginTop: 16,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#DCE9FF",
  },

  secondaryLink: {
    alignSelf: "center",
    marginTop: 14,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },

  secondaryLinkText: {
    fontSize: 14,
    lineHeight: 18,
    color: "#2F6DEB",
    includeFontPadding: false,
  },


});