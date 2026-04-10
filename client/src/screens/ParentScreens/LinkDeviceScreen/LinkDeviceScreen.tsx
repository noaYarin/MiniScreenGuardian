import React, { useEffect, useState } from "react";
import {
  View,
  Pressable,
  useWindowDimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./linkDeviceScreen.styles";
import { generateCodeForPairingChild } from "@/src/redux/thunks/authThunks";
import { setError } from "@/src/redux/slices/auth-slice";
import type { RootState, AppDispatch } from "@/src/redux/store/types";

type Mode = "barcode" | "code";

const qrImageUrlForToken = (token: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(token)}`;

function getErrorMessage(error: string | null): string {
  switch (error) {
    case "linkChildren.invalid_child_selection":
      return "Invalid child selected. Please go back and choose the child again.";
    case "linkChildren.error_generic":
      return "Failed to link device, please try again.";
    case "api.generic_error":
      return "Something went wrong. Please try again.";
    case "api.unauthorized":
      return "Session expired. Please log in again.";
    default:
      return error ?? "";
  }
}

export default function LinkDeviceScreen() {
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
    (children.length > 0 && !children.some((child) => child._id === targetChildId));

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
        if (!ignoreResult) {
          dispatch(setError(message));
        }
      });

    return () => {
      ignoreResult = true;
    };
  }, [childSelectionInvalid, dispatch, parentId, targetChildId]);

  const errorMessage = getErrorMessage(authError);

  return (
    <ScreenLayout>
      <View style={styles.page}>
        <View style={[styles.card, { maxWidth: cardMaxWidth }]}>
          <View style={styles.segmentWrap} accessibilityRole="tablist">
            <Pressable
              onPress={() => setMode("barcode")}
              accessibilityRole="tab"
              accessibilityState={{ selected: isBarcode }}
              accessibilityLabel="Switch to barcode mode"
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
                Barcode
              </AppText>
            </Pressable>

            <Pressable
              onPress={() => setMode("code")}
              accessibilityRole="tab"
              accessibilityState={{ selected: !isBarcode }}
              accessibilityLabel="Switch to code mode"
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
                Code
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
            Connect to Parent Account
          </AppText>

          <AppText weight="medium" style={styles.subtitle}>
            {isBarcode
              ? "Ask your parent to scan the barcode on their screen."
              : "Use this code on the parent device to connect this child."}
          </AppText>

          {isBarcode ? (
            <View style={styles.qrCard}>
              <View style={styles.qrBox}>
                {qrImageUri ? (
                  <Image
                    source={{ uri: qrImageUri }}
                    style={styles.qrImage}
                    accessibilityLabel="Pairing barcode"
                  />
                ) : (
                  <ActivityIndicator size="large" color="#1E3A8A" />
                )}
              </View>

              {!!errorMessage && <AppText style={styles.errorText}>{errorMessage}</AppText>}
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

              {!!errorMessage && <AppText style={styles.errorText}>{errorMessage}</AppText>}
            </View>
          )}
        </View>
      </View>
    </ScreenLayout>
  );
}