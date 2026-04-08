import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Stack, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

type LimitItem = {
  key: string;
  labelKey: string;
  descriptionKey?: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  route?: string;
};

type LimitSection = {
  key: string;
  titleKey: string;
  items: LimitItem[];
};

const LIMIT_SECTIONS: LimitSection[] = [
  {
    key: "screenTime",
    titleKey: "limits.screenTime.title",
    items: [
      {
        key: "dailyWeekly",
        labelKey: "limits.screenTime.dailyWeekly",
        descriptionKey: "limits.screenTime.dailyWeeklyDescription",
        icon: "clock-time-four-outline",
        route: "/Parent/dailyTimeLimits",
      },
      {
        key: "breaks",
        labelKey: "limits.screenTime.breaks",
        descriptionKey: "limits.screenTime.breaksDescription",
        icon: "timer-sand",
        route: "/Parent/routineLimits",
      },
    ],
  },
  {
    key: "apps",
    titleKey: "limits.apps.title",
    items: [
      {
        key: "blockedApps",
        labelKey: "limits.apps.blockedApps",
        descriptionKey: "limits.apps.blockedAppsDescription",
        icon: "cellphone-lock",
      },
    ],
  },
];

export default function LimitsScreen() {
  const { t } = useTranslation();
  const { isRTL, text, row } = useLocaleLayout();

  const onPressItem = (route?: string) => {
    if (!route) return;
    router.push(route as never);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t("limits.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />

      <ScreenLayout>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.introCard}>
              <AppText weight="extraBold" style={[styles.introTitle, text]}>
                {t("limits.heading")}
              </AppText>

              <AppText weight="medium" style={[styles.introSubtitle, text]}>
                {t("limits.subtitle")}
              </AppText>
            </View>

            {LIMIT_SECTIONS.map((section) => (
              <View key={section.key} style={styles.sectionBlock}>
                <AppText weight="bold" style={[styles.sectionTitle, text]}>
                  {t(section.titleKey)}
                </AppText>

                <View style={styles.groupCard}>
                  {section.items.map((item, index) => {
                    const isLast = index === section.items.length - 1;
                    const isPressable = Boolean(item.route);

                    return (
                      <Pressable
                        key={item.key}
                        onPress={() => onPressItem(item.route)}
                        disabled={!isPressable}
                        accessibilityRole="button"
                        accessibilityLabel={t(`${item.labelKey}A11y`)}
                        style={({ pressed }) => [
                          styles.rowButton,
                          !isLast && styles.rowDivider,
                          pressed && isPressable ? styles.rowPressed : null,
                        ]}
                      >
                        <View style={[styles.rowContent, row]}>
                          <View style={[styles.rowMain, row]}>
                            <View style={styles.iconWrap}>
                              <MaterialCommunityIcons
                                name={item.icon}
                                size={20}
                                color="#3B82F6"
                              />
                            </View>

                            <View style={styles.textWrap}>
                              <AppText
                                weight="bold"
                                style={[
                                  styles.rowTitle,
                                  text,
                                  !isPressable && styles.rowTitleDisabled,
                                ]}
                              >
                                {t(item.labelKey)}
                              </AppText>

                              {item.descriptionKey ? (
                                <AppText
                                  weight="medium"
                                  style={[
                                    styles.rowDescription,
                                    text,
                                    !isPressable && styles.rowDescriptionDisabled,
                                  ]}
                                >
                                  {t(item.descriptionKey)}
                                </AppText>
                              ) : null}
                            </View>
                          </View>

                          <View style={styles.rowEnd}>
                            {isPressable ? (
                              <MaterialCommunityIcons
                                name={isRTL ? "chevron-left" : "chevron-right"}
                                size={22}
                                color="#94A3B8"
                              />
                            ) : (
                              <AppText weight="medium" style={styles.soonText}>
                                {t("common.soon")}
                              </AppText>
                            )}
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </ScreenLayout>
    </>
  );
}