import { api } from "./request";
import { setParentToken, setChildToken } from "../services/authStorage";

const URL = "/api/v1/auth"; 
const PAIRING_URL = "/api/v1/pairing";

export async function apiRegisterParent(
  params: { email: string; password: string }
): Promise<{ token: string; parentId: string }> {
  const data = await api.post<{ token: string; parentId: string }>(
    `${URL}/register-parent`,
    params
  );
  if (data.token) {
    await setParentToken({ token: data.token, parentId: data.parentId });
  }
  return data;
}

export async function apiLoginParent(
  params: { email: string; password: string }
): Promise<{ token: string; parentId: string }> {
  const data = await api.post<{ token: string; parentId: string }>(
    `${URL}/login-parent`,
    params
  );
  if (data.token) {
    await setParentToken({ token: data.token, parentId: data.parentId });
  }
  return data;
}

export async function apiForgotPassword(
  email: string
): Promise<{ message: string }> {
  const data = await api.post<{ message: string }>(
    `${URL}/forgot-password`,
    { email },
  );
  return data;
}

export async function apiResetPassword(
  params: { email: string; otpCode: string; password: string }
): Promise<{ token: string; parentId: string }> {
  const data = await api.post<{ token: string; parentId: string }>(
    `${URL}/reset-password-confirm`,
    params,
  );

  if (data.token) {
    await setParentToken({ token: data.token, parentId: data.parentId });
  }

  return data;
}

// Pairing for children with code or barcode token

export async function apiGenerateCodeForPairingChild(
  params: { parentId: string; childId: string }
): Promise<{ code: string; barcodeToken: string; expiresAt: string }> {
  const data = await api.post<{ code: string; barcodeToken: string; expiresAt: string }>(
    `${PAIRING_URL}/generate-code`,
    params,
    { requireAuth: true, role: "PARENT" }
  );
  return data;
}


export async function apiLinkDevice(
  params: {
    code?: string;
    barcodeToken?: string;
    deviceId?: string;
    deviceName?: string;
    deviceType?: string;
    platform?: string;
  }
): Promise<{
  childToken: string;
  parentId: string;
  childId: string;
  deviceId: string;
  physicalId?: string;
  childName?: string;
}> {
    // Server returns `token` (child JWT). We normalize it to `childToken` in the client.
    const data = await api.post<{
      token: string;
      parentId: string;
      childId: string;
      deviceId: string;
      physicalId?: string;
      childName?: string;
    }>(
    `${PAIRING_URL}/link-device`,
    params
  );

  const childToken = data?.token;
  if (childToken) {
    await setChildToken({
      childToken,
      childId: data.childId,
      parentId: data.parentId,
      deviceId: data.deviceId,
      physicalId: data.physicalId,
    });
  }

  return {
    childToken,
    parentId: data.parentId,
    childId: data.childId,
    deviceId: data.deviceId,
    physicalId: data.physicalId,
    childName: data.childName,
  };
}

// Secure server-side logout: revokes the current parent's JWTs (and derived child JWTs).
export async function apiLogoutParent(): Promise<{ message?: string; ok?: boolean }> {
  const data = await api.post<{ message?: string; ok?: boolean }>(
    `${URL}/logout`,
    null,
    { requireAuth: true, role: "PARENT" }
  );
  return data;
}