// client/src/screens/ChildrenScreens/HomeScreenChild/HomeScreen.tsx

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { View, Pressable, useWindowDimensions, StyleProp, ViewStyle } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { router, Stack, useLocalSearchParams, type Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-root-toast";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles, TILE_COLORS } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";
import { pickRTL } from "../../../locales/rtl";
import type { SupportedLanguage } from "../../../locales/i18n";
import { useDispatch, useSelector } from "react-redux";
import { Child } from "@/src/redux/slices/children-slice";
import { fetchCurrentChildProfileThunk } from "@/src/redux/thunks/childrenThunks";
import type { AppDispatch, RootState } from "@/src/redux/store/types";
import { NativeModules } from "react-native";

const { DeviceControl } = NativeModules;
import * as Location from "expo-location";
import { updateDeviceLocation } from "@/src/redux/thunks/deviceThunks";
import { connectSocket, emitEvent, onEvent } from "@/src/services/socket";
import { REQUEST_CHILD_LOCATION } from "@/src/constants/socketEvents";
import { getChildProfileImageUri } from "@/src/utils/childProfileImage";

const ICON = {
  accessibility: "human-wheelchair",
  language: "translate",
  settings: "cog",
  points: "star-circle",
  level: "shield-star",
  coins: "cash",
  time: "clock-outline",
  apps: "apps",
  extend: "clock-plus-outline",
  shop: "shopping-outline",
  tasks: "clipboard-check-outline",
  achievements: "trophy",
  goals: "target",
  reports: "information-box",
  bulb: "lightbulb-on-outline",
  help: "help-circle-outline",
  panic: "alert-circle-outline",
} as const;

export default function HomeScreen() {
  const { t, currentLanguage, changeLanguage } = useTranslation();
  const params = useLocalSearchParams<{ initialName?: string }>();
  const { isRTL, row, text } = useLocaleLayout();
  const { width } = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();

  const isPhoneSmall = width < 390;
  const isPhone = width < 430;
  const isTablet = width >= 430 && width < 900;
  const isLarge = width >= 900;

  const avatarSize = isPhone ? 92 : isTablet ? 108 : 118;
  const helloSize = isPhone ? 22 : isTablet ? 26 : 28;
  const timerSize = isPhone ? 34 : isTablet ? 40 : 44;

  const [screenTime, setScreenTime] = useState({
    remainingMinutes: 0,
    usedTodayMinutes: 0,
    dailyLimitMinutes: 0,
    extraMinutes: 0,
    limitEnabled: false,
  });

  const activeChildId = useSelector((state: RootState) => state.auth.activeChildId);
  const childrenList = useSelector((state: RootState) => state.children.childrenList);

  const activeChildData = useMemo(() => {
    if (activeChildId == null || String(activeChildId).trim() === "") return undefined;
    const list = Array.isArray(childrenList) ? childrenList : [];
    return list.find((c: Child) => String(c._id) === String(activeChildId));
  }, [childrenList, activeChildId]);
  const deviceId = useSelector((state: RootState) => state.auth.deviceId);
  const parentId = useSelector((state: RootState) => state.auth.parentId);

  
  const handleSyncLocation = async (requestData?: any) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const locationData = { lat: loc.coords.latitude, lng: loc.coords.longitude };

      const targetParentId = requestData?.parentId || parentId;
      if (targetParentId) {
        emitEvent(REQUEST_CHILD_LOCATION, {
          parentId: targetParentId,
          childId: String(activeChildId),
          location: locationData,
          lastUpdated: new Date().toISOString()
        });
      }

      if (deviceId) {
        dispatch(updateDeviceLocation({
          childId: String(activeChildId),
          deviceId,
          location: locationData
        }));
      }
    } catch (error) {
      Toast.show(`${t("common.error")}\n${t("common.error_message", "Failed to sync location")}`, {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
      });
    }
  };

  useEffect(() => {
    if (!activeChildId) return;
  
    connectSocket(String(activeChildId), "child", parentId ? { parentId: String(parentId) } : undefined);
  
    const unsubscribe = onEvent(REQUEST_CHILD_LOCATION, (data) => {
        handleSyncLocation(data);
    });
  
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [activeChildId], );


  useFocusEffect(
    useCallback(() => {
      dispatch(fetchCurrentChildProfileThunk());
    }, [dispatch])
  );

  const loadScreenTime = async () => {
    try {
      const result = await DeviceControl.getRemainingTime();

      setScreenTime({
        remainingMinutes: Number(result.remainingMinutes) || 0,
        usedTodayMinutes: Number(result.usedTodayMinutes) || 0,
        dailyLimitMinutes: Number(result.dailyLimitMinutes) || 0,
        extraMinutes: Number(result.extraMinutes) || 0,
        limitEnabled: Boolean(result.limitEnabled),
      });
    } catch (e) {
      console.log("Error loading screen time", e);
    }
  };

  useEffect(() => {
    loadScreenTime();

    const interval = setInterval(() => {
      loadScreenTime();
    }, 5000);

    return () => clearInterval(interval);
  }, [deviceId]);

  const userName = (
    activeChildData?.name?.trim() ||
    (typeof params.initialName === "string" ? params.initialName.trim() : "") ||
    t("home.default_child_display_name")
  ).trim();
  const avatarLetter = userName.length ? (Array.from(userName)[0] ?? "?") : "?";
  const profileImageUri = useMemo(
    () => getChildProfileImageUri(activeChildData?.img),
    [activeChildData?.img]
  );
  const pointsValue = activeChildData?.avatar?.currentXp ?? 0;
  const levelValue = activeChildData?.avatar?.level ?? 0;
  const coinsValue =
    activeChildData?.coins != null ? String(activeChildData.coins) : "0";

  const onToggleLanguage = async () => {
    const next: SupportedLanguage = currentLanguage === "he" ? "en" : "he";
    await changeLanguage(next);
  };

  const leftIcon = pickRTL(isRTL, ICON.accessibility, ICON.settings);
  const rightIcon = pickRTL(isRTL, ICON.settings, ICON.accessibility);

  const leftA11y = pickRTL(isRTL, t("home.accessibility"), t("home.settings"));
  const rightA11y = pickRTL(isRTL, t("home.settings"), t("home.accessibility"));

  const statPillResponsiveStyle = isLarge
    ? styles.statPillDesktop
    : isTablet
      ? styles.statPillTablet
      : styles.statPillMobile;

  const formatTime = (minutes: number) => {
    const safeMinutes = Math.max(0, Number(minutes) || 0);
    const h = Math.floor(safeMinutes / 60);
    const m = safeMinutes % 60;

    return `\u200E${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}\u200E`;
  };

  const total = screenTime.dailyLimitMinutes + screenTime.extraMinutes;
  const percent =
    screenTime.limitEnabled && total > 0
      ? Math.min((screenTime.usedTodayMinutes / total) * 100, 100)
      : 0;

  return (
    <>
      <Stack.Screen
        options={{
          title: t("home.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => null,
          headerRight: () => null,
        }}
      />

      <ScreenLayout>
        <View
          style={[
            styles.page,
            isPhoneSmall && styles.pageSmall,
          ]}
        >
          <View style={styles.topRow}>
            <View style={[styles.topCol, { alignItems: "flex-start" }]}>
              <RoundIconButton
                name={leftIcon}
                onPress={() => { }}
                accessibilityLabel={leftA11y}
              />
            </View>

            <View style={styles.topColCenter}>
              <RoundIconButton
                name={ICON.language}
                onPress={onToggleLanguage}
                accessibilityLabel={t("common.change_language", "Change language")}
              />
            </View>

            <View style={[styles.topCol, { alignItems: "flex-end" }]}>
              <RoundIconButton
                name={rightIcon}
                onPress={() => { }}
                accessibilityLabel={rightA11y}
              />
            </View>
          </View>

          <View style={styles.headerCard}>
            <View style={[styles.headerRow, row]}>
              <View style={[styles.avatarWrap, { width: avatarSize, height: avatarSize }]}>
                {profileImageUri ? (
                  <Image
                    source={{ uri: profileImageUri }}
                    style={styles.avatarPhoto}
                    contentFit="cover"
                    transition={160}
                    accessibilityLabel={userName}
                  />
                ) : (
                  <LinearGradient
                    colors={["#3B82F6", "#BDE0FE"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatarGradient}
                  >
                    <AppText weight="extraBold" style={styles.avatarLetter}>
                      {avatarLetter}
                    </AppText>
                  </LinearGradient>
                )}
              </View>

              <View style={styles.helloBlock}>
                <AppText
                  weight="extraBold"
                  style={[styles.hello, { fontSize: helloSize }, text]}
                  numberOfLines={1}
                >
                  {t("home.hello_user", { name: userName })}
                </AppText>
              </View>
            </View>

            <View style={[styles.statsRow, row]}>
              <StatPill
                icon={ICON.points}
                text={t("home.points", { value: pointsValue })}
                variant="blue"
                isRTL={isRTL}
                style={statPillResponsiveStyle}
              />
              <StatPill
                icon={ICON.level}
                text={t("home.level", { level: levelValue })}
                variant="beige"
                isRTL={isRTL}
                style={statPillResponsiveStyle}
              />
              <StatPill
                icon={ICON.coins}
                text={t("home.coins", { value: coinsValue })}
                variant="primary"
                isRTL={isRTL}
                style={statPillResponsiveStyle}
              />
            </View>
          </View>

          <View style={styles.card}>
            <View style={[styles.cardTitleRow, row]}>
              <View style={[styles.cardTitleLeft, row]}>
                <View style={styles.iconBadge}>
                  <MaterialCommunityIcons name={ICON.time} size={18} color="#0F172A" />
                </View>

                <AppText weight="extraBold" style={[styles.cardTitle, text]}>
                  {t("home.time_left_title")}
                </AppText>
              </View>
            </View>

            <AppText
              weight="extraBold"
              style={[
                styles.timerValue,
                { fontSize: timerSize, writingDirection: "ltr", textAlign: "center" },
              ]}
            >
              {!screenTime.limitEnabled
                ? t("home.no_limit", "No limit")
                : formatTime(screenTime.remainingMinutes)}
            </AppText>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${percent}%` }]} />
            </View>

            <AppText weight="bold" style={styles.timerSub}>
              {!screenTime.limitEnabled
                ? t("home.no_limit_subtitle", "There is no active limit right now")
                : t("home.time_left_warning")}
            </AppText>
          </View>

          <View style={styles.grid}>
            <Tile
              iconName={ICON.apps}
              label={t("home.tile_apps")}
              onPress={() => { }}
              colorKey="apps"
            />

            <Tile
              iconName={ICON.extend}
              label={t("home.tile_extend")}
              onPress={() => router.push("/Child/extendTime" as Href)}
              colorKey="extend"
            />

            <Tile
              iconName={ICON.shop}
              label={t("home.tile_shop")}
              onPress={() => router.push("/Child/store" as Href)}
              colorKey="shop"
            />

            <Tile
              iconName={ICON.tasks}
              label={t("home.tile_tasks")}
              onPress={() => router.push("/Child/tasks" as Href)}
              colorKey="tasks"
            />

            <Tile
              iconName={ICON.achievements}
              label={t("home.tile_achievements")}
              onPress={() => router.push("/Child/achievements" as Href)}
              colorKey="achievements"
            />

            <Tile
              iconName={ICON.goals}
              label={t("home.tile_goals")}
              onPress={() => router.push("/Child/goals" as Href)}
              colorKey="goals"
            />

            <Tile
              iconName={ICON.reports}
              label={t("home.tile_reports")}
              onPress={() => { }}
              colorKey="help"
            />

            <Tile
              iconName={ICON.bulb}
              label={t("home.tile_ideas")}
              onPress={() => { }}
              colorKey="ideas"
            />

            <Tile
              iconName={ICON.help}
              label={t("home.tile_help")}
              onPress={() => { }}
              colorKey="help"
            />
          </View>

          <Pressable
            style={({ pressed }) => [styles.panicBtn, pressed && styles.panicPressed, row]}
            onPress={() => router.push("/Child/distress" as Href)}
            accessibilityRole="button"
            accessibilityLabel={t("home.panic_a11y")}
          >
            <View style={styles.panicIconBadge}>
              <MaterialCommunityIcons name={ICON.panic} size={18} color="#fff" />
            </View>

            <AppText weight="extraBold" style={styles.panicText}>
              {t("home.panic")}
            </AppText>
          </Pressable>
        </View>
      </ScreenLayout>
    </>
  );
}

function RoundIconButton({
  name,
  size = 22,
  onPress,
  accessibilityLabel,
}: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  size?: number;
  onPress?: () => void | Promise<void>;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      onPress={() => void onPress?.()}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.circleBtn, pressed && styles.circleBtnPressed]}
    >
      <MaterialCommunityIcons name={name} size={size} color="#0F172A" />
    </Pressable>
  );
}

function StatPill({
  icon,
  text,
  variant,
  isRTL,
  style,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  text: string;
  variant: "blue" | "beige" | "primary";
  isRTL: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const pillStyle =
    variant === "blue"
      ? styles.statPillBlue
      : variant === "beige"
        ? styles.statPillBeige
        : styles.statPillPrimary;

  return (
    <View
      style={[
        styles.statPill,
        pillStyle,
        style,
        { flexDirection: isRTL ? "row-reverse" : "row" },
      ]}
    >
      <MaterialCommunityIcons name={icon} size={18} color="#0F172A" />
      <AppText weight="extraBold" style={styles.statText} numberOfLines={1}>
        {text}
      </AppText>
    </View>
  );
}

function Tile({
  iconName,
  label,
  onPress,
  colorKey,
}: {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  onPress?: () => void;
  colorKey: keyof typeof TILE_COLORS;
}) {
  const c = TILE_COLORS[colorKey];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: c.bg, borderColor: c.border },
        pressed && styles.tilePressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.tileInner}>
        <View style={styles.tileIconZone}>
          <View style={[styles.tileIconWrap, { backgroundColor: c.badge }]}>
            <MaterialCommunityIcons name={iconName} size={26} color={c.icon} />
          </View>
        </View>

        <View style={styles.tileLabelZone}>
          <AppText weight="bold" style={styles.tileText} numberOfLines={2}>
            {label}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}