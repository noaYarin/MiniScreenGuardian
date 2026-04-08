import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Switch,
} from "react-native";
import { showAppToast } from "@/src/utils/appToast";
import { Stack, router, type Href } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import ChildDeviceSelector from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import { styles } from "./styles";

import type { AppDispatch, RootState } from "@/src/redux/store/types";
import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";
import { getMyChildrenThunk } from "@/src/redux/thunks/childrenThunks";
import {
  fetchDevicesByChild,
  updateDeviceScreenTimeThunk,
} from "@/src/redux/thunks/deviceThunks";

type ScreenLimitCard = {
  id: string;
  titleKey: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  currentHours: number;
  maxHours: number;
  summaryKey: string;
  summaryValue: string;
};

const STEP_HOURS = 5 / 60;
const MIN_HOURS = 5 / 60;

function formatHoursToClock(totalHours: number) {
  const wholeHours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - wholeHours) * 60);

  const normalizedHours = minutes === 60 ? wholeHours + 1 : wholeHours;
  const normalizedMinutes = minutes === 60 ? 0 : minutes;

  return `${normalizedHours}:${String(normalizedMinutes).padStart(2, "0")}`;
}

function getAccentFromIndex(index: number) {
  const accents = ["#EC6FB7", "#5B8DEF", "#16C7A1", "#F59E0B", "#8B5CF6"];
  return accents[index % accents.length];
}

export default function DailyTimeLimitsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { isRTL, text, row } = useLocaleLayout();

  const { childrenList, isLoading, error } = useSelector(
    (state: RootState) => state.children
  );

  const { byChildId, statusByChildId, errorByChildId } = useSelector(
    (state: RootState) => state.devices
  );

  const children = Array.isArray(childrenList) ? childrenList : [];

  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [tempLimits, setTempLimits] = useState<Record<string, number>>({});
  const [tempLimitEnabled, setTempLimitEnabled] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    dispatch(getMyChildrenThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedChildId && children.length > 0) {
      setSelectedChildId(String(children[0]._id));
    }
  }, [children, selectedChildId]);

  useEffect(() => {
    if (!selectedChildId) return;
    dispatch(fetchDevicesByChild(selectedChildId));
  }, [dispatch, selectedChildId]);

  const selectedChild = useMemo(() => {
    if (!children.length) return null;

    return (
      children.find((child) => String(child._id) === String(selectedChildId)) ??
      children[0]
    );
  }, [children, selectedChildId]);

  const selectedChildIndex = useMemo(() => {
    return children.findIndex(
      (child) => String(child._id) === String(selectedChildId)
    );
  }, [children, selectedChildId]);

  const currentChildDevices = useMemo(() => {
    return selectedChild ? byChildId[selectedChild._id] ?? [] : [];
  }, [byChildId, selectedChild]);

  const devicesStatus = selectedChildId
    ? statusByChildId[selectedChildId] ?? "idle"
    : "idle";

  const devicesError = selectedChildId
    ? errorByChildId[selectedChildId] ?? null
    : null;

  useEffect(() => {
    if (!selectedChild?._id) return;

    const firstDeviceId = currentChildDevices[0]?._id;
    const exists = currentChildDevices.some(
      (device: any) => String(device._id) === String(selectedDeviceId)
    );

    if (!exists) {
      setSelectedDeviceId(firstDeviceId ? String(firstDeviceId) : "");
      setEditingCardId(null);
      setTempLimits({});
      setTempLimitEnabled({});
    }
  }, [selectedChild, currentChildDevices, selectedDeviceId]);

  const selectedDevice = useMemo(() => {
    if (!currentChildDevices.length) return null;

    return (
      currentChildDevices.find(
        (device: any) => String(device._id) === String(selectedDeviceId)
      ) ?? currentChildDevices[0]
    );
  }, [currentChildDevices, selectedDeviceId]);

  const selectedDeviceName = selectedDevice
    ? String(
      (selectedDevice as any).deviceName ??
      (selectedDevice as any).model ??
      (selectedDevice as any).name ??
      ""
    )
    : "";

  const selectedLimits: ScreenLimitCard[] = useMemo(() => {
    if (!selectedDevice) return [];

    const dailyLimitMinutes = selectedDevice.screenTime?.dailyLimitMinutes ?? 0;
    const weeklyLimitMinutes =
      selectedDevice.screenTime?.weeklyLimitMinutes ?? 0;
    const usedTodayMinutes = selectedDevice.screenTime?.usedTodayMinutes ?? 0;
    const usedWeekMinutes = selectedDevice.screenTime?.usedWeekMinutes ?? 0;

    return [
      {
        id: "daily",
        titleKey: "dailyTimeLimits.daily.title",
        icon: "clock-outline",
        currentHours: usedTodayMinutes / 60,
        maxHours: dailyLimitMinutes / 60,
        summaryKey: "dailyTimeLimits.daily.summary",
        summaryValue: formatHoursToClock(dailyLimitMinutes / 60),
      },
      {
        id: "weekly",
        titleKey: "dailyTimeLimits.weekly.title",
        icon: "calendar-blank-outline",
        currentHours: usedWeekMinutes / 60,
        maxHours: weeklyLimitMinutes / 60,
        summaryKey: "dailyTimeLimits.weekly.summary",
        summaryValue: formatHoursToClock(weeklyLimitMinutes / 60),
      },
    ];
  }, [selectedDevice]);

  const handleEditPress = (limitId: string) => {
    if (!selectedDevice) return;

    if (limitId === "weekly") {
      router.push("/Parent/weeklyScheduleLimits" as Href);
      return;
    }

    const currentMinutes =
      limitId === "daily"
        ? selectedDevice.screenTime?.dailyLimitMinutes ?? MIN_HOURS * 60
        : selectedDevice.screenTime?.weeklyLimitMinutes ?? 0;

    const currentEnabled =
      limitId === "daily"
        ? selectedDevice.screenTime?.isLimitEnabled ?? false
        : true;

    setTempLimits((prev) => ({
      ...prev,
      [limitId]: Math.max(MIN_HOURS * 60, currentMinutes),
    }));

    setTempLimitEnabled((prev) => ({
      ...prev,
      [limitId]: currentEnabled,
    }));

    setEditingCardId(limitId);
  };

  const updateLimitByStep = (limitId: string, deltaHours: number) => {
    if (!selectedDevice || !selectedChildId) return;

    const isEnabled = tempLimitEnabled[limitId] ?? false;
    if (!isEnabled) return;

    const baseMinutes =
      tempLimits[limitId] ??
      (limitId === "daily"
        ? selectedDevice.screenTime?.dailyLimitMinutes ?? MIN_HOURS * 60
        : selectedDevice.screenTime?.weeklyLimitMinutes ?? 0);

    const nextMinutes = Math.max(MIN_HOURS * 60, baseMinutes + deltaHours * 60);

    setTempLimits((prev) => ({
      ...prev,
      [limitId]: Math.round(nextMinutes),
    }));
  };

  const handleSavePress = async (limitId: string) => {
    if (!selectedDevice || !selectedChildId) return;

    const nextMinutes = tempLimits[limitId];
    const nextEnabled = tempLimitEnabled[limitId];

    try {
      await dispatch(
        updateDeviceScreenTimeThunk({
          childId: selectedChildId,
          deviceId: selectedDevice._id,
          ...(limitId === "daily"
            ? {
              isLimitEnabled: nextEnabled ?? false,
              dailyLimitMinutes:
                nextEnabled === false
                  ? selectedDevice.screenTime?.dailyLimitMinutes ??
                  MIN_HOURS * 60
                  : Math.max(MIN_HOURS * 60, nextMinutes ?? MIN_HOURS * 60),
            }
            : {
              weeklyLimitMinutes:
                nextMinutes ??
                selectedDevice.screenTime?.weeklyLimitMinutes ??
                0,
            }),
        })
      ).unwrap();

      showAppToast(t("dailyTimeLimits.update_success"));

      setEditingCardId(null);

      setTempLimits((prev) => {
        const updated = { ...prev };
        delete updated[limitId];
        return updated;
      });

      setTempLimitEnabled((prev) => {
        const updated = { ...prev };
        delete updated[limitId];
        return updated;
      });
    } catch {
      showAppToast(t("dailyTimeLimits.update_error"));
    }
  };

  const heroInitial = String(selectedChild?.name ?? "").trim()[0] ?? "?";
  const heroAccent = getAccentFromIndex(
    selectedChildIndex >= 0 ? selectedChildIndex : 0
  );

  if (isLoading && children.length === 0) {
    return (
      <>
        <Stack.Screen
          options={{
            title: t("dailyTimeLimits.title"),
            headerTitleAlign: "center",
            headerShadowVisible: false,
          }}
        />
        <ScreenLayout>
          <View style={styles.container}>
            <ActivityIndicator />
          </View>
        </ScreenLayout>
      </>
    );
  }

  if (error && children.length === 0) {
    return (
      <>
        <Stack.Screen
          options={{
            title: t("dailyTimeLimits.title"),
            headerTitleAlign: "center",
            headerShadowVisible: false,
          }}
        />
        <ScreenLayout>
          <View style={styles.container}>
            <AppText>{t(error)}</AppText>
          </View>
        </ScreenLayout>
      </>
    );
  }

  if (!selectedChild) {
    return (
      <>
        <Stack.Screen
          options={{
            title: t("dailyTimeLimits.title"),
            headerTitleAlign: "center",
            headerShadowVisible: false,
          }}
        />
        <ScreenLayout>
          <View style={styles.container}>
            <AppText>{t("homeParent.no_children")}</AppText>
          </View>
        </ScreenLayout>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: t("dailyTimeLimits.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />

      <ScreenLayout>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.heroCard}>
              <View style={[styles.heroHeader, row]}>
                <View
                  style={[
                    styles.heroAvatar,
                    { backgroundColor: heroAccent },
                  ]}
                >
                  <AppText weight="extraBold" style={styles.heroAvatarText}>
                    {heroInitial}
                  </AppText>
                </View>

                <View style={styles.heroTextBlock}>
                  <AppText weight="extraBold" style={[styles.heroTitle, text]}>
                    {t("dailyTimeLimits.heroTitle")}
                  </AppText>

                  <AppText weight="medium" style={[styles.heroSubtitle, text]}>
                    {t("dailyTimeLimits.heroSubtitle")}
                  </AppText>
                </View>
              </View>
            </View>

            <ChildDeviceSelector
              selectedChildId={selectedChildId}
              selectedDeviceId={selectedDeviceId}
              showDevices={true}
              onSelectChild={(childId) => {
                setSelectedChildId(String(childId));
                setSelectedDeviceId("");
                setEditingCardId(null);
                setTempLimits({});
                setTempLimitEnabled({});
              }}
              onSelectDevice={(deviceId) => {
                setSelectedDeviceId(String(deviceId));
                setEditingCardId(null);
                setTempLimits({});
                setTempLimitEnabled({});
              }}
            />

            {isLoading && (
              <View style={styles.emptyState}>
                <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                  {t("common.loading", "Loading...")}
                </AppText>
              </View>
            )}

            {!!devicesError && (
              <View style={styles.emptyState}>
                <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                  {t(devicesError, devicesError)}
                </AppText>
              </View>
            )}

            {!isLoading &&
              !devicesError &&
              selectedChildId &&
              devicesStatus === "loading" && (
                <View style={styles.emptyState}>
                  <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                    {t("common.loading", "Loading...")}
                  </AppText>
                </View>
              )}

            {!isLoading &&
              !devicesError &&
              selectedChildId &&
              devicesStatus !== "loading" &&
              currentChildDevices.length === 0 && (
                <View style={styles.emptyState}>
                  <AppText weight="bold" style={[styles.emptyTitle, text]}>
                    {t("dailyTimeLimits.empty.noDevicesTitle", "No devices found")}
                  </AppText>

                  <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                    {t(
                      "dailyTimeLimits.empty.noDevicesSubtitle",
                      "There are no connected devices for this child yet."
                    )}
                  </AppText>
                </View>
              )}

            {!isLoading &&
              !devicesError &&
              selectedDeviceId &&
              currentChildDevices.length > 0 &&
              selectedLimits.length === 0 && (
                <View style={styles.emptyState}>
                  <AppText weight="bold" style={[styles.emptyTitle, text]}>
                    {t("dailyTimeLimits.empty.noLimitsTitle", "No limits yet")}
                  </AppText>

                  <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                    {t(
                      "dailyTimeLimits.empty.noLimitsSubtitle",
                      "No screen-time limits were found for this device yet."
                    )}
                  </AppText>
                </View>
              )}

            {selectedLimits.length > 0 && (
              <View style={styles.cardsList}>
                {selectedLimits.map((limitCard) => {
                  const isEditing = editingCardId === limitCard.id;
                  const isWeeklyCard = limitCard.id === "weekly";

                  const isEnabled = isWeeklyCard
                    ? true
                    : tempLimitEnabled[limitCard.id] ??
                    (selectedDevice?.screenTime?.isLimitEnabled ?? false);

                  const effectiveMaxHours = isEditing
                    ? (tempLimits[limitCard.id] ?? limitCard.maxHours * 60) / 60
                    : limitCard.maxHours;

                  const progress =
                    effectiveMaxHours > 0
                      ? Math.min(limitCard.currentHours / effectiveMaxHours, 1)
                      : 0;

                  const canDecrease =
                    isEnabled && effectiveMaxHours > MIN_HOURS;

                  return (
                    <View key={limitCard.id} style={styles.limitCard}>
                      <View style={[styles.limitTopRow, row]}>
                        <View style={styles.limitTitleWrap}>
                          <AppText weight="bold" style={[styles.limitTitle, text]}>
                            {t(limitCard.titleKey)}
                          </AppText>

                          <AppText weight="medium" style={[styles.limitMeta, text]}>
                            {t("dailyTimeLimits.deviceContext", {
                              childName: selectedChild?.name ?? "",
                              deviceName: selectedDeviceName,
                            })}
                          </AppText>
                        </View>

                        <View style={styles.limitIconBox}>
                          <MaterialCommunityIcons
                            name={limitCard.icon}
                            size={24}
                            color="#3D6BF2"
                          />
                        </View>
                      </View>

                      <View style={[styles.timePillsRow, row]}>
                        <View style={styles.timePill}>
                          <AppText weight="medium" style={[styles.timePillLabel, text]}>
                            {t("dailyTimeLimits.range.startLabel")}
                          </AppText>

                          <AppText
                            weight="bold"
                            style={[
                              styles.timePillValue,
                              text,
                              isRTL && styles.timePillValueRtl,
                            ]}
                          >
                            {formatHoursToClock(limitCard.currentHours)}
                          </AppText>
                        </View>

                        <View style={styles.timePill}>
                          <AppText weight="medium" style={[styles.timePillLabel, text]}>
                            {t("dailyTimeLimits.range.endLabel")}
                          </AppText>

                          <AppText
                            weight="bold"
                            style={[
                              styles.timePillValue,
                              text,
                              isRTL && styles.timePillValueRtl,
                            ]}
                          >
                            {isWeeklyCard || isEnabled
                              ? formatHoursToClock(effectiveMaxHours)
                              : t("dailyTimeLimits.noLimit", "No limit")}
                          </AppText>
                        </View>
                      </View>

                      <View
                        style={[
                          styles.progressMetaRow,
                          row,
                          isRTL && styles.progressMetaRowRtl,
                        ]}
                      >
                        <AppText weight="medium" style={[styles.progressMetaText, text]}>
                          {t("dailyTimeLimits.usedLabel")}
                        </AppText>

                        <AppText weight="bold" style={[styles.progressMetaValue, text]}>
                          {isWeeklyCard || isEnabled
                            ? `${Math.round(progress * 100)}%`
                            : t("dailyTimeLimits.off", "Off")}
                        </AppText>
                      </View>

                      <View style={styles.progressTrack}>
                        <View
                          style={[
                            styles.progressFill,
                            isRTL ? styles.progressFillRtl : styles.progressFillLtr,
                            { width: `${(isWeeklyCard || isEnabled ? progress : 0) * 100}%` },
                          ]}
                        />
                      </View>

                      <AppText weight="medium" style={[styles.summaryText, text]}>
                        {isWeeklyCard || isEnabled
                          ? t(limitCard.summaryKey, {
                            value: formatHoursToClock(effectiveMaxHours),
                          })
                          : t("dailyTimeLimits.disabledSummary", "This daily limit is turned off.")}
                      </AppText>

                      <View style={styles.actionsRow}>
                        <View
                          style={[
                            styles.statusChip,
                            !isWeeklyCard && !isEnabled
                              ? styles.statusChipNormal
                              : progress >= 1
                                ? styles.statusChipReached
                                : progress >= 0.8
                                  ? styles.statusChipWarning
                                  : styles.statusChipNormal,
                          ]}
                        >
                          <AppText
                            weight="bold"
                            style={[
                              styles.statusChipText,
                              !isWeeklyCard && !isEnabled
                                ? styles.statusChipTextNormal
                                : progress >= 1
                                  ? styles.statusChipTextReached
                                  : progress >= 0.8
                                    ? styles.statusChipTextWarning
                                    : styles.statusChipTextNormal,
                            ]}
                          >
                            {!isWeeklyCard && !isEnabled
                              ? t("dailyTimeLimits.off", "Off")
                              : progress >= 1
                                ? t("dailyTimeLimits.status.reached")
                                : progress >= 0.8
                                  ? t("dailyTimeLimits.status.almostReached")
                                  : t("dailyTimeLimits.status.ok")}
                          </AppText>
                        </View>

                        {!isEditing ? (
                          <View style={styles.editButtonWrap}>
                            <Pressable
                              onPress={() => handleEditPress(limitCard.id)}
                              accessibilityRole="button"
                              accessibilityLabel={
                                isWeeklyCard
                                  ? t("dailyTimeLimits.a11y.editWeeklySchedule")
                                  : t("dailyTimeLimits.a11y.editDailyLimit")
                              }
                              style={({ pressed }) => [
                                styles.editButton,
                                row,
                                pressed && styles.editButtonPressed,
                              ]}
                            >
                              <AppText weight="bold" style={styles.editButtonText}>
                                {isWeeklyCard
                                  ? t("dailyTimeLimits.editWeekly")
                                  : t("dailyTimeLimits.edit")}
                              </AppText>

                              <MaterialCommunityIcons
                                name={isWeeklyCard ? "chevron-left" : "pencil-outline"}
                                size={18}
                                color="#FFFFFF"
                              />
                            </Pressable>
                          </View>
                        ) : (
                          <View style={styles.editorWrap}>
                            <View style={[styles.editorHeaderRow, row]}>
                              <AppText weight="bold" style={[styles.editorTitle, text]}>
                                {t("dailyTimeLimits.edit")}
                              </AppText>

                              <Pressable
                                onPress={() => handleSavePress(limitCard.id)}
                                accessibilityRole="button"
                                accessibilityLabel={t("dailyTimeLimits.a11y.saveEditing")}
                                style={({ pressed }) => [
                                  styles.saveButtonStrong,
                                  pressed && styles.saveButtonStrongPressed,
                                ]}
                              >
                                <MaterialCommunityIcons
                                  name="content-save-outline"
                                  size={18}
                                  color="#FFFFFF"
                                />
                                <AppText weight="extraBold" style={styles.saveButtonStrongText}>
                                  {t("dailyTimeLimits.save")}
                                </AppText>
                              </Pressable>
                            </View>

                            <AppText weight="medium" style={[styles.editorHint, text]}>
                              {t("dailyTimeLimits.saveHint")}
                            </AppText>

                            {!isWeeklyCard && (
                              <View style={styles.switchRow}>
                                <View style={styles.switchTextWrap}>
                                  <AppText weight="medium" style={text}>
                                    {t("dailyTimeLimits.limitEnabled", "Daily limit enabled")}
                                  </AppText>

                                  <AppText weight="medium" style={[styles.switchHint, text]}>
                                    {isEnabled
                                      ? t(
                                        "dailyTimeLimits.limitEnabledHintOn",
                                        "Turn off the switch to remove the daily limit"
                                      )
                                      : t(
                                        "dailyTimeLimits.limitEnabledHintOff",
                                        "Turn on the switch to set a daily limit"
                                      )}
                                  </AppText>
                                </View>

                                <Switch
                                  value={isEnabled}
                                  onValueChange={(value) =>
                                    setTempLimitEnabled((prev) => ({
                                      ...prev,
                                      [limitCard.id]: value,
                                    }))
                                  }
                                  accessibilityLabel={t(
                                    "dailyTimeLimits.a11y.toggleDailyLimit",
                                    "Toggle daily limit"
                                  )}
                                />
                              </View>
                            )}

                            <View
                              style={[
                                styles.editorControlsRow,
                                isRTL && styles.editorControlsRowRtl,
                                !isWeeklyCard && !isEnabled && { opacity: 0.5 },
                              ]}
                            >
                              <Pressable
                                onPress={() => updateLimitByStep(limitCard.id, -STEP_HOURS)}
                                disabled={!canDecrease}
                                accessibilityRole="button"
                                accessibilityLabel={t("dailyTimeLimits.a11y.decreaseByFiveMinutes")}
                                style={({ pressed }) => [
                                  styles.stepButton,
                                  styles.stepButtonSecondary,
                                  pressed && styles.stepButtonPressed,
                                  !canDecrease && styles.stepButtonDisabled,
                                ]}
                              >
                                <MaterialCommunityIcons
                                  name="minus"
                                  size={18}
                                  color={canDecrease ? "#1F2A44" : "#A8B3C7"}
                                />
                                <AppText
                                  weight="bold"
                                  style={[
                                    styles.stepButtonTextSecondary,
                                    !canDecrease && styles.stepButtonTextDisabled,
                                  ]}
                                >
                                  5-
                                </AppText>
                              </Pressable>

                              <View style={styles.currentValueBox}>
                                <AppText
                                  weight="medium"
                                  style={[styles.currentValueLabel, text]}
                                >
                                  {t("dailyTimeLimits.currentLimit")}
                                </AppText>

                                <AppText
                                  weight="extraBold"
                                  style={styles.currentValueText}
                                >
                                  {!isWeeklyCard && !isEnabled
                                    ? t("dailyTimeLimits.noLimit", "No limit")
                                    : formatHoursToClock(effectiveMaxHours)}
                                </AppText>
                              </View>

                              <Pressable
                                onPress={() => updateLimitByStep(limitCard.id, STEP_HOURS)}
                                disabled={!isWeeklyCard && !isEnabled}
                                accessibilityRole="button"
                                accessibilityLabel={t("dailyTimeLimits.a11y.increaseByFiveMinutes")}
                                style={({ pressed }) => [
                                  styles.stepButton,
                                  styles.stepButtonPrimary,
                                  pressed && styles.stepButtonPressed,
                                  !isWeeklyCard && !isEnabled && styles.stepButtonDisabled,
                                ]}
                              >
                                <MaterialCommunityIcons
                                  name="plus"
                                  size={18}
                                  color={!isWeeklyCard && !isEnabled ? "#A8B3C7" : "#FFFFFF"}
                                />
                                <AppText
                                  weight="bold"
                                  style={[
                                    styles.stepButtonTextPrimary,
                                    !isWeeklyCard &&
                                    !isEnabled &&
                                    styles.stepButtonTextDisabled,
                                  ]}
                                >
                                  5+
                                </AppText>
                              </Pressable>
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </ScreenLayout>
    </>
  );
}