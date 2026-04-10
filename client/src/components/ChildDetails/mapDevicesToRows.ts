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

function translateDeviceType(raw: string | undefined): string {
  const key = (raw ?? "").toUpperCase();
  if (key === "PHONE") return "Phone";
  if (key === "TABLET") return "Tablet";
  return "Other";
}

function translateDevicePlatform(raw: string | undefined): string {
  const key = (raw ?? "").toUpperCase();
  if (key === "ANDROID") return "Android";
  if (key === "IOS") return "IOS";
  return "Other";
}

export function mapDevicesToRows(devices: Device[]): ChildDetailsDeviceRow[] {
  return devices.map((d) => {
    const name = d.name?.trim() ? d.name : "—";
    const lat = typeof d.location?.lat === "number" ? d.location.lat : 0;
    const lng = typeof d.location?.lng === "number" ? d.location.lng : 0;

    const loc =
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      (lat !== 0 || lng !== 0)
        ? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
        : "Unknown";

    return {
      id: String(d._id),
      name,
      typeLabel: translateDeviceType(d.type),
      platformLabel: translateDevicePlatform(d.platform),
      active: Boolean(d.isActive),
      locationText: loc,
      isLocked: Boolean(d.isLocked),
    };
  });
}