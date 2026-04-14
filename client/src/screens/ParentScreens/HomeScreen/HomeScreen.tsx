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
import EmptyStateCard from "../../../components/EmptyStateCard/EmptyStateCard";
import InfoHint from "../../../components/InfoHint/InfoHint";

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

  const getStatusStyles = (status: ChildCard["status"]) => {
    switch (status) {
      case "warn":
        return {
          avatarBg: styles.avatarWarn,
          timeColor: styles.timeWarn,
          subtitle: "Getting close to limit",
        };
      case "bad":
        return {
          avatarBg: styles.avatarBad,
          timeColor: styles.timeBad,
          subtitle: "Limit reached",
        };
      case "good":
      default:
        return {
          avatarBg: styles.avatarGood,
          timeColor: styles.timeGood,
          subtitle: "Daily screen time",
        };
    }
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
            <View style={styles.header}>
              <View style={styles.headerMenuLeft}>
                <Pressable
                  onPress={onPressOpenMenu}
                  accessibilityRole="button"
                  accessibilityLabel="Open menu"
                  style={({ pressed }) => [
                    styles.headerMenuButton,
                    pressed ? styles.headerMenuButtonPressed : null,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={ICON.menu}
                    size={24}
                    color="#0F172A"
                  />
                </Pressable>
              </View>

              <AppText weight="extraBold" style={styles.bigHello}>
                Hello, {parentName}
              </AppText>

              <View style={styles.headerBellRight}>
                <Pressable
                  onPress={onPressNotifications}
                  accessibilityRole="button"
                  accessibilityLabel="Open system alerts"
                  style={({ pressed }) => [
                    styles.headerMenuButton,
                    pressed ? styles.headerMenuButtonPressed : null,
                  ]}
                >
                  <View style={styles.bellWrap}>
                    <MaterialCommunityIcons
                      name={ICON.bell}
                      size={24}
                      color="#0F172A"
                    />

                    {unreadNotificationsCount > 0 ? (
                      <View style={styles.bellBadge}>
                        <AppText
                          weight="extraBold"
                          style={styles.bellBadgeText}
                        >
                          {unreadNotificationsCount > 99 ? "99+" : String(unreadNotificationsCount)}
                        </AppText>
                      </View>
                    ) : null}
                  </View>
                </Pressable>
              </View>
            </View>

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

            <View style={{ width: "100%", marginTop: 10, marginBottom: 6 }}>
              <InfoHint
                title="How this screen works"
                lines={[
                  "This screen gives you a quick overview of your children’s screen time and device status",
                  "Usage Access on child's device is needed to show correct screen-time data",
                  "Accessibility access on child's device is needed for lock actions to work properly",
                  "If a device is offline or a required permission is turned off, the latest updates will appear here after it reconnects",
                  "Open a child’s profile for deleting or editing child details and photo, watch child location, requests and screen time limits",
                ]}
              />
            </View>

            {isLoading ? (
              <View style={styles.loaderWrap}>
                <ActivityIndicator />
              </View>
            ) : error ? (
              <AppText style={styles.sectionSub}>{error}</AppText>
            ) : childCards.length === 0 ? (
              <EmptyStateCard
                icon="account-child-outline"
                title="No children yet"
                subtitle="Add your first child to start tracking screen time, limits, and device status."
                buttonLabel="Add Child"
                onPressButton={onPressAddChild}
              />
            ) : (
              <View style={styles.cardsWrap}>
                {childCards.map((c) => {
                  const statusStyles = getStatusStyles(c.status);

                  return (
                    <Pressable
                      key={c.id}
                      style={({ pressed }) => [
                        styles.card,
                        pressed ? styles.cardPressed : null,
                      ]}
                      onPress={() => onPressChildCard(c.id, c.name)}
                      accessibilityRole="button"
                      accessibilityLabel={`Open profile for ${c.name}`}
                    >
                      <View style={styles.cardInner}>
                        <View style={[styles.avatarCircle, statusStyles.avatarBg]}>
                          {c.avatarUri ? (
                            <Image
                              source={{ uri: c.avatarUri }}
                              style={styles.avatarImage}
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
                          <AppText weight="extraBold" style={styles.childName}>
                            {c.name}
                          </AppText>

                          <AppText style={styles.childSubtitle}>
                            {c.isLocked ? "Device locked" : statusStyles.subtitle}
                          </AppText>
                        </View>

                        <View style={styles.cardEdge}>
                          {c.isLocked ? (
                            <>
                              <AppText weight="extraBold" style={[styles.timeMain, styles.timeBad]}>
                                Locked
                              </AppText>
                              <AppText style={styles.timeSub}>By parent</AppText>
                            </>
                          ) : (
                            <>
                              <AppText
                                weight="extraBold"
                                style={[styles.timeMain, statusStyles.timeColor]}
                              >
                                {c.usedText ?? "--:--"}
                              </AppText>

                              <AppText style={styles.timeSub}>
                                {c.limitText ? `Out of ${c.limitText}` : "No limit"}
                              </AppText>
                            </>
                          )}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </ScrollView>

          {childCards.length > 0 && (
            <View style={styles.actionsWrap}>
              <Pressable
                style={({ pressed }) => [
                  styles.btnPrimary,
                  pressed ? styles.buttonPressed : null,
                ]}
                onPress={onPressFullWatch}
                accessibilityRole="button"
                accessibilityLabel="Open full view"
              >
                <AppText weight="extraBold" style={styles.btnPrimaryText}>
                  Full View
                </AppText>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.btnSecondary,
                  pressed ? styles.buttonPressed : null,
                ]}
                onPress={onPressAddChild}
                accessibilityRole="button"
                accessibilityLabel="Add child"
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