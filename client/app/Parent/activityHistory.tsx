import { Stack } from "expo-router";
import ActivityHistoryScreen from "@/src/screens/ParentScreens/ActivityHistoryScreen/ActivityHistoryScreen";

export default function ActivityHistoryRoute() {


  return (
    <>
      <Stack.Screen
        options={{
          title: "activity History",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <ActivityHistoryScreen />
    </>
  );
}