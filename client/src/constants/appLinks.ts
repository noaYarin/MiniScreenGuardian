export function getAppInviteDownloadUrl(): string {
 return process.env.EXPO_PUBLIC_APP_INVITE_URL?.trim() ?? "";
}
