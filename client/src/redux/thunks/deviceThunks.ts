import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiDeleteDeviceByChild,
  apiGetDevicesByChild,
  apiUpdateDeviceLocation,
  apiUpdateDeviceName,
  type Device,
  apiUpdateDeviceScreenTime,
  apiLockDevice,
  apiUnlockDevice,
} from "../../api/device";

function normalizeLocationLastUpdated(value: unknown): string {
  if (typeof value === "string" && value.trim()) return value.trim();

  if (value instanceof Date && Number.isFinite(value.getTime())) {
    return value.toISOString();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value).toISOString();
  }

  return new Date().toISOString();
}

function normalizeDevice(raw: unknown): Device {
  if (raw == null || typeof raw !== "object") {
    throw new Error("devices.fetch_device_failed");
  }
  const rawDevice = raw as Record<string, unknown>;
  const id = rawDevice._id ?? rawDevice.id;
  if (id == null) {
    throw new Error("devices.fetch_device_failed");
  }
  const rawLocation = rawDevice.location as
    | { lat?: unknown; lng?: unknown; lastUpdated?: unknown }
    | undefined;
  const lastUpdated = normalizeLocationLastUpdated(rawLocation?.lastUpdated);

  const location = {
    lat: typeof rawLocation?.lat === "number" ? rawLocation.lat : 0,
    lng: typeof rawLocation?.lng === "number" ? rawLocation.lng : 0,
    lastUpdated,
  };

  const screenTime = rawDevice.screenTime;
  return {
    _id: String(id),
    name: rawDevice.name != null ? String(rawDevice.name) : "",
    type: rawDevice.type != null ? String(rawDevice.type) : "",
    platform: rawDevice.platform != null ? String(rawDevice.platform) : "",
    isLocked: Boolean(rawDevice.isLocked),
    isActive: Boolean(rawDevice.isActive),
    location,
    parentId:
      rawDevice.parentId != null ? String(rawDevice.parentId) : "",
    childId: rawDevice.childId != null ? String(rawDevice.childId) : "",
    applications: Array.isArray(rawDevice.applications)
      ? (rawDevice.applications as Device["applications"])
      : [],
    screenTime:
      screenTime != null && typeof screenTime === "object"
        ? (screenTime as Device["screenTime"])
        : {}
  };
}

export const fetchDevicesByChild = createAsyncThunk<
  Device[], // What returned
  string, // Payload - the childId
  { rejectValue: string } // Reject value when the API returns an error
>("devices/fetchByChild", async (childId, thunkAPI) => {
  try {
    const list = await apiGetDevicesByChild(childId);
    if (!Array.isArray(list)) {
      return thunkAPI.rejectWithValue("devices.fetch_device_failed");
    }
    return list.map(normalizeDevice);
  } catch (error) {
    const message =
      (error as Error)?.message ?? "devices.fetch_device_failed";
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteDeviceForChild = createAsyncThunk<
  void,
  { childId: string; deviceId: string },
  { rejectValue: string }
>("devices/deleteForChild", async ({ childId, deviceId }, thunkAPI) => {
  try {
    await apiDeleteDeviceByChild(childId, deviceId);
  } catch (error) {
    const message =
      (error as Error)?.message ?? "devices.delete_device_failed";
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateDeviceName = createAsyncThunk<
  Device,
  { childId: string; deviceId: string; name: string },
  { rejectValue: string }
>("devices/updateName", async ({ childId, deviceId, name }, thunkAPI) => {
  try { 
    const response = await apiUpdateDeviceName(childId, deviceId, name);
    if (response == null) {
      return thunkAPI.rejectWithValue("devices.update_device_name_failed");
    }
    return normalizeDevice(response);
  } catch (error) {
    const message =
      (error as Error)?.message ?? "devices.update_device_name_failed";
    return thunkAPI.rejectWithValue(message);
  }
});


export const updateDeviceScreenTimeThunk = createAsyncThunk<
  { childId: string; device: Device },
  {
    childId: string;
    deviceId: string;
    isLimitEnabled?: boolean;
    dailyLimitMinutes?: number;
    weeklyLimitMinutes?: number;
  },
  { rejectValue: string }
>(
  "devices/updateScreenTime",
  async (
    { childId, deviceId, isLimitEnabled, dailyLimitMinutes, weeklyLimitMinutes },
    thunkAPI
  ) => {
    try {
      const response = await apiUpdateDeviceScreenTime(deviceId, {
        isLimitEnabled,
        dailyLimitMinutes,
        weeklyLimitMinutes,
      });

      if (response == null) {
        return thunkAPI.rejectWithValue("devices.update_screen_time_failed");
      }

      return {
        childId,
        device: normalizeDevice(response),
      };
    } catch (error) {
      const message =
        (error as Error)?.message ?? "devices.update_screen_time_failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const setDeviceLockThunk = createAsyncThunk<
  { childId: string; device: Device },
  { deviceId: string; childId: string; isLocked: boolean },
  { rejectValue: string }
>("devices/setLock", async ({ deviceId, childId, isLocked }, thunkAPI) => {
  try {
    const response = isLocked
      ? await apiLockDevice(deviceId)
      : await apiUnlockDevice(deviceId);

    if (!response) {
      return thunkAPI.rejectWithValue("devices.lock_device_failed");
    }

    return {
      childId,
      device: normalizeDevice(response),
    };
  } catch (error) {
    const message =
      (error as Error)?.message ?? "devices.lock_device_failed";
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateDeviceLocation = createAsyncThunk(
  "devices/updateLocation",
  async (
    { childId, deviceId, location }: { childId: string; deviceId: string; location: { lat: number; lng: number } },
    thunkAPI
  ) => {
    try {
      const response = await apiUpdateDeviceLocation(deviceId, location);
      return response;
    } catch (error) {
      const message = (error as Error)?.message ?? "devices.update_device_location_failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);
