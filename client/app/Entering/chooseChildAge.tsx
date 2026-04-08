import { Stack } from "expo-router";
import { useTranslation } from "../../hooks/use-translation";
import ChooseChildAgeScreen from "@/src/screens/EnteringScreens/ChooseChildAgeScreen/ChooseChildAgeScreen";

export default function ChooseChildAgeRoute() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen
        options={{
          title: t("chooseChildAge.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <ChooseChildAgeScreen />
    </>
  );
}