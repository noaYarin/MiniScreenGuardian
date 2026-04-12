import React from "react";
import { Pressable, ScrollView, StyleProp, ViewStyle } from "react-native";

import AppText from "@/src/components/AppText/AppText";
import type { Child } from "@/src/redux/slices/children-slice";
import { childDetailsStyles as styles } from "./childDetails.styles";

type Props = {
  childrenList: Child[];
  selectedChildId: string;
  onSelectChildId: (id: string) => void;
  row: StyleProp<ViewStyle>;
};

export function ChildrenStrip({
  childrenList,
  selectedChildId,
  onSelectChildId,
  row,
}: Props) {
  if (childrenList.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.childrenStrip}
      contentContainerStyle={[styles.childrenStripContent, row]}
    >
      {childrenList.map((c) => {
        const id = String(c._id);
        const selected = String(selectedChildId) === id;

        return (
          <Pressable
            key={id}
            onPress={() => onSelectChildId(id)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`Show details for ${c.name}`}
            style={({ pressed }) => [
              styles.childChip,
              selected && styles.childChipSelected,
              pressed && styles.childChipPressed,
            ]}
          >
            <AppText
              weight={selected ? "extraBold" : "bold"}
              style={[
                styles.childChipText,
                selected && styles.childChipTextSelected,
              ]}
              numberOfLines={1}
            >
              {c.name}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}