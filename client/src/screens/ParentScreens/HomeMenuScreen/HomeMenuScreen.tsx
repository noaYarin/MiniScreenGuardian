import React from "react";
import {
  View,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { MENU_ITEMS, type HomeMenuItem } from "@/data/homeMenuItems";
import { styles } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

export default function HomeMenuScreen() {
  const { t } = useTranslation();
  const { text, isRTL } = useLocaleLayout();
  const { width } = useWindowDimensions();

  const maxContentWidth = width >= 900 ? 760 : width >= 600 ? 620 : undefined;

  const handleItemPress = (item: HomeMenuItem) => {
    if (item.route) {
      router.push(item.route);
    }
  };

  return (
    <ScreenLayout scrollable={false}>
      <ScrollView
        style={styles.scrollRoot}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.container,
            maxContentWidth ? { maxWidth: maxContentWidth } : null,
          ]}
        >
          <View style={styles.menuCard}>
            {MENU_ITEMS.map((item, index) => (
              <Pressable
                key={item.key}
                onPress={() => handleItemPress(item)}
                accessibilityRole="button"
                accessibilityLabel={t(`${item.labelKey}_a11y`, {
                  defaultValue: t(item.labelKey),
                })}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                  index < MENU_ITEMS.length - 1 && styles.menuItemBorder,
                ]}
              >
                <View
                  style={[
                    styles.menuItemRow,
                    isRTL ? styles.menuItemRowRtl : styles.menuItemRowLtr,
                  ]}
                >
                  <View
                    style={[
                      styles.menuMainSide,
                      isRTL ? styles.menuMainSideRtl : styles.menuMainSideLtr,
                    ]}
                  >
                    <View style={styles.menuIconWrap}>
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={24}
                        color="#4A90E2"
                      />
                    </View>

                    <View
                      style={[
                        styles.menuTextWrap,
                        isRTL ? styles.menuTextWrapRtl : styles.menuTextWrapLtr,
                      ]}
                    >
                      <AppText weight="bold" style={[styles.menuText, text]}>
                        {t(item.labelKey)}
                      </AppText>
                    </View>
                  </View>                 
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}