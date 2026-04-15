import React, { useMemo, useState } from "react";
import {
  View,
  Pressable,
  TextInput,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import InlineDatePicker from "../../../components/InlineDatePicker/InlineDatePicker";
import { styles } from "./styles";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/src/redux/store/types";
import { addChildThunk } from "@/src/redux/thunks/childrenThunks";
import { clearChildrenError } from "@/src/redux/slices/children-slice";
import { showErrorToast } from "@/src/utils/appToast";


type GenderOption = "boy" | "girl" | "other";

const GENDER_OPTIONS: {
  key: GenderOption;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  accessibilityLabel: string;
}[] = [
    { key: "boy", icon: "human-male", label: "Boy", accessibilityLabel: "Select boy" },
    { key: "girl", icon: "human-female", label: "Girl", accessibilityLabel: "Select girl" },
    { key: "other", icon: "human-greeting-variant", label: "Other", accessibilityLabel: "Select other" },
  ];

function formatDateForDisplay(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
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

function formatDateForApi(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AddChildScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector(
    (state: { children: { isLoading: boolean; error: string | null } }) =>
      state.children
  );

  const { width } = useWindowDimensions();

  const [childName, setChildName] = useState("");
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [gender, setGender] = useState<GenderOption>("boy");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const maxContentWidth = Math.min(900, Math.max(340, width - 32));

  const formattedBirthDate = useMemo(() => {
    return formatDateForDisplay(birthDate);
  }, [birthDate]);

  const onSave = async () => {
    try {
      dispatch(clearChildrenError());

      if (!childName.trim()) {
        showErrorToast("Please enter a name", "Error");
        return;
      }

      const age = calculateAge(birthDate);

      if (age < 6 || age > 17) {
        showErrorToast("Age must be between 6 and 17", "Error");
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
      showErrorToast(
        typeof err === "string" ? err : "Something went wrong. Please try again.",
        "Error"
      );
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <View style={[styles.content, { maxWidth: maxContentWidth }]}>
          <View style={styles.heroCard}>
            <AppText weight="extraBold" style={styles.heading}>
              Add a new child
            </AppText>

            <AppText style={styles.subheading}>
              Fill in the child's basic details
            </AppText>
          </View>

          <View style={styles.formCard}>
            <View style={styles.fieldBlock}>
              <AppText weight="bold" style={styles.label}>
                Name
              </AppText>

              <TextInput
                value={childName}
                onChangeText={setChildName}
                placeholder="Enter a name"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                maxLength={30}
                accessibilityLabel="Child name field"
              />
            </View>

            <View style={styles.fieldBlock}>
              <AppText weight="bold" style={styles.label}>
                Birth date
              </AppText>

              <Pressable
                onPress={() => setShowDatePicker(true)}
                accessibilityRole="button"
                accessibilityLabel="Birth date field"
                style={({ pressed }) => [
                  styles.dateFieldButton,
                  pressed && styles.dateFieldButtonPressed,
                ]}
              >
                <View style={styles.dateFieldContent}>
                  <View style={styles.dateFieldLeft}>
                    <View style={styles.dateIconWrap}>
                      <AppText style={styles.dateIconEmoji}>📅</AppText>
                    </View>

                    <View style={styles.dateTextWrap}>
                      <AppText weight="medium" style={styles.dateFieldLabel}>
                        Birth date
                      </AppText>

                      <AppText weight="extraBold" style={styles.dateFieldValue}>
                        {formattedBirthDate}
                      </AppText>
                    </View>
                  </View>

                  <AppText weight="bold" style={styles.dateFieldChangeText}>
                    Change
                  </AppText>
                </View>
              </Pressable>

              <InlineDatePicker
                visible={showDatePicker}
                value={birthDate}
                maximumDate={new Date()}
                onChange={setBirthDate}
                onRequestClose={() => setShowDatePicker(false)}
                doneLabel="Done"
                doneAccessibilityLabel="Confirm birth date"
              />
            </View>

            <View style={styles.fieldBlock}>
              <AppText weight="bold" style={styles.label}>
                Gender
              </AppText>

              <View style={styles.genderRow}>
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
                      accessibilityLabel={option.accessibilityLabel}
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
                        {option.label}
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
            accessibilityLabel="Save child"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <AppText weight="extraBold" style={styles.saveButtonText}>
                Save
              </AppText>
            )}
          </Pressable>

          <View style={styles.bottomSpacer} />
        </View>
      </View>
    </ScreenLayout>
  );
}