import Toast from "react-native-root-toast";

export function showAppToast(message: string, title?: string) {
  const text = title ? `${title}\n${message}` : message;
  Toast.show(text, {
    duration: Toast.durations.LONG,
    position: Toast.positions.TOP,
  });
}
