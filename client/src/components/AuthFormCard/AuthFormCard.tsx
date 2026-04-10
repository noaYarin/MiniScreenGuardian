import React, { useMemo } from "react";
import { View, Pressable, ActivityIndicator, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "../AppText/AppText";
import { enteringFormStyles as styles } from "./AuthFormCard.styles";

const SIDE_PADDING = 16;
const MAX_CARD_WIDTH = 520;

export type AuthFormCardProps = {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  iconGradientColors: [string, string];
  title: string;
  subtitle: string;
  children: React.ReactNode;
  error: string | null;
  submitLabel: string;
  onSubmit: () => void;
  isLoading: boolean;
  middleContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  submitButtonAccessibilityLabel?: string;
};

export default function AuthFormCard({
  iconName,
  iconGradientColors,
  title,
  subtitle,
  children,
  error,
  submitLabel,
  onSubmit,
  isLoading,
  middleContent,
  bottomContent,
  submitButtonAccessibilityLabel,
}: AuthFormCardProps) {
  const { width } = useWindowDimensions();

  const cardWidth = useMemo(
    () => Math.min(width - SIDE_PADDING * 2, MAX_CARD_WIDTH),
    [width]
  );

  return (
    <View style={styles.container}>
      <View style={[styles.card, { width: cardWidth }]}>
        <View style={styles.iconWrap}>
          <LinearGradient
            colors={iconGradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconBadge}
          >
            <MaterialCommunityIcons name={iconName} size={28} color="#fff" />
          </LinearGradient>
        </View>

        <AppText weight="extraBold" style={styles.title}>
          {title}
        </AppText>

        <AppText style={styles.subtitle}>{subtitle}</AppText>

        {children}

        {error ? (
          <AppText style={styles.errorText} numberOfLines={2}>
            {error}
          </AppText>
        ) : null}

        {middleContent}

        <Pressable
          onPress={onSubmit}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel={submitButtonAccessibilityLabel}
          style={({ pressed }) => [
            styles.primaryBtn,
            isLoading && styles.primaryBtnDisabled,
            { opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <LinearGradient
            colors={["#1D4ED8", "#7C3AED"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryBtnGradient}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <AppText weight="extraBold" style={styles.primaryBtnText}>
                {submitLabel}
              </AppText>
            )}
          </LinearGradient>
        </Pressable>

        {bottomContent}
      </View>
    </View>
  );
}