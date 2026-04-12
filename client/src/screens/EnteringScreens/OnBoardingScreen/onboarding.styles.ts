import { StyleSheet } from "react-native";
import { COLORS, Fonts, SIZES } from "../../../../constants/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.light.background,
    justifyContent: "space-between",
  },

  slideWrapper: {
    flex: 1,
    width: "100%",
    position: "relative",
  },

  slideScroll: {
    flex: 1,
  },

  slideContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: SIZES.padding,
  },

  linkButton: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: SIZES.padding,
    marginBottom: 15,
    zIndex: 2,
  },

  linkText: {
    fontSize: SIZES.description,
    color: COLORS.light.icon,
    textDecorationLine: "underline",
  },

  iconContainer: {
    backgroundColor: COLORS.light.primary,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 24,
  },

  textContainer: {
    alignItems: "center",
    paddingHorizontal: 30,
  },

  title: {
    fontSize: SIZES.title,
    fontFamily: Fonts.rounded,
    color: COLORS.light.text,
    textAlign: "center",
    marginBottom: 15,
    letterSpacing: 0.5,
  },

  image: {
    width: "100%",
    height: "30%",
    resizeMode: "contain",
    marginTop: SIZES.padding,
  },

  description: {
    fontSize: SIZES.description,
    color: COLORS.light.icon,
    textAlign: "center",
    lineHeight: 26,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.light.tint,
    paddingLeft: 10,
  },

  stepsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.light.icon,
    opacity: 0.3,
    marginHorizontal: 6,
  },

  stepDotActive: {
    width: 24,
    opacity: 1,
    backgroundColor: COLORS.light.tint,
  },

  startButton: {
    marginTop: SIZES.padding * 2,
    paddingHorizontal: SIZES.padding * 1.5,
    paddingVertical: SIZES.padding * 0.75,
    backgroundColor: COLORS.light.tint,
    borderRadius: SIZES.radius,
  },

  startButtonText: {
    color: COLORS.light.text,
    fontSize: SIZES.description,
    fontFamily: Fonts.rounded,
    textAlign: "center",
  },

  footerContainer: {
    height: "20%",
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
});