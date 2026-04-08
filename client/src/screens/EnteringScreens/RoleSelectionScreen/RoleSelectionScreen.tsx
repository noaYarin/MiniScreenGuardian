import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import { RoleCard } from '../RoleCardScreen/RoleCardScreen';
import { useTranslation } from '../../../../hooks/use-translation';
import { styles } from './roleSelection.styles';
import { COLORS } from '../../../../constants/theme';

export const RoleSelectionScreen: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const title = t('roleSelection.title');

  const handleParentSelect = () => {
    router.push('/Entering/loginParent' as any);
  };

  //const handleParentSelect = () => { 
  // router.push('/Parent/(tabs)/home' as any);
  //};


  const handleChildSelect = () => {
    router.push('/Entering/linkChild' as any);
  };

  //const handleChildSelect = () => {
  //  router.push('/Child/home' as any);
 // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.cardsContainer}>
          <RoleCard
            title={t('roleSelection.childs')}
            imageSource={require('../../../../assets/images/childrens.webp')}
            description={t('roleSelection.childDescription')}
            onPress={handleChildSelect}
            backgroundColor={COLORS.light.secondary}
            avatarCircleBackground={COLORS.light.tint}
          />

          <RoleCard
            title={t('roleSelection.parents')}
            imageSource={require('../../../../assets/images/parents.webp')}
            description={t('roleSelection.parentDescription')}
            onPress={handleParentSelect}
            backgroundColor={COLORS.light.tint}
            avatarCircleBackground={COLORS.light.secondary}
          />
      </View>
    </View>
  );
};