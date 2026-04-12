import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, ScrollView, Pressable, useWindowDimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { Image } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, ProgressBar, Surface } from "react-native-paper";
import { NativeModules } from "react-native";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/redux/store/types";
import { Child } from "@/src/redux/slices/children-slice";
import { fetchCurrentChildProfileThunk } from "@/src/redux/thunks/childrenThunks";
import { getChildProfileImageUri } from "@/src/utils/childProfileImage";


console.log("NativeModules keys:", Object.keys(NativeModules));
console.log("Screen time module:", NativeModules.ScreenTimeModule);
console.log("App blocker module:", NativeModules.AppBlockerModule);
const { DeviceControl } = NativeModules;

type ScreenTimeState = {
  remainingMinutes: number;
  usedTodayMinutes: number;
  dailyLimitMinutes: number;
  extraMinutes: number;
  limitEnabled: boolean;
};

export default function HomeScreen() {
  const params = useLocalSearchParams<{ initialName?: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { width } = useWindowDimensions();

  const [screenTime, setScreenTime] = useState<ScreenTimeState>({
    remainingMinutes: 0,
    usedTodayMinutes: 0,
    dailyLimitMinutes: 0,
    extraMinutes: 0,
    limitEnabled: false,
  });

  const activeChildId = useSelector((state: RootState) => state.auth.activeChildId);
  const childrenList = useSelector((state: RootState) => state.children.childrenList);

  const activeChildData = useMemo(() => {
    if (!activeChildId || String(activeChildId).trim() === "") return undefined;

    const list = Array.isArray(childrenList) ? childrenList : [];
    return list.find((child: Child) => String(child._id) === String(activeChildId));
  }, [activeChildId, childrenList]);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchCurrentChildProfileThunk());
    }, [dispatch])
  );

  const loadScreenTime = useCallback(async () => {
    try {
      if (!DeviceControl?.getRemainingTime) {
  console.log("DeviceControl not available");
  return;
}

const result = await DeviceControl.getRemainingTime();
      setScreenTime({
        remainingMinutes: Number(result?.remainingMinutes) || 0,
        usedTodayMinutes: Number(result?.usedTodayMinutes) || 0,
        dailyLimitMinutes: Number(result?.dailyLimitMinutes) || 0,
        extraMinutes: Number(result?.extraMinutes) || 0,
        limitEnabled: Boolean(result?.limitEnabled),
      });
    } catch (error) {
      console.log("Error loading screen time", error);
    }
  }, []);

  useEffect(() => {
    loadScreenTime();

    const interval = setInterval(() => {
      loadScreenTime();
    }, 5000);

    return () => clearInterval(interval);
  }, [loadScreenTime]);

  const userName = (
    activeChildData?.name?.trim() ||
    (typeof params.initialName === "string" ? params.initialName.trim() : "") ||
    "Child"
  ).trim();

  const profileImageUri = useMemo(
    () => getChildProfileImageUri(activeChildData?.img),
    [activeChildData?.img]
  );

  const avatarLetter = userName.length ? Array.from(userName)[0] ?? "C" : "C";

  const formatTime = (minutes: number) => {
    const safeMinutes = Math.max(0, Number(minutes) || 0);
    const hours = Math.floor(safeMinutes / 60);
    const mins = safeMinutes % 60;

    return `\u200E${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}\u200E`;
  };

  const totalMinutes = screenTime.dailyLimitMinutes + screenTime.extraMinutes;

  const remainingProgress =
    screenTime.limitEnabled && totalMinutes > 0
      ? Math.max(0, Math.min(screenTime.remainingMinutes / totalMinutes, 1))
      : 0;

  const timeValue = screenTime.limitEnabled
    ? formatTime(screenTime.remainingMinutes)
    : "No limit";

  const timeSize = width < 390 ? 42 : width < 768 ? 56 : 66;
  const contentMaxWidth = width >= 900 ? 760 : 560;

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, { maxWidth: contentMaxWidth }]}>
          <Surface style={styles.heroSurface} elevation={0}>
            <View style={styles.heroBackgroundAccentTop} />
            <View style={styles.heroBackgroundAccentBottom} />

            <View style={styles.profileRow}>
              <View style={styles.avatarShell}>
                {profileImageUri ? (
                  <Image
                    source={{ uri: profileImageUri }}
                    style={styles.avatarImage}
                    contentFit="cover"
                    transition={180}
                    accessibilityLabel={userName}
                  />
                ) : (
                  <View style={styles.avatarFallback}>
                    <AppText weight="extraBold" style={styles.avatarLetter}>
                      {avatarLetter}
                    </AppText>
                  </View>
                )}
              </View>

              <View style={styles.nameBlock}>
                <AppText weight="medium" style={styles.kicker}>
                  Child Profile
                </AppText>

                <AppText weight="extraBold" style={styles.name} numberOfLines={1}>
                  {userName}
                </AppText>
              </View>
            </View>

            <View style={styles.timePanel}>
              <View style={styles.timePanelHeader}>
                <View style={styles.timeIconBadge}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={22}
                    color="#2F6DEB"
                  />
                </View>

                <AppText weight="bold" style={styles.timeLabel}>
                  Time left
                </AppText>
              </View>

              <AppText
                weight="extraBold"
                style={[styles.timeValue, { fontSize: timeSize }]}
              >
                {timeValue}
              </AppText>

              <ProgressBar
                progress={remainingProgress}
                color="#2F6DEB"
                style={styles.progressBar}
              />
            </View>

            <Pressable
              onPress={() => router.push("/Child/extendTime" as Href)}
              accessibilityRole="button"
              accessibilityLabel="Open extension request screen"
              style={styles.secondaryLink}
            >
              <AppText weight="bold" style={styles.secondaryLinkText}>
                 request more time
              </AppText>
            </Pressable>
          </Surface>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}