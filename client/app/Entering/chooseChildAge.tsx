import { Stack } from "expo-router";
import ChooseChildAgeScreen from "@/src/screens/EnteringScreens/ChooseChildAgeScreen/ChooseChildAgeScreen";

export default function ChooseChildAgeRoute() {


  return (
    <>
      <Stack.Screen
        options={{
          title:"Choose Child Age",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <ChooseChildAgeScreen />
    </>
  );
}