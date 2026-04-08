import { CSHARP_API_BASE_URL } from "../config/env";

export type ScreenTimeRecommendation = {
  id: number;
  minAge: number;
  maxAge: number;
  recommendedMinutes: number;
  message: string;
};

export async function getPreLoginRecommendation(age: number) {
  const res = await fetch(
    `${CSHARP_API_BASE_URL}/api/preloginrecommendation/recommendation?age=${age}`
  );

  if (!res.ok) throw new Error("Failed");

  return res.json();
}