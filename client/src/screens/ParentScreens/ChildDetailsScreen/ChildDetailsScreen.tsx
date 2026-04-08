import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
 RefreshControl,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ChildDeviceSelector from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";
import { useChildProfileLabels } from "../../../../hooks/use-child-profile-labels";
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
import { parseRouteParam } from "./childDetailsRouteParams";
import ConfirmDialog from "@/src/components/ConfirmDialog/ConfirmDialog";
import { showAppToast } from "@/src/utils/appToast";
import { emitEvent } from "@/src/services/socket";
import { DELETE_DEVICE } from "@/src/constants/socketEvents";

export default function ChildDetailsScreen() {
  const { t } = useTranslation();
  const { row, text } = useLocaleLayout();
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
        .catch(() => {});
    }

    setDevicesRefreshing(false);
  }, [dispatch, effectiveChildId]);

  const selectedChild = useMemo(
    () =>
      children.find((c) => String(c._id) === String(effectiveChildId)) ?? null,
    [children, effectiveChildId]
  );

  const { childName, birthDateLabel, genderLabel } =
    useChildProfileLabels(selectedChild);

  const deviceRows = useMemo(() => mapDevicesToRows(devices, t), [devices, t]);

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
      showAppToast(t("childDetails.delete_device_error"), t("common.error"));
    } finally {
      setDeletingDeviceId(null);
    }
  }, [dispatch, effectiveChildId, deviceDeleteDialog, deletingDeviceId, t]);

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

        showAppToast(
          locked
            ? t("childDetails.device_locked_success")
            : t("childDetails.device_unlocked_success")
        );
      } catch {
        showAppToast(t("childDetails.lock_error"), t("common.error"));
      }
    },
    [dispatch, effectiveChildId, deletingDeviceId, t]
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
      } catch {
        showAppToast(t("childDetails.rename_device_error"), t("common.error"));
        throw new Error("rename_failed");
      }
    },
    [dispatch, effectiveChildId, t]
  );

  const showFullScreenLoader = isLoading && children.length === 0;

  const showChildrenFetchError =
    Boolean(childrenError) && !isLoading && children.length === 0;

  const showEmptyState = !isLoading && children.length === 0 && !childrenError;

  const errorMessage = childrenError
    ? t(childrenError, { defaultValue: childrenError })
    : "";

  if (showFullScreenLoader) {
    return (
      <ScreenLayout scrollable={false}>
        <View style={[styles.container, { alignItems: "center", paddingTop: 40 }]}>
          <ActivityIndicator />
          <AppText style={[styles.loadingHint, text]}>
            {t("childDetails.loading_children")}
          </AppText>
        </View>
      </ScreenLayout>
    );
  }

  if (showChildrenFetchError) {
    return (
      <ScreenLayout>
        <View style={[styles.container, { paddingTop: 24 }]}>
          <AppText style={[styles.childMeta, text]}>{errorMessage}</AppText>
          <View style={{ marginTop: 12 }}>
            <AppText
              style={[styles.childMeta, text]}
              onPress={refreshChildrenList}
            >
              {t("common.retry")}
            </AppText>
          </View>
        </View>
      </ScreenLayout>
    );
  }

  if (showEmptyState) {
    return (
      <ScreenLayout>
        <View style={[styles.container, { paddingTop: 24 }]}>
          <AppText style={[styles.childMeta, text]}>
            {t("homeParent.no_children")}
          </AppText>
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
            ? t("childDetails.delete_device_title", {
                device: deviceDeleteDialog.displayName,
              })
            : ""
        }
        message={t("childDetails.delete_device_message", {
          child: childName.trim() || t("childDetails.devices_title"),
        })}
        cancelLabel={t("childDetails.delete_device_cancel")}
        confirmLabel={t("childDetails.delete_device_confirm")}
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
            row={row}
            text={text}
            onOpenProfile={handleOpenChildProfile}
          />

          <ChildDetailsDevicesSection
            expanded={isDevicesExpanded}
            onToggleExpanded={() => setIsDevicesExpanded((prev) => !prev)}
            onAddDevice={handleConnectDevice}
            devicesLoading={devicesLoading}
            rows={deviceRows}
            row={row}
            text={text}
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