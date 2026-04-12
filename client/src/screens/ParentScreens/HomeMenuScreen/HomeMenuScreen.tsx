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

function getMenuLabel(item: HomeMenuItem) {
  switch (item.key) {
    case "location":
      return "Location";
    case "history":
      return "Activity History";
    default:
      return "Menu Item";
  }
}

function getMenuAccessibilityLabel(item: HomeMenuItem) {
  switch (item.key) {
    case "location":
      return "Open location";
    case "history":
      return "Open activity history";
    default:
      return "Open menu item";
  }
}

export default function HomeMenuScreen() {
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
                accessibilityLabel={getMenuAccessibilityLabel(item)}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed ? styles.menuItemPressed : null,
                  index < MENU_ITEMS.length - 1 ? styles.menuItemBorder : null,
                ]}
              >
                <View style={styles.menuItemRow}>
                  <View style={styles.menuMainSide}>
                    <View style={styles.menuIconWrap}>
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={24}
                        color="#4A90E2"
                      />
                    </View>

                    <View style={styles.menuTextWrap}>
                      <AppText weight="bold" style={styles.menuText}>
                        {getMenuLabel(item)}
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