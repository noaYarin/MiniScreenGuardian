import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "../AppText/AppText";
import { styles } from "../../screens/ParentScreens/ChildLocationScreen/styles";

type Props = {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  iconColor: string;
  label: string;
  value: string;
  hint?: string;
};

export default function InfoItem({
  iconName,
  iconColor,
  label,
  value,
  hint,
}: Props) {
  return (
    <View style={styles.infoItem}>
      <View style={styles.infoLabelRow}>
        <MaterialCommunityIcons name={iconName} size={16} color={iconColor} />

        <AppText weight="medium" style={styles.infoLabel}>
          {label}
        </AppText>
      </View>

      <AppText weight="bold" style={styles.infoValue}>
        {value}
      </AppText>

      {hint ? (
        <AppText weight="regular" style={styles.infoHint}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}