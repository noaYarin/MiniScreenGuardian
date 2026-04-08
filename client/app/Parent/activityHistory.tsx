import { Stack } from "expo-router";
import { useTranslation } from "../../hooks/use-translation";
import ActivityHistoryScreen from "@/src/screens/ParentScreens/ActivityHistoryScreen/ActivityHistoryScreen";

export default function ActivityHistoryRoute() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen
        options={{
          title: t("activityHistory.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <ActivityHistoryScreen />
    </>
  );
}