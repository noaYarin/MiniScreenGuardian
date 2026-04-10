import { useMemo } from "react";

import type { Child } from "../src/redux/slices/children-slice";

// Full years since birth from an ISO date
export function getAgeInFullYearsFromBirthDate(
  iso: string | undefined
): number | null {
  if (!iso || typeof iso !== "string") return null;

  const birth = new Date(iso);
  if (Number.isNaN(birth.getTime())) return null;

  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && now.getDate() < birth.getDate())
  ) {
    age -= 1;
  }

  return age;
}

export type ChildProfileLabels = {
  childName: string;
  birthDateLabel: string;
  genderLabel: string;
};

/**
 * Display labels for a child profile (name, birth date, gender) — reusable across parent screens.
 */
export function useChildProfileLabels(
  child: Child | null
): ChildProfileLabels {
  return useMemo(() => {
    const childName = child?.name ?? "";

    const birthDateLabel = child?.birthDate
      ? new Date(child.birthDate).toLocaleDateString("en-US")
      : "";

    const genderKey = String(child?.gender ?? "").toLowerCase();

    const genderLabel =
      genderKey === "boy"
        ? "Boy"
        : genderKey === "girl"
        ? "Girl"
        : genderKey === "other"
        ? "Other"
        : "";

    return { childName, birthDateLabel, genderLabel };
  }, [child]);
}