import React, { useCallback, useEffect, useMemo } from "react";
import { View, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { router, type Href, useFocusEffect } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";

import { getChildProfileImageUri } from "@/src/utils/childProfileImage";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/redux/store/types";
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
  const dispatch = useDispatch<AppDispatch>();

  const { parentId } = useSelector((state: RootState) => state.auth ?? {});
  const { childrenSummary, isLoading, isRefreshing, error } = useSelector(
    (state: RootState) => state.parentHome
  );

  const children = Array.isArray(childrenSummary) ? childrenSummary : [];

  const unreadNotificationsCount = useSelector(
    (state: RootState) => state.notifications?.unreadCount ?? 0
  );

  useEffect(() => {
    dispatch(fetchParentHomeSummaryThunk());
    dispatch(getMyChildrenThunk());
    dispatch(fetchParentNotificationsThunk({ page: 1, limit: 10 }));
  }, [dispatch, parentId]);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchParentHomeSummaryThunk());
    }, [dispatch])
  );

  const parentName = "Parent";

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
  const onPressFullWatch = () => router.push("/Parent/(tabs)/children" as Href);
  const onPressAddChild = () => router.push("/Parent/addChild" as Href);

  const onPressChildCard = (childId: string, childName: string) =>
    router.push({
      pathname: "/Parent/childProfile" as Href,
      params: { id: childId, name: childName },
    } as never);

  const onPressNotifications = () => {
    router.push("/Parent/systemAlerts" as Href);
  };

  const onPressOpenMenu = () => router.push("/Parent/homeMenu" as Href);

  return (
    <ScreenLayout scrollable={false}>
      <View style={styles.container}>
        <View style={styles.content}>
          <ScrollView
            style={styles.mainScroll}
            contentContainerStyle={styles.mainScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* HEADER */}
            <View style={styles.header}>
              <AppText weight="extraBold" style={styles.bigHello}>
                Hello {parentName}
              </AppText>

              
            </View>

            {/* SUMMARY */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryChip}>
                  <AppText weight="extraBold" style={styles.summaryChipText}>
                    {children.length}
                  </AppText>
                </View>

                <View style={styles.summaryTextWrap}>
                  <AppText weight="bold" style={styles.sectionTitle}>
                    My Kids
                  </AppText>

                  <AppText style={styles.sectionSub}>
                    {isRefreshing
                      ? "Refreshing..."
                      : "Daily screen time overview"}
                  </AppText>
                </View>
              </View>
            </View>

            {/* CONTENT */}
            {isLoading ? (
              <View style={styles.loaderWrap}>
                <ActivityIndicator />
              </View>
            ) : error ? (
              <AppText style={styles.sectionSub}>{error}</AppText>
            ) : childCards.length === 0 ? (
              <View style={styles.emptyState}>
                <AppText>No children yet</AppText>

                <Pressable
                  style={({ pressed }) => [
                    styles.btnSecondary,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={onPressAddChild}
                >
                  <AppText weight="extraBold" style={styles.btnSecondaryText}>
                    Add Child
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
                  >
                    <View style={styles.cardInner}>
                      <View style={styles.avatarCircle}>
                        {c.avatarUri ? (
                          <Image
                            source={{ uri: c.avatarUri }}
                            style={styles.avatarImage}
                          />
                        ) : (
                          <MaterialCommunityIcons
                            name={c.isLocked ? ICON.lock : ICON.user}
                            size={22}
                          />
                        )}
                      </View>

                      <View style={styles.cardCenter}>
                        <AppText weight="extraBold" style={styles.childName}>
                          {c.name}
                        </AppText>

                        <AppText style={styles.childSubtitle}>
                          {c.isLocked
                            ? "Device locked"
                            : "Daily screen time"}
                        </AppText>
                      </View>

                      <View style={styles.cardEdge}>
                        {c.isLocked ? (
                          <>
                            <AppText weight="extraBold">
                              Locked
                            </AppText>
                            <AppText style={styles.timeSub}>
                              By parent
                            </AppText>
                          </>
                        ) : (
                          <>
                            <AppText weight="extraBold">
                              {c.usedText ?? "--:--"}
                            </AppText>
                            <AppText style={styles.timeSub}>
                              {c.limitText
                                ? `Out of ${c.limitText}`
                                : "No limit"}
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

          {/* ACTIONS */}
          {childCards.length > 0 && (
            <View style={styles.actionsWrap}>
              <Pressable
                style={({ pressed }) => [
                  styles.btnPrimary,
                  pressed && styles.buttonPressed,
                ]}
                onPress={onPressFullWatch}
              >
                <AppText weight="extraBold" style={styles.btnPrimaryText}>
                  Full View
                </AppText>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.btnSecondary,
                  pressed && styles.buttonPressed,
                ]}
                onPress={onPressAddChild}
              >
                <AppText weight="extraBold" style={styles.btnSecondaryText}>
                  Add Child
                </AppText>
              </Pressable>
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </View>
      </View>
    </ScreenLayout>
  );
}