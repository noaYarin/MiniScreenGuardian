import React from "react";
import { Stack } from "expo-router";

import ExtendTimeRequestScreen from "@/src/screens/ChildrenScreens/ExtendTimeRequestScreen/ExtendTimeRequestScreen";

export default function ExtendTimeRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Extension Request",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <ExtendTimeRequestScreen />
    </>
  );
}