import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Image } from 'expo-image';
import { LanguageToggle } from '../../../components/LanguageToggle';
import { useTranslation } from '../../../../hooks/use-translation';
import type { SupportedLanguage } from '../../../locales/i18n';
import { setLanguage } from '../../../redux/slices/language-slice';
import { styles } from './home.styles';

export const HomeScreen: React.FC = () => {
  const { t, currentLanguage } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();

  const toggleLanguage = () => {
    const nextLang: SupportedLanguage =
      currentLanguage === 'en' ? 'he' : 'en';
    dispatch(setLanguage(nextLang));
  };

  const handleStartOnboarding = () => {
    router.replace('/Entering/onboardingRoute');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/images/homeImg.webp')}
        style={styles.homeImg}
      />
      <Text style={styles.title}>{t('app_name')}</Text>

      <View style={styles.buttonRow}>
        <LanguageToggle
          currentLanguage={currentLanguage}
          onToggle={toggleLanguage}
        />

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleStartOnboarding}
        >
          <Text style={styles.buttonText}>
            {t('onboarding.startOnboarding')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

