import React from "react";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

const TAB_LABELS: Record<string, string> = {
  home: "Home",
  children: "Children",
  limits: "Limits",
  extensionRequests: "Requests",
  settings: "Settings",
};

export default function ParentTabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => {
        const title = TAB_LABELS[route.name];

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
          tabBarLabel: "Children",
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
          tabBarLabel: "Limits",
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
          tabBarLabel: "Home",
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
        name="extensionRequests"
        options={{
          tabBarLabel: "Requests",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="clock-check-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
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