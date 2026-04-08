import { Stack } from "expo-router";
import { useTranslation } from "../../../hooks/use-translation";
import SettingsScreen from "@/src/screens/ParentScreens/SettingsScreen/SettingsScreen";

export default function SettingsRoute() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen
        options={{
          title: t("settings.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <SettingsScreen />
    </>
  );
}