import React from "react";
import { Stack } from "expo-router";
import LinkDeviceScreen from "@/src/screens/ParentScreens/LinkDeviceScreen/LinkDeviceScreen";

export default function LinkDeviceRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerShadowVisible: false,
          title: "Link Device",
        }}
      />
      <LinkDeviceScreen />
    </>
  );
}