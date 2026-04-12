import React from "react";
import { Stack } from "expo-router";

import SystemAlertsScreen from "@/src/screens/ParentScreens/SystemAlertsScreen/SystemAlertsScreen";

export default function SystemAlertsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "System Alerts",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <SystemAlertsScreen />
    </>
  );
}