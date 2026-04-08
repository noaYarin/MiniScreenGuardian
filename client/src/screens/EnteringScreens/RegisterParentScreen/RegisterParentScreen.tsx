import React, { useMemo, useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Stack, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import AuthFormCard from "../../../components/AuthFormCard/AuthFormCard";
import { validateRegister } from "@/src/validation/authValidation";
import { AppDispatch } from "@/src/redux/store/types";
import { registerParent } from "@/src/redux/thunks/authThunks";
import { setError } from "@/src/redux/slices/auth-slice";
import { enteringFormStyles as styles } from "@/src/components/AuthFormCard/AuthFormCard.styles";

const ICON = {
  email: "email-outline",
  lock: "lock-outline",
  eye: "eye-outline",
  eyeOff: "eye-off-outline",
  users: "account-plus-outline",
} as const;

export default function RegisterParentScreen() {
  const { t } = useTranslation();
  const { isRTL } = useLocaleLayout();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { isLoading, error } = useSelector((state: { auth: { isLoading: boolean; error: string | null } }) => state.auth);

  const onSubmit = async () => {
    try {
      dispatch(setError(null));
      const errorKey = validateRegister(email, password, confirmPassword);
      if (errorKey) {
        dispatch(setError(errorKey));
        return;
      }
      await dispatch(registerParent({ email, password })).unwrap();
      router.replace("/Entering/loginParent" as any);
    } catch (err: any) {
      if (typeof err === "string") {
        dispatch(setError(err));
      }
    }
  };

  const inputRowStyle = useMemo(
    () => [styles.input, isRTL && styles.inputRTL],
    [isRTL]
  );

  const inputTextStyle = useMemo(
    () => [styles.inputText, isRTL && styles.inputTextRTL],
    [isRTL]
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "",
          headerShadowVisible: false,
        }}
      />

      <ScreenLayout>
        <KeyboardAvoidingView
          style={styles.flex1}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <AuthFormCard
            iconName={ICON.users}
            iconGradientColors={["#2563EB", "#7C3AED"]}
            title={t("registerParent.heading")}
            subtitle={t("registerParent.subheading")}
            error={error ? t(error) : null}
            submitLabel={t("registerParent.register")}
            onSubmit={onSubmit}
            isLoading={isLoading}
            submitButtonAccessibilityLabel={t("registerParent.register_a11y")}
            bottomContent={
              <>
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <AppText style={styles.dividerText}>{t("registerParent.or")}</AppText>
                  <View style={styles.dividerLine} />
                </View>
                <View style={styles.bottomRow}>
                  <Pressable
                    onPress={() => {
                      dispatch(setError(null));
                      router.replace("/Entering/loginParent" as any);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={t("registerParent.login_a11y")}
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  >
                    <AppText weight="bold" style={styles.bottomLink}>
                      {t("registerParent.login")}
                    </AppText>
                  </Pressable>
                  <AppText style={styles.bottomText}>
                    {t("registerParent.have_account")}
                  </AppText>
                </View>
              </>
            }
          >
            <View style={inputRowStyle}>
              <MaterialCommunityIcons name={ICON.email} size={20} color="#6B7280" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder={t("registerParent.email_placeholder")}
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={inputTextStyle}
                accessibilityLabel={t("registerParent.email_a11y")}
              />
            </View>

            <View style={inputRowStyle}>
              <MaterialCommunityIcons name={ICON.lock} size={20} color="#6B7280" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={t("registerParent.password_placeholder")}
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={inputTextStyle}
                accessibilityLabel={t("registerParent.password_a11y")}
              />
              <Pressable
                onPress={() => setShowPassword((s) => !s)}
                accessibilityRole="button"
                accessibilityLabel={t("registerParent.toggle_password_a11y")}
                hitSlop={10}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <MaterialCommunityIcons
                  name={showPassword ? ICON.eyeOff : ICON.eye}
                  size={22}
                  color="#6B7280"
                />
              </Pressable>
            </View>

            <View style={inputRowStyle}>
              <MaterialCommunityIcons name={ICON.lock} size={20} color="#6B7280" />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder={t("registerParent.confirm_password_placeholder")}
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={inputTextStyle}
                accessibilityLabel={t("registerParent.confirm_password_a11y")}
              />
              <Pressable
                onPress={() => setShowConfirmPassword((s) => !s)}
                accessibilityRole="button"
                accessibilityLabel={t("registerParent.toggle_confirm_password_a11y")}
                hitSlop={10}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <MaterialCommunityIcons
                  name={showConfirmPassword ? ICON.eyeOff : ICON.eye}
                  size={22}
                  color="#6B7280"
                />
              </Pressable>
            </View>
          </AuthFormCard>
        </KeyboardAvoidingView>
      </ScreenLayout>
    </>
  );
}
