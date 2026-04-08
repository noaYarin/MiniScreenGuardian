import { api } from "./request";
import type { Child } from "@/src/redux/slices/children-slice";

export async function fetchCurrentChildProfile(): Promise<{ child: Child }> {
  return api.get<{ child: Child }>("/api/v1/child/profile", {
    requireAuth: true,
    role: "CHILD",
  });
}

// Update current child profile by id
export async function updateCurrentChildProfile(childId: string, birthDate: string, gender: string): Promise<{
  child: Child;
}> {
  return api.put<{ child: Child }>(`/api/v1/child/${childId}/profile`, { birthDate, gender }, {
    requireAuth: true,
    role: "PARENT",
  });
}

export async function updateChildProfileImage(
  childId: string,
  img: string
): Promise<{ child: Child }> {
  return api.put<{ child: Child }>(
    `/api/v1/child/${childId}/profile-image`,
    { img },
    { requireAuth: true, role: "PARENT" }
  );
}