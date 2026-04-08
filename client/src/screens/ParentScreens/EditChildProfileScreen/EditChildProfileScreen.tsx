import React, { useEffect, useMemo, useState } from "react";
import { View, ScrollView, Pressable, useWindowDimensions, ActivityIndicator, TouchableOpacity } from "react-native";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import InlineDatePicker from "../../../components/InlineDatePicker/InlineDatePicker";
import ChildSelector from "../../../components/ChildSelector/ChildSelector";
import { styles } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";
import type { RootState } from "@/src/redux/store/types";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentChildProfileThunk } from "@/src/redux/thunks/childrenThunks";
import { router } from "expo-router";
import { AppDispatch } from "@/src/redux/store/types";
import { showAppToast } from "@/src/utils/appToast";

type GenderValue = "boy" | "girl" | "other";

type GenderOption = {
  key: GenderValue;
  labelKey: string;
};

const GENDER_OPTIONS: GenderOption[] = [
  { key: "boy", labelKey: "defineChildProfile.gender.options.boy" },
  { key: "girl", labelKey: "defineChildProfile.gender.options.girl" },
  { key: "other", labelKey: "defineChildProfile.gender.options.other" },
];

function formatDateForDisplay(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function calculateAge(date: Date) {
  const today = new Date();

  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < date.getDate())
  ) {
    age--;
  }

  return age;
}

export default function EditChildProfileScreen() {
  const { t, currentLanguage } = useTranslation();
  const { width } = useWindowDimensions();
  const { text, isRTL, row } = useLocaleLayout();
  const dispatch = useDispatch<AppDispatch>();
  const isTablet = width >= 768;
  const isLargeTablet = width >= 1100;

  const children = useSelector((state: RootState) => state.children.childrenList ?? []);
  const { isLoading } = useSelector((state: RootState) => state.children);

  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [gender, setGender] = useState<GenderValue>("girl");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!children || children.length === 0) return;

    const targetId = selectedChildId || String(children[0]._id);
    const currentChild = children.find(c => String(c._id) === targetId);

    if (currentChild) {
      if (!selectedChildId) {
        setSelectedChildId(String(currentChild._id));
      }

      if (currentChild.birthDate) {
        const newDate = new Date(currentChild.birthDate);
        if (birthDate.getTime() !== newDate.getTime()) {
          setBirthDate(newDate);
        }
      }

      if (currentChild.gender && currentChild.gender !== gender) {
        setGender(currentChild.gender as GenderValue);
      }
    }
  }, [children, selectedChildId]);

  const formattedBirthDate = useMemo(() => {
    const locale = currentLanguage === "he" ? "he-IL" : "en-US";
    return formatDateForDisplay(birthDate, locale);
  }, [birthDate, currentLanguage]);

  const handleSave = async () => {
    if (!selectedChildId || !birthDate) return;

    const age = calculateAge(birthDate);

    if (age < 6 || age > 17) {
      showAppToast(
        t("defineChildProfile.validation_age"),
        t("common.error")
      );
      return;
    }

    function formatDateForApi(date: Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    try {
      await dispatch(updateCurrentChildProfileThunk({
        childId: selectedChildId,
        birthDate: formatDateForApi(birthDate),
        gender,
      })).unwrap();

      router.back();
    } catch (error) {
      showAppToast(
        typeof error === "string" ? error : t("common.error_message"),
        t("common.error")
      );
    }
  };

  return (
    <>
      <ScreenLayout>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.container,
              isTablet && styles.containerTablet,
              isLargeTablet && styles.containerLargeTablet,
            ]}
          >
            <ChildSelector
              selectedChildId={selectedChildId}
              onSelectChild={setSelectedChildId}
            />

            <View style={[styles.formGrid, isTablet && styles.formGridTablet]}>
              <View style={[styles.sectionCard, isTablet && styles.sectionCardHalf]}>
                <View style={styles.sectionHeader}>
                  <AppText weight="extraBold" style={[styles.sectionTitle, text]}>
                    {t("defineChildProfile.birthDate.title")}
                  </AppText>
                </View>

                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  accessibilityRole="button"
                  accessibilityLabel={t("defineChildProfile.accessibility.birthDate")}
                  style={({ pressed }) => [
                    styles.dateFieldButton,
                    pressed && styles.dateFieldButtonPressed,
                  ]}
                >
                  <View
                    style={[
                      // eslint-disable-next-line react-native/no-inline-styles
                      styles.dateFieldContent,
                      isRTL ? styles.dateFieldContentRtl : styles.dateFieldContentLtr,
                    ]}
                  >
                    <View style={[styles.dateFieldLeft, row]}>
                      <View style={styles.dateIconWrap}>
                        <AppText style={styles.dateIconEmoji}>📅</AppText>
                      </View>

                      <View style={styles.dateTextWrap}>
                        <AppText weight="medium" style={[styles.dateFieldLabel, text]}>
                          {t("defineChildProfile.birthDate.fieldLabel")}
                        </AppText>

                        <AppText weight="extraBold" style={[styles.dateFieldValue, text]}>
                          {formattedBirthDate}
                        </AppText>
                      </View>
                    </View>

                    <AppText weight="bold" style={styles.dateFieldChangeText}>
                      {t("defineChildProfile.birthDate.change")}
                    </AppText>
                  </View>
                </Pressable>

                <InlineDatePicker
                  visible={showDatePicker}
                  value={birthDate ?? new Date()}
                  maximumDate={new Date()}
                  onChange={setBirthDate}
                  onRequestClose={() => setShowDatePicker(false)}
                  doneLabel={t("defineChildProfile.birthDate.done")}
                  doneAccessibilityLabel={t(
                    "defineChildProfile.accessibility.confirmBirthDate"
                  )}
                  footerContainerStyle={styles.iosPickerFooter}
                  donePressableStyle={styles.iosPickerDoneButton}
                  doneLabelStyle={styles.iosPickerDoneText}
                />
              </View>

              <View style={[styles.sectionCard, isTablet && styles.sectionCardHalf]}>
                <View style={styles.sectionHeader}>
                  <AppText weight="extraBold" style={[styles.sectionTitle, text]}>
                    {t("defineChildProfile.gender.title")}
                  </AppText>
                </View>

                <View
                  style={[
                    styles.genderRow,
                    isRTL ? styles.genderRowRtl : styles.genderRowLtr,
                  ]}
                >
                  {GENDER_OPTIONS.map((option) => {
                    const isSelected = option.key === gender;
                    return (
                      <Pressable
                        key={option.key}
                        onPress={() => setGender(option.key)}
                        accessibilityRole="button"
                        accessibilityLabel={t(
                          "defineChildProfile.accessibility.genderOption",
                          { gender: t(option.labelKey) }
                        )}
                        style={({ pressed }) => [
                          styles.genderChip,
                          isSelected && styles.genderChipSelected,
                          pressed && styles.genderChipPressed,
                        ]}
                      >
                        <View
                          style={[
                            styles.genderIndicator,
                            isSelected && styles.genderIndicatorSelected,
                          ]}
                        >
                          {isSelected ? <View style={styles.genderIndicatorInner} /> : null}
                        </View>

                        <AppText
                          weight={isSelected ? "extraBold" : "medium"}
                          style={[
                            styles.genderChipText,
                            text,
                            isSelected && styles.genderChipTextSelected,
                          ]}
                        >
                          {t(option.labelKey)}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                onPress={handleSave}
                disabled={isLoading}
                style={[styles.saveButton, isLoading && styles.disabledButton]}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <AppText style={styles.saveButtonText} weight="bold">
                    {t("common.save")}
                  </AppText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScreenLayout>
    </>
  );
}

