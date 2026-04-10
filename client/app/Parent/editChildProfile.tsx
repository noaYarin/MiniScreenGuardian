import { Stack } from "expo-router";
import EditChildProfileScreen from "@/src/screens/ParentScreens/EditChildProfileScreen/EditChildProfileScreen";

export default function EditChildProfileRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Child Profile Setup",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <EditChildProfileScreen />
    </>
  );
}