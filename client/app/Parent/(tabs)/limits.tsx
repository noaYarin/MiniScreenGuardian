import { Stack } from "expo-router";
import DailyTimeLimitsScreen from "@/src/screens/ParentScreens/DailyTimeLimitsScreen/DailyTimeLimitsScreen";

export default function DailyTimeLimitsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Screen Time Limits",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <DailyTimeLimitsScreen />
    </>
  );
}