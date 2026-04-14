import { StyleSheet } from "react-native";
import { APP_COLORS, COLORS, SIZES } from "../../../../constants/theme";

const SPACING_XS = 8;
const SPACING_SM = 12;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
    backgroundColor: APP_COLORS.beige,
  },

  heroBlock: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  homeImg: {
    width: SIZES.width * 0.8,
    height: SIZES.width * 0.8,
    marginBottom: 10,
  },

  title: {
    fontSize: 30,
    lineHeight: 36,
    color: COLORS.light.text,
    textAlign: "center",
    letterSpacing: 0.3,
  },


subtitle: {
  marginTop: 8,
  fontSize: 16,
  lineHeight: 24,
  color: "#4B5563",
  textAlign: "center",
  maxWidth: 300,
},

  buttonArea: {
    width: "100%",
    alignItems: "center",
    marginBottom: 64,
  },

  nextButton: {
    width: "100%",
    maxWidth: 320,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: COLORS.light.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  buttonText: {
    fontSize: 16,
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
});