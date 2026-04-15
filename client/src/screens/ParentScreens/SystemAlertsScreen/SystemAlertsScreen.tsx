import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import EmptyStateCard from "../../../components/EmptyStateCard/EmptyStateCard";
import { styles, ALERT_COLORS } from "./styles";

import type { AppDispatch, RootState } from "@/src/redux/store/types";
import type { Notification } from "@/src/api/notification";
import {
  fetchParentNotificationsThunk,
  markParentNotificationReadThunk,
  markAllParentNotificationsReadThunk,
  deleteParentNotificationThunk,
} from "@/src/redux/thunks/notificationThunks";
import { showErrorToast } from "@/src/utils/appToast";
type AlertFilter = "all" | "unread" | "critical";
type AlertSeverity = "critical" | "warning" | "info" | "success";

function toAlertSeverity(severity: string): AlertSeverity {
  const s = String(severity || "").toUpperCase();
  if (s === "CRITICAL" || s === "ERROR") return "critical";
  if (s === "WARNING") return "warning";
  if (s === "SUCCESS") return "success";
  return "info";
}

function pickIcon(
  type: string,
  severity: string
): React.ComponentProps<typeof MaterialCommunityIcons>["name"] {
  const t = String(type || "").toUpperCase();

  switch (t) {
    case "CHILD_LOGGED_IN":
      return "account-check-outline";
    case "CHILD_ADDED":
      return "account-plus-outline";
    case "CHILD_PROFILE_UPDATED":
      return "account-edit-outline";
    case "CHILD_DELETED":
      return "account-remove-outline";
    case "CHILD_DISCONNECTED":
      return "account-off-outline";
    case "CHILD_LOCATION_UPDATED":
      return "map-marker-check-outline";
    case "EXTENSION_REQUEST_CREATED":
      return "clock-plus-outline";
    case "EXTENSION_REQUEST_APPROVED":
      return "check-decagram-outline";
    case "EXTENSION_REQUEST_REJECTED":
      return "close-octagon-outline";
    case "DEVICE_LOCKED":
      return "lock-outline";
    case "DEVICE_UNLOCKED":
      return "lock-open-outline";
    case "DEVICE_ADDED":
      return "cellphone-link";
    case "DEVICE_DELETED":
      return "cellphone-remove";
    case "DEVICE_RENAMED":
      return "rename-outline";
    case "SCREEN_TIME_UPDATED":
      return "clock-edit-outline";
    case "SCREEN_TIME_ENDING":
      return "clock-alert-outline";
    case "SCREEN_TIME_ENDED":
      return "clock-remove-outline";
    default:
      return toAlertSeverity(severity) === "critical"
        ? "shield-alert-outline"
        : "bell-outline";
  }
}

function formatCreatedAt(createdAt?: string) {
  if (!createdAt) return "";
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

const FILTERS: AlertFilter[] = ["all", "unread", "critical"];

export default function SystemAlertsScreen() {
  const dispatch = useDispatch<AppDispatch>();

  const { items, pagination, status, unreadCount } = useSelector(
    (state: RootState) => state.notifications
  );

  const notifications = Array.isArray(items) ? items : [];

  const [selectedFilter, setSelectedFilter] = useState<AlertFilter>("all");
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [markAllReadBusy, setMarkAllReadBusy] = useState(false);

  const loadData = useCallback(
    (page: number) => {
      dispatch(fetchParentNotificationsThunk({ page, limit: 10 }));
    },
    [dispatch]
  );

  useEffect(() => {
    loadData(1);
  }, [loadData]);

  const handleMarkAllRead = useCallback(async () => {
    if (markAllReadBusy) return;

    setMarkAllReadBusy(true);

    try {
      await dispatch(markAllParentNotificationsReadThunk()).unwrap();
    } catch {
      showErrorToast("Could not mark all notifications as read.", "Error");
    } finally {
      setMarkAllReadBusy(false);
    }
  }, [dispatch, markAllReadBusy]);

  const handleDeleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        await dispatch(
          deleteParentNotificationThunk({ notificationId })
        ).unwrap();
      } catch {
        showErrorToast("Could not delete the notification.", "Error");
      }
    },
    [dispatch]
  );

  const handleLoadMore = useCallback(async () => {
    if (
      isFetchingMore ||
      status === "loading" ||
      !pagination ||
      pagination.page >= pagination.pages
    ) {
      return;
    }

    setIsFetchingMore(true);

    await dispatch(
      fetchParentNotificationsThunk({
        page: pagination.page + 1,
        limit: 10,
      })
    );

    setIsFetchingMore(false);
  }, [dispatch, pagination, isFetchingMore, status]);

  const filteredAlerts = useMemo(() => {
    switch (selectedFilter) {
      case "unread":
        return notifications.filter((n) => !n.isRead);
      case "critical":
        return notifications.filter(
          (n) => toAlertSeverity(n.severity) === "critical"
        );
      default:
        return notifications;
    }
  }, [selectedFilter, notifications]);

  const renderHeader = () => (
    <View style={styles.container}>
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroTextWrap}>
            <AppText weight="extraBold" style={styles.heroTitle}>
              Notifications
            </AppText>

            <AppText weight="medium" style={styles.heroSubtitle}>
              Stay updated on important activity and unusual events
            </AppText>
          </View>

          <View style={styles.heroIconWrap}>
            <MaterialCommunityIcons
              name="bell-badge-outline"
              size={26}
              color="#3D5AFE"
            />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <AppText weight="extraBold" style={styles.statValue}>
              {pagination?.total || 0}
            </AppText>
            <AppText weight="medium" style={styles.statLabel}>
              Total
            </AppText>
          </View>

          <View style={styles.statCard}>
            <AppText weight="extraBold" style={styles.statValue}>
              {unreadCount}
            </AppText>
            <AppText weight="medium" style={styles.statLabel}>
              Unread
            </AppText>
          </View>

          <View style={styles.statCard}>
            <AppText weight="extraBold" style={styles.statValue}>
              {
                notifications.filter(
                  (n) => toAlertSeverity(n.severity) === "critical"
                ).length
              }
            </AppText>
            <AppText weight="medium" style={styles.statLabel}>
              Critical
            </AppText>
          </View>
        </View>
      </View>

      <AppText weight="bold" style={styles.sectionTitle}>
        Filter notifications
      </AppText>

      <View style={styles.filtersRow}>
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setSelectedFilter(f)}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${f}`}
            style={({ pressed }) => [
              styles.filterChip,
              selectedFilter === f ? styles.filterChipSelected : null,
              pressed ? styles.pressed : null,
            ]}
          >
            <AppText
              weight={selectedFilter === f ? "bold" : "medium"}
              style={[
                styles.filterChipText,
                selectedFilter === f ? styles.filterChipTextSelected : null,
              ]}
            >
              {f}
            </AppText>
          </Pressable>
        ))}
      </View>

      <View style={styles.listTitleRow}>
        <AppText weight="bold" style={styles.sectionTitle}>
          Recent notifications
        </AppText>

        {unreadCount > 0 && (
          <Pressable
            onPress={handleMarkAllRead}
            accessibilityRole="button"
            accessibilityLabel="Mark all notifications as read"
            style={({ pressed }) => [
              styles.markAllReadPressable,
              pressed ? styles.pressed : null,
            ]}
          >
            <AppText weight="bold" style={styles.markAllReadText}>
              {markAllReadBusy ? "Marking..." : "Mark all read"}
            </AppText>
          </Pressable>
        )}
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: Notification }) => {
    const severity = toAlertSeverity(item.severity);
    const palette = ALERT_COLORS[severity];
    const isUnread = !item.isRead;

    return (
      <View style={styles.alertListItemWrap}>
        <View
          style={[
            styles.alertCard,
            !isUnread && styles.alertCardRead,
          ]}
        >
          <View
            style={[styles.alertAccent, { backgroundColor: palette.accent }]}
          />

          <View style={styles.alertCardInner}>
            {isUnread ? (
              <View style={styles.alertUnreadDotRow}>
                <View style={styles.alertCardEndSpacer} />
                <View style={styles.alertTrashTrack}>
                  <View style={styles.unreadDot} />
                </View>
              </View>
            ) : null}

            <View style={styles.alertCardInnerColumn}>
              <Pressable
                onPress={() => {
                  if (!item.isRead) {
                    dispatch(
                      markParentNotificationReadThunk({
                        notificationId: String(item._id),
                      })
                    );
                  }
                }}
                accessibilityRole="button"
                accessibilityLabel={String(item.title || "Open alert")}
                style={({ pressed }) => [
                  styles.alertCardMainPressable,
                  pressed ? styles.pressed : null,
                ]}
              >
                <View
                  style={[
                    styles.alertIconWrap,
                    { backgroundColor: palette.soft },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={pickIcon(item.type, item.severity)}
                    size={21}
                    color={palette.accent}
                  />
                </View>

                <View style={styles.alertTextWrap}>
                  <View style={styles.alertHeaderRow}>
                    <AppText weight="bold" style={styles.alertTitle} numberOfLines={2}>
                      {String(item.title || "")}
                    </AppText>
                  </View>

                  <AppText weight="medium" style={styles.alertDescription}>
                    {String(item.description || "")}
                  </AppText>
                </View>
              </Pressable>

              <View style={styles.alertFooterRow}>
                <View style={styles.alertFooterMetaGroup}>
                  <View style={styles.timeBadge}>
                    <MaterialCommunityIcons
                      name="clock-time-four-outline"
                      size={14}
                      color="#64748B"
                    />
                    <AppText weight="medium" style={styles.timeText}>
                      {formatCreatedAt(item.createdAt) || "Just now"}
                    </AppText>
                  </View>

                  <View
                    style={[
                      styles.severityBadge,
                      { backgroundColor: palette.soft },
                    ]}
                  >
                    <AppText
                      weight="bold"
                      style={[styles.severityText, { color: palette.accent }]}
                    >
                      {severity}
                    </AppText>
                  </View>
                </View>

                <View style={styles.alertTrashTrack}>
                  <Pressable
                    onPress={() => handleDeleteNotification(String(item._id))}
                    accessibilityRole="button"
                    accessibilityLabel="Delete notification"
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    style={({ pressed }) => [
                      styles.alertDeleteFooter,
                      pressed ? styles.alertDeleteFooterPressed : null,
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
  };

  return (
    <ScreenLayout scrollable={false}>
      <FlatList
        data={filteredAlerts}
        renderItem={renderItem}
        keyExtractor={(item, i) =>
          item?._id ? String(item._id) : `alert-${i}`
        }
        ListHeaderComponent={renderHeader}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.25}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={status === "loading"}
            onRefresh={() => loadData(1)}
          />
        }
        ListEmptyComponent={
          status !== "loading" ? (
            <EmptyStateCard
              icon="bell-outline"
              title="No notifications yet"
              subtitle="New notifications will appear here."
            />
          ) : null
        }
      />
    </ScreenLayout>
  );
}