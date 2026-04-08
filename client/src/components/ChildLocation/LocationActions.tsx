import React from "react";
import { Pressable, View, ActivityIndicator, type ViewStyle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "../AppText/AppText";
import { styles } from "../../screens/ParentScreens/ChildLocationScreen/styles";

type Props = {
  row: ViewStyle;
  refreshA11y: string;
  refreshButtonText: string;
  navigateA11y: string;
  navigateButtonText: string;
  onRefreshLocation: () => void;
  onNavigateToLocation: () => void;
  isLoading?: boolean;
};

export default function LocationActions({
  row,
  refreshA11y,
  refreshButtonText,
  navigateA11y,
  navigateButtonText,
  onRefreshLocation,
  onNavigateToLocation,
  isLoading = false,
}: Props) {
  return (
    <View style={styles.actionsWrap}>
      <Pressable
        onPress={onRefreshLocation}
        disabled={isLoading}
        accessibilityRole="button"
        accessibilityLabel={refreshA11y}
        style={({ pressed }) => [
          styles.primaryButton,
          (pressed || isLoading) && styles.buttonPressed,
          isLoading && { opacity: 0.8 }
        ]}
      >
        <View style={[styles.buttonContent, row]}>
          {isLoading ? <ActivityIndicator color="#FFF" size="small" style={{ marginRight: 8 }} /> : 
          <MaterialCommunityIcons name="refresh" size={22} color="#FFF" />}
          <AppText weight="bold" style={styles.primaryButtonText}>
            {refreshButtonText}
          </AppText>
        </View>
      </Pressable>

      <Pressable
        onPress={onNavigateToLocation}
        accessibilityRole="button"
        accessibilityLabel={navigateA11y}
        style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
      >
        <View style={[styles.buttonContent, row]}>
          <MaterialCommunityIcons name="navigation-variant-outline" size={22} color="#2A63E8" />
          <AppText weight="bold" style={styles.secondaryButtonText}>
            {navigateButtonText}
          </AppText>
        </View>
      </Pressable>
    </View>
  );
}