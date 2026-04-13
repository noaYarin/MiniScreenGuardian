import React, { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

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


    setRecommendation(null);
    setRecommendationError(null);
    setHasCheckedRecommendation(false);
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
              What is the child's age?
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

                <AppText weight="bold" style={styles.ageLabel}>
                  Years old
                </AppText>

                <Pressable
                  onPress={handleOpenAgeModal}
                  accessibilityRole="button"
                  accessibilityLabel="Open age picker"
                >
                  <View style={styles.agePickerHintRow}>
                    <MaterialCommunityIcons name="chevron-down" size={18} color="#6A7C92" />
                    <AppText style={styles.agePickerHintText}>
                      Tap to choose age
                    </AppText>
                  </View>
                </Pressable>
              </View>

              <View style={styles.rangeCard}>
                <View style={styles.rangeHeaderRow}>
                  <AppText weight="bold" style={styles.rangeTitle}>
                    Supported range
                  </AppText>
                </View>

                <View style={styles.track}>
                  <View
                    style={[
                      styles.trackFill,
                      {
                        width: `${((selectedAge - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100}%`,
                        left: 0,
                      },
                    ]}
                  />
                </View>

                <View style={styles.trackLabelsRow}>
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
                accessibilityLabel="Check recommendation"
                style={[
                  styles.recommendationButton,
                  isRecommendationLoading && styles.recommendationButtonDisabled,
                ]}
              >
                <AppText weight="bold" style={styles.recommendationButtonText}>
                  {isRecommendationLoading ? "Loading..." : "See Recommendation"}
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
                      recommendationVariant === "young" && styles.recommendationTitleYoung,
                      recommendationVariant === "middle" && styles.recommendationTitleMiddle,
                      recommendationVariant === "teen" && styles.recommendationTitleTeen,
                    ]}
                  >
                    Recommended Daily Screen Time
                  </AppText>

                  {isRecommendationLoading ? (
                    <AppText style={styles.recommendationLoading}>
                      Loading recommendation...
                    </AppText>
                  ) : recommendationError ? (
                    <AppText style={styles.recommendationError}>
                      {recommendationError}
                    </AppText>
                  ) : recommendation ? (
                    <>
                      <AppText
                        weight="extraBold"
                        style={[
                          styles.recommendationMinutes,
                          recommendationVariant === "young" && styles.recommendationMinutesYoung,
                          recommendationVariant === "middle" && styles.recommendationMinutesMiddle,
                          recommendationVariant === "teen" && styles.recommendationMinutesTeen,
                        ]}
                      >
                        {recommendation.recommendedMinutes} Minutes
                      </AppText>

                      <AppText style={styles.recommendationText}>
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
            accessibilityLabel="Continue to the next step"
            style={styles.continueButton}
          >
            <AppText weight="bold" style={styles.continueButtonText}>
              Continue
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
                Choose Age
              </AppText>

              <Pressable
                onPress={handleCloseAgeModal}
                accessibilityRole="button"
                accessibilityLabel="Close age picker"
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
                    accessibilityRole="button"
                    accessibilityLabel={`Select age ${age}`}
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