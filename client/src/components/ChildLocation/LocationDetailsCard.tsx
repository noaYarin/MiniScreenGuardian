import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import moment from "moment-timezone";

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
        // OpenStreetMap API
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${deviceSnapshot.latitude}&lon=${deviceSnapshot.longitude}&accept-language=en`;    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Screenguardian'
      }
    });
    
    const data = await response.json();

        if (data && data.address) {
          const street = data.address.road || data.address.pedestrian || "";
          const houseNum = data.address.house_number ? ` ${data.address.house_number}` : "";
          const city = data.address.city || data.address.town || data.address.village || "";
          
          const cleanAddress = `${street}${houseNum}${street && city ? ", " : ""}${city}`.trim();
          setResolvedAddress(cleanAddress || data.display_name);
        } else {
          setResolvedAddress("No address found");
        } 
      } catch {
        setResolvedAddress(`No address found`);
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
      const tz = "Asia/Jerusalem";
      const m = moment(deviceSnapshot.lastUpdated as any).tz(tz);
      timeStr = m.isValid() ? m.format("MM/DD, HH:mm") : "--:--";
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