import React from "react";
import { View, Pressable } from "react-native";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

const ICON = {
  coin: "coins",
  clock: "clock-outline",
  movie: "movie-open-outline",
  icecream: "ice-cream",
  gift: "gift-outline",
} as const;

type RewardTile = {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  price: number;
  bg: string;
  badge: string;
  iconColor: string;
  border: string;
};

export default function StoreScreen() {
  const { t } = useTranslation();
  const { isRTL, row, text } = useLocaleLayout();

  const coinsBalance = 250;

  const rewards: RewardTile[] = [
    {
      id: 1,
      title: t("store.reward_time"),
      subtitle: t("store.reward_cost"),
      icon: ICON.clock,
      price: 25,
      bg: "#EAF2FF",
      badge: "#CFE3FF",
      iconColor: "#2F6DEB",
      border: "#D6E6FF",
    },
    {
      id: 2,
      title: t("store.reward_movie"),
      subtitle: t("store.reward_cost"),
      icon: ICON.movie,
      price: 25,
      bg: "#F3EDFF",
      badge: "#E0D2FF",
      iconColor: "#6D28D9",
      border: "#E7DBFF",
    },
    {
      id: 3,
      title: t("store.reward_icecream"),
      subtitle: t("store.reward_cost"),
      icon: ICON.icecream,
      price: 25,
      bg: "#FFEAF0",
      badge: "#FFC9D8",
      iconColor: "#D81B60",
      border: "#FFD6E2",
    },
    {
      id: 4,
      title: t("store.reward_small"),
      subtitle: t("store.reward_cost"),
      icon: ICON.gift,
      price: 25,
      bg: "#FFF3DD",
      badge: "#FFE1A8",
      iconColor: "#B46B00",
      border: "#FFE6BA",
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: t("store.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />

      <ScreenLayout>
        <View style={styles.container}>
          {/* Balance */}
          <View style={styles.balanceSection}>
            <AppText weight="bold" style={[styles.balanceLabel, text]}>
              {t("store.your_balance")}
            </AppText>

            <View style={[styles.balanceCard, row]}>
              <View style={styles.balanceBadge}>
                <FontAwesome5 name={ICON.coin} size={18} color="#2F6DEB" />
              </View>

              <View style={styles.balanceTextWrap}>
                <AppText weight="extraBold" style={[styles.balanceAmount, text]}>
                  {coinsBalance}
                </AppText>
                <AppText style={[styles.balanceSub, text]}>{t("store.coins")}</AppText>
              </View>
            </View>
          </View>

          {/* Rewards */}
          <View style={styles.rewardsContainer}>
            <AppText weight="bold" style={[styles.sectionTitle, text]}>
              {t("store.available_rewards")}
            </AppText>

            {rewards.map((item) => {
              return (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.rewardCard,
                    {
                      backgroundColor: item.bg,
                      borderColor: item.border,
                      opacity: pressed ? 0.92 : 1,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.title}, ${t("store.reward_cost")}`}
                >
                  <View style={[styles.rewardRow, row]}>
                    {/* Icon side */}
                    <View
                      style={[
                        styles.iconBox,
                        { backgroundColor: item.badge, borderColor: item.border },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={24}
                        color={item.iconColor}
                      />
                    </View>

                    {/* Text middle */}
                    <View style={styles.textBox}>
                      <AppText weight="bold" style={[styles.rewardTitle, text]}>
                        {item.title}
                      </AppText>
                      <AppText style={[styles.rewardSub, text]}>{item.subtitle}</AppText>
                    </View>

                    {/* Price side */}
                    <View
                      style={[
                        styles.priceBox,
                        {
                          alignItems: isRTL ? "flex-start" : "flex-end",
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.pricePill,
                          { borderColor: item.border, backgroundColor: "#FFFFFF" },
                        ]}
                      >
                        <AppText weight="extraBold" style={styles.rewardPrice}>
                          {item.price}
                        </AppText>
                        <AppText style={styles.rewardCoins}>{t("store.coins")}</AppText>
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