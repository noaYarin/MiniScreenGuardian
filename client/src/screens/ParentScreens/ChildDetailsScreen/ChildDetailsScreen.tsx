import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import ChildDeviceSelector from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { RootState, AppDispatch } from "@/src/redux/store/types";
import { getMyChildrenThunk } from "@/src/redux/thunks/childrenThunks";
import {
  fetchDevicesByChild,
  deleteDeviceForChild,
  setDeviceLockThunk,
  updateDeviceName,
} from "@/src/redux/thunks/deviceThunks";
import { ChildDetailsProfileCard } from "@/src/components/ChildDetails/ChildDetailsProfileCard";
import { ChildDetailsDevicesSection } from "@/src/components/ChildDetails/ChildDetailsDevicesSection";
import { mapDevicesToRows } from "@/src/components/ChildDetails/mapDevicesToRows";
import { childDetailsStyles as styles } from "@/src/components/ChildDetails/childDetails.styles";
import EmptyStateCard from "../../../components/EmptyStateCard/EmptyStateCard";
import { parseRouteParam } from "./childDetailsRouteParams";
import ConfirmDialog from "@/src/components/ConfirmDialog/ConfirmDialog";
import { showErrorToast, showInfoToast, showSuccessToast } from "@/src/utils/appToast";
import { emitEvent } from "@/src/services/socket";
import { DELETE_DEVICE } from "@/src/constants/socketEvents";
import InfoHint from "../../../components/InfoHint/InfoHint";


type SelectedChildLike = {
  _id?: string;
  id?: string;
  name?: string;
  img?: string | null;
  birthDate?: string | Date | null;
  gender?: string | null;
};

function formatBirthDateLabel(value?: string | Date | null) {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatGenderLabel(value?: string | null) {
  const normalized = String(value ?? "").trim().toLowerCase();

  if (normalized === "boy" || normalized === "male") return "Boy";
  if (normalized === "girl" || normalized === "female") return "Girl";
  if (normalized === "other") return "Other";

  return "—";
}

export default function ChildDetailsScreen() {
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ id?: string; deviceId?: string | string[] }>();
  const dispatch = useDispatch<AppDispatch>();

  const paramDeviceId = useMemo(
    () => parseRouteParam(params.deviceId),
    [params.deviceId]
  );

  const paramChildIdFromRoute = useMemo(
    () => parseRouteParam(params.id),
    [params.id]
  );

  const {
    childrenList,
    isLoading,
    error: childrenError,
  } = useSelector((state: RootState) => state.children);

  const devicesSlice = useSelector((state: RootState) => state.devices);
  const children = Array.isArray(childrenList) ? childrenList : [];

  const [userSelectedChildId, setUserSelectedChildId] = useState<string | null>(null);
  const [isDevicesExpanded, setIsDevicesExpanded] = useState(false);
  const [devicesRefreshing, setDevicesRefreshing] = useState(false);
  const [deletingDeviceId, setDeletingDeviceId] = useState<string | null>(null);
  const [deviceDeleteDialog, setDeviceDeleteDialog] = useState<{
    deviceId: string;
    displayName: string;
  } | null>(null);

  const maxContentWidth = Math.min(900, Math.max(340, width - 32));

  const effectiveChildId = useMemo(() => {
    if (children.length === 0) {
      return paramChildIdFromRoute || userSelectedChildId || "";
    }

    if (
      paramChildIdFromRoute &&
      children.some((c) => String(c._id) === paramChildIdFromRoute)
    ) {
      return paramChildIdFromRoute;
    }

    if (
      userSelectedChildId &&
      children.some((c) => String(c._id) === String(userSelectedChildId))
    ) {
      return String(userSelectedChildId);
    }

    return String(children[0]._id);
  }, [children, paramChildIdFromRoute, userSelectedChildId]);

  const devices = useMemo(() => {
    if (!effectiveChildId) return [];
    return Array.isArray(devicesSlice.byChildId[effectiveChildId])
      ? devicesSlice.byChildId[effectiveChildId]
      : [];
  }, [devicesSlice.byChildId, effectiveChildId]);

  const devicesLoading =
    Boolean(effectiveChildId) &&
    devicesSlice.statusByChildId[effectiveChildId] === "loading";

  const refreshChildrenList = useCallback(() => {
    dispatch(getMyChildrenThunk());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      refreshChildrenList();

      if (effectiveChildId) {
        dispatch(fetchDevicesByChild(effectiveChildId));
      }
    }, [refreshChildrenList, effectiveChildId, dispatch])
  );

  useEffect(() => {
    if (paramDeviceId && paramChildIdFromRoute) {
      setIsDevicesExpanded(true);
    }
  }, [paramDeviceId, paramChildIdFromRoute]);

  const handleRefreshDevices = useCallback(async () => {
    setDevicesRefreshing(true);

    await dispatch(getMyChildrenThunk());

    if (effectiveChildId) {
      await dispatch(fetchDevicesByChild(effectiveChildId))
        .unwrap()
        .catch(() => { });
    }

    setDevicesRefreshing(false);
  }, [dispatch, effectiveChildId]);

  const selectedChild = useMemo(
    () =>
      (children.find((c) => String(c._id) === String(effectiveChildId)) ??
        null) as SelectedChildLike | null,
    [children, effectiveChildId]
  );

  const childName = selectedChild?.name?.trim() || "Child";
  const birthDateLabel = formatBirthDateLabel(selectedChild?.birthDate ?? null);
  const genderLabel = formatGenderLabel(selectedChild?.gender ?? null);

  const deviceRows = useMemo(() => mapDevicesToRows(devices), [devices]);

  const handleConnectDevice = useCallback(() => {
    if (!effectiveChildId) return;

    router.push({
      pathname: "/Parent/linkDevice",
      params: { id: effectiveChildId, name: childName },
    } as never);
  }, [effectiveChildId, childName]);

  const handleOpenChildProfile = useCallback(() => {
    if (!effectiveChildId) return;

    router.push({
      pathname: "/Parent/childProfile",
      params: { id: effectiveChildId, name: childName },
    } as never);
  }, [effectiveChildId, childName]);

  const handleDeleteDevice = useCallback(
    (deviceId: string, deviceDisplayName: string) => {
      if (!effectiveChildId || deletingDeviceId) return;
      setDeviceDeleteDialog({ deviceId, displayName: deviceDisplayName });
    },
    [effectiveChildId, deletingDeviceId]
  );

  const confirmDeleteDevice = useCallback(async () => {
    if (!effectiveChildId || !deviceDeleteDialog || deletingDeviceId) return;

    const { deviceId } = deviceDeleteDialog;
    setDeviceDeleteDialog(null);
    setDeletingDeviceId(deviceId);

    try {
      await dispatch(
        deleteDeviceForChild({
          childId: effectiveChildId,
          deviceId,
        })
      ).unwrap();

      emitEvent(DELETE_DEVICE, { deviceId, childId: effectiveChildId });
    } catch {
      showErrorToast("Could not remove the device. Please try again.", "Error");
    } finally {
      setDeletingDeviceId(null);
    }
  }, [dispatch, effectiveChildId, deviceDeleteDialog, deletingDeviceId]);

  const handleSetDeviceLocked = useCallback(
    async (deviceId: string, locked: boolean) => {
      if (!effectiveChildId || deletingDeviceId) return;

      try {
        await dispatch(
          setDeviceLockThunk({
            deviceId,
            childId: effectiveChildId,
            isLocked: locked,
          })
        ).unwrap();

        showInfoToast(
          locked
            ? "Lock command sent to the child device."
            : "Unlock command sent to the child device."
        );
      } catch {
        showErrorToast("Failed to update the device lock state.", "Error");
      }
    },
    [dispatch, effectiveChildId, deletingDeviceId]
  );

  const handleRenameDevice = useCallback(
    async (deviceId: string, newName: string) => {
      if (!effectiveChildId) {
        throw new Error("no_child");
      }

      try {
        await dispatch(
          updateDeviceName({
            childId: effectiveChildId,
            deviceId,
            name: newName,
          })
        ).unwrap();
        showSuccessToast("The device name was updated successfully.");
      } catch {
        showErrorToast("Could not update the device name. Please try again.", "Error");
        throw new Error("rename_failed");
      }
    },
    [dispatch, effectiveChildId]
  );

  const showFullScreenLoader = isLoading && children.length === 0;
  const showChildrenFetchError =
    Boolean(childrenError) && !isLoading && children.length === 0;
  const showEmptyState = !isLoading && children.length === 0 && !childrenError;
  const errorMessage = childrenError ? String(childrenError) : "";

  if (showFullScreenLoader) {
    return (
      <ScreenLayout scrollable={false}>
        <View style={[styles.container, { alignItems: "center", paddingTop: 40 }]}>
          <ActivityIndicator />
          <AppText style={styles.loadingHint}>Loading children…</AppText>
        </View>
      </ScreenLayout>
    );
  }

  if (showChildrenFetchError) {
    return (
      <ScreenLayout>
        <View style={[styles.container, { paddingTop: 24 }]}>
          <AppText style={styles.childMeta}>{errorMessage || "Could not load children."}</AppText>

          <View style={{ marginTop: 12 }}>
            <Pressable
              onPress={refreshChildrenList}
              accessibilityRole="button"
              accessibilityLabel="Try loading children again"
            >
              <AppText style={styles.childMeta}>Try again</AppText>
            </Pressable>
          </View>
        </View>
      </ScreenLayout>
    );
  }

  if (showEmptyState) {
    return (
      <ScreenLayout>
        <View style={[styles.container, { paddingTop: 24 }]}>
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
    <ScreenLayout scrollable={false}>
      <ConfirmDialog
        visible={deviceDeleteDialog != null}
        title={
          deviceDeleteDialog
            ? `Remove ${deviceDeleteDialog.displayName}?`
            : ""
        }
        message={`The device will be unlinked from ${childName}. This cannot be undone.`}
        cancelLabel="Cancel"
        confirmLabel="Remove"
        destructive
        onCancel={() => setDeviceDeleteDialog(null)}
        onConfirm={confirmDeleteDevice}
      />

      <ScrollView
        style={styles.scrollRoot}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={devicesRefreshing}
            onRefresh={handleRefreshDevices}
          />
        }
      >
        <View style={[styles.content, { maxWidth: maxContentWidth }]}>
          <ChildDeviceSelector
            selectedChildId={effectiveChildId}
            onSelectChild={(childId) => {
              setUserSelectedChildId(childId);
              setIsDevicesExpanded(false);
            }}
            showDevices={false}
          />

          <ChildDetailsProfileCard
            childName={childName}
            birthDateLabel={birthDateLabel}
            genderLabel={genderLabel}
            profileImg={selectedChild?.img}
            row={{ flexDirection: "row" }}
            text={undefined}
            onOpenProfile={handleOpenChildProfile}
          />


          <View style={{ marginTop: 10 }}>
            <InfoHint
              title="How device controls work"
              lines={[
                "Manual lock and unlock work only when Accessibility access is enabled on the child’s device",
                "Manual lock and unlock affect only the manual lock state",
                "They do not turn the daily limit on or off",
                "Daily limits can be changed only on the daily limits screen",
                "Manual lock and daily limits are handled separately",
                "If the daily limit has already been reached and you press Lock, the device may stay in the daily-limit state until the limit is reset or turned off.\nOnce the daily limit is no longer active, the manual lock can be removed",
                "If a device is offline, changes will apply when it reconnects",
              ]}
            />
          </View>

          <ChildDetailsDevicesSection
            expanded={isDevicesExpanded}
            onToggleExpanded={() => setIsDevicesExpanded((prev) => !prev)}
            onAddDevice={handleConnectDevice}
            devicesLoading={devicesLoading}
            rows={deviceRows}
            row={{ flexDirection: "row" }}
            text={undefined}
            deletingDeviceId={deletingDeviceId}
            onDeleteDevice={handleDeleteDevice}
            onSetDeviceLocked={handleSetDeviceLocked}
            onRenameDevice={handleRenameDevice}
          />
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}