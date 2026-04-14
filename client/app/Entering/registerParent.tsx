import { Stack } from "expo-router";
import RegisterParentScreen from "../../src/screens/EnteringScreens/RegisterParentScreen/RegisterParentScreen";

export default function RegisterParentRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
          headerShadowVisible: false,
        }}
      />
      <RegisterParentScreen />
    </>
  );
}