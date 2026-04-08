import { Stack } from "expo-router";
import ForgotPasswordScreen from "@/src/screens/EnteringScreens/ForgotPassword/ForgotPassword";

export default function forgotPasswordRoute() {
    
    return (
    <>
      <Stack.Screen
            options={{  
              headerShown: true,           
              title: "",                   
              headerShadowVisible: false,   
        }}  
      />
      <ForgotPasswordScreen />
    </>
  );
}