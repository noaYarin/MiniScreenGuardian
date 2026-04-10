import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
  Image,
  Pressable,
} from "react-native";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { OnboardingButton } from "../../../components/OnboardingButton";
import { COLORS, SIZES } from "../../../../constants/theme";
import { styles } from "./onboarding.styles";

type OnboardingSlide = {
  id: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  description: string;
  image?: any;
};

export const OnboardingScreen: React.FC = () => {
  const router = useRouter();

  const slides: OnboardingSlide[] = [
    {
      id: "1",
      icon: "shield",
      title: "Monitor & Protect",
      description: "Track screen time and block apps instantly.",
    },
    {
      id: "2",
      icon: "map-pin",
      title: "Real-time Location",
      description: "Get your child's GPS location anytime.",
    },
    {
      id: "3",
      icon: "cpu",
      title: "AI Analysis",
      description: "AI-based recommendations for other activities.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingSlide> | null>(null);

  const handleStartUsingApp = () => {
    router.push("Entering/chooseChildAge" as any);
  };

  const handleSkipOnboarding = () => {
    router.push("Entering/chooseChildAge" as any);
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex < slides.length) {
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SIZES.width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item }: { item: OnboardingSlide }) => {
    return (
      <>
        <Pressable
          onPress={handleSkipOnboarding}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          style={styles.linkButton}
        >
          <AppText weight="medium" style={styles.linkText}>
            Skip
          </AppText>
        </Pressable>

        <View style={styles.slideContainer}>
          <View style={styles.iconContainer}>
            <Feather
              name={item.icon}
              size={40}
              color={COLORS.light.background}
            />
          </View>

          <View style={styles.textContainer}>
            <AppText weight="extraBold" style={styles.title}>
              {item.title}
            </AppText>

            <AppText weight="regular" style={styles.description}>
              {item.description}
            </AppText>
          </View>

          {item.image ? <Image source={item.image} style={styles.image} /> : null}
        </View>
      </>
    );
  };

  return (
    <ScreenLayout>
      <View style={styles.safeArea}>
        <FlatList
          ref={flatListRef}
          data={slides}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
        />

        <View style={styles.footerContainer}>
          <View style={styles.stepsContainer}>
            {slides.map((_, index) => {
              const isActive = index === currentIndex;

              return (
                <View
                  key={index}
                  style={[styles.stepDot, isActive && styles.stepDotActive]}
                />
              );
            })}
          </View>

          <OnboardingButton
            label={currentIndex < slides.length - 1 ? "Next" : "Start"}
            onPress={
              currentIndex < slides.length - 1
                ? handleNext
                : handleStartUsingApp
            }
            containerStyle={styles.startButton}
            textStyle={styles.startButtonText}
          />
        </View>
      </View>
    </ScreenLayout>
  );
};