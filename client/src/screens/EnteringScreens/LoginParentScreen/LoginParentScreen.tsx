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
import { loginParent } from "@/src/redux/thunks/authThunks";
import { useDispatch, useSelector } from "react-redux";
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import AuthFormCard from "../../../components/AuthFormCard/AuthFormCard";
import { validateLogin } from "@/src/validation/authValidation";
import { AppDispatch } from "@/src/redux/store/types";
import { setError } from "@/src/redux/slices/auth-slice";
import { enteringFormStyles as styles } from "@/src/components/AuthFormCard/AuthFormCard.styles";
import { connectSocket } from "@/src/services/socket";

const ICON = {
  email: "email-outline",
  lock: "lock-outline",
  eye: "eye-outline",
  eyeOff: "eye-off-outline",
  users: "account-group-outline",
} as const;

export default function LoginParentScreen() {
  const dispatch = useDispatch<AppDispatch>();

  const { isLoading, error } = useSelector(
    (state: { auth: { isLoading: boolean; error: string | null } }) =>
      state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async () => {
    try {
      dispatch(setError(null));

      const validationError = validateLogin(email, password);
      if (validationError) {
        dispatch(setError(validationError));
        return;
      }

      const result = await dispatch(
        loginParent({ email, password })
      ).unwrap();

      if (result?.parentId) {
        connectSocket(result.parentId, "parent");
      }

      router.replace("/Parent/(tabs)/home" as any);
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
          title="Connect to Parents"
          subtitle="Manage your family's screen time"
          error={error}
          submitLabel="Connect"
          onSubmit={onSubmit}
          isLoading={isLoading}
          submitButtonAccessibilityLabel="Login button"
          middleContent={
            <Pressable
              onPress={() => {
                dispatch(setError(null));
                router.push("/Entering/forgotPassword" as any);
              }}
              accessibilityRole="button"
              accessibilityLabel="Forgot password"
              style={({ pressed }) => [
                styles.forgotWrap,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <AppText style={styles.forgotText}>
                Forgot password?
              </AppText>
            </Pressable>
          }
          bottomContent={
            <>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <AppText style={styles.dividerText}>OR</AppText>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.bottomRow}>
                <Pressable
                  onPress={() => {
                    dispatch(setError(null));
                    router.replace("/Entering/registerParent" as any);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Go to registration"
                  style={({ pressed }) => [
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >

                   <AppText style={styles.bottomText}>
                  Don't have an account?{" "}
                      <AppText weight="bold" style={styles.bottomLink}>
                         Register now
                     </AppText>
                </AppText>

                </Pressable>

               
              </View>
            </>
          }
        >
          {/* EMAIL */}
          <View style={styles.input}>
            <MaterialCommunityIcons
              name={ICON.email}
              size={20}
              color="#6B7280"
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.inputText}
              accessibilityLabel="Email input"
            />
          </View>

          {/* PASSWORD */}
          <View style={styles.input}>
            <MaterialCommunityIcons
              name={ICON.lock}
              size={20}
              color="#6B7280"
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.inputText}
              accessibilityLabel="Password input"
            />
            <Pressable
              onPress={() => setShowPassword((s) => !s)}
              accessibilityRole="button"
              accessibilityLabel="Show or hide password"
              hitSlop={10}
              style={({ pressed }) => [
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <MaterialCommunityIcons
                name={showPassword ? ICON.eyeOff : ICON.eye}
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