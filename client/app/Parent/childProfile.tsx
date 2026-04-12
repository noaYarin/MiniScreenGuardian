import React from "react";
import { Stack } from "expo-router";

import ChildProfileScreen from "@/src/screens/ParentScreens/ChildProfileScreen/ChildProfileScreen";

export default function ChildProfileRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Child Profile",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <ChildProfileScreen />
    </>
  );
}