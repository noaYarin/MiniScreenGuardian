import { Stack } from "expo-router";
import LinkChildScreen from "../../src/screens/EnteringScreens/LinkChildrenScreen/LinkChildrenScreen";
export default function LinkChildRoute() {
  return (
    <>
      <Stack.Screen
          options={{  
            headerShown: true,           
            title: "",                   
            headerShadowVisible: false,   
      }}  
      />
      <LinkChildScreen />
    </>
  );
}