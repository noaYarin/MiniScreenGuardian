import React, { useEffect, useMemo, useRef } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSelector } from "react-redux";
import moment from "moment-timezone";

import AppText from "../AppText/AppText";
import { styles } from "../../screens/ParentScreens/ChildLocationScreen/styles";
import type { ChildOption, DeviceLocationSnapshot } from "./types";
import type { RootState } from "@/src/redux/store/types";

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

type Props = {
  selectedChild: ChildOption;
  onDeviceLocation: (snapshot: DeviceLocationSnapshot | null) => void;
  locationSharingEnabled?: boolean;
  mapDisabledBannerText?: string;
};

export default function LocationMapCard({
  selectedChild,
  onDeviceLocation,
  locationSharingEnabled = true,
  mapDisabledBannerText = "",
}: Props) {
  const mapRef = useRef<MapView | null>(null);

  const deviceInRedux = useSelector(
    (state: RootState) => state.devices.byChildId[selectedChild.id]?.[0] || null
  );

  const coords = useMemo(() => {
    const loc = deviceInRedux?.location;

    if (
      loc &&
      typeof loc.lat === "number" &&
      typeof loc.lng === "number"
    ) {
      return {
        latitude: loc.lat,
        longitude: loc.lng,
      };
    }

    return null;
  }, [deviceInRedux]);

  useEffect(() => {
    if (coords && locationSharingEnabled) {
      onDeviceLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        lastUpdated:
          deviceInRedux?.location?.lastUpdated ||
          moment().tz("Asia/Jerusalem").format(),
      });

      mapRef.current?.animateToRegion(
        {
          ...coords,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        1000
      );
    } else {
      onDeviceLocation(null);
    }
  }, [
    coords,
    coords?.latitude,
    coords?.longitude,
    locationSharingEnabled,
    onDeviceLocation,
    deviceInRedux,
  ]);

  return (
    <View style={styles.mapCard}>
      {!locationSharingEnabled && mapDisabledBannerText ? (
        <View style={{ paddingBottom: 8 }}>
          <AppText weight="medium" style={styles.infoHint}>
            {mapDisabledBannerText}
          </AppText>
        </View>
      ) : null}

      <View style={styles.mapArea}>
        {locationSharingEnabled && coords ? (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              ...coords,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
          >
            <Marker
              coordinate={coords}
              title={selectedChild.name}
              pinColor={selectedChild.accent}
            />
          </MapView>
        ) : (
          <View
            style={[
              styles.mapBase,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <AppText>
              {locationSharingEnabled
                ? "Waiting for child's location..."
                : "Location sharing disabled"}
            </AppText>
          </View>
        )}
      </View>
    </View>
  );
}