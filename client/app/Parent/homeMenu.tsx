import React from "react";
import { Stack } from "expo-router";

import HomeMenuScreen from "@/src/screens/ParentScreens/HomeMenuScreen/HomeMenuScreen";

export default function HomeMenuRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Menu",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <HomeMenuScreen />
    </>
  );
}