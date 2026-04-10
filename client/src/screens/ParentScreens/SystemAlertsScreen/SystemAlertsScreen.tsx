import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles, ALERT_COLORS } from "./styles";

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

function pickIcon(type: string, severity: string) {
  const t = String(type || "").toUpperCase();
  switch (t) {
    case "DEVICE_LOCKED": return "lock-outline";
    case "DEVICE_UNLOCKED": return "lock-open-outline";
    case "EXTENSION_REQUEST_APPROVED": return "check-decagram-outline";
    case "EXTENSION_REQUEST_REJECTED": return "close-octagon-outline";
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

  const { items, pagination, status, error, unreadCount } = useSelector(
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
    setMarkAllReadBusy(true);
    try {
      await dispatch(markAllParentNotificationsReadThunk()).unwrap();
    } catch {
      showAppToast("Could not mark all notifications as read");
    } finally {
      setMarkAllReadBusy(false);
    }
  }, [dispatch]);

  const handleDeleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        await dispatch(deleteParentNotificationThunk({ notificationId })).unwrap();
      } catch {
        showAppToast("Could not delete the notification");
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
    )
      return;

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
              System Alerts
            </AppText>
            <AppText weight="medium" style={styles.heroSubtitle}>
              Track important updates and unusual activity
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
        Filter Alerts
      </AppText>

      <View style={styles.filtersRow}>
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setSelectedFilter(f)}
            style={[
              styles.filterChip,
              selectedFilter === f && styles.filterChipSelected,
            ]}
          >
            <AppText
              weight={selectedFilter === f ? "bold" : "medium"}
              style={[
                styles.filterChipText,
                selectedFilter === f && styles.filterChipTextSelected,
              ]}
            >
              {f}
            </AppText>
          </Pressable>
        ))}
      </View>

      <View style={styles.listTitleRow}>
        <AppText weight="bold" style={styles.sectionTitle}>
          Recent Alerts
        </AppText>

        {unreadCount > 0 && (
          <Pressable onPress={handleMarkAllRead}>
            <AppText weight="bold" style={styles.markAllReadText}>
              Mark all read
            </AppText>
          </Pressable>
        )}
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: Notification }) => {
    const severity = toAlertSeverity(item.severity);
    const palette = ALERT_COLORS[severity];

    return (
      <View style={styles.alertListItemWrap}>
        <View style={styles.alertCard}>
          <View
            style={[styles.alertAccent, { backgroundColor: palette.accent }]}
          />

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
            style={styles.alertCardMainPressable}
          >
            <View
              style={[
                styles.alertIconWrap,
                { backgroundColor: palette.soft },
              ]}
            >
              <MaterialCommunityIcons
                name={pickIcon(item.type, item.severity)}
                size={20}
                color={palette.accent}
              />
            </View>

            <View style={styles.alertTextWrap}>
              <AppText weight="bold" style={styles.alertTitle}>
                {String(item.title || "")}
              </AppText>

              <AppText weight="medium" style={styles.alertDescription}>
                {String(item.description || "")}
              </AppText>
            </View>
          </Pressable>
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
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={status === "loading"}
            onRefresh={() => loadData(1)}
          />
        }
        ListEmptyComponent={
          status !== "loading" ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="bell-outline"
                size={28}
                color="#9CA3AF"
              />
              <AppText weight="bold" style={styles.emptyTitle}>
                No alerts to display
              </AppText>
              <AppText weight="medium" style={styles.emptySubtitle}>
                New alerts will appear here
              </AppText>
            </View>
          ) : null
        }
      />
    </ScreenLayout>
  );
}