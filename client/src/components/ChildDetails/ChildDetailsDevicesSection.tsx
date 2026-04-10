import React from "react";
import {
  View,
  Pressable,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "@/src/components/AppText/AppText";
import type { ChildDetailsDeviceRow } from "./mapDevicesToRows";
import { childDetailsStyles as styles } from "./childDetails.styles";
import { ChildDetailsDeviceCard } from "./ChildDetailsDeviceCard";

type Props = {
  expanded: boolean;
  onToggleExpanded: () => void;
  onAddDevice: () => void;
  devicesLoading: boolean;
  rows: ChildDetailsDeviceRow[];
  row: StyleProp<ViewStyle>;
  text: StyleProp<TextStyle>;
  deletingDeviceId: string | null;
  onDeleteDevice: (deviceId: string, displayName: string) => void;
  onSetDeviceLocked: (deviceId: string, locked: boolean) => void;
  onRenameDevice: (deviceId: string, newName: string) => Promise<void>;
};

export function ChildDetailsDevicesSection({
  expanded,
  onToggleExpanded,
  onAddDevice,
  devicesLoading,
  rows,
  row,
  text,
  deletingDeviceId,
  onDeleteDevice,
  onSetDeviceLocked,
  onRenameDevice,
}: Props) {
  const deleteBusy = deletingDeviceId !== null;

  return (
    <>
      <View style={[styles.sectionHeader, row]}>
        <Pressable
          onPress={onToggleExpanded}
          accessibilityRole="button"
          accessibilityLabel="Expand or collapse devices list"
          style={({ pressed }) => [
            styles.devicesToggleButton,
            pressed && styles.devicesToggleButtonPressed,
          ]}
        >
          <View style={[styles.devicesToggleInner, row]}>
            <AppText weight="extraBold" style={[styles.sectionTitle, text]}>
              Devices
            </AppText>
            <MaterialCommunityIcons
              name={expanded ? "chevron-down" : "chevron-up"}
              size={22}
              color="#0F172A"
            />
          </View>
        </Pressable>

        <Pressable
          style={styles.addDeviceButton}
          onPress={onAddDevice}
          accessibilityRole="button"
          accessibilityLabel="Add a new device for this child"
        >
          <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
          <AppText weight="extraBold" style={styles.addDeviceButtonText}>
            Add device
          </AppText>
        </Pressable>
      </View>

      {expanded && (
        <View style={styles.devicesList}>
          {devicesLoading ? (
            <ActivityIndicator style={{ marginVertical: 12 }} />
          ) : (
            rows.map((device) => (
              <ChildDetailsDeviceCard
                key={device.id}
                device={device}
                row={row}
                text={text}
                deleteDisabled={deleteBusy}
                lockDisabled={deleteBusy}
                renameDisabled={deleteBusy}
                onDelete={onDeleteDevice}
                onSetDeviceLocked={onSetDeviceLocked}
                onRenameDevice={onRenameDevice}
              />
            ))
          )}
        </View>
      )}
    </>
  );
}