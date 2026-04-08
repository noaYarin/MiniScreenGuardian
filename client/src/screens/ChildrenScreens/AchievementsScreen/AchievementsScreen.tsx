import React from "react";
import { View, Pressable, useWindowDimensions } from "react-native";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";
import { pickRTL } from "../../../locales/rtl";

type StatCard = {
  id: string;
  label: string;
  value: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  tone: "blue" | "pink";
};

type AchievementCard = {
  id: string;
  title: string;
  subtitle: string;
  progressText: string;
  rewardText: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  tone: "gold" | "light";
  completed?: boolean;
};

export default function AchievementsScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { isRTL, row, text } = useLocaleLayout();

  const isTabletLarge = width >= 900;
  const isTablet = width >= 650;

  const heroIconSize = isTabletLarge ? 84 : isTablet ? 74 : 66;
  const sidePadding = isTabletLarge ? 24 : 16;

  const gridGap = 14;
  const statColumns = isTabletLarge ? 4 : 2;
  const contentWidth = width - sidePadding * 2;
  const statCardWidth = Math.min(
    Math.floor((contentWidth - gridGap * (statColumns - 1)) / statColumns),
    220
  );

  const rowTop = {
    ...row,
    alignItems: "flex-start" as const,
  };

  const points = 1200;
  const completedGoals = 5;
  const totalGoals = 8;
  const streakDays = 7;
  const screenTimeSavedHours = 7;

  const stats: StatCard[] = [
    {
      id: "savedTime",
      label: t("achievements.saved_time"),
      value: `${screenTimeSavedHours} ${t("achievements.hours_short")}`,
      icon: "clock-outline",
      tone: "blue",
    },
    {
      id: "streak",
      label: t("achievements.streak_days"),
      value: `${streakDays}`,
      icon: "fire",
      tone: "pink",
    },
  ];

  const achievements: AchievementCard[] = [
    {
      id: "focusMaster",
      title: t("achievements.cards.focus_master.title"),
      subtitle: t("achievements.cards.focus_master.subtitle"),
      progressText: t("achievements.cards.focus_master.progress"),
      rewardText: t("achievements.cards.focus_master.reward"),
      icon: "target",
      tone: "gold",
      completed: true,
    },
    {
      id: "kingOfAchievements",
      title: t("achievements.cards.king_of_achievements.title"),
      subtitle: t("achievements.cards.king_of_achievements.subtitle"),
      progressText: t("achievements.cards.king_of_achievements.progress"),
      rewardText: t("achievements.cards.king_of_achievements.reward"),
      icon: "crown-outline",
      tone: "light",
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: t("achievements.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />

      <ScreenLayout>
        <View style={[styles.page, { paddingHorizontal: sidePadding }]}>
          <View style={styles.heroCard}>
            <View
              style={[
                styles.heroIconWrap,
                {
                  width: heroIconSize,
                  height: heroIconSize,
                  borderRadius: heroIconSize / 2,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="trophy-outline"
                size={heroIconSize * 0.5}
                color="#8A6500"
              />
            </View>

            <View style={styles.heroTextBlock}>
              <AppText weight="extraBold" style={[styles.heroTitle, text]}>
                {t("achievements.heading")}
              </AppText>

              <AppText weight="medium" style={[styles.heroSubtitle, text]}>
                {t("achievements.subtitle")}
              </AppText>
            </View>

            <View style={[styles.heroSummaryRow, row]}>
              <View style={[styles.heroSummaryCard, styles.heroSummaryCardGreen]}>
                <View style={[styles.heroSummaryTop, row]}>
                  <View style={styles.heroSummaryIconGreen}>
                    <MaterialCommunityIcons name="target" size={18} color="#0F8A5F" />
                  </View>

                  <AppText
                    weight="extraBold"
                    style={[styles.heroSummaryValueGreen, text]}
                  >
                    {completedGoals}/{totalGoals}
                  </AppText>
                </View>

                <AppText style={[styles.heroSummaryLabel, text]}>
                  {t("achievements.completed")}
                </AppText>
              </View>

              <View style={[styles.heroSummaryCard, styles.heroSummaryCardGold]}>
                <View style={[styles.heroSummaryTop, row]}>
                  <View style={styles.heroSummaryIconGold}>
                    <MaterialCommunityIcons
                      name="star-circle-outline"
                      size={18}
                      color="#B46B00"
                    />
                  </View>

                  <AppText
                    weight="extraBold"
                    style={[styles.heroSummaryValueGold, text]}
                  >
                    {points}
                  </AppText>
                </View>

                <AppText style={[styles.heroSummaryLabel, text]}>
                  {t("achievements.points")}
                </AppText>
              </View>
            </View>
          </View>

          <View style={[styles.statsGrid, { gap: gridGap }]}>
            {stats.map((item) => {
              const isBlue = item.tone === "blue";

              return (
                <View
                  key={item.id}
                  style={[
                    styles.statCard,
                    isBlue ? styles.statCardBlue : styles.statCardPink,
                    { width: statCardWidth },
                  ]}
                >
                  <View style={[styles.statHeader, row]}>
                    <View
                      style={[
                        styles.statIconBadge,
                        isBlue ? styles.statIconBadgeBlue : styles.statIconBadgePink,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={18}
                        color={isBlue ? "#2F6DEB" : "#D81B60"}
                      />
                    </View>

                    <AppText
                      weight="medium"
                      style={[styles.statLabel, text]}
                      numberOfLines={1}
                    >
                      {item.label}
                    </AppText>
                  </View>

                  <AppText
                    weight="extraBold"
                    style={[
                      styles.statValue,
                      isBlue ? styles.statValueBlue : styles.statValuePink,
                      text,
                    ]}
                    numberOfLines={1}
                  >
                    {item.value}
                  </AppText>
                </View>
              );
            })}
          </View>

          <View style={styles.achievementsList}>
            {achievements.map((item) => {
              const isGold = item.tone === "gold";

              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.title} ${item.subtitle}`}
                  style={({ pressed }) => [
                    styles.achievementCard,
                    isGold ? styles.achievementCardGold : styles.achievementCardLight,
                    pressed && styles.achievementCardPressed,
                  ]}
                  onPress={() => {}}
                >
                  <View style={[styles.achievementInner, rowTop]}>
                    <View
                      style={[
                        styles.achievementIconBox,
                        isGold
                          ? styles.achievementIconBoxGold
                          : styles.achievementIconBoxLight,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={28}
                        color={isGold ? "#A17B00" : "#7C3AED"}
                      />
                    </View>

                    <View style={styles.achievementTextArea}>
                      <View style={[styles.achievementTitleRow, row]}>
                        <AppText
                          weight="extraBold"
                          style={[
                            styles.achievementTitle,
                            isGold && styles.achievementTitleGold,
                            text,
                          ]}
                          numberOfLines={1}
                        >
                          {item.title}
                        </AppText>

                        {item.completed ? (
                          <View style={[styles.completedBadge, row]}>
                            <MaterialCommunityIcons name="check" size={14} color="#fff" />
                            <AppText weight="bold" style={styles.completedBadgeText}>
                              {t("achievements.done")}
                            </AppText>
                          </View>
                        ) : null}
                      </View>

                      <AppText
                        style={[
                          styles.achievementSubtitle,
                          isGold && styles.achievementSubtitleGold,
                          text,
                        ]}
                        numberOfLines={2}
                      >
                        {item.subtitle}
                      </AppText>

                      <View style={styles.achievementBottomArea}>
                        <View
  style={[
    styles.rewardPill,
    isGold ? styles.rewardPillGold : styles.rewardPillLight,
    isRTL ? styles.rewardPillRtl : styles.rewardPillLtr,
  ]}
>
                          <AppText
                            style={[
                              styles.rewardText,
                              isGold && styles.rewardTextGold,
                              { textAlign: "center" },
                            ]}
                            numberOfLines={1}
                          >
                            {item.rewardText}
                          </AppText>
                        </View>

                        <View
  style={[
    styles.pointsPill,
    isGold ? styles.pointsPillGold : styles.pointsPillLight,
    isRTL ? styles.pointsPillRtl : styles.pointsPillLtr,
  ]}
>
                          <AppText
                            style={[
                              styles.progressText,
                              isGold && styles.progressTextGold,
                              { textAlign: "center" },
                            ]}
                            numberOfLines={1}
                          >
                            {item.progressText}
                          </AppText>
                        </View>
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScreenLayout>
    </>
  );
}