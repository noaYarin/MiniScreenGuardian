import React, { useMemo, useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { loginParent } from "@/src/redux/thunks/authThunks";
import { useDispatch, useSelector } from "react-redux";
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import AuthFormCard from "../../../components/AuthFormCard/AuthFormCard";
import { validateLogin } from "@/src/validation/authValidation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";
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
  const { t } = useTranslation();
  const { isRTL } = useLocaleLayout();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: { auth: { isLoading: boolean; error: string | null } }) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async () => {
    try {
      dispatch(setError(null));
      const errorKey = validateLogin(email, password);
      if (errorKey) {
        dispatch(setError(errorKey));
        return;
      }
     const result = await dispatch(loginParent({ email, password })).unwrap();
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

  const inputRowStyle = useMemo(
    () => [styles.input, isRTL && styles.inputRTL],
    [isRTL]
  );

  const inputTextStyle = useMemo(
    () => [styles.inputText, isRTL && styles.inputTextRTL],
    [isRTL]
  );

  return (
    <ScreenLayout>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <AuthFormCard
          iconName={ICON.users}
          iconGradientColors={["#2563EB", "#7C3AED"]}
          title={t("loginParent.heading")}
          subtitle={t("loginParent.subheading")}
          error={error ? t(error) : null}
          submitLabel={t("loginParent.connect")}
          onSubmit={onSubmit}
          isLoading={isLoading}
          submitButtonAccessibilityLabel={t("loginParent.connect_a11y")}
          middleContent={
            <Pressable
              onPress={() => {
                dispatch(setError(null));
                router.push("/Entering/forgotPassword" as any);
              }}
              accessibilityRole="button"
              accessibilityLabel={t("loginParent.forgot_a11y")}
              style={({ pressed }) => [styles.forgotWrap, { opacity: pressed ? 0.7 : 1 }]}
            >
              <AppText style={styles.forgotText}>{t("loginParent.forgot")}</AppText>
            </Pressable>
          }
          bottomContent={
            <>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <AppText style={styles.dividerText}>{t("loginParent.or")}</AppText>
                <View style={styles.dividerLine} />
              </View>
              <View style={styles.bottomRow}>
                <Pressable
                  onPress={() => {
                    dispatch(setError(null));
                    router.replace("/Entering/registerParent" as any);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={t("loginParent.register_a11y")}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <AppText weight="bold" style={styles.bottomLink}>
                    {t("loginParent.register")}
                  </AppText>
                </Pressable>
                <AppText style={styles.bottomText}>
                  {t("loginParent.no_account")}
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
              placeholder={t("loginParent.email_placeholder")}
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={inputTextStyle}
              accessibilityLabel={t("loginParent.email_a11y")}
            />
          </View>

          <View style={inputRowStyle}>
            <MaterialCommunityIcons name={ICON.lock} size={20} color="#6B7280" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder={t("loginParent.password_placeholder")}
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              style={inputTextStyle}
              accessibilityLabel={t("loginParent.password_a11y")}
            />
            <Pressable
              onPress={() => setShowPassword((s) => !s)}
              accessibilityRole="button"
              accessibilityLabel={t("loginParent.toggle_password_a11y")}
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
        </AuthFormCard>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}
