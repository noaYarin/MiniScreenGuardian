import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

export const HomeScreen: React.FC = () => {
  const router = useRouter();

  const handleStartOnboarding = () => {
    router.replace("/Entering/onboardingRoute");
  };

  return (
    <ScreenLayout scrollable={false}>
      <View style={styles.container}>
        <Image
          source={require("../../../../assets/images/homeImg.webp")}
          style={styles.homeImg}
          contentFit="contain"
        />

        <AppText weight="extraBold" style={styles.title}>
          ScreenTime Guardian
        </AppText>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleStartOnboarding}
            accessibilityRole="button"
            accessibilityLabel="Start onboarding"
          >
            <AppText weight="bold" style={styles.buttonText}>
              Start
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenLayout>
  );
};