import { Stack } from "expo-router";
import { useTranslation } from "../../hooks/use-translation";
import EditChildProfileScreen from "@/src/screens/ParentScreens/EditChildProfileScreen/EditChildProfileScreen";

export default function EditChildProfileRoute() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen
        options={{
          title: t("defineChildProfile.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <EditChildProfileScreen />
    </>
  );
}

