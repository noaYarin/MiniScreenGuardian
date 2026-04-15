import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "@/src/components/AppText/AppText";
import type { ChildDetailsDeviceRow } from "./mapDevicesToRows";
import {
  childDetailsStyles as styles,
  childDetailsIconColors,
} from "./childDetails.styles";

const DEVICE_NAME_MAX_LEN = 20;


type DeviceDetailRowProps = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  value: string;
  row: StyleProp<ViewStyle>;
  text: StyleProp<TextStyle>;
  valueLines?: number;
  isDeviceNameRow?: boolean;
  nameInputValue?: string;
  onNameInputChange?: (text: string) => void;
  onNameInputCommit?: () => void;
  nameInputDisabled?: boolean;
};

function DeviceDetailRow({
  icon,
  label,
  value,
  row,
  text,
  valueLines = 2,
  isDeviceNameRow,
  nameInputValue,
  onNameInputChange,
  onNameInputCommit,
  nameInputDisabled,
}: DeviceDetailRowProps) {
  return (
    <View style={[styles.deviceDetailRow, row]}>
      <View style={styles.deviceDetailIconColumn}>
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={childDetailsIconColors.detailAccent}
        />
      </View>

      <View style={styles.deviceDetailTextColumn}>
        <AppText style={[styles.deviceDetailLabel, text]}>{label}</AppText>

        {isDeviceNameRow &&
          nameInputValue != null &&
          onNameInputChange != null ? (
          <TextInput
            value={nameInputValue}
            onChangeText={(v) =>
              onNameInputChange(v.slice(0, DEVICE_NAME_MAX_LEN))
            }
            onSubmitEditing={() => onNameInputCommit?.()}
            onBlur={() => onNameInputCommit?.()}
            editable={!nameInputDisabled}
            maxLength={DEVICE_NAME_MAX_LEN}
            returnKeyType="done"
            accessibilityLabel="Device name"
            style={[
              styles.deviceDetailValue,
              styles.deviceDetailNameInput,
              text,
              nameInputDisabled && { opacity: 0.45 },
            ]}
          />
        ) : (
          <AppText
            style={[styles.deviceDetailValue, text]}
            numberOfLines={valueLines}
          >
            {value}
          </AppText>
        )}
      </View>
    </View>
  );
}

type Props = {
  device: ChildDetailsDeviceRow;
  row: StyleProp<ViewStyle>;
  text: StyleProp<TextStyle>;
  deleteDisabled: boolean;
  lockDisabled: boolean;
  renameDisabled: boolean;
  onDelete: (deviceId: string, displayName: string) => void;
  onSetDeviceLocked: (deviceId: string, locked: boolean) => void;
  onRenameDevice: (deviceId: string, newName: string) => Promise<void>;
};

export function ChildDetailsDeviceCard({
  device,
  row,
  text,
  deleteDisabled,
  lockDisabled,
  renameDisabled,
  onDelete,
  onSetDeviceLocked,
  onRenameDevice,
}: Props) {
  const [nameDraft, setNameDraft] = useState(device.name);
  const [nameSaving, setNameSaving] = useState(false);

  useEffect(() => {
    setNameDraft(device.name);
  }, [device.id, device.name]);

  const commitDeviceName = useCallback(async () => {
    if (renameDisabled || nameSaving) return;

    const trimmed = nameDraft.trim();

    if (trimmed.length === 0) {
      setNameDraft(device.name);
      return;
    }

    if (trimmed === device.name) return;

    setNameSaving(true);
    try {
      await onRenameDevice(device.id, trimmed);
    } catch {
      setNameDraft(device.name);
    } finally {
      setNameSaving(false);
    }
  }, [
    device.id,
    device.name,
    nameDraft,
    nameSaving,
    onRenameDevice,
    renameDisabled,
  ]);

  const linkColor = device.active ? "#16A34A" : "#64748B";

  const looksLikeDailyLimitLock =
    device.isLocked &&
    device.isLimitEnabled &&
    device.remainingMinutes === 0;

  const showUnlock = device.isLocked && !looksLikeDailyLimitLock;

  return (
    <View style={styles.deviceCard}>
      <View style={[styles.deviceHeaderRow, row]}>
        <View style={styles.deviceMainInfo}>
          <AppText
            weight="extraBold"
            style={[styles.deviceName, text]}
            numberOfLines={1}
          >
            {device.name}
          </AppText>

          <View style={[styles.deviceStatusRow, row]}>
            <MaterialCommunityIcons
              name="cellphone-link"
              size={17}
              color={linkColor}
            />
            <AppText style={[styles.deviceStatusText, text, { color: linkColor }]}>
              {device.active ? "Linked" : "Not linked"}
            </AppText>
          </View>

          <View style={styles.deviceInfoStrip}>
            <DeviceDetailRow
              icon="rename-outline"
              label="Device name"
              value={device.name}
              row={row}
              text={text}
              valueLines={2}
              isDeviceNameRow
              nameInputValue={nameDraft}
              onNameInputChange={setNameDraft}
              onNameInputCommit={() => {
                void commitDeviceName();
              }}
              nameInputDisabled={renameDisabled || nameSaving}
            />

            <View style={styles.deviceDetailRowDivider} />

            <DeviceDetailRow
              icon="tablet-cellphone"
              label="Device type"
              value={device.typeLabel}
              row={row}
              text={text}
              valueLines={1}
            />

            <View style={styles.deviceDetailRowDivider} />

            <DeviceDetailRow
              icon="cellphone-marker"
              label="Platform"
              value={device.platformLabel}
              row={row}
              text={text}
              valueLines={1}
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                looksLikeDailyLimitLock
                  ? `Daily limit reached for ${device.name}`
                  : showUnlock
                    ? `Unlock device ${device.name}`
                    : `Lock device ${device.name}`
              }
              disabled={lockDisabled || looksLikeDailyLimitLock}
              onPress={() => {
                if (!looksLikeDailyLimitLock) {
                  onSetDeviceLocked(device.id, showUnlock ? false : true);
                }
              }}
              style={({ pressed }) => [
                styles.deviceLockActionButton,
                looksLikeDailyLimitLock
                  ? styles.deviceLockActionButtonLimit
                  : showUnlock
                    ? styles.deviceLockActionButtonGreen
                    : styles.deviceLockActionButtonRed,
                (lockDisabled || looksLikeDailyLimitLock) && { opacity: 0.45 },
                pressed && !lockDisabled && !looksLikeDailyLimitLock && { opacity: 0.85 },
              ]}
            >
              <MaterialCommunityIcons
                name={
                  looksLikeDailyLimitLock
                    ? "timer-off-outline"
                    : showUnlock
                      ? "lock-open-outline"
                      : "lock-outline"
                }
                size={18}
                color={
                  looksLikeDailyLimitLock
                    ? "#C2410C"
                    : showUnlock
                      ? "#ffffff"
                      : "#ffffff"
                }
              />

              <AppText
                weight="extraBold"
                style={
                  looksLikeDailyLimitLock
                    ? styles.deviceLockActionTextLimit
                    : showUnlock
                      ? styles.deviceLockActionTextGreen
                      : styles.deviceLockActionTextRed
                }
              >
                {looksLikeDailyLimitLock
                  ? "Daily limit reached"
                  : showUnlock
                    ? "Unlock"
                    : "Lock"}
              </AppText>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            (deleteDisabled || pressed) && {
              opacity: deleteDisabled ? 0.45 : 0.75,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Delete device ${device.name}`}
          disabled={deleteDisabled}
          onPress={() => onDelete(device.id, device.name)}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={22}
            color={childDetailsIconColors.deleteTrash}
          />
        </Pressable>
      </View>
    </View>
  );
}