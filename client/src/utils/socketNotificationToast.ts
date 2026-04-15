import {
  showSuccessToast,
  showInfoToast,
  showWarningToast,
  showErrorToast,
} from "@/src/utils/appToast";

type SocketToastType = "success" | "info" | "warning" | "error";

function mapSeverityToToastType(severity?: string): SocketToastType {
  const s = String(severity ?? "").toUpperCase();

  switch (s) {
    case "SUCCESS":
      return "success";
    case "WARNING":
      return "warning";
    case "CRITICAL":
    case "ERROR":
      return "error";
    case "INFO":
    default:
      return "info";
  }
}

export function getToastTypeFromNotification(data: any): SocketToastType {
  return mapSeverityToToastType(data?.severity);
}

export function showToastFromSocketNotification(data: any) {
  const title = data?.title ? String(data.title) : "New notification";
  const description = data?.description ? String(data.description) : "";
  const message = description || title;
  const toastTitle = description ? title : undefined;

  switch (getToastTypeFromNotification(data)) {
    case "success":
      showSuccessToast(message, toastTitle);
      break;
    case "warning":
      showWarningToast(message, toastTitle);
      break;
    case "error":
      showErrorToast(message, toastTitle);
      break;
    default:
      showInfoToast(message, toastTitle);
      break;
  }
}