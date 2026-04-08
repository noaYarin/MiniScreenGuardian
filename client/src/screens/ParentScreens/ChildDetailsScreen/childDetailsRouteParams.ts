/**
 * Normalizes expo-router search params that may be string | string[] | undefined.
 */
export function parseRouteParam(
  value: string | string[] | undefined
): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === "string" && raw.trim().length > 0 ? raw.trim() : "";
}
