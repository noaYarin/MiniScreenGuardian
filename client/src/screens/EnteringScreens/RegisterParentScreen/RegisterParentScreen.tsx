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
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import AuthFormCard from "../../../components/AuthFormCard/AuthFormCard";
import { validateRegister } from "@/src/validation/authValidation";
import { AppDispatch } from "@/src/redux/store/types";
import { registerParent } from "@/src/redux/thunks/authThunks";
import { setError } from "@/src/redux/slices/auth-slice";
import { enteringFormStyles as styles } from "@/src/components/AuthFormCard/AuthFormCard.styles";
import { showSuccessToast } from "@/src/utils/appToast";

const ICON = {
  email: "email-outline",
  lock: "lock-outline",
  eye: "eye-outline",
  eyeOff: "eye-off-outline",
  users: "account-plus-outline",
} as const;

export default function RegisterParentScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { isLoading, error } = useSelector(
    (state: { auth: { isLoading: boolean; error: string | null } }) => state.auth
  );

  const onSubmit = async () => {
    try {
      dispatch(setError(null));

      const errorKey = validateRegister(email, password, confirmPassword);
      if (errorKey) {
        dispatch(setError(errorKey));
        return;
      }

      await dispatch(registerParent({ email, password })).unwrap();
      showSuccessToast("Account created successfully");

      router.replace("/Entering/loginParent" as any);
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
          iconName={ICON.users}
          iconGradientColors={["#2563EB", "#7C3AED"]}
          title="Create Parent Account"
          subtitle="Sign up to start managing screen time"
          error={error}
          submitLabel="Sign Up"
          onSubmit={onSubmit}
          isLoading={isLoading}
          submitButtonAccessibilityLabel="Sign up button"
          bottomContent={
            <>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <AppText style={styles.dividerText}>or</AppText>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.bottomRow}>
                <Pressable
                  onPress={() => {
                    dispatch(setError(null));
                    router.replace("/Entering/loginParent" as any);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Go to login screen"
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >

                  <AppText style={styles.bottomText}>
                    Already have an account? {""}
                    <AppText weight="bold" style={styles.bottomLink}>
                      Log In
                    </AppText>
                  </AppText>

                </Pressable>


              </View>
            </>
          }
        >
          <View style={styles.input}>
            <MaterialCommunityIcons name={ICON.email} size={20} color="#6B7280" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.inputText}
              accessibilityLabel="Email field"
            />
          </View>

          <View style={styles.input}>
            <MaterialCommunityIcons name={ICON.lock} size={20} color="#6B7280" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.inputText}
              accessibilityLabel="Password field"
            />
            <Pressable
              onPress={() => setShowPassword((s) => !s)}
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
            <MaterialCommunityIcons name={ICON.lock} size={20} color="#6B7280" />
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.inputText}
              accessibilityLabel="Confirm password field"
            />
            <Pressable
              onPress={() => setShowConfirmPassword((s) => !s)}
              accessibilityRole="button"
              accessibilityLabel="Show or hide confirm password"
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
  );
}