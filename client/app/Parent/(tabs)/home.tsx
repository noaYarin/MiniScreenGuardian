import React from "react";
import HomeParentScreen from "../../../src/screens/ParentScreens/HomeScreen/HomeScreen";
import { useTranslation } from "react-i18next";
import { Stack } from "expo-router";

export default function HomeParentScreenRoute() {
  const { t } = useTranslation();
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerShadowVisible: false,
          title: t("homeParent.title"),
        }}
      />
      <HomeParentScreen />
    </>
  );
}