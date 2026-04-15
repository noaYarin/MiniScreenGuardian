import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  useWindowDimensions,
  Linking,
  Platform,
  Pressable,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Href, router } from "expo-router";
import { showInfoToast } from "@/src/utils/appToast";
import EmptyStateCard from "../../../components/EmptyStateCard/EmptyStateCard";
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import ChildSelector from "../../../components/ChildSelector/ChildSelector";
import LocationMapCard from "../../../components/ChildLocation/LocationMapCard";
import LocationDetailsCard from "../../../components/ChildLocation/LocationDetailsCard";
import LocationActions from "../../../components/ChildLocation/LocationActions";
import AppText from "@/src/components/AppText/AppText";

import { fetchDevicesByChild } from "@/src/redux/thunks/deviceThunks";
import { styles } from "./styles";

import type { RootState, AppDispatch } from "@/src/redux/store/types";
import { CHILD_ACCENT_COLORS } from "../../../../constants/childAccentColors";
import type { DeviceLocationSnapshot } from "../../../components/ChildLocation/types";
import { REQUEST_REFRESH_FROM_PARENT } from "@/src/constants/socketEvents";
import { emitEvent } from "@/src/services/socket";

const getAccent = (id: string) =>
  CHILD_ACCENT_COLORS[
  [...id].reduce((a, c) => a + c.charCodeAt(0), 0) %
  CHILD_ACCENT_COLORS.length
  ];

export default function ChildLocationScreen() {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();

  const childrenList = useSelector(
    (state: RootState) => state.children.childrenList ?? []
  );
  const { byChildId, statusByChildId } = useSelector(
    (state: RootState) => state.devices
  );
  const { parentId } = useSelector((state: RootState) => state.auth ?? {});

  const [selectedChildId, setSelectedChildId] = useState(
    childrenList[0]?._id ?? ""
  );
  const [deviceSnapshot, setDeviceSnapshot] =
    useState<DeviceLocationSnapshot | null>(null);

  useEffect(() => {
    if (!selectedChildId && childrenList.length > 0) {
      setSelectedChildId(childrenList[0]._id);
    }
  }, [childrenList, selectedChildId]);

  const selectedChild = useMemo(
    () => childrenList.find((c) => c._id === selectedChildId),
    [childrenList, selectedChildId]
  );

  const devicesForSelectedChild = useMemo(
    () => byChildId[selectedChildId] ?? [],
    [byChildId, selectedChildId]
  );

  const isUpdating = statusByChildId[selectedChildId] === "loading";

  useEffect(() => {
    if (selectedChildId) {
      dispatch(fetchDevicesByChild(selectedChildId));
    }
  }, [selectedChildId, dispatch]);

  const onRefreshLocation = (childId: string) => {
    emitEvent(REQUEST_REFRESH_FROM_PARENT, { parentId, childId });
  };

  const onNavigate = async () => {
    if (!deviceSnapshot || !deviceSnapshot.latitude || !deviceSnapshot.longitude) {
      showInfoToast(
        "Allow location in Settings, then refresh. If it still fails, check the app location permission.",
        "No location yet"
      );
      return;
    }

    const { latitude, longitude } = deviceSnapshot;
    const label = selectedChild?.name || "Child";

    const url = Platform.select({
      ios: `maps://app?q=${label}&ll=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
      default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}` // fallback
    });

    try {
      if (url) {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          // Using https for the fallback in case the maps app is not installed
          await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
        }
      }
    } catch (err) {
      console.error("Navigation error:", err);
      const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      Linking.openURL(fallbackUrl);
    }
  };

  if (!selectedChild) {
    return (
      <ScreenLayout>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View
            style={[styles.container, width >= 900 && styles.containerTablet]}
          >
            <EmptyStateCard
              icon="account-child-outline"
              title="No children yet"
              subtitle="There are no children linked to this account yet."
            />
          </View>
        </ScrollView>
      </ScreenLayout>
    );
  }

  const childOption = {
    id: selectedChild._id,
    name: selectedChild.name,
    accent: getAccent(selectedChild._id),
    initial: selectedChild.name?.[0] ?? "",
  };

  const hasNoDevices =
    statusByChildId[selectedChildId] === "succeeded" &&
    devicesForSelectedChild.length === 0;

  if (hasNoDevices) {
    return (
      <ScreenLayout>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View
            style={[styles.container, width >= 900 && styles.containerTablet]}
          >
            <ChildSelector
              selectedChildId={selectedChildId}
              onSelectChild={setSelectedChildId}
            />
            <EmptyStateCard
              icon="cellphone-link-off"
              title="No devices yet"
              subtitle="Add a device to start tracking location."
              buttonLabel="Add device"
              onPressButton={() =>
                router.push({
                  pathname: "/Parent/(tabs)/children" as Href,
                  params: { id: selectedChildId, name: selectedChild.name },
                } as never)
              }
            />
          </View>
        </ScrollView>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.container, width >= 900 && styles.containerTablet]}>
          <ChildSelector
            selectedChildId={selectedChildId}
            onSelectChild={setSelectedChildId}
          />

          <LocationMapCard
            selectedChild={childOption}
            onDeviceLocation={setDeviceSnapshot}
          />

          <LocationDetailsCard
            detailsTitle="Location Details"
            addressLabel="Current location"
            updatedLabel="Updated"
            selectedChildLabel="Selected child"
            selectedChildName={selectedChild.name}
            deviceSnapshot={deviceSnapshot}
          />

          <LocationActions
            onRefreshLocation={() => onRefreshLocation(selectedChildId)}
            onNavigateToLocation={onNavigate}
            isLoading={isUpdating}
            refreshButtonText="Refresh location"
            navigateButtonText="Navigate to location"
            refreshA11y="Refresh child location"
            navigateA11y="Open navigation to child location"
          />
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}