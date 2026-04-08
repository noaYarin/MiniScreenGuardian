import React from "react";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { OnboardingScreen } from "../../src/screens/EnteringScreens/OnBoardingScreen/OnboardingScreen";

export default function OnboardingRoute() {

  return (
    <>
      <Stack.Screen
        options={{
            headerShown: true,           
            title: "",                   
            headerShadowVisible: false,   

        }}
      />
      <OnboardingScreen />
    </>
  );
}