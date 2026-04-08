import React from "react";
import { Stack } from "expo-router";
import { RoleSelectionScreen } from "../../src/screens/EnteringScreens/RoleSelectionScreen/RoleSelectionScreen";

export default function RoleSelectionRoute() {
  return (
    <>
      <Stack.Screen
        options={{
            headerShown: true,           
            title: "",                   
            headerShadowVisible: false,   
      }}  
      />
      <RoleSelectionScreen />
    </>
  );
}