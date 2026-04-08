import { api } from "./request";

type Child = {
  _id: string;
  name: string;
  img?: string;
  birthDate: string;
  gender?: string;
  interests?: string[];
  coins: number;
  isActive: boolean;
  role: string;
  achievementIds?: string[];
  avatar?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

export type HomeSummaryChild = {
  childId: string;
  name: string;
  img?: string;
  deviceId: string | null;
  deviceName: string | null;
  usedTodayMinutes: number | null;
  dailyLimitMinutes: number | null;
  remainingMinutes: number | null;
  status: "good" | "warn" | "bad";
  isLocked: boolean;
};

const URL = "/api/v1/parent";

export async function addChild(body: {
  name: string;
  birthDate: string;
  gender?: string;
}): Promise<{ child: Child }> {
  return api.post<{ child: Child }>("/api/v1/parent/children", body, { requireAuth: true, role: "PARENT" });
}

export async function getMyChildren(options?: {
  includeInactive?: boolean;
}): Promise<{ children: Child[] }> {
  const query =
    options?.includeInactive === true ? "?includeInactive=true" : "";
  return api.get<{ children: Child[] }>(`${URL}/children${query}`, { requireAuth: true, role: "PARENT" });
}

export async function getChildById(
  childId: string
): Promise<{ child: Child }> {
  return api.get<{ child: Child }>(
    `${URL}/get/child/${encodeURIComponent(childId)}`,
    { requireAuth: true, role: "PARENT" }
  );
}



export async function setChildActive(
  childId: string,
  isActive: boolean
): Promise<{ [key: string]: unknown }> {
  return api.patch<{ [key: string]: unknown }>(
    `${URL}/children/${encodeURIComponent(childId)}/active`,
    { isActive },
    { requireAuth: true, role: "PARENT" }
  );
}


export async function getHomeSummary(): Promise<{
  children: HomeSummaryChild[];
}> {
  return api.get<{ children: HomeSummaryChild[] }>(
    `${URL}/home-summary`,
    { requireAuth: true, role: "PARENT" }
  );
}
export async function deleteChild(
  childId: string
): Promise<{ deletedChildId: string }> {
  return api.delete<{ deletedChildId: string }>(
    `${URL}/children/${encodeURIComponent(childId)}`,
    { requireAuth: true, role: "PARENT" }
  );
}
