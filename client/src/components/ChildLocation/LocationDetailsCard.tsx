import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import * as Location from "expo-location";

import AppText from "../AppText/AppText";
import { styles } from "../../screens/ParentScreens/ChildLocationScreen/styles";
import InfoItem from "./InfoItem";
import type { DeviceLocationSnapshot } from "./types";

type Props = {
  detailsTitle: string;
  addressLabel: string;
  updatedLabel: string;
  selectedChildLabel: string;
  selectedChildName: string;
  deviceSnapshot: DeviceLocationSnapshot | null;
  locationSharingEnabled?: boolean;
  disabledAddressValue?: string;
};

export default function LocationDetailsCard({
  detailsTitle,
  addressLabel,
  updatedLabel,
  selectedChildLabel,
  selectedChildName,
  deviceSnapshot,
  locationSharingEnabled = true,
  disabledAddressValue,
}: Props) {
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);

  useEffect(() => {
    if (
      !locationSharingEnabled ||
      !deviceSnapshot ||
      typeof deviceSnapshot.latitude !== "number" ||
      typeof deviceSnapshot.longitude !== "number"
    ) {
      setResolvedAddress(null);
      return;
    }

    const fetchAddress = async () => {
      try {
        const reversed = await Location.reverseGeocodeAsync({
          latitude: deviceSnapshot.latitude,
          longitude: deviceSnapshot.longitude,
        });

        const res = reversed[0];

        if (res) {
          const street = res.street || "";
          const city = res.city || "";
          const streetNumber = res.streetNumber ? ` ${res.streetNumber}` : "";

          const fullAddress = `${street}${streetNumber}${
            street && city ? ", " : ""
          }${city}`.trim();

          setResolvedAddress(
            fullAddress ||
              `${deviceSnapshot.latitude.toFixed(4)}, ${deviceSnapshot.longitude.toFixed(4)}`
          );
          return;
        }

        setResolvedAddress(
          `${deviceSnapshot.latitude.toFixed(4)}, ${deviceSnapshot.longitude.toFixed(4)}`
        );
      } catch (error) {
        console.warn("Geocoding error:", error);
        setResolvedAddress(
          `${deviceSnapshot.latitude.toFixed(4)}, ${deviceSnapshot.longitude.toFixed(4)}`
        );
      }
    };

    fetchAddress();
  }, [
    deviceSnapshot,
    deviceSnapshot?.latitude,
    deviceSnapshot?.longitude,
    locationSharingEnabled,
  ]);

  const displayData = useMemo(() => {
    if (!locationSharingEnabled) {
      return {
        address: disabledAddressValue || "---",
        updated: "--:--",
      };
    }

    let timeStr = "--:--";

    if (deviceSnapshot?.lastUpdated) {
      const date = new Date(deviceSnapshot.lastUpdated);
      const datePart = date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
      });
      const timePart = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      timeStr = `${datePart}, ${timePart}`;
    }

    return {
      address: resolvedAddress || (deviceSnapshot ? "..." : "---"),
      updated: timeStr,
    };
  }, [
    locationSharingEnabled,
    disabledAddressValue,
    resolvedAddress,
    deviceSnapshot,
  ]);

  return (
    <View style={styles.detailsCard}>
      <AppText weight="bold" style={styles.sectionTitle}>
        {detailsTitle}
      </AppText>

      <View style={styles.infoGrid}>
        <InfoItem
          iconName="map-marker-radius-outline"
          iconColor="#4C7CF0"
          label={addressLabel}
          value={displayData.address}
        />

        <InfoItem
          iconName="clock-time-four-outline"
          iconColor="#4C7CF0"
          label={updatedLabel}
          value={displayData.updated}
        />

        <InfoItem
          iconName="account-circle-outline"
          iconColor="#4C7CF0"
          label={selectedChildLabel}
          value={selectedChildName}
        />
      </View>
    </View>
  );
}