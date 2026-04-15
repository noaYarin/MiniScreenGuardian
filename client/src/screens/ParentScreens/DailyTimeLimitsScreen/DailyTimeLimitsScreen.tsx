import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Switch,
} from "react-native";
import { showErrorToast, showSuccessToast, showInfoToast } from "@/src/utils/appToast";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import EmptyStateCard from "../../../components/EmptyStateCard/EmptyStateCard";
import AppText from "../../../components/AppText/AppText";
import ChildDeviceSelector from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import { styles } from "./styles";

import type { AppDispatch, RootState } from "@/src/redux/store/types";
import { getMyChildrenThunk } from "@/src/redux/thunks/childrenThunks";
import {
  fetchDevicesByChild,
  updateDeviceScreenTimeThunk,
} from "@/src/redux/thunks/deviceThunks";
import InfoHint from "../../../components/InfoHint/InfoHint";


type ScreenLimitCard = {
  id: string;
  title: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  currentHours: number;
  maxHours: number;
  summary: string;
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
    const usedTodayMinutes = selectedDevice.screenTime?.usedTodayMinutes ?? 0;

    return [
      {
        id: "daily",
        title: "Daily screen time",
        icon: "clock-outline",
        currentHours: usedTodayMinutes / 60,
        maxHours: dailyLimitMinutes / 60,
        summary: `Current limit is ${formatHoursToClock(
          dailyLimitMinutes / 60
        )} per day`,
      },
    ];
  }, [selectedDevice]);

  const handleEditPress = (limitId: string) => {
    if (!selectedDevice) return;

    const currentMinutes =
      limitId === "daily"
        ? selectedDevice.screenTime?.dailyLimitMinutes ?? MIN_HOURS * 60
        : MIN_HOURS * 60;

    const currentEnabled =
      limitId === "daily"
        ? selectedDevice.screenTime?.isLimitEnabled ?? false
        : false;

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
        : MIN_HOURS * 60);

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
          isLimitEnabled: nextEnabled ?? false,
          dailyLimitMinutes:
            nextEnabled === false
              ? selectedDevice.screenTime?.dailyLimitMinutes ?? MIN_HOURS * 60
              : Math.max(MIN_HOURS * 60, nextMinutes ?? MIN_HOURS * 60),
        })
      ).unwrap();

      showInfoToast(
        "The new limit was saved and sent to the child device.");
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
      showErrorToast("Could not update the daily limit. Please try again.", "Error");
    }
  };

  const heroInitial = String(selectedChild?.name ?? "").trim()[0] ?? "?";
  const heroAccent = getAccentFromIndex(
    selectedChildIndex >= 0 ? selectedChildIndex : 0
  );

  if (isLoading && children.length === 0) {
    return (
      <ScreenLayout>
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      </ScreenLayout>
    );
  }

  if (error && children.length === 0) {
    return (
      <ScreenLayout>
        <View style={styles.container}>
          <AppText>{error}</AppText>
        </View>
      </ScreenLayout>
    );
  }

  if (!selectedChild) {
    return (
      <ScreenLayout>
        <View style={styles.container}>
          <EmptyStateCard
            icon="account-child-outline"
            title="No children yet"
            subtitle="Add a child to get started."
          />
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.heroCard}>
                <AppText weight="extraBold" style={styles.heroTitle}>
                  Manage screen time by child and device
                </AppText>

                <AppText weight="medium" style={styles.heroSubtitle}>
                  Choose a child and device, then set or update the daily screen-time limit.
                </AppText>
            <InfoHint
              title="How daily limits work"
              lines={[
                "The daily limit resets automatically at the start of each new day",
                "For the daily limit to work correctly, Usage Access and Accessibility must stay enabled on the child’s device",
                "If you want to give more time, approve an extension request or turn off the daily limit here",
                "Unlocking the device manually does not turn off the daily limit",
                "If the device is offline, changes will apply when it reconnects",
              ]}
            />

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
              <AppText weight="medium" style={styles.emptySubtitle}>
                Loading...
              </AppText>
            </View>
          )}

          {!!devicesError && (
            <View style={styles.emptyState}>
              <AppText weight="medium" style={styles.emptySubtitle}>
                {devicesError}
              </AppText>
            </View>
          )}

          {!isLoading &&
            !devicesError &&
            selectedChildId &&
            devicesStatus === "loading" && (
              <View style={styles.emptyState}>
                <AppText weight="medium" style={styles.emptySubtitle}>
                  Loading...
                </AppText>
              </View>
            )}
          {!isLoading &&
            !devicesError &&
            selectedChildId &&
            devicesStatus !== "loading" &&
            currentChildDevices.length === 0 && (
              <EmptyStateCard
                icon="cellphone-link-off"
                title="No devices yet"
                subtitle="There are no connected devices for this child yet."
              />
            )}

          {!isLoading &&
            !devicesError &&
            selectedDeviceId &&
            currentChildDevices.length > 0 &&
            selectedLimits.length === 0 && (
              <EmptyStateCard
                icon="clock-outline"
                title="No daily limit yet"
                subtitle="No daily screen-time limit was set for this device yet."
              />
            )}
          {selectedLimits.length > 0 && (
            <View style={styles.cardsList}>
              {selectedLimits.map((limitCard) => {
                const isEditing = editingCardId === limitCard.id;

                const isEnabled =
                  tempLimitEnabled[limitCard.id] ??
                  (selectedDevice?.screenTime?.isLimitEnabled ?? false);

                const effectiveMaxHours = isEditing
                  ? (tempLimits[limitCard.id] ?? limitCard.maxHours * 60) / 60
                  : limitCard.maxHours;

                const progress =
                  effectiveMaxHours > 0
                    ? Math.min(limitCard.currentHours / effectiveMaxHours, 1)
                    : 0;

                const canDecrease = isEnabled && effectiveMaxHours > MIN_HOURS;

                return (
                  <View key={limitCard.id} style={styles.limitCard}>
                    <View style={styles.limitTopRow}>
                      <View style={styles.limitTitleWrap}>
                        <AppText weight="bold" style={styles.limitTitle}>
                          {limitCard.title}
                        </AppText>

                        <AppText weight="medium" style={styles.limitMeta}>
                          {`${selectedChild?.name ?? ""} · ${selectedDeviceName}`}
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

                    <View style={styles.timePillsRow}>
                      <View style={styles.timePill}>
                        <AppText weight="medium" style={styles.timePillLabel}>
                          Current usage
                        </AppText>

                        <AppText weight="bold" style={styles.timePillValue}>
                          {formatHoursToClock(limitCard.currentHours)}
                        </AppText>
                      </View>

                      <View style={styles.timePill}>
                        <AppText weight="medium" style={styles.timePillLabel}>
                          Limit
                        </AppText>

                        <AppText weight="bold" style={styles.timePillValue}>
                          {isEnabled
                            ? formatHoursToClock(effectiveMaxHours)
                            : "No limit"}
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.progressMetaRow}>
                      <AppText weight="medium" style={styles.progressMetaText}>
                        Used so far
                      </AppText>

                      <AppText weight="bold" style={styles.progressMetaValue}>
                        {isEnabled ? `${Math.round(progress * 100)}%` : "Off"}
                      </AppText>
                    </View>

                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${(isEnabled ? progress : 0) * 100}%`,
                          },
                        ]}
                      />
                    </View>


                    <View style={styles.actionsRow}>
                      <View
                        style={[
                          styles.statusChip,
                          !isEnabled
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
                            !isEnabled
                              ? styles.statusChipTextNormal
                              : progress >= 1
                                ? styles.statusChipTextReached
                                : progress >= 0.8
                                  ? styles.statusChipTextWarning
                                  : styles.statusChipTextNormal,
                          ]}
                        >
                          {!isEnabled
                            ? "Off"
                            : progress >= 1
                              ? "Limit reached"
                              : progress >= 0.8
                                ? "Almost reached"
                                : "OK"}
                        </AppText>
                      </View>

                      {!isEditing ? (
                        <View style={styles.editButtonWrap}>
                          <Pressable
                            onPress={() => handleEditPress(limitCard.id)}
                            accessibilityRole="button"
                            accessibilityLabel="Edit daily limit"
                            style={({ pressed }) => [
                              styles.editButton,
                              pressed && styles.editButtonPressed,
                            ]}
                          >
                            <AppText weight="bold" style={styles.editButtonText}>
                              Edit Limit
                            </AppText>

                            <MaterialCommunityIcons
                              name="pencil-outline"
                              size={18}
                              color="#FFFFFF"
                            />
                          </Pressable>
                        </View>
                      ) : (
                        <View style={styles.editorWrap}>
                          <View style={styles.editorHeaderRow}>
                            <AppText weight="bold" style={styles.editorTitle}>
                              Edit Daily Limit
                            </AppText>

                          </View>


                          <View style={styles.switchRow}>
                            <View style={styles.switchTextWrap}>

                              <AppText weight="medium" style={styles.switchHint}>
                                {isEnabled ? "Daily limit is on" : " Daily limit is off"}

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
                              accessibilityLabel="Toggle daily limit"
                            />
                          </View>

                          <View
                            style={[
                              styles.editorControlsRow,
                              !isEnabled && { opacity: 0.5 },
                            ]}
                          >


                            <Pressable
                              onPress={() =>
                                updateLimitByStep(limitCard.id, -STEP_HOURS)
                              }
                              disabled={!canDecrease}
                              accessibilityRole="button"
                              accessibilityLabel="Decrease by five minutes"
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
                                5
                              </AppText>
                            </Pressable>

                            <View style={styles.currentValueBox}>
                              <AppText
                                weight="medium"
                                style={styles.currentValueLabel}
                              >
                                Limit
                              </AppText>

                              <AppText
                                weight="extraBold"
                                style={styles.currentValueText}
                              >
                                {!isEnabled
                                  ? "No limit"
                                  : formatHoursToClock(effectiveMaxHours)}
                              </AppText>
                            </View>

                            <Pressable
                              onPress={() =>
                                updateLimitByStep(limitCard.id, STEP_HOURS)
                              }
                              disabled={!isEnabled}
                              accessibilityRole="button"
                              accessibilityLabel="Increase by five minutes"
                              style={({ pressed }) => [
                                styles.stepButton,
                                styles.stepButtonPrimary,
                                pressed && styles.stepButtonPressed,
                                !isEnabled && styles.stepButtonDisabled,
                              ]}
                            >
                              <MaterialCommunityIcons
                                name="plus"
                                size={18}
                                color={!isEnabled ? "#A8B3C7" : "#FFFFFF"}
                              />
                              <AppText
                                weight="bold"
                                style={[
                                  styles.stepButtonTextPrimary,
                                  !isEnabled && styles.stepButtonTextDisabled,
                                ]}
                              >
                                5
                              </AppText>
                            </Pressable>
                          </View>

                          <Pressable
                            onPress={() => handleSavePress(limitCard.id)}
                            accessibilityRole="button"
                            accessibilityLabel="Save edited limit"
                            style={({ pressed }) => [
                              styles.saveButtonStrong,
                              styles.saveButtonStrongBottom,
                              pressed && styles.saveButtonStrongPressed,
                            ]}
                          >
                            <MaterialCommunityIcons
                              name="content-save-outline"
                              size={18}
                              color="#FFFFFF"
                            />
                            <AppText
                              weight="extraBold"
                              style={styles.saveButtonStrongText}
                            >
                              Save
                            </AppText>
                          </Pressable>

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
  );
}