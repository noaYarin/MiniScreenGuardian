import React, { useMemo, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Alert,
} from "react-native";
import { Stack } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import ChildDeviceSelector, {
  type ChildOption,
} from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import { styles } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

type WeeklyDayConfig = {
  key: DayKey;
  startMinutes: number;
  endMinutes: number;
  enabled: boolean;
};

const STEP_MINUTES = 30;
const MIN_MINUTES = 0;
const MAX_MINUTES = 23 * 60 + 30;

const STATIC_CHILDREN: ChildOption[] = [
  {
    id: "noa",
    name: "נועה",
    initial: "נ",
    accent: "#14C38E",
    subtitleKey: "childDeviceSelector.defaultChildSubtitle",
    devices: [
      {
        id: "noa-phone",
        type: "phone",
        name: "iPhone 14",
        icon: "cellphone",
      },
      {
        id: "noa-tablet",
        type: "tablet",
        name: "iPad Air",
        icon: "tablet",
      },
    ],
  },
  {
    id: "yonatan",
    name: "יונתן",
    initial: "י",
    accent: "#7C98FF",
    subtitleKey: "childDeviceSelector.defaultChildSubtitle",
    devices: [
      {
        id: "yonatan-phone",
        type: "phone",
        name: "Galaxy A54",
        icon: "cellphone",
      },
    ],
  },
  {
    id: "tamar",
    name: "תמר",
    initial: "ת",
    accent: "#D96CE6",
    subtitleKey: "childDeviceSelector.defaultChildSubtitle",
    devices: [
      {
        id: "tamar-tablet",
        type: "tablet",
        name: "Lenovo Tab",
        icon: "tablet",
      },
    ],
  },
];

const INITIAL_WEEKLY_CONFIG: WeeklyDayConfig[] = [
  { key: "sun", startMinutes: 7 * 60, endMinutes: 17 * 60, enabled: true },
  { key: "mon", startMinutes: 7 * 60 + 30, endMinutes: 16 * 60, enabled: true },
  { key: "tue", startMinutes: 7 * 60, endMinutes: 16 * 60 + 30, enabled: true },
  { key: "wed", startMinutes: 8 * 60, endMinutes: 15 * 60, enabled: true },
  { key: "thu", startMinutes: 7 * 60, endMinutes: 17 * 60 + 30, enabled: true },
  { key: "fri", startMinutes: 9 * 60, endMinutes: 13 * 60, enabled: true },
  { key: "sat", startMinutes: 10 * 60, endMinutes: 12 * 60, enabled: false },
];

function formatTime(minutes: number) {
  const normalized = Math.max(MIN_MINUTES, Math.min(MAX_MINUTES, minutes));
  const hours24 = Math.floor(normalized / 60);
  const mins = normalized % 60;
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  return `${String(hours12).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${suffix}`;
}

function calculateDurationHours(startMinutes: number, endMinutes: number) {
  const diff = Math.max(0, endMinutes - startMinutes);
  const hours = diff / 60;
  return Number.isInteger(hours) ? String(hours) : String(hours);
}

export default function WeeklyScheduleScreen() {
  const { t } = useTranslation();
  const { isRTL, row, text } = useLocaleLayout();
  const { width } = useWindowDimensions();

  const isTablet = width >= 900;

  const scrollRef = useRef<ScrollView | null>(null);
  const cardsSectionOffsetRef = useRef(0);
  const sectionOffsetsRef = useRef<Record<DayKey, number>>({
    sun: 0,
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
  });

  const [selectedChildId, setSelectedChildId] = useState("noa");
  const [selectedDeviceId, setSelectedDeviceId] = useState("noa-phone");
  const [weeklyConfig, setWeeklyConfig] = useState<WeeklyDayConfig[]>(INITIAL_WEEKLY_CONFIG);
  const [activeDayKey, setActiveDayKey] = useState<DayKey>("sun");

  const selectedChild = useMemo(() => {
    return STATIC_CHILDREN.find((child) => child.id === selectedChildId) ?? STATIC_CHILDREN[0];
  }, [selectedChildId]);

  const selectedDevice = useMemo(() => {
    return (
      selectedChild.devices.find((device) => device.id === selectedDeviceId) ??
      selectedChild.devices[0]
    );
  }, [selectedChild, selectedDeviceId]);

  const enabledDaysCount = weeklyConfig.filter((day) => day.enabled).length;

  const activeDaysTotalHours = weeklyConfig
    .filter((day) => day.enabled)
    .reduce((sum, day) => sum + Math.max(0, day.endMinutes - day.startMinutes) / 60, 0);

  const handleSelectChild = (childId: string) => {
    setSelectedChildId(childId);

    const child = STATIC_CHILDREN.find((item) => item.id === childId);
    if (!child) return;

    const firstDevice = child.devices[0];
    if (firstDevice) {
      setSelectedDeviceId(firstDevice.id);
    }
  };

  const handleSelectDevice = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
  };

  const handleScrollToDay = (dayKey: DayKey) => {
    setActiveDayKey(dayKey);

    requestAnimationFrame(() => {
      const cardsSectionY = cardsSectionOffsetRef.current ?? 0;
      const dayY = sectionOffsetsRef.current[dayKey] ?? 0;

      scrollRef.current?.scrollTo({
        y: Math.max(0, cardsSectionY + dayY - 18),
        animated: true,
      });
    });
  };

  const toggleDayEnabled = (dayKey: DayKey) => {
    setWeeklyConfig((prev) =>
      prev.map((day) =>
        day.key === dayKey
          ? {
              ...day,
              enabled: !day.enabled,
            }
          : day
      )
    );
  };

  const updateTime = (
    dayKey: DayKey,
    field: "startMinutes" | "endMinutes",
    direction: "increase" | "decrease"
  ) => {
    setWeeklyConfig((prev) =>
      prev.map((day) => {
        if (day.key !== dayKey) return day;

        const delta = direction === "increase" ? STEP_MINUTES : -STEP_MINUTES;
        const nextValue = Math.max(MIN_MINUTES, Math.min(MAX_MINUTES, day[field] + delta));

        if (field === "startMinutes") {
          return {
            ...day,
            startMinutes: Math.max(
              MIN_MINUTES,
              Math.min(nextValue, day.endMinutes - STEP_MINUTES)
            ),
          };
        }

        return {
          ...day,
          endMinutes: Math.min(
            MAX_MINUTES,
            Math.max(nextValue, day.startMinutes + STEP_MINUTES)
          ),
        };
      })
    );
  };

  const copyActiveDayToAll = () => {
    const sourceDay = weeklyConfig.find((day) => day.key === activeDayKey);
    if (!sourceDay) return;

    setWeeklyConfig((prev) =>
      prev.map((day) =>
        day.key === activeDayKey
          ? day
          : {
              ...day,
              startMinutes: sourceDay.startMinutes,
              endMinutes: sourceDay.endMinutes,
              enabled: sourceDay.enabled,
            }
      )
    );
  };

  const saveSchedule = () => {
    // Future server integration:
    // POST/PUT weekly schedule for selected child and selected device.
    // Suggested payload:
    // {
    //   childId: selectedChildId,
    //   deviceId: selectedDeviceId,
    //   weeklySchedule: weeklyConfig
    // }

    Alert.alert(t("weeklySchedule.title"), t("weeklySchedule.save"));
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t("weeklySchedule.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />

      <ScreenLayout>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.contentMaxWidth}>
              <ChildDeviceSelector
                childrenOptions={STATIC_CHILDREN}
                selectedChildId={selectedChildId}
                selectedDeviceId={selectedDeviceId}
                onSelectChild={handleSelectChild}
                onSelectDevice={handleSelectDevice}
                childCardWidth={isTablet ? 170 : 142}
              />

              <View style={styles.heroCard}>
                <View style={[styles.heroTopRow, row]}>
                  <View style={styles.heroIconWrap}>
                    <MaterialCommunityIcons name="calendar-week" size={24} color="#2F6BFF" />
                  </View>

                  <View style={styles.heroTextWrap}>
                    <AppText weight="extraBold" style={[styles.heroTitle, text]}>
                      {t("weeklySchedule.heading")}
                    </AppText>

                    <AppText weight="medium" style={[styles.heroSubtitle, text]}>
                      {t("weeklySchedule.subtitle", {
                        childName: selectedChild.name,
                        deviceName: selectedDevice.name,
                      })}
                    </AppText>
                  </View>
                </View>

                <View style={[styles.heroStatsRow, isTablet ? row : styles.heroStatsColumn]}>
                  <View style={styles.statCard}>
                    <AppText weight="bold" style={[styles.statLabel, text]}>
                      {t("weeklySchedule.summary.activeDays")}
                    </AppText>

                    <AppText weight="extraBold" style={[styles.statValue, text]}>
                      {enabledDaysCount}
                    </AppText>
                  </View>

                  <View style={styles.statCard}>
                    <AppText weight="bold" style={[styles.statLabel, text]}>
                      {t("weeklySchedule.summary.totalHours")}
                    </AppText>

                    <AppText weight="extraBold" style={[styles.statValue, text]}>
                      {activeDaysTotalHours}
                    </AppText>
                  </View>
                </View>
              </View>

              <View style={styles.daysRailSection}>
                <View style={[styles.sectionHeaderRow, row]}>
                  <AppText weight="extraBold" style={[styles.sectionTitle, text]}>
                    {t("weeklySchedule.dayRailTitle")}
                  </AppText>

                  <AppText weight="medium" style={[styles.sectionHint, text]}>
                    {t("weeklySchedule.dayRailHint")}
                  </AppText>
                </View>

                <View style={isRTL ? styles.dayRailOuterRtl : styles.dayRailOuterLtr}>
  <View
    style={isRTL ? styles.dayRailWrapRtl : styles.dayRailWrapLtr}
  >
                  {weeklyConfig.map((day) => {
                    const isActive = activeDayKey === day.key;

                    return (
                      <Pressable
                        key={day.key}
                        onPress={() => handleScrollToDay(day.key)}
                        accessibilityRole="button"
                        accessibilityLabel={t("weeklySchedule.a11y.scrollToDay", {
                          day: t(`weeklySchedule.days.${day.key}.full`),
                        })}
                        style={({ pressed }) => [
                          styles.dayRailChip,
                          day.enabled ? styles.dayRailChipActive : styles.dayRailChipInactive,
                          isActive && styles.dayRailChipFocused,
                          pressed && styles.dayRailChipPressed,
                        ]}
                      >
                        <AppText
                          weight="extraBold"
                          style={[
                            styles.dayRailChipLetter,
                            text,
                            day.enabled
                              ? styles.dayRailChipLetterActive
                              : styles.dayRailChipLetterInactive,
                          ]}
                        >
                          {t(`weeklySchedule.days.${day.key}.short`)}
                        </AppText>

                        <AppText
                          weight="medium"
                          style={[
                            styles.dayRailChipLabel,
                            text,
                            day.enabled
                              ? styles.dayRailChipLabelActive
                              : styles.dayRailChipLabelInactive,
                          ]}
                        >
                          {t(`weeklySchedule.days.${day.key}.full`)}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
</View>
              <View
                style={styles.cardsSection}
                onLayout={(event) => {
                  cardsSectionOffsetRef.current = event.nativeEvent.layout.y;
                }}
              >
                {weeklyConfig.map((day) => {
                  const totalHours = calculateDurationHours(day.startMinutes, day.endMinutes);

                  return (
                    <View
                      key={day.key}
                      onLayout={(event) => {
                        sectionOffsetsRef.current[day.key] = event.nativeEvent.layout.y;
                      }}
                      style={[
                        styles.dayCard,
                        activeDayKey === day.key && styles.dayCardActive,
                        !day.enabled && styles.dayCardDisabled,
                      ]}
                    >
                      <View style={[styles.dayCardHeader, row]}>
                        <View style={[styles.dayIdentityRow, row]}>
                          <View
                            style={[
                              styles.dayBadge,
                              !day.enabled && styles.dayBadgeDisabled,
                            ]}
                          >
                            <AppText weight="extraBold" style={[styles.dayBadgeText, text]}>
                              {t(`weeklySchedule.days.${day.key}.short`)}
                            </AppText>
                          </View>

                          <View style={styles.dayNameWrap}>
                            <AppText weight="extraBold" style={[styles.dayName, text]}>
                              {t(`weeklySchedule.days.${day.key}.full`)}
                            </AppText>

                            <AppText weight="medium" style={[styles.dayStatus, text]}>
                              {day.enabled
                                ? t("weeklySchedule.status.enabled")
                                : t("weeklySchedule.status.disabled")}
                            </AppText>
                          </View>
                        </View>

                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={t("weeklySchedule.a11y.toggleDay", {
                            day: t(`weeklySchedule.days.${day.key}.full`),
                          })}
                          style={({ pressed }) => [
                            styles.toggleWrap,
                            pressed && styles.toggleWrapPressed,
                          ]}
                          onPress={() => toggleDayEnabled(day.key)}
                        >
                          <View
                            style={[
                              styles.toggleTrack,
                              day.enabled && styles.toggleTrackOn,
                            ]}
                          >
                            <View
                              style={[
                                styles.toggleThumb,
                                day.enabled && styles.toggleThumbOn,
                              ]}
                            />
                          </View>
                        </Pressable>
                      </View>

                      <View style={[styles.timeGrid, isTablet && styles.timeGridTablet]}>
                        <View style={styles.timeCard}>
                          <View style={[styles.timeLabelRow, row]}>
                            <MaterialCommunityIcons name="clock-outline" size={18} color="#7D889C" />
                            <AppText weight="bold" style={[styles.timeLabel, text]}>
                              {t("weeklySchedule.startTime")}
                            </AppText>
                          </View>

                          <View style={[styles.timeValueBox, row]}>
                            <Pressable
                              onPress={() => updateTime(day.key, "startMinutes", "decrease")}
                              style={({ pressed }) => [
                                styles.timeAdjustButton,
                                pressed && styles.timeAdjustButtonPressed,
                              ]}
                            >
                              <MaterialCommunityIcons name="minus" size={18} color="#2F6BFF" />
                            </Pressable>

                            <AppText weight="extraBold" style={[styles.timeValue, text]}>
                              {formatTime(day.startMinutes)}
                            </AppText>

                            <Pressable
                              onPress={() => updateTime(day.key, "startMinutes", "increase")}
                              style={({ pressed }) => [
                                styles.timeAdjustButton,
                                pressed && styles.timeAdjustButtonPressed,
                              ]}
                            >
                              <MaterialCommunityIcons name="plus" size={18} color="#2F6BFF" />
                            </Pressable>
                          </View>
                        </View>

                        <View style={styles.timeCard}>
                          <View style={[styles.timeLabelRow, row]}>
                            <MaterialCommunityIcons name="clock-end" size={18} color="#7D889C" />
                            <AppText weight="bold" style={[styles.timeLabel, text]}>
                              {t("weeklySchedule.endTime")}
                            </AppText>
                          </View>

                          <View style={[styles.timeValueBox, row]}>
                            <Pressable
                              onPress={() => updateTime(day.key, "endMinutes", "decrease")}
                              style={({ pressed }) => [
                                styles.timeAdjustButton,
                                pressed && styles.timeAdjustButtonPressed,
                              ]}
                            >
                              <MaterialCommunityIcons name="minus" size={18} color="#2F6BFF" />
                            </Pressable>

                            <AppText weight="extraBold" style={[styles.timeValue, text]}>
                              {formatTime(day.endMinutes)}
                            </AppText>

                            <Pressable
                              onPress={() => updateTime(day.key, "endMinutes", "increase")}
                              style={({ pressed }) => [
                                styles.timeAdjustButton,
                                pressed && styles.timeAdjustButtonPressed,
                              ]}
                            >
                              <MaterialCommunityIcons name="plus" size={18} color="#2F6BFF" />
                            </Pressable>
                          </View>
                        </View>
                      </View>

                      <View style={[styles.dayFooter, row]}>
                        <View style={[styles.totalHoursPill, row]}>
                          <MaterialCommunityIcons name="timer-outline" size={16} color="#2F6BFF" />
                          <AppText weight="bold" style={[styles.totalHoursText, text]}>
                            {t("weeklySchedule.totalHours", { hours: totalHours })}
                          </AppText>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>

              <View style={styles.bottomActionsWrap}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t("weeklySchedule.a11y.copyToAllDays")}
                  style={({ pressed }) => [
                    styles.secondaryActionButton,
                    row,
                    pressed && styles.secondaryActionButtonPressed,
                  ]}
                  onPress={copyActiveDayToAll}
                >
                  <MaterialCommunityIcons name="content-copy" size={18} color="#2F6BFF" />
                  <AppText weight="bold" style={[styles.secondaryActionText, text]}>
                    {t("weeklySchedule.copyToAll")}
                  </AppText>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t("weeklySchedule.a11y.saveSchedule")}
                  style={({ pressed }) => [
                    styles.primaryActionButton,
                    row,
                    pressed && styles.primaryActionButtonPressed,
                  ]}
                  onPress={saveSchedule}
                >
                  <MaterialCommunityIcons name="content-save-outline" size={18} color="#FFFFFF" />
                  <AppText weight="bold" style={styles.primaryActionText}>
                    {t("weeklySchedule.save")}
                  </AppText>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </ScreenLayout>
    </>
  );
}