import { Stack } from "expo-router";
import LoginParentScreen from "../../src/screens/EnteringScreens/LoginParentScreen/LoginParentScreen";

export default function loginParentRoute() {
    
    return (
    <>
      <Stack.Screen
            options={{  
              headerShown: true,           
              title: "",                   
              headerShadowVisible: false,   
        }}  
      />
      <LoginParentScreen />
    </>
  );
}