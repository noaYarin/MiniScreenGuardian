import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { NativeModules } from "react-native";
import { Button, Surface, TextInput as PaperTextInput } from "react-native-paper";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

import type { AppDispatch, RootState } from "@/src/redux/store/types";
import {
  createRequestThunk,
  fetchMyRequestsThunk,
} from "@/src/redux/thunks/requestThunks";
import { showErrorToast, showSuccessToast } from "@/src/utils/appToast";

// Native module for device control actions and current screen-time status
const { DeviceControl } = NativeModules;

type MinuteOption = {
  minutes: number;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  tile: "blue" | "green";
};

export default function ExtendTimeRequestScreen() {
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
      { minutes: 30, icon: "clock-outline", tile: "green" },
    ],
    []
  );

  const [selectedMinutes, setSelectedMinutes] = useState<number>(10);
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

  const selectPreset = (minutes: number) => setSelectedMinutes(minutes);

  const selectCustom = (minutes: number) => {
    setCustomMinutes(minutes);
    setSelectedMinutes(minutes);
  };

  const incCustom = () => selectCustom(Math.min(120, customMinutes + 1));
  const decCustom = () => selectCustom(Math.max(1, customMinutes - 1));

  const getErrorMessage = (msg?: string) => {
    if (!msg) return "Something went wrong. Please try again.";

    const lower = msg.toLowerCase();

    if (lower.includes("already")) {
      return "A pending extension request already exists for this device";
    }

    if (lower.includes("invalid")) {
      return "Invalid number of minutes";
    }

    return msg;
  };

  const onSend = async () => {
    if (isSubmitting) return;

    try {
      if (!deviceId) {
        showErrorToast("No linked device found", "Error");
        return;
      }

      if (!selectedMinutes || selectedMinutes < 1 || selectedMinutes > 120) {
        showErrorToast("Invalid number of minutes", "Error");
        return;
      }

      if (!DeviceControl?.getRemainingTime || !DeviceControl?.syncPolicyNow) {
        showErrorToast("Device control is not available on this device", "Error");
        return;
      }

      await DeviceControl.syncPolicyNow();
      const nativeState = await DeviceControl.getRemainingTime();

      const hasActiveLimit =
        !!nativeState?.limitEnabled &&
        Number(nativeState?.dailyLimitMinutes ?? 0) > 0;

      if (!hasActiveLimit) {
        showErrorToast(
          "No screen-time limit is active right now",
          "Error"
        );
        return;
      }

      if (hasPendingRequestForThisDevice) {
        showErrorToast(
          "You already have a pending request for more time.",
          "Error"
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

      showSuccessToast("Extension request sent successfully.");

      router.back();
    } catch (error) {
      showErrorToast(getErrorMessage((error as Error)?.message), "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.outer}>
            <Surface style={styles.heroSurface} elevation={0}>
              <View style={styles.heroAccentTop} />
              <View style={styles.heroAccentBottom} />

              <View style={styles.headerBlock}>
                <View style={styles.subTitleRow}>
                  <View style={styles.subTitleIconBadge}>
                    <MaterialCommunityIcons
                      name="clock-plus-outline"
                      size={16}
                      color="#2F6DEB"
                    />
                  </View>

                  <AppText weight="bold" style={styles.subTitle}>
                    Extension Request
                  </AppText>
                </View>

                <AppText weight="extraBold" style={styles.question}>
                  How much time to request?
                </AppText>

                <AppText weight="medium" style={styles.helperText}>
                  Choose a quick option or set your own amount.
                </AppText>
              </View>

              <View style={styles.grid}>
                <View style={styles.rowTwo}>
                  <MinuteCard
                    minutes={minuteOptions[0].minutes}
                    iconName={minuteOptions[0].icon}
                    active={selectedMinutes === minuteOptions[0].minutes}
                    tile={minuteOptions[0].tile}
                    onPress={() => selectPreset(minuteOptions[0].minutes)}
                    a11y={`Select ${minuteOptions[0].minutes} extra minutes`}
                    minutesLabel="minutes"
                  />

                  <MinuteCard
                    minutes={minuteOptions[1].minutes}
                    iconName={minuteOptions[1].icon}
                    active={selectedMinutes === minuteOptions[1].minutes}
                    tile={minuteOptions[1].tile}
                    onPress={() => selectPreset(minuteOptions[1].minutes)}
                    a11y={`Select ${minuteOptions[1].minutes} extra minutes`}
                    minutesLabel="minutes"
                  />
                </View>

                <View style={styles.customRow}>
                  <View
                    style={[
                      styles.customCard,
                      selectedMinutes === customMinutes ? styles.cardActive : null,
                    ]}
                    accessible={false}
                  >
                    <Pressable
                      onPress={() => selectCustom(customMinutes)}
                      accessibilityRole="button"
                      accessibilityLabel="Select a custom amount"
                      style={({ pressed }) => [
                        styles.cardOverlayPressable,
                        pressed ? styles.cardPressed : null,
                      ]}
                    />

                    <View style={styles.customTopRow}>
                      <View style={styles.orangeBadge}>
                        <MaterialCommunityIcons
                          name="pencil-outline"
                          size={18}
                          color="#B46B00"
                        />
                      </View>
                    </View>

                    <AppText weight="extraBold" style={styles.customLabel}>
                      Custom
                    </AppText>

                    <View style={styles.customValueRow}>
                      <Pressable
                        onPress={decCustom}
                        accessibilityRole="button"
                        accessibilityLabel="Decrease minutes"
                        hitSlop={10}
                        style={({ pressed }) => [
                          styles.customControlBtn,
                          pressed ? styles.pressedOpacity : null,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="minus"
                          size={18}
                          color="#B46B00"
                        />
                      </Pressable>

                      <AppText weight="extraBold" style={styles.customValue}>
                        {customMinutes}
                      </AppText>

                      <Pressable
                        onPress={incCustom}
                        accessibilityRole="button"
                        accessibilityLabel="Increase minutes"
                        hitSlop={10}
                        style={({ pressed }) => [
                          styles.customControlBtn,
                          pressed ? styles.pressedOpacity : null,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="plus"
                          size={18}
                          color="#B46B00"
                        />
                      </Pressable>
                    </View>

                    <AppText style={styles.customUnit}>minutes</AppText>
                  </View>
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
                  Requested: +{selectedMinutes} minutes
                </AppText>
              </View>

              <View style={styles.messageBlock}>
                <AppText weight="bold" style={styles.messageLabel}>
                  Message to parent (optional)
                </AppText>

                <PaperTextInput
                  mode="outlined"
                  value={message}
                  onChangeText={setMessage}
                  placeholder="I want to finish watching the movie..."
                  multiline
                  numberOfLines={4}
                  accessibilityLabel="Message field"
                  style={styles.messageInput}
                  contentStyle={styles.messageInputContent}
                  outlineStyle={styles.messageInputOutline}
                  theme={{
                    roundness: 18,
                    colors: {
                      primary: "#2F6DEB",
                      outline: "#D6E6FF",
                      background: "#FFFFFF",
                      onSurfaceVariant: "#8A8A8A",
                    },
                  }}
                />
              </View>

              <Button
                mode="contained"
                onPress={onSend}
                disabled={isSubmitting || hasPendingRequestForThisDevice}
                accessibilityLabel="Send extension request"
                style={[
                  styles.sendBtn,
                  (isSubmitting || hasPendingRequestForThisDevice) && styles.sendBtnDisabled,
                ]}
                contentStyle={styles.sendBtnContent}
                labelStyle={[
                  styles.sendBtnText,
                  (isSubmitting || hasPendingRequestForThisDevice) && styles.sendBtnTextDisabled,
                ]}
                buttonColor={
                  isSubmitting || hasPendingRequestForThisDevice ? "#E5E7EB" : "#16A34A"
                }
                textColor={
                  isSubmitting || hasPendingRequestForThisDevice ? "#475569" : "#FFFFFF"
                }
                icon="send"
              >
                {hasPendingRequestForThisDevice
                  ? "Pending request already sent"
                  : isSubmitting
                    ? "Sending..."
                    : "Send request to parent"}
              </Button>
            </Surface>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
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
  tile: "blue" | "green";
  onPress: () => void;
  a11y: string;
  minutesLabel: string;
}) {
  const tileStyle = tile === "blue" ? styles.tileBlue : styles.tileGreen;
  const iconColor = tile === "blue" ? "#2F6DEB" : "#0F8A5F";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      style={({ pressed }) => [
        styles.minuteCard,
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