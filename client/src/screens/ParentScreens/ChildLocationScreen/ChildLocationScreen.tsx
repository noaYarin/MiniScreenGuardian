import React, { useEffect, useMemo, useState } from "react";
import { View, ScrollView, useWindowDimensions, Linking, Platform, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Href, router } from "expo-router";
import Toast from "react-native-root-toast";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import ChildSelector from "../../../components/ChildSelector/ChildSelector";
import LocationMapCard from "../../../components/ChildLocation/LocationMapCard";
import LocationDetailsCard from "../../../components/ChildLocation/LocationDetailsCard";
import LocationActions from "../../../components/ChildLocation/LocationActions";
import AppText from "@/src/components/AppText/AppText";

import { fetchDevicesByChild } from "@/src/redux/thunks/deviceThunks";
import { styles } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";
import type { RootState, AppDispatch } from "@/src/redux/store/types";
import { CHILD_ACCENT_COLORS } from "../../../../constants/childAccentColors";
import type { DeviceLocationSnapshot } from "../../../components/ChildLocation/types";
import { REQUEST_REFRESH_FROM_PARENT } from "@/src/constants/socketEvents";
import { emitEvent } from "@/src/services/socket";


const getAccent = (id: string) => 
  CHILD_ACCENT_COLORS[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % CHILD_ACCENT_COLORS.length];

export default function ChildLocationScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { text, row, isRTL } = useLocaleLayout();
  const dispatch = useDispatch<AppDispatch>();

  // --- Redux State ---
  const childrenList = useSelector((state: RootState) => state.children.childrenList ?? []);
  const { byChildId, statusByChildId } = useSelector((state: RootState) => state.devices);
  const { parentId } = useSelector((state: RootState) => state.auth ?? {});

  const [selectedChildId, setSelectedChildId] = useState(childrenList[0]?._id ?? "");
  const [deviceSnapshot, setDeviceSnapshot] = useState<DeviceLocationSnapshot | null>(null);

  const selectedChild = useMemo(() => 
    childrenList.find(c => c._id === selectedChildId), 
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

  // --- Handlers ---
  const onRefreshLocation = (childId: string) => {
    emitEvent(REQUEST_REFRESH_FROM_PARENT, { parentId, childId });
  };

  // Navigate to the location of the child open maps
  const onNavigate = async () => {
    if (!deviceSnapshot || !deviceSnapshot.latitude || !deviceSnapshot.longitude) {
      Toast.show(
        `${t("childLocation.navigateNoCoordsTitle")}\n${t("childLocation.navigateNoCoordsMessage")}`,
        {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
        }
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

  if (!selectedChild) return null;

  const childOption = {
    id: selectedChild._id,
    name: selectedChild.name,
    accent: getAccent(selectedChild._id),
    initial: selectedChild.name?.[0] ?? "",
  };

  const hasNoDevices = statusByChildId[selectedChildId] === "succeeded" && devicesForSelectedChild.length === 0;

  if (hasNoDevices) {
    return (
      <ScreenLayout>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.container, width >= 900 && styles.containerTablet]}>
            <ChildSelector selectedChildId={selectedChildId} onSelectChild={setSelectedChildId} />
            <View style={{ marginTop: 60, alignItems: 'center', paddingHorizontal: 20 }}>
              <AppText weight="bold" style={{ fontSize: 20, textAlign: 'center', color: '#333' }}>
                {t("childLocation.noDevicesTitle")}
              </AppText>
              <AppText style={{ textAlign: 'center', marginTop: 12, color: '#666', fontSize: 16, marginBottom: 20 }}>
                {t("childLocation.noDevicesMessage")}
              </AppText>
              <Button
                title={t("childLocation.addDeviceButton")}
                onPress={() =>
                  router.push({
                    pathname: "/Parent/(tabs)/children" as Href,
                    params: { id: selectedChildId, name: selectedChild.name },
                  } as never)
                }
              />
            </View>
          </View>
        </ScrollView>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.container, width >= 900 && styles.containerTablet]}>
          <ChildSelector selectedChildId={selectedChildId} onSelectChild={setSelectedChildId} />
          
          <LocationMapCard
            isRTL={isRTL}
            text={text}
            selectedChild={childOption}
            onDeviceLocation={setDeviceSnapshot}
          />

          <LocationDetailsCard
            text={text}
            row={row}
            detailsTitle={t("childLocation.detailsTitle")}
            addressLabel={t("childLocation.currentLocationLabel")}
            updatedLabel={t("childLocation.updatedLabel")}
            selectedChildLabel={t("childLocation.selectedChildLabel")}
            selectedChildName={selectedChild.name}
            deviceSnapshot={deviceSnapshot}
          />

          <LocationActions 
            row={row} 
            onRefreshLocation={() => onRefreshLocation(selectedChildId)} 
            onNavigateToLocation={onNavigate} 
            isLoading={isUpdating} 
            refreshButtonText={t("childLocation.refreshButton")} 
            navigateButtonText={t("childLocation.navigateButton")}
            refreshA11y={t("childLocation.refreshA11y")} 
            navigateA11y={t("childLocation.navigateA11y")} 
          />
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}