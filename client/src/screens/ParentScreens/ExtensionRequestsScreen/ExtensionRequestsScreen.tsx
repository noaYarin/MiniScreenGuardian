import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import ChildDeviceSelector, {
  ALL_DEVICE_ID,
  type DeviceType,
} from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import { styles } from "./styles";

import type { AppDispatch, RootState } from "@/src/redux/store/types";
import { getMyChildrenThunk } from "@/src/redux/thunks/childrenThunks";
import { fetchDevicesByChild } from "@/src/redux/thunks/deviceThunks";
import {
  fetchPendingRequestsThunk,
  decideRequestThunk,
} from "@/src/redux/thunks/requestThunks";
import { showErrorToast, showSuccessToast } from "@/src/utils/appToast";
import EmptyStateCard from "../../../components/EmptyStateCard/EmptyStateCard";
import InfoHint from "../../../components/InfoHint/InfoHint";

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

  const pendingRequestsRefreshKey = useSelector(
    (state: RootState) => state.requests.pendingRequestsRefreshKey
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
  }, [dispatch, selectedChildId, pendingRequestsRefreshKey]);

  const selectedChild = useMemo(() => {
    return children.find((c) => String(c._id) === selectedChildId) ?? null;
  }, [children, selectedChildId]);

  const getChildName = (childId: string) => {
    const child = children.find((c) => String(c._id) === String(childId));
    return child?.name ?? "";
  };

  const getDeviceByIds = (childId: string, deviceId: string) => {
    const list = devicesByChild[String(childId)] ?? [];
    return list.find((d) => String(d._id) === String(deviceId)) ?? null;
  };

  const selectedDevice = useMemo(() => {
    if (selectedDeviceId === ALL_DEVICE_ID) {
      return {
        _id: ALL_DEVICE_ID,
        type: "phone" as DeviceType,
        name: "All devices",
      };
    }

    if (!selectedChild) return null;

    const list = devicesByChild[String(selectedChild._id)] ?? [];

    return list.find((d) => String(d._id) === selectedDeviceId) ?? null;
  }, [devicesByChild, selectedChild, selectedDeviceId]);

  const visibleRequests = useMemo(() => {
    return pendingRequests.filter((r) => {
      return (
        selectedDeviceId === ALL_DEVICE_ID ||
        String(r.deviceId) === selectedDeviceId
      );
    });
  }, [pendingRequests, selectedDeviceId]);

  const handleApprove = async (requestId: string) => {
    try {
      await dispatch(
        decideRequestThunk({
          requestId,
          decision: "APPROVED",
        })
      ).unwrap();

      showSuccessToast("The request was approved and extra time was added.");
    } catch (error: any) {
      showErrorToast(
        error?.message ?? "Could not update the request. Please try again.",
        "Error"
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

      showSuccessToast("The request was declined.");
    } catch (error: any) {
      showErrorToast(
        error?.message ?? "Could not update the request. Please try again.",
        "Error"
      );
    }
  };

  return (
    <ScreenLayout>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.heroCard}>
            <AppText weight="extraBold" style={styles.heroTitle}>
              Extension Requests
            </AppText>

            <AppText weight="medium" style={styles.heroSubtitle}>
              Review and manage pending requests for extra daily screen time
            </AppText>

            <InfoHint
              title="How requests work"
              lines={[
                "Approving a request adds extra minutes for the current day only",
                "Approved extra time stays until the daily reset, even if the daily limit is turned off and on again",
                "Requests on this screen affect only the daily limit and do not control manual lock or unlock actions",
                "If the device is offline or Usage Access is turned off, the remaining time shown here may update after the device reconnects and syncs",
              ]}
            />

          </View>


          {!!selectedChildId && (
            <ChildDeviceSelector
              selectedChildId={selectedChildId}
              selectedDeviceId={selectedDeviceId}
              onSelectChild={(id) => {
                setSelectedChildId(id);
                setSelectedDeviceId(ALL_DEVICE_ID);
              }}
              onSelectDevice={setSelectedDeviceId}
              showDevices
              includeAllDevicesOption
            />
          )}

          {requestsStatus === "loading" ? (
            <ActivityIndicator />
          ) : requestsError ? (
            <AppText>Error: {requestsError}</AppText>
          ) : visibleRequests.length === 0 ? (
            <EmptyStateCard
              icon="clock-outline"
              title="No pending requests"
              subtitle="New extension requests will appear here."
            />
          ) : (
            <View style={styles.cardsWrap}>
              {visibleRequests.map((request) => {
                const childName = getChildName(request.childId);
                const device = getDeviceByIds(request.childId, request.deviceId);
                const deviceName = device?.name ?? "All devices";
                const deviceType = (device?.type as DeviceType) ?? "phone";
                const remaining = getRemainingMinutes(device);

                return (
                  <View key={request._id} style={styles.requestCard}>
                    <View style={styles.cardTopRow}>
                      <View style={styles.deviceBadge}>
                        <MaterialCommunityIcons
                          name={getDeviceIconName(deviceType)}
                          size={24}
                          color="#315BFF"
                        />
                      </View>

                      <View style={styles.cardTopTextWrap}>
                        <AppText weight="extraBold" style={styles.deviceName}>
                          {deviceName}
                        </AppText>

                        <AppText weight="medium" style={styles.childName}>
                          {childName}
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.infoGrid}>
                      <View style={styles.infoChip}>
                        <MaterialCommunityIcons
                          name="clock-plus-outline"
                          size={16}
                          color="#315BFF"
                        />
                        <AppText weight="bold" style={styles.infoChipText}>
                          Requested extra time: {request.requestedMinutes} minutes
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.reasonBox}>
                      <AppText weight="bold" style={styles.reasonLabel}>
                        Reason
                      </AppText>

                      <AppText weight="medium" style={styles.reasonText}>
                        {request.reason || "No reason provided"}
                      </AppText>
                    </View>

                    <View style={styles.remainingBox}>
                      <View style={styles.remainingRowLtr}>
                        <MaterialCommunityIcons
                          name="timer-sand"
                          size={16}
                          color="#7A8599"
                        />
                        <AppText weight="medium" style={styles.remainingText}>
                          {remaining === "UNLIMITED"
                            ? "Unlimited"
                            : remaining !== null
                              ? `${remaining} minutes remaining`
                              : "Remaining time unavailable"}
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.timeRowLtr}>
                      <MaterialCommunityIcons
                        name="history"
                        size={16}
                        color="#8A94A6"
                      />
                      <AppText weight="medium" style={styles.timeText}>
                        {request.createdAt ? new Date(request.createdAt).toLocaleString() : ""}
                      </AppText>
                    </View>

                    <View style={styles.actionsRow}>
                      <Pressable
                        onPress={() => handleDecline(request._id)}
                        accessibilityRole="button"
                        accessibilityLabel={`Decline request for ${deviceName}`}
                        style={({ pressed }) => [
                          styles.actionButton,
                          styles.declineButton,
                          pressed && styles.actionButtonPressed,
                        ]}
                      >
                        <MaterialCommunityIcons name="close" size={18} color="#FFFFFF" />
                        <AppText weight="extraBold" style={styles.actionButtonText}>
                          Decline
                        </AppText>
                      </Pressable>

                      <Pressable
                        onPress={() => handleApprove(request._id)}
                        accessibilityRole="button"
                        accessibilityLabel={`Approve request for ${deviceName}`}
                        style={({ pressed }) => [
                          styles.actionButton,
                          styles.approveButton,
                          pressed && styles.actionButtonPressed,
                        ]}
                      >
                        <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
                        <AppText weight="extraBold" style={styles.actionButtonText}>
                          Approve
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
  );
}