import React from "react";
import { Stack } from "expo-router";

import ChildDetailsScreen from "@/src/screens/ParentScreens/ChildDetailsScreen/ChildDetailsScreen";

export default function ChildDetailsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Child Details",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <ChildDetailsScreen />
    </>
  );
}