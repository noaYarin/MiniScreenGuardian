import React, { useState } from "react";
import { View, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AuthFormCard from "../../../components/AuthFormCard/AuthFormCard";
import { validateResetPassword } from "@/src/validation/authValidation";
import { AppDispatch } from "@/src/redux/store/types";
import { resetPassword } from "@/src/redux/thunks/authThunks";
import { setError } from "@/src/redux/slices/auth-slice";
import { enteringFormStyles as styles } from "@/src/components/AuthFormCard/AuthFormCard.styles";
import { showAppToast } from "@/src/utils/appToast";

const ICON = {
  lock: "lock-reset",
  eye: "eye-outline",
  eyeOff: "eye-off-outline",
} as const;

export default function ResetPasswordScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { email } = useLocalSearchParams<{ email?: string }>();

  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, error } = useSelector((state: { auth: { isLoading: boolean; error: string | null } }) => state.auth);

  const onSubmit = async () => {
    try {
      dispatch(setError(null));
      const errorKey = validateResetPassword(
        typeof email === "string" ? email : "",
        verificationCode,
        password,
        confirmPassword
      );
      if (errorKey) {
        dispatch(setError(errorKey));
        return;
      }

      await dispatch(
        resetPassword({
          email: String(email),
          otpCode: verificationCode.trim(),
          password,
        })
      ).unwrap();

      showAppToast(t("resetPassword.success_message"), t("resetPassword.success_title"));
      dispatch(setError(null));
      setTimeout(() => {
        router.replace("/Entering/loginParent" as any);
      }, 600);
    } catch {
      dispatch(setError("resetPassword.generic_error"));
    }
  };

  return (
    <ScreenLayout>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <AuthFormCard
          iconName={ICON.lock}
          iconGradientColors={["#6366f1", "#4f46e5"]}
          title={t("resetPassword.heading")}
          subtitle={t("resetPassword.subheading")}
          error={error ? t(error) : null}
          submitLabel={t("resetPassword.submit_btn")}
          onSubmit={onSubmit}
          isLoading={isLoading}
        >
          <View style={styles.input}>
            <MaterialCommunityIcons name="numeric" size={20} color="#6B7280" />
            <TextInput
              value={verificationCode}
              onChangeText={setVerificationCode}
              placeholder={t("resetPassword.code_placeholder") || "Verification code"}
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={6}
              style={styles.inputText}
            />
          </View>

          <View style={styles.input}>
            <MaterialCommunityIcons name="lock-outline" size={20} color="#6B7280" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder={t("resetPassword.new_password_placeholder")}
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              style={styles.inputText}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <MaterialCommunityIcons
                name={showPassword ? ICON.eyeOff : ICON.eye}
                size={22}
                color="#6B7280"
              />
            </Pressable>
          </View>

          <View style={styles.input}>
            <MaterialCommunityIcons name="lock-check-outline" size={20} color="#6B7280" />
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={t("resetPassword.confirm_password_placeholder")}
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              style={styles.inputText}
            />
          </View>
        </AuthFormCard>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}
