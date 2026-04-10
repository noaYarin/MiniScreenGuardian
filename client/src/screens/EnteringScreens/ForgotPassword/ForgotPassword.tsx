import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "@/src/redux/thunks/authThunks";
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import AuthFormCard from "../../../components/AuthFormCard/AuthFormCard";
import { validateForgotPassword } from "@/src/validation/authValidation";
import { AppDispatch } from "@/src/redux/store/types";
import { setError } from "@/src/redux/slices/auth-slice";
import { enteringFormStyles as styles } from "@/src/components/AuthFormCard/AuthFormCard.styles";



export default function ForgotPasswordScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const { isLoading, error } = useSelector(
    (state: { auth: { isLoading: boolean; error: string | null } }) => state.auth
  );


  const handleSendEmail = async () => {
    dispatch(setError(null));

    const errorKey = validateForgotPassword(email);
    if (errorKey) {
      dispatch(setError(errorKey));
      return;
    }

    const trimmedEmail = email.trim();

    try {
      await dispatch(forgotPassword(trimmedEmail)).unwrap();
      router.push({
        pathname: "/Entering/resetPassword",
        params: { email: trimmedEmail },
      } as any);
    } catch (err: any) {
      if (typeof err === "string") {
        dispatch(setError(err));
      }
    }
  };

  return (
    <ScreenLayout>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <AuthFormCard
          iconName="lock-reset"
          iconGradientColors={["#2563EB", "#7C3AED"]}
          title="Forgot password"
          subtitle="Enter your email to receive a verification code"
          error={error}
          submitLabel="Send code"
          onSubmit={handleSendEmail}
          isLoading={isLoading}
          submitButtonAccessibilityLabel="Send code"
          bottomContent={
            <Pressable
              onPress={() => {
                dispatch(setError(null));
                router.back();
              }}
              accessibilityRole="button"
              accessibilityLabel="Back"
              style={styles.backButtonWrapper}
            >
              <AppText style={styles.bottomLink}>Back</AppText>
            </Pressable>
          }
        >
          <View style={styles.input}>
            <MaterialCommunityIcons name="email-outline" size={20} color="#6B7280" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.inputText}
              accessibilityLabel="Email input"
            />
          </View>
        </AuthFormCard>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}