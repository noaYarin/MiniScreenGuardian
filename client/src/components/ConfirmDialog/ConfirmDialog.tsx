import React from "react";
import { Modal, View, Pressable } from "react-native";
import AppText from "@/src/components/AppText/AppText";
import { styles } from "./styles";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  destructive?: boolean;
};

export default function ConfirmDialog({
  visible,
  title,
  message,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  destructive,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <AppText weight="extraBold" style={styles.title}>
            {title}
          </AppText>
          <AppText weight="medium" style={styles.message}>
            {message}
          </AppText>
          <View style={styles.row}>
            <Pressable
              accessibilityRole="button"
              onPress={onCancel}
              style={({ pressed }) => [styles.btn, styles.btnSecondary, styles.btnFirst, pressed && styles.pressed]}
            >
              <AppText weight="bold" style={styles.btnSecondaryText}>
                {cancelLabel}
              </AppText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.btn,
                destructive ? styles.btnDanger : styles.btnPrimary,
                pressed && styles.pressed,
              ]}
            >
              <AppText weight="bold" style={styles.btnPrimaryText}>
                {confirmLabel}
              </AppText>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
