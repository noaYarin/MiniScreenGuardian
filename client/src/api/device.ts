import { api } from "./request";

const URL = "/api/v1/devices";

export type Device = {
  _id: string;
  name: string;
  type: string;
  platform: string;
  isLocked: boolean;
  isActive: boolean;
  location: {
    lat: number;
    lng: number;
    lastUpdated: string;
  };  parentId: string;
  childId: string;
  applications?: Array<{
    packageName: string;
    appName?: string;
    isBlocked?: boolean;
  }>;
  screenTime?: {
    isLimitEnabled?: boolean;
    dailyLimitMinutes?: number;
    extraMinutesToday?: number;
    weeklyLimitMinutes?: number;
    usedTodayMinutes?: number;
    usedWeekMinutes?: number;
    lastDailyResetAt?: string | null;
    lastWeeklyResetAt?: string | null;
    weeklySchedule?: unknown[];
  };
  createdAt?: string;
  updatedAt?: string;
};

export async function apiGetDevicesByChild(childId: string): Promise<Device[]> {
  const data = await api.get<Device[]>(
    `${URL}/child/${encodeURIComponent(childId)}`,
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
  return data;
}

export async function apiGetDeviceByChild(
  childId: string,
  deviceId: string
): Promise<Device> {
  const data = await api.get<Device>(
    `${URL}/child/${encodeURIComponent(childId)}/${encodeURIComponent(deviceId)}`,
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
  return data;
}

export async function apiDeleteDeviceByChild(
  childId: string,
  deviceId: string
): Promise<void> {
  await api.delete(
    `${URL}/child/${encodeURIComponent(childId)}/${encodeURIComponent(deviceId)}`,
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
}

export async function apiUpdateDeviceName(
  childId: string,
  deviceId: string,
  name: string
): Promise<Device> {
  const data = await api.patch<Device>(
    `${URL}/child/${encodeURIComponent(childId)}/${encodeURIComponent(deviceId)}/name`,
    { name },
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
  return data;
}


export async function apiUpdateDeviceScreenTime(
  deviceId: string,
  payload: {
    isLimitEnabled?: boolean;
    dailyLimitMinutes?: number;
    weeklyLimitMinutes?: number;
  }
): Promise<Device> {
  const data = await api.patch<Device>(
    `${URL}/${encodeURIComponent(deviceId)}/screen-time`,
    payload,
    {
      requireAuth: true,
      role: "PARENT",
          }
  );
  return data;
}

export async function apiUpdateDeviceLocation(
  deviceId: string,
  location: { lat: number; lng: number }
): Promise<Device> {
  const data = await api.patch<Device>(
    `${URL}/${encodeURIComponent(deviceId)}/location`,
    { location },
    {
      requireAuth: true,
      role: "CHILD", 
    }
  );
  return data;
}

export async function apiLockDevice(deviceId: string): Promise<Device> {
  const data = await api.patch<Device>(
    `${URL}/${encodeURIComponent(deviceId)}/lock`,
    {},
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
  return data;
}

export async function apiUnlockDevice(deviceId: string): Promise<Device> {
  const data = await api.patch<Device>(
    `${URL}/${encodeURIComponent(deviceId)}/unlock`,
    {},
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
  return data;
}
