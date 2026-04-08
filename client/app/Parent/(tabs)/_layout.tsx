import React from "react";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { COLORS } from "@/constants/theme";

const TAB_ROUTES = new Set([
  "home",
  "children",
  "limits",
  "reports",
  "settings",
]);

export default function ParentTabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={({ route }) => {
        const title =
          route.name === "home"
            ? t("homeParent.title")
            : TAB_ROUTES.has(route.name)
            ? t(`tabs.${route.name}`)
            : undefined;

        return {
          sceneContainerStyle: {
            backgroundColor: COLORS.light.background,
          },
          headerStyle: {
            backgroundColor: COLORS.light.tint,
          },
          title,
          tabBarShowLabel: true,
          tabBarStyle: {
            height: 72,
            paddingTop: 8,
            paddingBottom: 10,
            borderTopWidth: 1,
            borderTopColor: "#E7EFFA",
            backgroundColor: "#FFFFFF",
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarActiveTintColor: COLORS.light.primary,
          tabBarInactiveTintColor: COLORS.light.tabIconDefault,
          headerTitleAlign: "center",
          headerShadowVisible: false,
        };
      }}
    >
      <Tabs.Screen
        name="children"
        options={{
          tabBarLabel: t("tabs.children"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-group-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="limits"
        options={{
          tabBarLabel: t("tabs.limits"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="clock-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: t("tabs.home"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          tabBarLabel: t("tabs.reports"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chart-bar"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: t("tabs.settings"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="cog-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}