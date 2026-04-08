import React, { useState, useMemo } from "react";
import {
  View,
  Pressable,
  TextInput,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { Stack, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import InlineDatePicker from "../../../components/InlineDatePicker/InlineDatePicker";
import { styles } from "./styles";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/src/redux/store/types";
import { addChildThunk } from "@/src/redux/thunks/childrenThunks";
import { clearChildrenError } from "@/src/redux/slices/children-slice";
import { showAppToast } from "@/src/utils/appToast";

type GenderOption = "boy" | "girl" | "other";

const GENDER_OPTIONS: {
  key: GenderOption;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
}[] = [
    { key: "boy", icon: "human-male" },
    { key: "girl", icon: "human-female" },
    { key: "other", icon: "human-greeting-variant" },
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

export default function AddChildScreen() {
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector(
    (state: { children: { isLoading: boolean; error: string | null } }) => state.children
  );

  const { row, text, isRTL } = useLocaleLayout();
  const { width } = useWindowDimensions();

  const [childName, setChildName] = useState("");
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [gender, setGender] = useState<GenderOption>("boy");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const maxContentWidth = Math.min(900, Math.max(340, width - 32));

  const formattedBirthDate = useMemo(() => {
    const locale = i18n.language === "he" ? "he-IL" : "en-US";
    return formatDateForDisplay(birthDate, locale);
  }, [birthDate, i18n.language]);

  function formatDateForApi(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }


  const onSave = async () => {
    try {
      dispatch(clearChildrenError());

      if (!childName.trim()) {
        showAppToast(t("addChild.validation_name"), t("addChild.validation_title"));
        return;
      }

      const age = calculateAge(birthDate);

      if (age < 6 || age > 17) {
        showAppToast(
          t("addChild.validation_age"),
          t("addChild.validation_title")
        );
        return;
      }

      await dispatch(
        addChildThunk({
          name: childName.trim(),
          birthDate: formatDateForApi(birthDate),
          gender,
        })
      ).unwrap();

      router.back();
    } catch (err: any) {
      showAppToast(
        typeof err === "string" ? t(err) : t("common.generic_error"),
        t("addChild.validation_title")
      );
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t("addChild.title"),
          headerTitleAlign: "center",
        }}
      />

      <ScreenLayout>
        <View style={styles.container}>
          <View style={[styles.content, { maxWidth: maxContentWidth }]}>
            <View style={styles.heroCard}>
              <AppText weight="extraBold" style={[styles.heading, text]}>
                {t("addChild.heading")}
              </AppText>

              <AppText style={[styles.subheading, text]}>
                {t("addChild.subheading")}
              </AppText>
            </View>

            <View style={styles.formCard}>
              <View style={styles.fieldBlock}>
                <AppText weight="bold" style={[styles.label, text]}>
                  {t("addChild.name_label")}
                </AppText>

                <TextInput
                  value={childName}
                  onChangeText={setChildName}
                  placeholder={t("addChild.name_placeholder")}
                  placeholderTextColor="#94A3B8"
                  style={[styles.input, text]}
                  maxLength={30}
                  accessibilityLabel={t("addChild.name_a11y")}
                />
              </View>

              <View style={styles.fieldBlock}>
                <AppText weight="bold" style={[styles.label, text]}>
                  {t("addChild.birthdate_label")}
                </AppText>

                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  accessibilityRole="button"
                  accessibilityLabel={t("addChild.birthdate_a11y")}
                  style={({ pressed }) => [
                    styles.dateFieldButton,
                    pressed && styles.dateFieldButtonPressed,
                  ]}
                >
                  <View
                    style={[
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
                          {t("addChild.birthdate_label")}
                        </AppText>

                        <AppText weight="extraBold" style={[styles.dateFieldValue, text]}>
                          {formattedBirthDate}
                        </AppText>
                      </View>
                    </View>

                    <AppText weight="bold" style={styles.dateFieldChangeText}>
                      {t("addChild.birthdate_change")}
                    </AppText>
                  </View>
                </Pressable>

                <InlineDatePicker
                  visible={showDatePicker}
                  value={birthDate}
                  maximumDate={new Date()}
                  onChange={setBirthDate}
                  onRequestClose={() => setShowDatePicker(false)}
                  doneLabel={t("addChild.birthdate_done")}
                  doneAccessibilityLabel={t("addChild.birthdate_done_a11y")}
                />
              </View>

              <View style={styles.fieldBlock}>
                <AppText weight="bold" style={[styles.label, text]}>
                  {t("addChild.gender_label")}
                </AppText>

                <View style={[styles.genderRow, row]}>
                  {GENDER_OPTIONS.map((option) => {
                    const isSelected = gender === option.key;

                    return (
                      <Pressable
                        key={option.key}
                        onPress={() => setGender(option.key)}
                        style={[
                          styles.genderButton,
                          isSelected && styles.genderButtonActive,
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={t(`addChild.gender_${option.key}_a11y`)}
                      >
                        <MaterialCommunityIcons
                          name={option.icon}
                          size={20}
                          color={isSelected ? "#2563EB" : "#475569"}
                        />

                        <AppText
                          weight="bold"
                          style={[
                            styles.genderButtonText,
                            isSelected && styles.genderButtonTextActive,
                          ]}
                        >
                          {t(`addChild.gender_${option.key}`)}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>

            <Pressable
              style={[styles.saveButton, isLoading && { opacity: 0.7 }]}
              onPress={onSave}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel={t("addChild.save_a11y")}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <AppText weight="extraBold" style={styles.saveButtonText}>
                  {t("addChild.save")}
                </AppText>
              )}
            </Pressable>

            <View style={styles.bottomSpacer} />
          </View>
        </View>
      </ScreenLayout>
    </>
  );
}