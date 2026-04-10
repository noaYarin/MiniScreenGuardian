import { Stack } from "expo-router";
import AddChildScreen from "@/src/screens/ParentScreens/AddChildScreen/AddChildScreen";

export default function AddChildRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Add Child",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <AddChildScreen />
    </>
  );
}