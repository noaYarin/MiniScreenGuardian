import type { Device } from "@/src/api/device";

export type ChildDetailsDeviceRow = {
  id: string;
  name: string;
  typeLabel: string;
  platformLabel: string;
  active: boolean;
  locationText: string;
  isLocked: boolean;
  isLimitEnabled: boolean;
  dailyLimitMinutes: number | null;
  remainingMinutes: number | null;
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


 const isLimitEnabled = d.screenTime?.isLimitEnabled === true;
    const dailyLimitMinutes = isLimitEnabled
      ? Number(d.screenTime?.dailyLimitMinutes ?? 0)
      : null;
    const extraMinutesToday = Number(d.screenTime?.extraMinutesToday ?? 0);
    const usedTodayMinutes = Number(d.screenTime?.usedTodayMinutes ?? 0);

    const remainingMinutes =
      isLimitEnabled && dailyLimitMinutes !== null
        ? Math.max(dailyLimitMinutes + extraMinutesToday - usedTodayMinutes, 0)
        : null;

    return {
      id: String(d._id),
      name,
      typeLabel: translateDeviceType(d.type),
      platformLabel: translateDevicePlatform(d.platform),
      active: Boolean(d.isActive),
      locationText: loc,
      isLocked: Boolean(d.isLocked),
      isLimitEnabled,
      dailyLimitMinutes,
      remainingMinutes,
    };
  });
}