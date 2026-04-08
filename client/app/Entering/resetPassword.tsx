import { Stack } from "expo-router";
import ResetPasswordScreen from "../../src/screens/EnteringScreens/ResetPasswordScreen/ResetPasswordScreen";

export default function resetPasswordRoute() {
    
    return (
    <>
      <Stack.Screen
            options={{  
              headerShown: true,           
              title: "",                   
              headerShadowVisible: false,   
        }}  
      />
      <ResetPasswordScreen />
    </>
  );
}