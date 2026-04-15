import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Pressable,
  useWindowDimensions,
  StyleProp,
  ViewStyle,
  NativeModules,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { showErrorToast, showInfoToast } from "@/src/utils/appToast";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles, TILE_COLORS } from "./styles";

import { Child } from "@/src/redux/slices/children-slice";
import { fetchCurrentChildProfileThunk } from "@/src/redux/thunks/childrenThunks";
import { updateDeviceLocation } from "@/src/redux/thunks/deviceThunks";
import type { AppDispatch, RootState } from "@/src/redux/store/types";
import { connectSocket, emitEvent, onEvent } from "@/src/services/socket";
import { REQUEST_CHILD_LOCATION } from "@/src/constants/socketEvents";
import { getChildProfileImageUri } from "@/src/utils/childProfileImage";

const { DeviceControl } = NativeModules;

const ICON = {
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
  statsClosed: "chevron-down",
  statsOpen: "chevron-up",
} as const;

export default function HomeScreen() {
  const params = useLocalSearchParams<{ initialName?: string }>();
  const { width } = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();

  const isPhoneSmall = width < 390;
  const isPhone = width < 430;
  const isTablet = width >= 430 && width < 900;
  const isLarge = width >= 900;

  const avatarSize = isPhone ? 92 : isTablet ? 108 : 118;
  const helloSize = isPhone ? 22 : isTablet ? 26 : 28;
  const timerSize = isPhone ? 34 : isTablet ? 40 : 44;

  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [screenTime, setScreenTime] = useState({
    remainingMinutes: 0,
    usedTodayMinutes: 0,
    dailyLimitMinutes: 0,
    extraMinutes: 0,
    limitEnabled: false,
  });

  const activeChildId = useSelector(
    (state: RootState) => state.auth.activeChildId
  );
  const childrenList = useSelector(
    (state: RootState) => state.children.childrenList
  );
  const deviceId = useSelector((state: RootState) => state.auth.deviceId);
  const parentId = useSelector((state: RootState) => state.auth.parentId);

  const activeChildData = useMemo(() => {
    if (activeChildId == null || String(activeChildId).trim() === "") {
      return undefined;
    }

    const list = Array.isArray(childrenList) ? childrenList : [];
    return list.find((c: Child) => String(c._id) === String(activeChildId));
  }, [childrenList, activeChildId]);

  const handleSyncLocation = async (requestData?: any) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const lastUpdated = new Date().toISOString();
      const locationData = {
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      };

      const resolvedDeviceId = deviceId && String(deviceId).trim();

      const targetParentId = requestData?.parentId || parentId;

      if (targetParentId) {
        emitEvent(REQUEST_CHILD_LOCATION, {
          parentId: targetParentId,
          childId: String(activeChildId),
          location: {
            lat: locationData.lat,
            lng: locationData.lng,
          },
          lastUpdated,
        });
      }

      if (resolvedDeviceId) {
        await dispatch(
          updateDeviceLocation({
            childId: String(activeChildId),
            deviceId: resolvedDeviceId,
            location: locationData,
          })
        ).unwrap();
      } else {
        showInfoToast(
          "Please ask your parent to reconnect this device so location can be saved.",
          "Device not linked"
        );
      }
    } catch (error) {
      showErrorToast("Could not to sync location.", "Error");
    }
  };

  useEffect(() => {
    if (!activeChildId) return;

    connectSocket(
      String(activeChildId),
      "child",
      parentId ? { parentId: String(parentId) } : undefined
    );

    const unsubscribe = onEvent(REQUEST_CHILD_LOCATION, (data) => {
      handleSyncLocation(data);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [activeChildId, parentId]);

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
    "Child"
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
    <ScreenLayout>
      <View style={[styles.page, isPhoneSmall && styles.pageSmall]}>
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.avatarWrapRow}>
              <View
                style={[styles.avatarWrap, { width: avatarSize, height: avatarSize }]}
              >
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

              <View style={styles.headerTextSide}>
                <AppText
                  weight="extraBold"
                  style={[styles.hello, { fontSize: helloSize }]}
                  numberOfLines={1}
                >
                  {`Hi, ${userName}`}
                </AppText>

                <Pressable
                  onPress={() => setIsStatsOpen((prev) => !prev)}
                  style={({ pressed }) => [
                    styles.statsToggle,
                    pressed && styles.statsTogglePressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isStatsOpen
                      ? "Hide points, level and coins"
                      : "Show points, level and coins"
                  }
                >
                  <AppText weight="bold" style={styles.statsToggleText}>
                    {isStatsOpen ? "Hide stats" : "Show stats"}
                  </AppText>
                  <MaterialCommunityIcons
                    name={isStatsOpen ? ICON.statsOpen : ICON.statsClosed}
                    size={18}
                    color="#2563EB"
                  />
                </Pressable>
              </View>
            </View>
          </View>

          {isStatsOpen ? (
            <View style={styles.statsRow}>
              <StatPill
                icon={ICON.points}
                text={`Points: ${pointsValue}`}
                variant="blue"
                style={statPillResponsiveStyle}
              />
              <StatPill
                icon={ICON.level}
                text={`Level ${levelValue}`}
                variant="beige"
                style={statPillResponsiveStyle}
              />
              <StatPill
                icon={ICON.coins}
                text={`Coins: ${coinsValue}`}
                variant="primary"
                style={statPillResponsiveStyle}
              />
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <View style={styles.cardTitleLeft}>
              <View style={styles.iconBadge}>
                <MaterialCommunityIcons
                  name={ICON.time}
                  size={18}
                  color="#0F172A"
                />
              </View>

              <AppText weight="extraBold" style={styles.cardTitle}>
                Time left
              </AppText>
            </View>
          </View>

          <AppText
            weight="extraBold"
            style={[
              styles.timerValue,
              { fontSize: timerSize, writingDirection: "ltr", textAlign: "left" },
            ]}
          >
            {!screenTime.limitEnabled
              ? "No limit"
              : formatTime(screenTime.remainingMinutes)}
          </AppText>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percent}%` }]} />
          </View>

          <AppText weight="bold" style={styles.timerSub}>
            {!screenTime.limitEnabled
              ? "There is no active limit right now"
              : "Your time is almost over"}
          </AppText>
        </View>

        <View style={styles.grid}>
          <Tile iconName={ICON.apps} label="Apps" colorKey="apps" disabled />

          <Tile
            iconName={ICON.extend}
            label="Request"
            onPress={() => router.push("/Child/extendTime" as Href)}
            colorKey="extend"
          />

          <Tile iconName={ICON.shop} label="Shop" colorKey="shop" disabled />
          <Tile iconName={ICON.tasks} label="Tasks" colorKey="tasks" disabled />
          <Tile
            iconName={ICON.achievements}
            label="Achievements"
            colorKey="achievements"
            disabled
          />
          <Tile iconName={ICON.goals} label="Goals" colorKey="goals" disabled />
          <Tile
            iconName={ICON.reports}
            label="Reports"
            colorKey="help"
            disabled
          />
          <Tile iconName={ICON.bulb} label="Ideas" colorKey="ideas" disabled />
          <Tile iconName={ICON.help} label="Help" colorKey="help" disabled />
        </View>

        <Pressable
          disabled
          style={({ pressed }) => [
            styles.panicBtn,
            styles.panicDisabled, 
            pressed && styles.panicPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="SOS disabled"
          accessibilityState={{ disabled: true }}
        >
          <View style={styles.panicContent}>
           
            <View style={styles.panicIconBadge}>
              <MaterialCommunityIcons name={ICON.panic} size={18} color="#fff" />
            </View>

            <AppText weight="extraBold" style={styles.panicText}>
              SOS
            </AppText>
          </View>
        </Pressable>
      </View>
    </ScreenLayout>
  );
}

function StatPill({
  icon,
  text,
  variant,
  style,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  text: string;
  variant: "blue" | "beige" | "primary";
  style?: StyleProp<ViewStyle>;
}) {
  const pillStyle =
    variant === "blue"
      ? styles.statPillBlue
      : variant === "beige"
        ? styles.statPillBeige
        : styles.statPillPrimary;

  return (
    <View style={[styles.statPill, pillStyle, style]}>
      <MaterialCommunityIcons name={icon} size={20} color="#0F172A" />
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
  disabled = false,
}: {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  onPress?: () => void;
  colorKey: keyof typeof TILE_COLORS;
  disabled?: boolean;
}) {
  const c = TILE_COLORS[colorKey];

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: c.bg, borderColor: c.border },
        pressed && !disabled && styles.tilePressed,
        disabled && styles.tileDisabled,
      ]}
      onPress={disabled ? undefined : onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <View style={styles.tileInner}>
        <View style={styles.tileIconZone}>
          <View
            style={[
              styles.tileIconWrap,
              { backgroundColor: c.badge },
              disabled && styles.tileIconDisabled,
            ]}
          >
            <MaterialCommunityIcons
              name={iconName}
              size={26}
              color={disabled ? "#9CA3AF" : c.icon}
            />
          </View>
        </View>

        <View style={styles.tileLabelZone}>
          <AppText
            weight="bold"
            style={[styles.tileText, disabled && styles.tileTextDisabled]}
            numberOfLines={2}
          >
            {label}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}