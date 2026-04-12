import React from "react";
import HomeParentScreen from "../../../src/screens/ParentScreens/HomeScreen/HomeScreen";
import { Stack } from "expo-router";

export default function HomeParentRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Home",
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerBackVisible: false,
        }}
      />
      <HomeParentScreen />
    </>
  );
}