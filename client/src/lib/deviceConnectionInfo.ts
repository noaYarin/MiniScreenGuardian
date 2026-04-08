import { Platform } from "react-native";
import * as Application from 'expo-application';
import * as Device from 'expo-device';

export type DevicePlatformValue = "ANDROID" | "IOS" | "OTHER";
export type DeviceTypeValue = "PHONE" | "TABLET" | "OTHER";

export function detectConnectionPlatform(): DevicePlatformValue {
  if (Platform.OS === "android") return "ANDROID";
  if (Platform.OS === "ios") return "IOS";
  return "OTHER";
}

export function detectConnectionDeviceType(): DeviceTypeValue {
  const type = Device.deviceType;

  if (type === Device.DeviceType.TABLET) return "TABLET";
  if (type === Device.DeviceType.PHONE) return "PHONE";
  
  return "OTHER";
}


const getDeviceId = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'android') {
      return Application.getAndroidId(); 
    } else {
      return await Application.getIosIdForVendorAsync();
    }
  } catch (error) {
    console.error("Failed to get device ID:", error);
    return null;
  }
};

export async function buildDeviceConnectionPayload() {

  const deviceId = await getDeviceId();
  if (!deviceId) {
    throw new Error("Failed to get device ID");
  }

  return {
    deviceName: "Child Device",
    deviceType: detectConnectionDeviceType(),
    platform: detectConnectionPlatform(),
    deviceId,
  };
}

