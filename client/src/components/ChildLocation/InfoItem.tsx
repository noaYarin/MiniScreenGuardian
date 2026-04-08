import React from "react";
import { View, type TextStyle, type ViewStyle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "../AppText/AppText";
import { styles } from "../../screens/ParentScreens/ChildLocationScreen/styles";

type Props = {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  iconColor: string;
  label: string;
  value: string;
  hint?: string;
  row: ViewStyle;
  text: TextStyle;
};

export default function InfoItem({
  iconName,
  iconColor,
  label,
  value,
  hint,
  row,
  text,
}: Props) {
  return (
    <View style={styles.infoItem}>
      <View style={[styles.infoLabelRow, row]}>
        <MaterialCommunityIcons name={iconName} size={16} color={iconColor} />
        <AppText weight="medium" style={[styles.infoLabel, text]}>
          {label}
        </AppText>
      </View>

      <AppText weight="bold" style={[styles.infoValue, text]}>
        {value}
      </AppText>

      {hint ? (
        <AppText weight="regular" style={[styles.infoHint, text]}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}
