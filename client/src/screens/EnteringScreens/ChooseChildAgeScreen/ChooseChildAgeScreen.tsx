import React, { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";
import {
  getPreLoginRecommendation,
  type ScreenTimeRecommendation,
} from "../../../api/PreLoginRecommendation";

const MIN_AGE = 6;
const MAX_AGE = 17;
const DEFAULT_AGE = 10;

const AGE_OPTIONS = Array.from(
  { length: MAX_AGE - MIN_AGE + 1 },
  (_, index) => MIN_AGE + index
);

export default function ChooseChildAgeScreen() {
  const { t } = useTranslation();
  const { text, row, isRTL } = useLocaleLayout();
  const { width } = useWindowDimensions();

  const [selectedAge, setSelectedAge] = useState<number>(DEFAULT_AGE);
  const [isAgeModalVisible, setIsAgeModalVisible] = useState(false);

  const [recommendation, setRecommendation] = useState<ScreenTimeRecommendation | null>(null);
  const [isRecommendationLoading, setIsRecommendationLoading] = useState<boolean>(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);
  const [hasCheckedRecommendation, setHasCheckedRecommendation] = useState<boolean>(false);

  const isTablet = width >= 900;
  const isWide = width >= 700;

  const recommendationVariant = useMemo(() => {
    if (selectedAge <= 8) return "young";
    if (selectedAge <= 12) return "middle";
    return "teen";
  }, [selectedAge]);

  function handleOpenAgeModal() {
    setIsAgeModalVisible(true);
  }

  function handleCloseAgeModal() {
    setIsAgeModalVisible(false);
  }

  function handleSelectAge(age: number) {
    setSelectedAge(age);
    setIsAgeModalVisible(false);
  }

  async function handleCheckRecommendation() {
    try {
      setHasCheckedRecommendation(true);
      setIsRecommendationLoading(true);
      setRecommendationError(null);

      const result = await getPreLoginRecommendation(selectedAge);
      setRecommendation(result);
    } catch (error) {
      setRecommendation(null);
      setRecommendationError("Failed to load recommendation");
    } finally {
      setIsRecommendationLoading(false);
    }
  }

  function handleContinue() {
    router.replace("/Entering/roleSelectionRoute" as any);
  }

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, isTablet && styles.containerTablet]}>
          <View style={styles.heroCard}>
            <AppText weight="extraBold" style={styles.title}>
              {t("chooseChildAge.heading")}
            </AppText>

            <View
              style={[
                styles.selectorCard,
                isWide && styles.selectorCardWide,
              ]}
            >
              <View style={styles.controlsCenter}>

                <Pressable
                  onPress={handleOpenAgeModal}
                  accessibilityRole="button"
                  accessibilityLabel="Choose child age"
                  style={styles.agePickerButton}
                >
                  <View style={styles.ageCircle}>
                    <AppText weight="extraBold" style={styles.ageNumber}>
                      {selectedAge}
                    </AppText>
                  </View>
                </Pressable>

                <AppText weight="bold" style={[styles.ageLabel, text]}>
                  {t("chooseChildAge.selectedAgeLabel")}
                </AppText>

                <Pressable
                  onPress={handleOpenAgeModal}
                  accessibilityRole="button"
                >
                  <View style={[styles.agePickerHintRow, row]}>
                    <MaterialCommunityIcons name="chevron-down" size={18} color="#6A7C92" />
                    <AppText style={[styles.agePickerHintText, text]}>
                      Tap to choose age
                    </AppText>
                  </View>
                </Pressable>

              </View>
              <View style={styles.rangeCard}>
                <View style={[styles.rangeHeaderRow, row]}>
                  <AppText weight="bold" style={[styles.rangeTitle, text]}>
                    {t("chooseChildAge.rangeTitle")}
                  </AppText>

                </View>

                <View style={styles.track}>
                  <View
                    style={[
                      styles.trackFill,
                      {
                        width: `${((selectedAge - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100}%`,
                        ...(isRTL ? { right: 0 } : { left: 0 }),
                      },
                    ]}
                  />
                </View>

                <View style={[styles.trackLabelsRow, row]}>
                  <AppText weight="medium" style={styles.trackEdgeLabel}>
                    {MIN_AGE}
                  </AppText>
                  <AppText weight="medium" style={styles.trackEdgeLabel}>
                    {MAX_AGE}
                  </AppText>
                </View>
              </View>

              <Pressable
                onPress={handleCheckRecommendation}
                disabled={isRecommendationLoading}
                accessibilityRole="button"
                style={[
                  styles.recommendationButton,
                  isRecommendationLoading && styles.recommendationButtonDisabled,
                ]}
              >
                <AppText weight="bold" style={styles.recommendationButtonText}>
                  {isRecommendationLoading ? "Loading..." : "Check Recommendation "}
                </AppText>
              </Pressable>

              {hasCheckedRecommendation && (
                <View
                  style={[
                    styles.recommendationCard,
                    recommendationVariant === "young" && styles.recommendationCardYoung,
                    recommendationVariant === "middle" && styles.recommendationCardMiddle,
                    recommendationVariant === "teen" && styles.recommendationCardTeen,
                  ]}
                >
                  <AppText
                    weight="bold"
                    style={[
                      styles.recommendationTitle,
                      text,
                      recommendationVariant === "young" && styles.recommendationTitleYoung,
                      recommendationVariant === "middle" && styles.recommendationTitleMiddle,
                      recommendationVariant === "teen" && styles.recommendationTitleTeen,
                    ]}
                  >
                   Recommended Screen Time
                  </AppText>

                  {isRecommendationLoading ? (
                    <AppText style={[styles.recommendationLoading, text]}>
                      טוען המלצה...
                    </AppText>
                  ) : recommendationError ? (
                    <AppText style={[styles.recommendationError, text]}>
                      {recommendationError}
                    </AppText>
                  ) : recommendation ? (
                    <>
                      <AppText
                        weight="extraBold"
                        style={[
                          styles.recommendationMinutes,
                          text,
                          recommendationVariant === "young" && styles.recommendationMinutesYoung,
                          recommendationVariant === "middle" && styles.recommendationMinutesMiddle,
                          recommendationVariant === "teen" && styles.recommendationMinutesTeen,
                        ]}
                      >
                        {recommendation.recommendedMinutes} Minutes
                      </AppText>

                      <AppText style={[styles.recommendationText, text]}>
                        {recommendation.message}
                      </AppText>
                    </>
                  ) : null}
                </View>
              )}
            </View>
          </View>

          <Pressable
            onPress={handleContinue}
            accessibilityRole="button"
            accessibilityLabel={t("chooseChildAge.continue_a11y")}
            style={styles.continueButton}
          >
            <AppText weight="bold" style={styles.continueButtonText}>
              {t("chooseChildAge.continue")}
            </AppText>
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={isAgeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseAgeModal}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseAgeModal}>
          <Pressable style={styles.modalCard} onPress={() => { }}>
            <View style={styles.modalHeader}>
              <AppText weight="extraBold" style={styles.modalTitle}>
                בחר גיל
              </AppText>

              <Pressable
                onPress={handleCloseAgeModal}
                accessibilityRole="button"
                style={styles.modalCloseButton}
              >
                <MaterialCommunityIcons name="close" size={22} color="#243447" />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              {AGE_OPTIONS.map((age) => {
                const isSelected = age === selectedAge;

                return (
                  <Pressable
                    key={age}
                    onPress={() => handleSelectAge(age)}
                    style={[
                      styles.ageOption,
                      isSelected && styles.ageOptionSelected,
                    ]}
                  >
                    <AppText
                      weight={isSelected ? "extraBold" : "medium"}
                      style={[
                        styles.ageOptionText,
                        isSelected && styles.ageOptionTextSelected,
                      ]}
                    >
                      {age}
                    </AppText>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenLayout>
  );
}