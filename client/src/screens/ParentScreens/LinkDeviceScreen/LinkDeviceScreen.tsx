import React, { useEffect, useState } from "react";
import { View, Pressable, useWindowDimensions, Image, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./linkDeviceScreen.styles";
import { generateCodeForPairingChild } from "@/src/redux/thunks/authThunks";
import { setError } from "@/src/redux/slices/auth-slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/src/redux/store/types";

type Mode = "barcode" | "code";

// Generate a QR code image URL from a given token
const qrImageUrlForToken = (token: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(token)}`;

export default function LinkDeviceScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();
  const parentId = useSelector((state: RootState) => state.auth.parentId);
  const authError = useSelector((state: RootState) => state.auth.error);
  const childrenList = useSelector((state: RootState) => state.children.childrenList);
  const children = Array.isArray(childrenList) ? childrenList : [];
  const params = useLocalSearchParams<{ id?: string }>();
  const targetChildId =
    typeof params.id === "string" && params.id.trim().length > 0 ? params.id : null;

  const childSelectionInvalid =
    !targetChildId ||
    (children.length > 0 && !children.some((c) => c._id === targetChildId));

  // Barcode or Code
  const [mode, setMode] = useState<Mode>("barcode");
  const [code, setCode] = useState("");
  const [barcodeToken, setBarcodeToken] = useState("");
  const isBarcode = mode === "barcode";

  const qrImageUri = barcodeToken ? qrImageUrlForToken(barcodeToken) : "";
  const cardMaxWidth = width >= 900 ? 520 : width >= 650 ? 480 : 420;

  useEffect(() => {
    if (childSelectionInvalid) {
      dispatch(setError("linkChildren.invalid_child_selection"));
      setCode("");
      setBarcodeToken("");
      return;
    }

    dispatch(setError(null));
    if (!parentId || !targetChildId) return;

    // If parent dont want the pairing, we will ignore the result
    let ignoreResult = false;

    dispatch(generateCodeForPairingChild({ parentId, childId: targetChildId }))
      .unwrap()
      .then((result) => {
        if (ignoreResult) return;
        setCode(result.code);
        setBarcodeToken(result.barcodeToken);
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : String(error);
        console.error(message);
        if (!ignoreResult) dispatch(setError(message));
      });

    return () => {
      ignoreResult = true;
    };
  }, [childSelectionInvalid, dispatch, parentId, targetChildId]);

  const errorLine = authError ? (
    <AppText style={styles.errorText}>{t(authError)}</AppText>
  ) : null;

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
            </Pressable>
          </View>

          <View style={styles.iconCircle} accessible accessibilityRole="image">
            <MaterialCommunityIcons
              name={isBarcode ? "qrcode-scan" : "link-variant"}
              size={34}
              color="#1E3A8A"
            />
          </View>

          <AppText weight="extraBold" style={styles.title} numberOfLines={2}>
            {t("linkChildren.heading")}
          </AppText>

          {isBarcode ? (
            <View style={styles.qrCard}>
              <View style={styles.qrBox}>
                {qrImageUri ? (
                  <Image
                    source={{ uri: qrImageUri }}
                    style={styles.qrImage}
                    accessibilityLabel={t("linkChildren.tab_barcode_a11y")}
                  />
                ) : (
                  <ActivityIndicator size="large" color="#1E3A8A" />
                )}
              </View>

              {errorLine}
            </View>
          ) : (
            <View style={styles.codeArea}>
              <View style={styles.inputWrap}>
                <View style={styles.codeDisplayContainer}>
                  <AppText
                    weight="extraBold"
                    style={styles.codeDisplayText}
                    numberOfLines={1}
                  >
                    {code.trim() || "----"}
                  </AppText>
                </View>
              </View>
              {errorLine}
            </View>
          )}
        </View>
      </View>
    </ScreenLayout>
  );
}