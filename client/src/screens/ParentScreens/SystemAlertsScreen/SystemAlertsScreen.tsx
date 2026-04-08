import React, { useEffect, useMemo, useState, useCallback } from "react";
import { View, FlatList, Pressable, ActivityIndicator, RefreshControl } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles, ALERT_COLORS } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";
import type { AppDispatch, RootState } from "@/src/redux/store/types";
import type { Notification } from "@/src/api/notification";
import {
  fetchParentNotificationsThunk,
  markParentNotificationReadThunk,
  markAllParentNotificationsReadThunk,
  deleteParentNotificationThunk,
} from "@/src/redux/thunks/notificationThunks";
import { showAppToast } from "@/src/utils/appToast";

type AlertFilter = "all" | "unread" | "critical";
type AlertSeverity = "critical" | "warning" | "info" | "success";

function toAlertSeverity(severity: string): AlertSeverity {
  const s = String(severity || "").toUpperCase();
  if (s === "CRITICAL" || s === "ERROR") return "critical";
  if (s === "WARNING") return "warning";
  if (s === "SUCCESS") return "success";
  return "info";
}

function pickIcon(type: string, severity: string): React.ComponentProps<typeof MaterialCommunityIcons>["name"] {
  const t = String(type || "").toUpperCase();
  switch (t) {
    case "CHILD_LOGGED_IN": return "account-check-outline";
    case "CHILD_ADDED": return "account-plus-outline";
    case "CHILD_PROFILE_UPDATED": return "account-edit-outline";
    case "CHILD_DELETED": return "account-remove-outline";
    case "CHILD_DISCONNECTED": return "account-off-outline";
    case "CHILD_LOCATION_UPDATED": return "map-marker-check-outline";
    case "EXTENSION_REQUEST_CREATED": return "clock-plus-outline";
    case "EXTENSION_REQUEST_APPROVED": return "check-decagram-outline";
    case "EXTENSION_REQUEST_REJECTED": return "close-octagon-outline";
    case "DEVICE_LOCKED": return "lock-outline";
    case "DEVICE_UNLOCKED": return "lock-open-outline";
    case "DEVICE_ADDED": return "cellphone-link";
    case "DEVICE_DELETED": return "cellphone-remove";
    case "DEVICE_RENAMED": return "rename-outline";
    case "SCREEN_TIME_UPDATED": return "clock-edit-outline";
    case "SCREEN_TIME_ENDING": return "clock-alert-outline";
    case "SCREEN_TIME_ENDED": return "clock-remove-outline";
    default:
      return toAlertSeverity(severity) === "critical" ? "shield-alert-outline" : "bell-outline";
  }
}

function formatCreatedAt(createdAt?: string) {
  if (!createdAt) return "";
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

const FILTERS: AlertFilter[] = ["all", "unread", "critical"];

const EMPTY_NOTIFICATIONS: Notification[] = [];
const DEFAULT_PAGINATION = { total: 0, page: 1, pages: 1, limit: 10 };

function safeErrorText(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

export default function SystemAlertsScreen() {
  const { t } = useTranslation();
  const { text, row } = useLocaleLayout();
  const dispatch = useDispatch<AppDispatch>();

  const notificationsState = useSelector((state: RootState) => state.notifications);
  const notifications = Array.isArray(notificationsState?.items)
    ? notificationsState.items
    : EMPTY_NOTIFICATIONS;
  const pagination = notificationsState?.pagination ?? DEFAULT_PAGINATION;
  const status = notificationsState?.status ?? "idle";
  const error = notificationsState?.error ?? null;
  const unreadCount = notificationsState?.unreadCount ?? 0;

  const [selectedFilter, setSelectedFilter] = useState<AlertFilter>("all");
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [markAllReadBusy, setMarkAllReadBusy] = useState(false);

  const loadData = useCallback((page: number) => {
    dispatch(fetchParentNotificationsThunk({ page, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    loadData(1);
  }, [loadData]);

  const handleMarkAllRead = useCallback(async () => {
    setMarkAllReadBusy(true);
    try {
      await dispatch(markAllParentNotificationsReadThunk()).unwrap();
    } catch {
      showAppToast(t("systemAlerts.markAllReadFailed"), t("common.error"));
    } finally {
      setMarkAllReadBusy(false);
    }
  }, [dispatch, t]);

  const handleDeleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        await dispatch(deleteParentNotificationThunk({ notificationId })).unwrap();
      } catch {
        showAppToast(t("systemAlerts.deleteFailed"), t("common.error"));
      }
    },
    [dispatch]
  );

  const handleLoadMore = useCallback(async () => {
    if (isFetchingMore || status === "loading" || !pagination || (pagination?.page || 1) >= (pagination?.pages || 1)) return;

    setIsFetchingMore(true);
    await dispatch(fetchParentNotificationsThunk({
      page: (pagination?.page || 1) + 1,
      limit: 10,
    }));
    setIsFetchingMore(false);
  }, [dispatch, pagination, isFetchingMore, status]);

  const filteredAlerts = useMemo(() => {
    const list = Array.isArray(notifications) ? notifications : [];
    switch (selectedFilter) {
      case "unread": return list.filter((n: Notification) => !n.isRead);
      case "critical": return list.filter((n: Notification) => toAlertSeverity(n.severity) === "critical");
      default: return list;
    }
  }, [selectedFilter, notifications]);

  const renderHeader = () => (
    <View style={styles.container}>
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroTextWrap}>
            <AppText weight="extraBold" style={[styles.heroTitle, text]}>{t("systemAlerts.heading")}</AppText>
            <AppText weight="medium" style={[styles.heroSubtitle, text]}>{t("systemAlerts.subtitle")}</AppText>
          </View>
          <View style={styles.heroIconWrap}>
            <MaterialCommunityIcons name="bell-badge-outline" size={26} color="#3D5AFE" />
          </View>
        </View>

        <View style={[styles.statsRow, row]}>
          <View style={styles.statCard}>
            <AppText weight="extraBold" style={styles.statValue}>
              {pagination?.total || 0}
            </AppText>
            <AppText weight="medium" style={[styles.statLabel, text]}>
              {t("systemAlerts.stats.total")}
            </AppText>
          </View>

          <View style={styles.statCard}>
            <AppText weight="extraBold" style={styles.statValue}>
              {unreadCount}
            </AppText>
            <AppText weight="medium" style={[styles.statLabel, text]}>
              {t("systemAlerts.stats.unread")}
            </AppText>
          </View>

          <View style={styles.statCard}>
            <AppText weight="extraBold" style={styles.statValue}>
              {(notifications || []).filter((n: Notification) => toAlertSeverity(n.severity) === "critical").length}
            </AppText>
            <AppText weight="medium" style={[styles.statLabel, text]}>
              {t("systemAlerts.stats.critical")}
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <AppText weight="bold" style={[styles.sectionTitle, text]}>{t("systemAlerts.filters.title")}</AppText>
      </View>

      <View style={[styles.filtersRow, row]}>
        {FILTERS.map((filterKey) => (
          <Pressable
            key={filterKey}
            onPress={() => setSelectedFilter(filterKey)}
            style={[
              styles.filterChip,
              selectedFilter === filterKey && styles.filterChipSelected,
            ]}
          >
            <AppText weight={selectedFilter === filterKey ? "bold" : "medium"} style={[styles.filterChipText, text, selectedFilter === filterKey && styles.filterChipTextSelected]}>
              {t(`systemAlerts.filters.items.${filterKey}`)}
            </AppText>
          </Pressable>
        ))}
      </View>

      {status === "failed" && (notifications || []).length > 0 && (
        <View style={{ padding: 10, backgroundColor: "#FEE2E2", borderRadius: 8, marginHorizontal: 16, marginBottom: 10 }}>
          <AppText style={{ color: "#B91C1C" }}>{safeErrorText(error)}</AppText>
        </View>
      )}

      <View style={[styles.listTitleRow, row]}>
        <AppText weight="bold" style={[styles.sectionTitle, text]}>
          {t("systemAlerts.listTitle")}
        </AppText>
        {unreadCount > 0 && (
          <Pressable
            onPress={() => {
              void handleMarkAllRead();
            }}
            disabled={markAllReadBusy}
            accessibilityRole="button"
            accessibilityLabel={t("systemAlerts.markAllRead_a11y")}
            style={({ pressed }) => [
              styles.markAllReadPressable,
              pressed && !markAllReadBusy && { opacity: 0.7 },
              markAllReadBusy && { opacity: 0.45 },
            ]}
          >
            <AppText weight="bold" style={styles.markAllReadText}>
              {t("systemAlerts.markAllRead")}
            </AppText>
          </Pressable>
        )}
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingMore) return <View style={{ height: 40 }} />;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" color="#3D5AFE" />
      </View>
    );
  };

  const renderItem = useCallback(
    ({ item: alert }: { item: Notification }) => {
      const severity = toAlertSeverity(alert.severity);
      const palette = ALERT_COLORS[severity];
      const isUnread = !alert.isRead;

      return (
        <View style={styles.alertListItemWrap}>
          <View
            style={[
              styles.alertCard,
              !isUnread && styles.alertCardRead,
            ]}
          >
            <View style={[styles.alertAccent, { backgroundColor: palette.accent }]} />
            <View style={styles.alertCardInner}>
              {isUnread ? (
                <View style={[styles.alertUnreadDotRow, row]}>
                  <View style={styles.alertCardEndSpacer} />
                  <View style={styles.alertTrashTrack}>
                    <View style={styles.unreadDot} />
                  </View>
                </View>
              ) : null}
              <View style={styles.alertCardInnerColumn}>
                <Pressable
                  onPress={() => {
                    if (alert._id && !alert.isRead) {
                      dispatch(
                        markParentNotificationReadThunk({
                          notificationId: String(alert._id),
                        })
                      );
                    }
                  }}
                  style={({ pressed }) => [
                    styles.alertCardMainPressable,
                    row,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={[styles.alertIconWrap, { backgroundColor: palette.soft }]}>
                    <MaterialCommunityIcons
                      name={pickIcon(alert.type, alert.severity)}
                      size={21}
                      color={palette.accent}
                    />
                  </View>
                  <View style={styles.alertTextWrap}>
                    <View style={styles.alertHeaderRow}>
                      <AppText weight="bold" style={[styles.alertTitle, text]} numberOfLines={2}>
                        {String(alert.title ?? "")}
                      </AppText>
                    </View>
                    <AppText weight="medium" style={[styles.alertDescription, text]}>
                      {String(alert.description ?? "")}
                    </AppText>
                  </View>
                </Pressable>
                <View style={[styles.alertFooterRow, row]}>
                  <View style={[styles.alertFooterMetaGroup, row]}>
                    <View style={styles.timeBadge}>
                      <MaterialCommunityIcons name="clock-time-four-outline" size={14} color="#64748B" />
                      <AppText weight="medium" style={[styles.timeText, text]}>
                        {formatCreatedAt(alert.createdAt) || t("systemAlerts.time.justNow")}
                      </AppText>
                    </View>
                    <View style={[styles.severityBadge, { backgroundColor: palette.soft }]}>
                      <AppText weight="bold" style={[styles.severityText, text, { color: palette.accent }]}>
                        {t(`systemAlerts.severityLabels.${severity}`)}
                      </AppText>
                    </View>
                  </View>
                  <View style={styles.alertTrashTrack}>
                    <Pressable
                      onPress={() => {
                        void handleDeleteNotification(String(alert._id));
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={t("systemAlerts.delete_a11y")}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                      style={({ pressed }) => [
                        styles.alertDeleteFooter,
                        pressed && styles.alertDeleteFooterPressed,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="trash-can-outline"
                        size={22}
                        color="#DC2626"
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    },
    [dispatch, handleDeleteNotification, row, t, text]
  );

  if (status === "loading" && (notifications?.length || 0) === 0) {
    return (
      <ScreenLayout scrollable={false}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#3D5AFE" />
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout scrollable={false}>
      <FlatList
        data={filteredAlerts}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item?._id != null && item._id !== "" ? String(item._id) : `alert-${index}`
        }
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListHeaderComponentStyle={{ width: "100%" }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={status === "loading" && (notifications?.length || 0) > 0}
            onRefresh={() => loadData(1)}
            colors={["#3D5AFE"]}
          />
        }
        ListEmptyComponent={
          status !== "loading" ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="bell-outline" size={28} color="#9CA3AF" />
              <AppText weight="bold" style={[styles.emptyTitle, text]}>
                {t("systemAlerts.empty.title")}
              </AppText>
              <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                {t("systemAlerts.empty.subtitle")}
              </AppText>
            </View>
          ) : null
        }
      />
    </ScreenLayout>
  );
}
