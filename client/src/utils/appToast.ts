import Toast from "react-native-root-toast";
import { ALERT_COLORS } from "@/src/screens/ParentScreens/SystemAlertsScreen/styles"; 

export type AppToastType = "success" | "info" | "warning" | "error";

function getToastStyle(type: AppToastType) {
  switch (type) {
    case "success":
      return {
        backgroundColor: ALERT_COLORS.success.soft,
        textColor: ALERT_COLORS.success.accent,
      };
    case "warning":
      return {
        backgroundColor: ALERT_COLORS.warning.soft,
        textColor: ALERT_COLORS.warning.accent,
      };
    case "error":
      return {
        backgroundColor: ALERT_COLORS.critical.soft,
        textColor: ALERT_COLORS.critical.accent,
      };
    case "info":
    default:
      return {
        backgroundColor: ALERT_COLORS.info.soft,
        textColor: ALERT_COLORS.info.accent,
      };
  }
}

export function showAppToast(
  message: string,
  title?: string,
  type: AppToastType = "info"
) {
  const { backgroundColor, textColor } = getToastStyle(type);
  const text = title ? `${title.toUpperCase()}\n${message}` : message;

  Toast.show(text, {
    duration: type === "error" ? Toast.durations.LONG : Toast.durations.SHORT,
    position: Toast.positions.TOP,
    animation: true,
    shadow: true,
    opacity: 0.98,
    hideOnPress: true,
    delay: 0,
    containerStyle: {
      backgroundColor,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 10,
      marginHorizontal: 16,
      marginTop: 10,
    },
    textStyle: {
      color: textColor,
    },
  });
}

export function showSuccessToast(message: string, title?: string) {
  showAppToast(message, title, "success");
}

export function showInfoToast(message: string, title?: string) {
  showAppToast(message, title, "info");
}

export function showWarningToast(message: string, title?: string) {
  showAppToast(message, title, "warning");
}

export function showErrorToast(message: string, title?: string) {
  showAppToast(message, title, "error");
}