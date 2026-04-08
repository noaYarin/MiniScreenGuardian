import React, { useCallback, useEffect, useMemo } from "react";
import { View, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { router, Stack, type Href, useFocusEffect } from "expo-router";

import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";

import { getChildProfileImageUri } from "@/src/utils/childProfileImage";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/redux/store/types";
import { connectSocket } from "@/src/services/socket";
import { fetchParentHomeSummaryThunk } from "@/src/redux/thunks/parentHomeThunks";
import { getMyChildrenThunk } from "@/src/redux/thunks/childrenThunks";
import { fetchParentNotificationsThunk } from "@/src/redux/thunks/notificationThunks";

type ChildCard = {
  id: string;
  name: string;
  status: "good" | "warn" | "bad";
  isLocked: boolean;
  usedText: string | null;
  limitText: string | null;
  avatarUri: string | null;
};

const ICON = {
  user: "account-outline",
  menu: "menu",
  bell: "bell-outline",
  lock: "lock-outline",
} as const;

export default function HomeParentScreen() {
  const { t } = useTranslation();
  const { row, text, isRTL } = useLocaleLayout();
  const dispatch = useDispatch<AppDispatch>();

  const { parentId } = useSelector((state: RootState) => state.auth ?? {});

  const { childrenSummary, isLoading, isRefreshing, error } = useSelector(
    (state: RootState) => state.parentHome
  );

  const children = Array.isArray(childrenSummary) ? childrenSummary : [];


  const notifications = useSelector((state: RootState) => state.notifications?.items ?? []);
  const unreadNotificationsCount = useSelector((state: RootState) => state.notifications?.unreadCount ?? 0);

  useEffect(() => {
    dispatch(fetchParentHomeSummaryThunk());
    dispatch(getMyChildrenThunk());

    //if (parentId) {
    //connectSocket(parentId, "parent");
    //}
    dispatch(fetchParentNotificationsThunk({ page: 1, limit: 10 }));
  }, [dispatch, parentId]);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchParentHomeSummaryThunk());
    }, [dispatch])
  );

  const parentName = t("homeParent.parent_name_fallback");

  const formatMinutes = (minutes: number | null) => {
    if (minutes == null) return null;

    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}`;
  };

  const childCards: ChildCard[] = useMemo(() => {
    return children.map((child) => ({
      id: String(child.childId),
      name: child.name ?? "",
      status: child.status ?? "good",
      isLocked: child.isLocked === true,
      usedText: formatMinutes(child.usedTodayMinutes),
      limitText:
        child.dailyLimitMinutes == null
          ? null
          : formatMinutes(child.dailyLimitMinutes),
      avatarUri: getChildProfileImageUri(child.img),

    }));
  }, [children]);

  const onPressOverview = () => router.push("/Parent/(tabs)/reports" as Href);
  const onPressFullWatch = () =>
    router.push("/Parent/(tabs)/children" as Href);
  const onPressAddChild = () => router.push("/Parent/addChild" as Href);

  const onPressChildCard = (childId: string, childName: string) =>
    router.push({
      pathname: "/Parent/childProfile" as Href,
      params: { id: childId, name: childName },
    } as never);

  const onPressNotifications = () => {
    router.push("/Parent/systemAlerts" as Href);
  };



  const bellButton = (
    <Pressable
      onPress={onPressNotifications}
      accessibilityRole="button"
      accessibilityLabel={t("homeParent.notifications_a11y")}
      hitSlop={10}
      style={({ pressed }) => [
        styles.headerMenuButton,
        pressed && styles.headerMenuButtonPressed,
      ]}
    >
      <View style={styles.bellWrap}>
        <MaterialCommunityIcons name={ICON.bell} size={24} color="#0F172A" />
        {unreadNotificationsCount > 0 ? (
          <View style={styles.bellBadge} pointerEvents="none">
            <AppText weight="bold" style={styles.bellBadgeText}>
              {unreadNotificationsCount > 99 ? "99+" : String(unreadNotificationsCount)}
            </AppText>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
  const onPressOpenMenu = () => router.push("/Parent/homeMenu" as Href);

  const menuButton = (
    <Pressable
      onPress={onPressOpenMenu}
      accessibilityRole="button"
      accessibilityLabel={t("homeParent.open_menu_a11y")}
      hitSlop={10}
      style={({ pressed }) => [
        styles.headerMenuButton,
        pressed && styles.headerMenuButtonPressed,
      ]}
    >
      <MaterialCommunityIcons name={ICON.menu} size={24} color="#0F172A" />
    </Pressable>
  );
return (
    <>
      <Stack.Screen
        options={{
          title: t("homeParent.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerBackVisible: false,
          ...(isRTL
            ? {
                headerLeft: () => menuButton,
                headerRight: () => bellButton,
              }
            : {
                headerRight: () => menuButton,
                headerLeft: () => bellButton,
              }),
        }}
      />

      <ScreenLayout scrollable={false}>
        <View style={styles.container}>
          <View style={styles.content}>
            <ScrollView
              style={styles.mainScroll}
              contentContainerStyle={styles.mainScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.header}>
                <AppText weight="extraBold" style={[styles.bigHello, text]}>
                  {t("homeParent.hello", { name: parentName })}
                </AppText>

                <AppText
                  onPress={onPressOverview}
                  weight="bold"
                  style={[styles.overviewLink, text]}
                >
                  {t("homeParent.overview")}
                </AppText>
              </View>

              <View style={styles.summaryCard}>
                <View style={[styles.summaryRow, row]}>
                  <View style={styles.summaryChip}>
                    <AppText weight="extraBold" style={styles.summaryChipText}>
                      {children.length}
                    </AppText>
                  </View>

                  <View style={styles.summaryTextWrap}>
                    <AppText weight="bold" style={[styles.sectionTitle, text]}>
                      {t("homeParent.my_kids")}
                    </AppText>

                    <AppText style={[styles.sectionSub, text]}>
                      {isRefreshing
                        ? t("homeParent.refreshing")
                        : t("homeParent.day_screen_time")}
                    </AppText>
                  </View>
                </View>
              </View>

              {isLoading ? (
                <View style={styles.loaderWrap}>
                  <ActivityIndicator />
                </View>
              ) : error ? (
                <AppText style={[styles.sectionSub, text]}>
                  {t(error, { defaultValue: error })}
                </AppText>
              ) : childCards.length === 0 ? (
                <View style={styles.emptyState}>
                  <AppText style={[styles.sectionSub, text]}>
                    {t("homeParent.no_children")}
                  </AppText>

                  <Pressable
                    style={({ pressed }) => [
                      styles.btnSecondary,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={onPressAddChild}
                    accessibilityRole="button"
                    accessibilityLabel={t("homeParent.add_child_a11y")}
                  >
                    <AppText weight="extraBold" style={styles.btnSecondaryText}>
                      {t("homeParent.add_child")}
                    </AppText>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.cardsWrap}>
                  {childCards.map((c) => (
                    <Pressable
                      key={c.id}
                      style={({ pressed }) => [
                        styles.card,
                        pressed && styles.cardPressed,
                      ]}
                      onPress={() => onPressChildCard(c.id, c.name)}
                      accessibilityRole="button"
                      accessibilityLabel={t("homeParent.child_card_a11y", {
                        name: c.name,
                      })}
                    >
                      <View style={[styles.cardInner, row]}>
                        <View
                          style={[
                            styles.avatarCircle,
                            !c.avatarUri && c.isLocked && styles.avatarBad,
                            !c.avatarUri &&
                              !c.isLocked &&
                              c.status === "good" &&
                              styles.avatarGood,
                            !c.avatarUri &&
                              !c.isLocked &&
                              c.status === "warn" &&
                              styles.avatarWarn,
                            !c.avatarUri &&
                              !c.isLocked &&
                              c.status === "bad" &&
                              styles.avatarBad,
                          ]}
                        >
                          {c.avatarUri ? (
                            <Image
                              source={{ uri: c.avatarUri }}
                              style={styles.avatarImage}
                              contentFit="cover"
                              transition={120}
                            />
                          ) : (
                            <MaterialCommunityIcons
                              name={c.isLocked ? ICON.lock : ICON.user}
                              size={22}
                              color="#0F172A"
                            />
                          )}
                        </View>

                        <View style={styles.cardCenter}>
                          <AppText
                            weight="extraBold"
                            style={[styles.childName, text]}
                            numberOfLines={1}
                          >
                            {c.name}
                          </AppText>

                          <AppText
                            style={[styles.childSubtitle, text]}
                            numberOfLines={1}
                          >
                            {c.isLocked
                              ? t("homeParent.locked_subtitle")
                              : t("homeParent.day_screen_time")}
                          </AppText>
                        </View>

                        <View
                          style={[
                            styles.cardEdge,
                            isRTL ? styles.cardEdgeRtl : styles.cardEdgeLtr,
                          ]}
                        >
                          {c.isLocked ? (
                            <>
                              <AppText
                                weight="extraBold"
                                style={[styles.timeMain, styles.timeBad]}
                              >
                                {t("homeParent.locked")}
                              </AppText>

                              <AppText style={styles.timeSub}>
                                {t("homeParent.locked_by_parent")}
                              </AppText>
                            </>
                          ) : (
                            <>
                              <AppText
                                weight="extraBold"
                                style={[
                                  styles.timeMain,
                                  c.status === "good" && styles.timeGood,
                                  c.status === "warn" && styles.timeWarn,
                                  c.status === "bad" && styles.timeBad,
                                ]}
                              >
                                {c.usedText ?? "--:--"}
                              </AppText>

                              <AppText style={styles.timeSub}>
                                {c.limitText == null
                                  ? t("homeParent.no_limit")
                                  : t("homeParent.out_of", {
                                      limit: c.limitText,
                                    })}
                              </AppText>
                            </>
                          )}
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}
            </ScrollView>

            {childCards.length > 0 && (
              <View style={styles.actionsWrap}>
                <Pressable
                  style={({ pressed }) => [
                    styles.btnPrimary,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={onPressFullWatch}
                  accessibilityRole="button"
                  accessibilityLabel={t("homeParent.full_watch_a11y")}
                >
                  <AppText weight="extraBold" style={styles.btnPrimaryText}>
                    {t("homeParent.full_watch")}
                  </AppText>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.btnSecondary,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={onPressAddChild}
                  accessibilityRole="button"
                  accessibilityLabel={t("homeParent.add_child_a11y")}
                >
                  <AppText weight="extraBold" style={styles.btnSecondaryText}>
                    {t("homeParent.add_child")}
                  </AppText>
                </Pressable>
              </View>
            )}

            <View style={styles.bottomSpacer} />
          </View>
        </View>
      </ScreenLayout>
    </>
  );
}