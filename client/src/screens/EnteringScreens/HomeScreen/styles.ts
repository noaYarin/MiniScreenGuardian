import { StyleSheet } from "react-native";
import { APP_COLORS, COLORS, SIZES } from "../../../../constants/theme";

const SPACING_XS = 8;
const SPACING_SM = 12;
const BUTTON_RADIUS = 8;
const BUTTON_PADDING_VERTICAL = 10;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SIZES.padding,
    gap: SPACING_XS,
    backgroundColor: APP_COLORS.beige,
  },
  title: {
    fontSize: SIZES.title,
    marginBottom: SPACING_XS,
    color: COLORS.light.text,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    gap: SPACING_SM,
    marginTop: SPACING_XS,
    alignItems: "center",
  },
  homeImg: {
    width: SIZES.width,
    height: SIZES.width,
    marginBottom: SIZES.padding,
  },
  nextButton: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: BUTTON_PADDING_VERTICAL,
    borderRadius: BUTTON_RADIUS,
    backgroundColor: COLORS.light.tint,
  },
  buttonText: {
    fontSize: SIZES.description,
    color: COLORS.light.text,
  },
});