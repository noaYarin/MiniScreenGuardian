import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AuthFormCard from "../../../components/AuthFormCard/AuthFormCard";
import { validateResetPassword } from "@/src/validation/authValidation";
import { AppDispatch } from "@/src/redux/store/types";
import { resetPassword } from "@/src/redux/thunks/authThunks";
import { setError } from "@/src/redux/slices/auth-slice";
import { enteringFormStyles as styles } from "@/src/components/AuthFormCard/AuthFormCard.styles";
import { showSuccessToast } from "@/src/utils/appToast";

const ICON = {
  lock: "lock-reset",
  eye: "eye-outline",
  eyeOff: "eye-off-outline",
} as const;

export default function ResetPasswordScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { email } = useLocalSearchParams<{ email?: string }>();

  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading, error } = useSelector(
    (state: { auth: { isLoading: boolean; error: string | null } }) => state.auth
  );

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

      showSuccessToast("Your password has been reset successfully.");

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
          title="Reset password"
          subtitle="Enter the code you received and choose a new password"
          error={error}
          submitLabel="Submit"
          onSubmit={onSubmit}
          isLoading={isLoading}
          submitButtonAccessibilityLabel="Submit reset password"
        >
          <View style={styles.input}>
            <MaterialCommunityIcons name="numeric" size={20} color="#6B7280" />
            <TextInput
              value={verificationCode}
              onChangeText={setVerificationCode}
              placeholder="Verification code"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={6}
              style={styles.inputText}
              accessibilityLabel="Verification code"
            />
          </View>

          <View style={styles.input}>
            <MaterialCommunityIcons name="lock-outline" size={20} color="#6B7280" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="New password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              style={styles.inputText}
              accessibilityLabel="New password"
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              accessibilityRole="button"
              accessibilityLabel="Show or hide password"
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

          <View style={styles.input}>
            <MaterialCommunityIcons name="lock-check-outline" size={20} color="#6B7280" />
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              style={styles.inputText}
              accessibilityLabel="Confirm new password"
            />
          </View>
        </AuthFormCard>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}