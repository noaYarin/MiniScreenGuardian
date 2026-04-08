import { api } from "./request";

const URL = "/api/v1/requests";

export type ParentExtensionRequest = {
  _id: string;
  parentId: string;
  childId: string;
  deviceId: string;
  requestedMinutes: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt?: string;
  updatedAt?: string;
};


export type CreateChildExtensionRequestBody = {
  deviceId: string;
  requestedMinutes: number;
  reason: string;
};

export async function apiCreateRequest(
  body: CreateChildExtensionRequestBody
) {
  return api.post<ParentExtensionRequest>(
    `${URL}/child`,
    body,
    {
      requireAuth: true,
      role: "CHILD",
    }
  );
}


export async function apiGetMyRequests() {
  return api.get<ParentExtensionRequest[]>(
    `${URL}/child`,
    {
      requireAuth: true,
      role: "CHILD",
    }
  );
}

export async function apiGetPendingRequests(childId?: string) {
  const query = childId ? `?childId=${encodeURIComponent(childId)}` : "";

  return api.get<ParentExtensionRequest[]>(
    `${URL}/parent/pending${query}`,
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
}

export async function apiDecideRequest(
  requestId: string,
  decision: "APPROVED" | "REJECTED"
) {
  return api.patch<ParentExtensionRequest>(
    `${URL}/parent/${encodeURIComponent(requestId)}/decision`,
    { decision },
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
}