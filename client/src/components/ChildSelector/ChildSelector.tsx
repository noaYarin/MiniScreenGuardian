import React, { useMemo } from "react";
import {
  View,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useSelector } from "react-redux";

import { getChildProfileImageUri } from "@/src/utils/childProfileImage";
import { CHILD_ACCENT_COLORS } from "../../../../client/constants/childAccentColors";

import AppText from "../AppText/AppText";
import { styles } from "./styles";

import type { RootState } from "@/src/redux/store/types";

// Accent color generator
function accentColorForChildId(childId: string): string {
  const sum = [...childId].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return CHILD_ACCENT_COLORS[sum % CHILD_ACCENT_COLORS.length];
}

export type ChildSelectorOption = {
  id: string;
  name: string;
  initial: string;
  accent: string;
  subtitleKey?: string;
};

type Props = {
  selectedChildId: string;
  onSelectChild: (childId: string) => void;
  childSectionTitleKey?: string;
};

export default function ChildSelector({
  selectedChildId,
  onSelectChild,
}: Props) {
  const { width } = useWindowDimensions();

  const childrenOptions = useSelector(
    (state: RootState) => state.children.childrenList ?? []
  );

  const cardWidth = useMemo(() => {
    if (width < 380) return 110;
    if (width < 450) return 120;
    return 132;
  }, [width]);

  if (!childrenOptions.length) return null;

  const shouldCenter = childrenOptions.length <= 2;

  return (
    <View style={styles.wrapper}>
      <View style={styles.section}>
        <AppText weight="bold" style={styles.sectionTitle}>
          Select Child
        </AppText>

        <View style={styles.childrenViewport}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.childrenRow,
              shouldCenter && styles.childrenRowCentered,
            ]}
          >
            {childrenOptions.map((child) => {
              const childId = String(child._id);
              const accentColor = accentColorForChildId(childId);
              const childName = String(child.name ?? "");
              const childInitial =
                childName.trim().length > 0
                  ? (Array.from(childName.trim())[0] ?? "")
                  : "";

              const avatarUri = getChildProfileImageUri(child.img);
              const isSelected = childId === selectedChildId;

              return (
                <Pressable
                  key={childId}
                  onPress={() => onSelectChild(childId)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select child ${childName}`}
                  style={({ pressed }) => [
                    styles.childCard,
                    { width: cardWidth },
                    isSelected && [
                      styles.childCardSelected,
                      {
                        borderColor: accentColor,
                        shadowColor: accentColor,
                      },
                    ],
                    pressed ? styles.pressed : null,
                  ]}
                >
                  <View
                    style={[
                      styles.childAvatarWrap,
                      isSelected && styles.childAvatarWrapSelected,
                    ]}
                  >
                    <View
                      style={[
                        styles.childAvatarCircle,
                        !avatarUri && { backgroundColor: accentColor },
                      ]}
                    >
                      {avatarUri ? (
                        <Image
                          source={{ uri: avatarUri }}
                          style={styles.childAvatarImage}
                          contentFit="cover"
                          transition={120}
                          accessibilityLabel={childName}
                        />
                      ) : (
                        <AppText
                          weight="extraBold"
                          style={styles.childAvatarText}
                        >
                          {childInitial || "?"}
                        </AppText>
                      )}
                    </View>
                  </View>

                  <AppText
                    weight="bold"
                    style={styles.childName}
                    numberOfLines={1}
                  >
                    {childName}
                  </AppText>

                  {isSelected && (
                    <View
                      style={[
                        styles.selectedBadge,
                        { backgroundColor: accentColor },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="check"
                        size={14}
                        color="#FFF"
                      />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}