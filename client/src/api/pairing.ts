import { api } from "./request";

const URL = "/api/v1/pairing";

export async function apiGenerateCode(
  params?: { childId?: string | null }
): Promise<{ code: string; barcodeToken: string; expiresAt: string }> {
  return api.post<{ code: string; barcodeToken: string; expiresAt: string }>(
    `${URL}/generate-code`,
    params?.childId != null ? { childId: params.childId } : undefined,
    { requireAuth: true, role: "PARENT" }
  );
}

export async function apiLinkDevice(
  params: { code?: string; barcodeToken?: string }
): Promise<{ token: string; parentId: string; childId: string }> {
  return api.post<{ token: string; parentId: string; childId: string }>(
    `${URL}/link-device`,
    params,
    { requireAuth: true }
  );
}

