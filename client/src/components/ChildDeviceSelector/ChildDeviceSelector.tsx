import React, { useMemo } from "react";
import { View, ScrollView, Pressable, useWindowDimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import AppText from "../AppText/AppText";
import { styles } from "./styles";

import { useTranslation } from "../../../hooks/use-translation";
import { useLocaleLayout } from "../../../hooks/use-locale-layout";
import ChildSelector from "../ChildSelector/ChildSelector";
import { RootState } from "@/src/redux/store/types";

export type DeviceType = "phone" | "tablet";

export type ChildDevice = {
  id: string;
  type: DeviceType;
  name: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
};

export const ALL_DEVICE_ID = "all-devices";

type Props = {
  selectedChildId: string;
  onSelectChild: (childId: string) => void;
  showDevices?: boolean;
  selectedDeviceId?: string;
  onSelectDevice?: (deviceId: string) => void;
  deviceSectionTitleKey?: string;
  includeAllDevicesOption?: boolean;
  allDevicesLabel?: string;
};

export default function ChildDeviceSelector({
  selectedChildId,
  onSelectChild,
  showDevices = false,
  selectedDeviceId,
  onSelectDevice,
  deviceSectionTitleKey = "childDeviceSelector.devicesSectionTitle",
  includeAllDevicesOption = false,
  allDevicesLabel,
}: Props) {
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const { isRTL, text, row } = useLocaleLayout();

  const devicesByChild = useSelector((state: RootState) => state.devices.byChildId);

  const computedDeviceChipWidth = useMemo(() => {
    if (width < 380) return 150;
    if (width < 450) return 160;
    return 170;
  }, [width]);

  const currentChildDevices = useMemo(() => {
    const rawDevices = devicesByChild[selectedChildId] || [];
    
    const mapped: ChildDevice[] = rawDevices.map((d: any) => ({
      id: d.deviceId || d._id,
      name: d.deviceName || d.model || "",
      type: d.type === "tablet" ? "tablet" : "phone",
      icon: d.type === "tablet" ? "tablet" : "phone",
    }));

    if (includeAllDevicesOption && mapped.length > 0) {
      const allOption: ChildDevice = {
        id: ALL_DEVICE_ID,
        name: allDevicesLabel ?? t("childDeviceSelector.allDevices"),
        type: "phone",
        icon: "devices",
      };
      return [allOption, ...mapped];
    }
    return mapped;
  }, [devicesByChild, selectedChildId, includeAllDevicesOption, allDevicesLabel, t]);

  const shouldCenterDevices = currentChildDevices.length <= 2;

  return (
    <View style={styles.wrapper}>
      <ChildSelector 
        selectedChildId={selectedChildId} 
        onSelectChild={onSelectChild} 
      />

      {showDevices && currentChildDevices.length > 0 && (
        <View style={styles.section}>
          <AppText weight="bold" style={[styles.sectionTitle, text]}>
            {t(deviceSectionTitleKey)}
          </AppText>

          <View style={styles.devicesViewport}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.devicesRow,
                isRTL ? styles.devicesRowRtl : styles.devicesRowLtr,
                shouldCenterDevices ? styles.devicesRowCentered : null,
              ]}
            >
              {currentChildDevices.map((device) => {
                const isSelected = device.id === selectedDeviceId;

                return (
                  <Pressable
                    key={device.id}
                    onPress={() => onSelectDevice?.(device.id)}
                    style={({ pressed }) => [
                      styles.deviceChip,
                      row,
                      { minWidth: computedDeviceChipWidth },
                      isSelected && styles.deviceChipSelected,
                      pressed ? styles.pressed : null,
                    ]}
                  >
                    <View style={[styles.deviceIconWrap, isSelected && styles.deviceIconWrapSelected]}>
                      <MaterialCommunityIcons
                        name={device.icon}
                        size={20}
                        color={isSelected ? "#FFFFFF" : "#3D6BF2"}
                      />
                    </View>

                    <View style={styles.deviceTextWrap}>
                      <AppText weight="bold" style={[styles.deviceName, text]} numberOfLines={1}>
                        {device.name}
                      </AppText>
                      
                      {device.id !== ALL_DEVICE_ID && (
                        <AppText weight="medium" style={[styles.deviceType, text]} numberOfLines={1}>
                          {t(`childDeviceSelector.devices.${device.type}`)}
                        </AppText>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}