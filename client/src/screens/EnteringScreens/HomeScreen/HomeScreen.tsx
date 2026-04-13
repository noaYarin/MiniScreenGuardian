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
        <View style={styles.heroBlock}>
          <Image
            source={require("../../../../assets/images/homeImg.webp")}
            style={styles.homeImg}
            contentFit="contain"
          />

          <AppText weight="extraBold" style={styles.title}>
            ScreenTime Guardian
          </AppText>

          <AppText style={styles.subtitle}>
            Smart screen-time support for families
          </AppText>
        </View>

        <View style={styles.buttonArea}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleStartOnboarding}
            accessibilityRole="button"
            accessibilityLabel="Start onboarding"
            activeOpacity={0.85}
          >
            <AppText weight="extraBold" style={styles.buttonText}>
              Get Started
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenLayout>
  );
};