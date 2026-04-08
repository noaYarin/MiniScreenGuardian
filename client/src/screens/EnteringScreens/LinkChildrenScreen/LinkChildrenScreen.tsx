import React, { useEffect, useRef, useState } from "react";
import { View, Pressable, TextInput, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { useDispatch } from "react-redux";
import { apiLinkDevice } from "../../../api/auth";
import { buildDeviceConnectionPayload } from "../../../lib/deviceConnectionInfo";
import { hydrateChildSession } from "../../../redux/slices/auth-slice";
import type { AppDispatch } from "../../../redux/store/types";
import { styles } from "./styles";
import { NativeModules } from "react-native";
import * as Location from "expo-location";  
import { updateDeviceLocation } from "../../../redux/thunks/deviceThunks";
import { showAppToast } from "@/src/utils/appToast";

/** After a failed link, wait before re-enabling scan so the camera does not instantly re-read the same QR. */
const ERROR_RELEASE_DELAY = 750;

type Mode = "barcode" | "code";

export default function LinkChildrenScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();

  const [mode, setMode] = useState<Mode>("barcode");
  const [code, setCode] = useState("");
  const [permission, requestPermission] = useCameraPermissions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const linkInFlightRef = useRef(false);
  const finishLinkErrorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isBarcode = mode === "barcode";

  const cardMaxWidth = width >= 900 ? 520 : width >= 650 ? 480 : 420;

  // Resets the linking state and releases the lock.
  const finishLink = () => {
    linkInFlightRef.current = false;
    setIsSubmitting(false);
  };

  const tryBeginLink = () => {
    if (linkInFlightRef.current) return false;
    linkInFlightRef.current = true;
    setIsSubmitting(true);
    return true;
  };

  // Prevents the camera from immediately re-scanning the same QR after an error.
  const scheduleFinishLinkAfterError = () => {
    if (finishLinkErrorTimeoutRef.current) {
      clearTimeout(finishLinkErrorTimeoutRef.current);
    }
    finishLinkErrorTimeoutRef.current = setTimeout(() => {
      finishLinkErrorTimeoutRef.current = null;
      finishLink();
    }, ERROR_RELEASE_DELAY);
  };

  const runDeviceLink = async (params: { code: string; barcodeToken: string }) => {
    if (!tryBeginLink()) return;
    try {
      const res = await apiLinkDevice({ ...params, ...(await buildDeviceConnectionPayload()) });

      // After successful pairing, save config in native storage so the device can send heartbeat
      try {
        await NativeModules.DeviceControl.saveHeartbeatConfig(
          process.env.EXPO_PUBLIC_API_URL,
          res.deviceId,
          res.childToken
        );
      } catch (e) {
        console.log("Failed to save heartbeat config:", e);
      }

      try {
        await NativeModules.DeviceControl.syncPolicyNow();
      } catch (e) {
        console.log("Failed to sync initial policy:", e);
      }

      const dbDeviceId = res.deviceId;
      dispatch(
        hydrateChildSession({
          childToken: res.childToken,
          parentId: res.parentId,
          childId: res.childId,
          deviceId: dbDeviceId,
          physicalId: res.physicalId,
        })
      );

      finishLink();
      router.replace({
        pathname: "/Child/home",
        params: { initialName: res.childName ?? "" }
      });
    } catch(err: any) {
      showAppToast(
        err?.error?.message ?? t("common.error_message"),
        t("linkChildren.error_title")
      );
      scheduleFinishLinkAfterError();
      router.replace("Entering/roleSelectionRoute" as any);
    }
  };

  // Request camera permission on mount when the hook has not resolved yet.
  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission, requestPermission]);

  useEffect(
    () => () => {
      if (finishLinkErrorTimeoutRef.current) clearTimeout(finishLinkErrorTimeoutRef.current);
    },
    []
  );

  // code from parent
  const pairingBtn = async () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    await runDeviceLink({ code: trimmed, barcodeToken: "" });
  };

  // QR payload from parent device
  const handleBarcodeScanned = async (result: { data?: string }) => {
    const token = result?.data?.trim();
    if (!token) return;
    await runDeviceLink({ code: "", barcodeToken: token });
  };

  const segmentIcon = isBarcode ? ("qrcode-scan" as const) : ("link-variant" as const);

  return (
    <ScreenLayout>
      <View style={styles.page}>
        <View style={[styles.card, { maxWidth: cardMaxWidth }]}>
          <View style={styles.segmentWrap} accessibilityRole="tablist">
            <Pressable
              onPress={() => setMode("barcode")}
              accessibilityRole="tab"
              accessibilityState={{ selected: isBarcode }}
              accessibilityLabel={t("linkChildren.tab_barcode_a11y")}
              style={[
                styles.segmentBtn,
                isBarcode ? styles.segmentActive : styles.segmentInactive,
              ]}
            >
              <AppText
                weight={isBarcode ? "extraBold" : "bold"}
                style={[
                  styles.segmentText,
                  isBarcode ? styles.segmentTextActive : styles.segmentTextInactive,
                ]}
                numberOfLines={1}
              >
                {t("linkChildren.tab_barcode")}
              </AppText>
            </Pressable>

            <Pressable
              onPress={() => setMode("code")}
              accessibilityRole="tab"
              accessibilityState={{ selected: !isBarcode }}
              accessibilityLabel={t("linkChildren.tab_code_a11y")}
              style={[
                styles.segmentBtn,
                !isBarcode ? styles.segmentActive : styles.segmentInactive,
              ]}
            >
              <View style={styles.segmentRow}>
                <AppText
                  weight={!isBarcode ? "extraBold" : "bold"}
                  style={[
                    styles.segmentText,
                    !isBarcode ? styles.segmentTextActive : styles.segmentTextInactive,
                  ]}
                  numberOfLines={1}
                >
                  {t("linkChildren.tab_code")}
                </AppText>
              </View>
            </Pressable>
          </View>

          <View style={styles.iconCircle} accessible accessibilityRole="image">
            <MaterialCommunityIcons name={segmentIcon} size={34} color="#1E3A8A" />
          </View>

          <AppText weight="extraBold" style={styles.title} numberOfLines={2}>
            {t("linkChildren.heading")}
          </AppText>

          {isBarcode ? (
            <View style={styles.qrCard}>
              <View style={styles.qrBox}>
                {permission?.granted ? (
                  <CameraView
                    style={styles.cameraView}
                    onBarcodeScanned={isSubmitting ? undefined : handleBarcodeScanned}
                    barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                  />
                ) : (
                  <View style={styles.cameraFallback}>
                    <AppText style={styles.subtitle}>
                      {t("linkChildren.camera_denied_message")}
                    </AppText>
                  </View>
                )}
              </View>

              <Pressable
                onPress={requestPermission}
                accessibilityRole="button"
                accessibilityLabel={t("linkChildren.scan_a11y")}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  { opacity: pressed || isSubmitting ? 0.75 : 1 },
                ]}
                disabled={isSubmitting}
              >
                <AppText weight="extraBold" style={styles.primaryBtnText}>
                  {t("linkChildren.scan")}
                </AppText>
              </Pressable>
            </View>
          ) : (
            <View style={styles.codeArea}>
              <AppText style={styles.subtitle} numberOfLines={3}>
                {t("linkChildren.sub_code")}
              </AppText>
              <View style={styles.inputWrap}>
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  placeholder={t("linkChildren.code_placeholder")}
                  autoComplete="off"
                  autoFocus
                  keyboardType="numeric"
                  maxLength={6}
                  style={styles.input}
                  accessibilityLabel={t("linkChildren.code_input_a11y")}
                />
              </View>

              <Pressable
                onPress={pairingBtn}
                disabled={!code.trim() || isSubmitting}
                accessibilityRole="button"
                accessibilityLabel={t("linkChildren.submit_a11y")}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  !code.trim() ? styles.primaryBtnDisabled : null,
                  { opacity: pressed || isSubmitting ? 0.75 : 1 },
                ]}
              >
                <AppText weight="extraBold" style={styles.primaryBtnText}>
                  {t("linkChildren.connect")}
                </AppText>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </ScreenLayout>
  );
}
