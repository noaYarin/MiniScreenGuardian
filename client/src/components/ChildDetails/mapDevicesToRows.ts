import type { TFunction } from "i18next";
import type { Device } from "@/src/api/device";

export type ChildDetailsDeviceRow = {
  id: string;
  name: string;
  typeLabel: string;
  platformLabel: string;
  active: boolean;
  locationText: string;
  isLocked: boolean;
};

function translateDeviceType(t: TFunction, raw: string | undefined): string {
  const key = (raw ?? "").toUpperCase();
  if (key === "PHONE") return t("childDetails.device_type.phone");
  if (key === "TABLET") return t("childDetails.device_type.tablet");
  return t("childDetails.device_type.other");
}

function translateDevicePlatform(t: TFunction, raw: string | undefined): string {
  const key = (raw ?? "").toUpperCase();
  if (key === "ANDROID") return t("childDetails.device_platform.android");
  if (key === "IOS") return t("childDetails.device_platform.ios");
  return t("childDetails.device_platform.other");
}

export function mapDevicesToRows(
  devices: Device[],
  t: TFunction
): ChildDetailsDeviceRow[] {
  return devices.map((d) => {
    const name = d.name?.trim() ? d.name : "—";
    const lat = typeof d.location?.lat === "number" ? d.location.lat : 0;
    const lng = typeof d.location?.lng === "number" ? d.location.lng : 0;
    const loc =
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      (lat !== 0 || lng !== 0)
        ? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
        : t("childDetails.location_unknown");
    return {
      id: String(d._id),
      name,
      typeLabel: translateDeviceType(t, d.type),
      platformLabel: translateDevicePlatform(t, d.platform),
      active: Boolean(d.isActive),
      locationText: loc,
      isLocked: Boolean(d.isLocked),
    };
  });
}
