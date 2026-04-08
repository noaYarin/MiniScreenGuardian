import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";

type Props = TextProps & {
  weight?: "regular" | "medium" | "bold" | "extraBold";
};

export default function AppText({
  style,
  weight = "regular",
  ...props
}: Props) {
  return (
    <Text
      {...props}
      style={[
        styles.base,
        weightStyles[weight],
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: "Heebo_400Regular",
  },
});

const weightStyles = {
  regular: { fontFamily: "Heebo_400Regular" },
  medium: { fontFamily: "Heebo_500Medium" },
  bold: { fontFamily: "Heebo_700Bold" },
  extraBold: { fontFamily: "Heebo_800ExtraBold" },
};
