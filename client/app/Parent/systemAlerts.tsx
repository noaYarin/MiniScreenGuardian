import React from "react";
import { Stack } from "expo-router";

import SystemAlertsScreen from "@/src/screens/ParentScreens/SystemAlertsScreen/SystemAlertsScreen";

export default function SystemAlertsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Notifications",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <SystemAlertsScreen />
    </>
  );
}