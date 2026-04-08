import React from "react";
import { useTranslation } from "react-i18next";
import { Stack } from "expo-router";
import LinkDeviceScreen from "@/src/screens/ParentScreens/LinkDeviceScreen/LinkDeviceScreen";

export default function LinkDeviceRoute() {
  const { t } = useTranslation();
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerShadowVisible: false,
          title: t("linkDevice.title"),
        }}
      />
      <LinkDeviceScreen />
    </>
  );
}