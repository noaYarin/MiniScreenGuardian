import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Stack, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { NativeModules } from "react-native";
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";
import { pickRTL } from "../../../locales/rtl";

import type { AppDispatch, RootState } from "@/src/redux/store/types";
import {
  createRequestThunk,
  fetchMyRequestsThunk,
} from "@/src/redux/thunks/requestThunks";

const { DeviceControl } = NativeModules;

type MinuteOption = {
  minutes: number;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  tile: "blue" | "purple" | "green";
};

export default function ExtendTimeRequestScreen() {
  const { t } = useTranslation();
  const { isRTL, row, text } = useLocaleLayout();
  const dispatch = useDispatch<AppDispatch>();

  const { activeChildId, deviceId } = useSelector(
    (state: RootState) => state.auth
  );

  const devicesByChild = useSelector(
    (state: RootState) => state.devices.byChildId
  );

  const myRequests = useSelector(
    (state: RootState) => state.requests.mine ?? []
  );

  const device =
    devicesByChild[activeChildId ?? ""]?.find(
      (d) => String(d._id) === String(deviceId)
    ) ?? null;

  const minuteOptions: MinuteOption[] = useMemo(
    () => [
      { minutes: 10, icon: "clock-outline", tile: "blue" },
      { minutes: 5, icon: "clock-outline", tile: "purple" },
      { minutes: 15, icon: "clock-outline", tile: "green" },
    ],
    []
  );

  const [selectedMinutes, setSelectedMinutes] = useState<number>(
    minuteOptions[0]?.minutes ?? 5
  );
  const [customMinutes, setCustomMinutes] = useState<number>(5);
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchMyRequestsThunk());
  }, [dispatch]);

  const hasPendingRequestForThisDevice = myRequests.some(
    (request) =>
      String(request.deviceId) === String(deviceId) &&
      request.status === "PENDING"
  );

  const selectPreset = (m: number) => setSelectedMinutes(m);

  const selectCustom = (m: number) => {
    setCustomMinutes(m);
    setSelectedMinutes(m);
  };

  const incCustom = () => selectCustom(Math.min(120, customMinutes + 1));
  const decCustom = () => selectCustom(Math.max(1, customMinutes - 1));

  const getErrorMessage = (msg?: string) => {
    if (!msg) return t("api.generic_error");

    const lower = msg.toLowerCase();

    if (lower.includes("already")) {
      return t(
        "extendTime.alreadyRequested",
        "A pending extension request already exists for this device"
      );
    }

    if (lower.includes("invalid")) {
      return t("extendTime.invalidMinutes", "Invalid number of minutes");
    }

    return msg;
  };

  const onSend = async () => {
    if (isSubmitting) return;

    try {
      if (!deviceId) {
        Alert.alert(
          t("common.error"),
          t("extendTime.noDevice", "No linked device found")
        );
        return;
      }

      if (!selectedMinutes || selectedMinutes < 1 || selectedMinutes > 120) {
        Alert.alert(
          t("common.error"),
          t("extendTime.invalidMinutes", "Invalid number of minutes")
        );
        return;
      }

      await DeviceControl.syncPolicyNow();
      const nativeState = await DeviceControl.getRemainingTime();

      const hasActiveLimit =
        !!nativeState?.limitEnabled &&
        Number(nativeState?.dailyLimitMinutes ?? 0) > 0;

      if (!hasActiveLimit) {
        Alert.alert(
          t("common.error"),
          t(
            "extendTime.noActiveLimit",
            "There is no active screen-time limit on this device"
          )
        );
        return;
      }

      if (hasPendingRequestForThisDevice) {
        Alert.alert(
          t("common.error"),
          t(
            "extendTime.alreadyRequested",
            "A pending extension request already exists for this device"
          )
        );
        return;
      }

      setIsSubmitting(true);

      await dispatch(
        createRequestThunk({
          deviceId,
          requestedMinutes: selectedMinutes,
          reason: message.trim(),
        })
      ).unwrap();

      Alert.alert(
        t("common.success"),
        t("extendTime.requestSent", "Extension request sent successfully")
      );

      router.back();
    } catch (error) {
      Alert.alert(
        t("common.error"),
        getErrorMessage((error as Error)?.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const firstControlAction = pickRTL(isRTL, incCustom, decCustom);
  const secondControlAction = pickRTL(isRTL, decCustom, incCustom);

  const firstControlIcon = pickRTL<
    React.ComponentProps<typeof MaterialCommunityIcons>["name"]
  >(isRTL, "plus", "minus");

  const secondControlIcon = pickRTL<
    React.ComponentProps<typeof MaterialCommunityIcons>["name"]
  >(isRTL, "minus", "plus");

  const firstControlA11y = pickRTL(
    isRTL,
    t("extendTime.customPlus_a11y"),
    t("extendTime.customMinus_a11y")
  );

  const secondControlA11y = pickRTL(
    isRTL,
    t("extendTime.customMinus_a11y"),
    t("extendTime.customPlus_a11y")
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: t("extendTime.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />

      <ScreenLayout>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          <View style={styles.outer}>
            <View style={styles.container}>
              <View style={[styles.subTitleRow, row]}>
                <View style={styles.subTitleIconBadge}>
                  <MaterialCommunityIcons
                    name="trending-up"
                    size={16}
                    color="#2F6DEB"
                  />
                </View>
                <AppText weight="bold" style={styles.subTitle}>
                  {t("extendTime.subTitle")}
                </AppText>
              </View>

              <AppText weight="extraBold" style={styles.question}>
                {t("extendTime.question")}
              </AppText>

              <View style={styles.grid}>
                <View style={styles.row}>
                  <MinuteCard
                    minutes={minuteOptions[0].minutes}
                    iconName={minuteOptions[0].icon}
                    active={selectedMinutes === minuteOptions[0].minutes}
                    tile={minuteOptions[0].tile}
                    onPress={() => selectPreset(minuteOptions[0].minutes)}
                    a11y={t("extendTime.option_a11y", {
                      minutes: minuteOptions[0].minutes,
                    })}
                    minutesLabel={t("extendTime.minutes")}
                  />

                  <MinuteCard
                    minutes={minuteOptions[1].minutes}
                    iconName={minuteOptions[1].icon}
                    active={selectedMinutes === minuteOptions[1].minutes}
                    tile={minuteOptions[1].tile}
                    onPress={() => selectPreset(minuteOptions[1].minutes)}
                    a11y={t("extendTime.option_a11y", {
                      minutes: minuteOptions[1].minutes,
                    })}
                    minutesLabel={t("extendTime.minutes")}
                  />
                </View>

                <View style={styles.row}>
                  <View
                    style={[
                      styles.cardBase,
                      styles.tileOrange,
                      selectedMinutes === customMinutes ? styles.cardActive : null,
                    ]}
                    accessible={false}
                  >
                    <Pressable
                      onPress={() => selectCustom(customMinutes)}
                      accessibilityRole="button"
                      accessibilityLabel={t("extendTime.custom_a11y")}
                      style={({ pressed }) => [
                        styles.cardOverlayPressable,
                        pressed ? styles.cardPressed : null,
                      ]}
                    />

                    <View style={styles.customTopRow}>
                      <View style={styles.orangeBadge}>
                        <MaterialCommunityIcons
                          name="clock-outline"
                          size={18}
                          color="#B46B00"
                        />
                      </View>
                    </View>

                    <AppText weight="extraBold" style={styles.customLabel}>
                      {t("extendTime.customTitle")}
                    </AppText>

                    <View style={[styles.customValueRow, row]}>
                      <Pressable
                        onPress={firstControlAction}
                        accessibilityRole="button"
                        accessibilityLabel={firstControlA11y}
                        hitSlop={10}
                        style={({ pressed }) => [
                          styles.customControlBtn,
                          pressed ? styles.pressedOpacity : null,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={firstControlIcon}
                          size={18}
                          color="#B46B00"
                        />
                      </Pressable>

                      <AppText weight="extraBold" style={styles.customValue}>
                        {customMinutes}
                      </AppText>

                      <Pressable
                        onPress={secondControlAction}
                        accessibilityRole="button"
                        accessibilityLabel={secondControlA11y}
                        hitSlop={10}
                        style={({ pressed }) => [
                          styles.customControlBtn,
                          pressed ? styles.pressedOpacity : null,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={secondControlIcon}
                          size={18}
                          color="#B46B00"
                        />
                      </Pressable>
                    </View>

                    <AppText style={styles.customUnit}>
                      {t("extendTime.minutes")}
                    </AppText>
                  </View>

                  <MinuteCard
                    minutes={minuteOptions[2].minutes}
                    iconName={minuteOptions[2].icon}
                    active={selectedMinutes === minuteOptions[2].minutes}
                    tile={minuteOptions[2].tile}
                    onPress={() => selectPreset(minuteOptions[2].minutes)}
                    a11y={t("extendTime.option_a11y", {
                      minutes: minuteOptions[2].minutes,
                    })}
                    minutesLabel={t("extendTime.minutes")}
                  />
                </View>
              </View>

              <View style={styles.summaryBar}>
                <View style={styles.summaryBadge}>
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={18}
                    color="#0F8A5F"
                  />
                </View>
                <AppText weight="extraBold" style={styles.summaryText}>
                  {t("extendTime.requestedLabel")}{" "}
                  {t("extendTime.plusMinutes", { minutes: selectedMinutes })}
                </AppText>
              </View>

              <View style={styles.messageBlock}>
                <AppText weight="bold" style={[styles.messageLabel, text]}>
                  {t("extendTime.messageLabel")}
                </AppText>
                <TextInput
                  value={message}
                  onChangeText={setMessage}
                  placeholder={t("extendTime.messagePlaceholder")}
                  placeholderTextColor="#8A8A8A"
                  style={[styles.messageInput, text]}
                  multiline
                  accessibilityLabel={t("extendTime.message_a11y")}
                />
              </View>

              <Pressable
                onPress={onSend}
                disabled={isSubmitting || hasPendingRequestForThisDevice}
                accessibilityRole="button"
                accessibilityLabel={t("extendTime.send_a11y")}
                style={({ pressed }) => [
                  styles.sendBtn,
                  pressed ? styles.sendBtnPressed : null,
                  (isSubmitting || hasPendingRequestForThisDevice) && {
                    opacity: 0.6,
                  },
                ]}
              >
                <View style={styles.sendIconBadge}>
                  <MaterialCommunityIcons name="send" size={16} color="#FFFFFF" />
                </View>
                <AppText weight="extraBold" style={styles.sendBtnText}>
                  {hasPendingRequestForThisDevice
                    ? t(
                      "extendTime.alreadyRequested",
                      "A pending extension request already exists for this device"
                    )
                    : isSubmitting
                      ? t("extendTime.sending", "Sending...")
                      : t("extendTime.send")}
                </AppText>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScreenLayout>
    </>
  );
}

function MinuteCard({
  minutes,
  iconName,
  active,
  tile,
  onPress,
  a11y,
  minutesLabel,
}: {
  minutes: number;
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  active: boolean;
  tile: "blue" | "purple" | "green";
  onPress: () => void;
  a11y: string;
  minutesLabel: string;
}) {
  const tileStyle =
    tile === "blue"
      ? styles.tileBlue
      : tile === "purple"
        ? styles.tilePurple
        : styles.tileGreen;

  const iconColor =
    tile === "blue" ? "#2F6DEB" : tile === "purple" ? "#6D28D9" : "#0F8A5F";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      style={({ pressed }) => [
        styles.cardBase,
        tileStyle,
        active ? styles.cardActive : null,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <View style={styles.tileIconBadge}>
        <MaterialCommunityIcons name={iconName} size={18} color={iconColor} />
      </View>

      <AppText weight="extraBold" style={styles.minutesValue}>
        +{minutes}
      </AppText>

      <AppText style={styles.minutesLabel}>{minutesLabel}</AppText>
    </Pressable>
  );
}