import { Stack } from "expo-router";

import ChildLocationScreen from "@/src/screens/ParentScreens/ChildLocationScreen/ChildLocationScreen";

export default function ChildLocationRoute() {


  return (
    <>
      <Stack.Screen
        options={{
          title: "Child Location",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <ChildLocationScreen />
    </>
  );
}