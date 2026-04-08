import React, { useMemo } from "react";
import { View, Pressable, StyleProp, ViewStyle, TextStyle } from "react-native";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";

import AppText from "@/src/components/AppText/AppText";
import { childDetailsStyles as styles } from "./childDetails.styles";
import { getChildProfileImageUri } from "@/src/utils/childProfileImage";

type Props = {
  childName: string;
  birthDateLabel: string;
  genderLabel: string;
  profileImg?: string | null;
  row: StyleProp<ViewStyle>;
  text: StyleProp<TextStyle>;
  onOpenProfile: () => void;
};

export function ChildDetailsProfileCard({
  childName,
  birthDateLabel,
  genderLabel,
  profileImg,
  row,
  text,
  onOpenProfile,
}: Props) {
  const { t } = useTranslation();
  const avatarUri = useMemo(() => getChildProfileImageUri(profileImg), [profileImg]);

  return (
    <View style={styles.profileCard}>
      <View style={[styles.profileHeader, row]}>
        <View style={styles.avatarColumn}>
          <View style={styles.avatarWrap}>
            {avatarUri ? (
              <Image
                source={{ uri: avatarUri }}
                style={styles.avatarImage}
                contentFit="cover"
                transition={120}
                accessibilityIgnoresInvertColors
              />
            ) : (
              <MaterialCommunityIcons
                name="account-outline"
                size={22}
                color="#0F172A"
              />
            )}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.childProfileButton,
              pressed && styles.childProfileButtonPressed,
            ]}
            onPress={onOpenProfile}
            accessibilityRole="button"
            accessibilityLabel={t("childDetails.child_profile_a11y", {
              name: childName,
            })}
          >
            <AppText
              weight="bold"
              style={styles.childProfileButtonText}
              numberOfLines={1}
            >
              {t("childDetails.child_profile")}
            </AppText>
          </Pressable>
        </View>

        <View style={styles.profileTextWrap}>
          <AppText
            weight="extraBold"
            style={[styles.childName, text]}
            numberOfLines={1}
          >
            {childName}
          </AppText>

          <AppText style={[styles.childMeta, text]} numberOfLines={1}>
            {t("childDetails.birthdate_value", { value: birthDateLabel })}
          </AppText>

          <AppText style={[styles.childMeta, text]} numberOfLines={1}>
            {t("childDetails.gender_value", { value: genderLabel })}
          </AppText>
        </View>
      </View>
    </View>
  );
}
