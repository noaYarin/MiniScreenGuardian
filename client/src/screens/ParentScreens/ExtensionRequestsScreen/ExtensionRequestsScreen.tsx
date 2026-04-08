import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Stack } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import ChildDeviceSelector, {
  ALL_DEVICE_ID,
  type DeviceType,
} from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import { styles } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

import type { AppDispatch, RootState } from "@/src/redux/store/types";
import { getMyChildrenThunk } from "@/src/redux/thunks/childrenThunks";
import { fetchDevicesByChild } from "@/src/redux/thunks/deviceThunks";
import {
  fetchPendingRequestsThunk,
  decideRequestThunk,
} from "@/src/redux/thunks/requestThunks";

function getDeviceIconName(deviceType?: string) {
  return deviceType === "tablet" ? "tablet-dashboard" : "cellphone";
}

function getRemainingMinutes(device: any | null) {
  if (!device?.screenTime) return null;

  const {
    isLimitEnabled,
    dailyLimitMinutes = 0,
    extraMinutesToday = 0,
    usedTodayMinutes = 0,
  } = device.screenTime;

  if (!isLimitEnabled) return "UNLIMITED";

  return Math.max(
    0,
    dailyLimitMinutes + extraMinutesToday - usedTodayMinutes
  );
}

export default function ExtensionRequestsScreen() {
  const { t } = useTranslation();
  const { text, row, isRTL } = useLocaleLayout();
  const { width } = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();

  const isWide = width >= 920;

  const children = useSelector(
    (state: RootState) => state.children.childrenList ?? []
  );

  const devicesByChild = useSelector(
    (state: RootState) => state.devices.byChildId ?? {}
  );

  const pendingRequests = useSelector(
    (state: RootState) => state.requests.pending
  );

  const requestsStatus = useSelector(
    (state: RootState) => state.requests.status
  );

  const requestsError = useSelector(
    (state: RootState) => state.requests.error
  );

  const [selectedChildId, setSelectedChildId] = useState("");
  const [selectedDeviceId, setSelectedDeviceId] = useState(ALL_DEVICE_ID);

  useEffect(() => {
    dispatch(getMyChildrenThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedChildId && children.length > 0) {
      setSelectedChildId(String(children[0]._id));
    }
  }, [children, selectedChildId]);

  useEffect(() => {
    children.forEach((child) => {
      dispatch(fetchDevicesByChild(String(child._id)));
    });
  }, [children, dispatch]);

  useEffect(() => {
    if (!selectedChildId) return;

    dispatch(
      fetchPendingRequestsThunk({
        childId: selectedChildId,
      })
    );
  }, [dispatch, selectedChildId]);

  const selectedChild = useMemo(() => {
    if (!selectedChildId) return null;

    return (
      children.find((child) => String(child._id) === String(selectedChildId)) ??
      null
    );
  }, [children, selectedChildId]);

  const selectedDevice = useMemo(() => {
    if (selectedDeviceId === ALL_DEVICE_ID) {
      return {
        _id: ALL_DEVICE_ID,
        type: "phone" as DeviceType,
        name: t("childDeviceSelector.allDevices"),
      };
    }

    if (!selectedChild) {
      return {
        _id: ALL_DEVICE_ID,
        type: "phone" as DeviceType,
        name: t("childDeviceSelector.allDevices"),
      };
    }

    const childDevices = devicesByChild[String(selectedChild._id)] ?? [];

    return (
      childDevices.find(
        (device) => String(device._id) === String(selectedDeviceId)
      ) ?? null
    );
  }, [devicesByChild, selectedChild, selectedDeviceId, t]);

  const selectedChildLabel = selectedChild?.name ?? "";

  const visibleRequests = useMemo(() => {
    return pendingRequests.filter((request) => {
      const matchesDevice =
        selectedDeviceId === ALL_DEVICE_ID ||
        String(request.deviceId) === String(selectedDeviceId);

      return matchesDevice;
    });
  }, [pendingRequests, selectedDeviceId]);

  const getChildName = (childId: string) => {
    const child = children.find((c) => String(c._id) === String(childId));
    return child?.name ?? "";
  };

  const getDeviceByIds = (childId: string, deviceId: string) => {
    const list = devicesByChild[String(childId)] ?? [];
    return list.find((d) => String(d._id) === String(deviceId)) ?? null;
  };

  const handleApprove = async (requestId: string) => {
    try {
      await dispatch(
        decideRequestThunk({
          requestId,
          decision: "APPROVED",
        })
      ).unwrap();

      if (selectedChildId) {
        await dispatch(fetchDevicesByChild(selectedChildId));
      }

      Alert.alert(
        t("common.success"),
        t("extensionRequests.requestApproved")
      );
    } catch (error) {
      Alert.alert(
        t("common.error"),
        (error as Error)?.message ?? t("api.generic_error")
      );
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await dispatch(
        decideRequestThunk({
          requestId,
          decision: "REJECTED",
        })
      ).unwrap();

      if (selectedChildId) {
        await dispatch(fetchDevicesByChild(selectedChildId));
      }

      Alert.alert(
        t("common.success"),
        t("extensionRequests.requestDeclined")
      );
    } catch (error) {
      Alert.alert(
        t("common.error"),
        (error as Error)?.message ?? t("api.generic_error")
      );
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t("extensionRequests.title"),
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
              <View style={styles.heroGlow} />

              <AppText weight="extraBold" style={[styles.heroTitle, text]}>
                {t("extensionRequests.heading")}
              </AppText>

              <AppText weight="medium" style={[styles.heroSubtitle, text]}>
                {t("extensionRequests.subtitle")}
              </AppText>

              <View
                style={[
                  styles.heroMetaRow,
                  row,
                  isWide ? styles.heroMetaRowWide : undefined,
                ]}
              >
                <View style={styles.heroMetaChip}>
                  <MaterialCommunityIcons
                    name="account-child-outline"
                    size={18}
                    color="#315BFF"
                  />
                  <AppText weight="bold" style={[styles.heroMetaText, text]}>
                    {selectedChildLabel}
                  </AppText>
                </View>

                <View style={styles.heroMetaChip}>
                  <MaterialCommunityIcons
                    name={
                      selectedDeviceId === ALL_DEVICE_ID
                        ? "devices"
                        : getDeviceIconName(selectedDevice?.type ?? "phone")
                    }
                    size={18}
                    color="#315BFF"
                  />
                  <AppText weight="bold" style={[styles.heroMetaText, text]}>
                    {selectedDevice?.name ?? t("childDeviceSelector.allDevices")}
                  </AppText>
                </View>
              </View>
            </View>

            {!!selectedChildId && (
              <ChildDeviceSelector
                selectedChildId={selectedChildId}
                selectedDeviceId={selectedDeviceId}
                onSelectChild={(childId) => {
                  setSelectedChildId(childId);
                  setSelectedDeviceId(ALL_DEVICE_ID);
                }}
                onSelectDevice={setSelectedDeviceId}
                showDevices
                includeAllDevicesOption
              />
            )}

            <View
              style={[
                styles.sectionHeader,
                { alignItems: isRTL ? "flex-end" : "flex-start" },
              ]}
            >
              <View style={[styles.sectionTitleRow, row]}>
                <AppText weight="extraBold" style={[styles.sectionTitle, text]}>
                  {t("extensionRequests.pendingSectionTitle")}
                </AppText>

                <View style={styles.countBadge}>
                  <AppText weight="extraBold" style={styles.countBadgeText}>
                    {visibleRequests.length}
                  </AppText>
                </View>
              </View>

              <AppText weight="medium" style={[styles.sectionSubtitle, text]}>
                {t("extensionRequests.pendingSectionSubtitle")}
              </AppText>
            </View>

            {requestsStatus === "loading" ? (
              <View style={styles.emptyCard}>
                <ActivityIndicator />
              </View>
            ) : requestsError ? (
              <View style={styles.emptyCard}>
                <AppText weight="extraBold" style={[styles.emptyTitle, text]}>
                  {t("common.error")}
                </AppText>
                <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                  {requestsError}
                </AppText>
              </View>
            ) : visibleRequests.length === 0 ? (
              <View style={styles.emptyCard}>
                <MaterialCommunityIcons
                  name="check-decagram-outline"
                  size={34}
                  color="#7A8599"
                />
                <AppText weight="extraBold" style={[styles.emptyTitle, text]}>
                  {t("extensionRequests.empty.title")}
                </AppText>
                <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                  {t("extensionRequests.empty.subtitle")}
                </AppText>
              </View>
            ) : (
              <View
                style={[styles.cardsWrap, isWide ? styles.cardsWrapWide : undefined]}
              >
                {visibleRequests.map((request) => {
                  const childName = getChildName(request.childId);
                  const device = getDeviceByIds(request.childId, request.deviceId);
                  const deviceName =
                    device?.name ?? t("childDeviceSelector.allDevices");
                  const deviceType = (device?.type as DeviceType) ?? "phone";
                  const remaining = getRemainingMinutes(device);

                  return (
                    <View
                      key={request._id}
                      style={[
                        styles.requestCard,
                        isWide ? styles.requestCardWide : undefined,
                      ]}
                    >
                      <View style={[styles.cardTopRow, row]}>
                        <View style={styles.deviceBadge}>
                          <MaterialCommunityIcons
                            name={getDeviceIconName(deviceType)}
                            size={24}
                            color="#315BFF"
                          />
                        </View>

                        <View style={styles.cardTopTextWrap}>
                          <AppText weight="extraBold" style={[styles.deviceName, text]}>
                            {deviceName}
                          </AppText>

                          <AppText weight="medium" style={[styles.childName, text]}>
                            {childName}
                          </AppText>
                        </View>
                      </View>

                      <View style={styles.infoGrid}>
                        <View
                          style={[
                            styles.infoChip,
                            isRTL ? styles.infoChipRtl : styles.infoChipLtr,
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="clock-plus-outline"
                            size={16}
                            color="#315BFF"
                          />

                          <AppText weight="bold" style={[styles.infoChipText, text]}>
                            {t("extensionRequests.requestedMinutesLabel", {
                              minutes: request.requestedMinutes,
                            })}
                          </AppText>
                        </View>
                      </View>

                      <View style={styles.reasonBox}>
                        <AppText weight="bold" style={[styles.reasonLabel, text]}>
                          {t("extensionRequests.reasonLabel")}
                        </AppText>

                        <AppText weight="medium" style={[styles.reasonText, text]}>
                          {request.reason}
                        </AppText>
                      </View>

                      <View style={styles.remainingBox}>
                        <View
                          style={
                            isRTL ? styles.remainingRowRtl : styles.remainingRowLtr
                          }
                        >
                          <MaterialCommunityIcons
                            name="timer-sand"
                            size={16}
                            color="#7A8599"
                          />
                          <AppText
                            weight="medium"
                            style={[styles.remainingText, text]}
                          >
                            {remaining === "UNLIMITED"
                              ? t("extensionRequests.unlimited")
                              : remaining !== null
                              ? t("extensionRequests.remainingMinutes", {
                                  minutes: remaining,
                                })
                              : t("extensionRequests.remainingInfoUnavailable")}
                          </AppText>
                        </View>
                      </View>

                      <View style={isRTL ? styles.timeRowRtl : styles.timeRowLtr}>
                        <MaterialCommunityIcons
                          name="history"
                          size={16}
                          color="#8A94A6"
                        />
                        <AppText weight="medium" style={[styles.timeText, text]}>
                          {request.createdAt
                            ? new Date(request.createdAt).toLocaleString()
                            : ""}
                        </AppText>
                      </View>

                      <View style={[styles.actionsRow, row]}>
                        <Pressable
                          onPress={() => handleDecline(request._id)}
                          accessibilityRole="button"
                          accessibilityLabel={t(
                            "extensionRequests.a11y.declineRequest",
                            {
                              childName,
                              deviceName,
                            }
                          )}
                          style={({ pressed }) => [
                            styles.actionButton,
                            styles.declineButton,
                            pressed && styles.actionButtonPressed,
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="close"
                            size={18}
                            color="#FFFFFF"
                          />
                          <AppText weight="extraBold" style={styles.actionButtonText}>
                            {t("extensionRequests.decline")}
                          </AppText>
                        </Pressable>

                        <Pressable
                          onPress={() => handleApprove(request._id)}
                          accessibilityRole="button"
                          accessibilityLabel={t(
                            "extensionRequests.a11y.approveRequest",
                            {
                              childName,
                              deviceName,
                            }
                          )}
                          style={({ pressed }) => [
                            styles.actionButton,
                            styles.approveButton,
                            pressed && styles.actionButtonPressed,
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="check"
                            size={18}
                            color="#FFFFFF"
                          />
                          <AppText weight="extraBold" style={styles.actionButtonText}>
                            {t("extensionRequests.approve")}
                          </AppText>
                        </Pressable>
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