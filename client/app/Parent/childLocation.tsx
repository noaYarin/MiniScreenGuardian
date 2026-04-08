import { Stack } from "expo-router";
import { useTranslation } from "../../hooks/use-translation";
import ChildLocationScreen from "@/src/screens/ParentScreens/ChildLocationScreen/ChildLocationScreen";

export default function ChildLocationRoute() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen
        options={{
          title: t("childLocation.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <ChildLocationScreen />
    </>
  );
}