import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
  Image,
} from 'react-native';

import { OnboardingButton } from '../../../components/OnboardingButton';
import { COLORS, SIZES } from '../../../../constants/theme';
import {
  getOnboardingSlides,
  OnboardingSlide,
} from '../../../../data/onBoardingData';
import { useTranslation } from '../../../../hooks/use-translation';
import { styles } from './onboarding.styles';

export const OnboardingScreen: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const slides: OnboardingSlide[] = getOnboardingSlides(t);

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingSlide> | null>(null);

  const handleStartUsingApp = () => {
    router.push('Entering/chooseChildAge' as any);
  };

  const handleSkipOnboarding = () => {
    router.push('Entering/chooseChildAge' as any);
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
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SIZES.width);
    setCurrentIndex(index);
  };

  const renderItem = ({
    item,
  }: {
    item: OnboardingSlide;
  }) => {

    return (
      <>
       <Text style={styles.link} onPress={handleSkipOnboarding}> {t('dashboard.skip')}</Text>
      <View style={styles.slideContainer}>
        <View
          style={styles.iconContainer}
        >
          <Feather name={item.icon} size={40} color={COLORS.light.background} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View> 
        {item.image && <Image source={item.image} style={styles.image}/>}
      </View>
      </>
    );
  };

  return (
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
          label={
            currentIndex < slides.length - 1
              ? t('dashboard.next')
              : t('dashboard.start')
          }
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
  );
};