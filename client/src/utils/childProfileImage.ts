export function getChildProfileImageUri(img?: string | null): string | null {
  if (img == null || typeof img !== "string") return null;
  const trimmed = img.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("data:image/")) return trimmed;
  return null;
}
