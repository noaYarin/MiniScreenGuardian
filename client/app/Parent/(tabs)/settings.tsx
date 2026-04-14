import { Stack } from "expo-router";

import SettingsScreen from "@/src/screens/ParentScreens/SettingsScreen/SettingsScreen";

export default function SettingsRoute() {


  return (
    <>
      <Stack.Screen
        options={{
          title: "Settings",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <SettingsScreen />
    </>
  );
}