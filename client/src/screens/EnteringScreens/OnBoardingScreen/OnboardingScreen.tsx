import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  View,
  Image,
  Pressable,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useWindowDimensions,
} from "react-native";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { OnboardingButton } from "../../../components/OnboardingButton";
import { COLORS } from "../../../../constants/theme";
import { styles } from "./onboarding.styles";

const CHOOSE_CHILD_AGE = "/Entering/chooseChildAge";

type OnboardingSlide = {
  id: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  description: string;
  image?: any;
};

export const OnboardingScreen: React.FC = () => {
  const router = useRouter();
  const { width: pageWidth } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const indexRef = useRef(0);
  const scrollRef = useRef<ScrollView | null>(null);

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
      image: require("../../../../assets/images/map.png"),
    },
    {
      id: "3",
      icon: "cpu",
      title: "AI Analysis",
      description: "AI-based recommendations for other activities.",
    },
  ];

  //Prevent index that not exist
  const clampIndex = (index: number) =>
    Math.max(0, Math.min(slides.length - 1, index));

  const isLastSlide = currentIndex >= slides.length - 1;

  const goToChooseChildAge = () => {
    router.push(CHOOSE_CHILD_AGE as any);
  };

  const handleSkipOnboarding = () => {
    goToChooseChildAge();
  };

  const syncIndexFromOffset = (offsetX: number) => {
    if (pageWidth <= 0) return;
    const idx = clampIndex(Math.round(offsetX / pageWidth));
    indexRef.current = idx;
    setCurrentIndex(idx);
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    syncIndexFromOffset(event.nativeEvent.contentOffset.x);
  };

  const handlePrimaryPress = () => {
    const i = indexRef.current;
    if (i >= slides.length - 1) {
      goToChooseChildAge();
      return;
    }
    const next = i + 1;
    indexRef.current = next;
    setCurrentIndex(next);
    if (pageWidth > 0) {
      scrollRef.current?.scrollTo({
        x: next * pageWidth,
        animated: true,
      });
    }
  };

  return (
    <ScreenLayout scrollable={false}>
      <View style={styles.safeArea}>
        <View style={styles.slideWrapper}>
          <ScrollView
            ref={scrollRef}
            style={styles.slideScroll}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            keyboardShouldPersistTaps="handled"
          >
            {slides.map((slide) => (
              <View key={slide.id} style={{ width: pageWidth }}>
                <View style={styles.slideContainer}>
                  <View style={styles.iconContainer}>
                    <Feather
                      name={slide.icon}
                      size={40}
                      color={COLORS.light.background}
                    />
                  </View>

                  <View style={styles.textContainer}>
                    <AppText weight="extraBold" style={styles.title}>
                      {slide.title}
                    </AppText>

                    <AppText weight="regular" style={styles.description}>
                      {slide.description}
                    </AppText>
                  </View>

                  {slide.image ? (
                    <Image source={slide.image} style={styles.image} />
                  ) : null}
                </View>
              </View>
            ))}
          </ScrollView>

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
        </View>

        <View style={styles.footerContainer}>
          <View style={styles.stepsContainer}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.stepDot,
                  index === currentIndex && styles.stepDotActive,
                ]}
              />
            ))}
          </View>

          <OnboardingButton
            label={isLastSlide ? "Start" : "Next"}
            onPress={handlePrimaryPress}
            containerStyle={styles.startButton}
            textStyle={styles.startButtonText}
          />
        </View>
      </View>
    </ScreenLayout>
  );
};
