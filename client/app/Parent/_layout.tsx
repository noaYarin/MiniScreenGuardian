import React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { HeaderBackButton } from "@react-navigation/elements";
import { useTranslation } from "react-i18next";
import { COLORS } from "@/constants/theme";

export default function ParentRootLayout() {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language?.startsWith("he") ?? false;

  return (
    <Stack
      screenOptions={({ navigation }) => ({
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerBackButtonDisplayMode: "minimal",
        contentStyle: {
          backgroundColor: COLORS.light.background,
        },
        headerStyle: {
          backgroundColor: COLORS.light.tint,
        },

        ...(isRTL
          ? {
              headerBackVisible: false,
              headerLeft: () => null,
              headerRight: (props) =>
                navigation.canGoBack() ? (
                  <View style={{ transform: [{ scaleX: -1 }] }}>
                    <HeaderBackButton {...props} onPress={navigation.goBack} />
                  </View>
                ) : null,
            }
          : {
              headerBackVisible: true,
            }),
      })}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="addChild"
        options={{
          title: isRTL ? "הוספת ילד" : "Add Child",
        }}
      />

      <Stack.Screen
        name="childDetails"
        options={{
          title: t("childDetails.title"),
        }}
      />

      <Stack.Screen
        name="childProfile"
        options={{
          title: isRTL ? "פרופיל של הילד/ה" : "Child Profile",
        }}
      />

      <Stack.Screen
        name="homeMenu"
        options={{
          title: t("homeMenu.title"),
        }}
      />
    </Stack>
  );
}