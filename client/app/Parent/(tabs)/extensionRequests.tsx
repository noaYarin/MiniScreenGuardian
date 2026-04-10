import React from "react";
import { Stack } from "expo-router";
import ExtensionRequestsScreen from "@/src/screens/ParentScreens/ExtensionRequestsScreen/ExtensionRequestsScreen";

export default function ExtensionRequestsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Extension Requests",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <ExtensionRequestsScreen />
    </>
  );
}