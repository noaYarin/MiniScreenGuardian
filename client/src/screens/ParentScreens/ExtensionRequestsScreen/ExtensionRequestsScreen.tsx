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
import { showAppToast } from "@/src/utils/appToast";

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
    return children.find((c) => String(c._id) === selectedChildId) ?? null;
  }, [children, selectedChildId]);

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

      showAppToast("Request approved", "Success");
    } catch (error: any) {
      showAppToast(error?.message ?? "Something went wrong", "Error");
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

      showAppToast("Request declined", "Success");
    } catch (error: any) {
      showAppToast(error?.message ?? "Something went wrong", "Error");
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
              Manage pending requests from your children
            </AppText>
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
            <AppText>No pending requests</AppText>
          ) : (
            <View style={styles.cardsWrap}>
              {visibleRequests.map((request) => {
                const device = devicesByChild[String(request.childId)]?.find(
                  (d) => String(d._id) === String(request.deviceId)
                );

                return (
                  <View key={request._id} style={styles.requestCard}>
                    <AppText weight="bold">
                      {device?.name ?? "Device"}
                    </AppText>

                    <AppText>
                      Requested: {request.requestedMinutes} minutes
                    </AppText>

                    <AppText>{request.reason}</AppText>

                    <View style={styles.actionsRow}>
                      <Pressable
                        onPress={() => handleDecline(request._id)}
                        style={styles.declineButton}
                      >
                        <AppText style={styles.actionButtonText}>
                          Decline
                        </AppText>
                      </Pressable>

                      <Pressable
                        onPress={() => handleApprove(request._id)}
                        style={styles.approveButton}
                      >
                        <AppText style={styles.actionButtonText}>
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