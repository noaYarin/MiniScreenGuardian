
export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: any;
  image?: any;
}

export const getOnboardingSlides = (t: any): OnboardingSlide[] => [
    {
      id: '1',
      title: t('onboarding.step1_title'),
      description: t('onboarding.step1_desc'),
      icon: "lock",
    },
    {
      id: '2',
      title: t('onboarding.step2_title'),
      description: t('onboarding.step2_desc'),
      icon: "map",
      image: require('../assets/images/map.png')
    },
    {
      id: '3',
      title: t('onboarding.step3_title'),
      description: t('onboarding.step3_desc'),
      icon: "activity",
    },
  ];