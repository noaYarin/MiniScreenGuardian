import { StyleSheet } from "react-native";
import { COLORS, Fonts, SIZES } from "../../../../constants/theme";

const AVATAR_SIZE = 220;

export const roleCardStyles = StyleSheet.create({
  card: {
    alignItems: "center",
    borderRadius: 10,
    width: "100%",
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },

  imageContainer: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  image: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    resizeMode: "contain",
  },

  title: {
    fontSize: SIZES.subTitle,
    fontWeight: "700",
    color: COLORS.light.text,
    fontFamily: Fonts.rounded,
    textAlign: "center",
    marginTop: SIZES.padding / 2,
  },

  description: {
    fontSize: SIZES.description,
    color: COLORS.light.text,
    fontFamily: Fonts.rounded,
    textAlign: "center",
    marginTop: 6,
  },
});