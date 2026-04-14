import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import EmptyStateCard from "../../../components/EmptyStateCard/EmptyStateCard";
import ChildDeviceSelector from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import { styles } from "./styles";

import type { AppDispatch, RootState } from "@/src/redux/store/types";
import { getMyChildrenThunk } from "@/src/redux/thunks/childrenThunks";
import { fetchAuditLogsThunk } from "@/src/redux/thunks/auditThunks";
import type { AuditActionType } from "@/src/api/audit";

type FilterKey = "all" | "locks" | "extensions" | "updates";

const ALL_CHILDREN_FILTER_ID = "all-children-filter";

function getActivityMeta(actionType: AuditActionType) {
  switch (actionType) {
    case "LOCK_DEVICE":
      return {
        icon: "cellphone-lock" as const,
        iconBg: "#FEE2E2",
        iconColor: "#DC2626",
      };

    case "UNLOCK_DEVICE":
      return {
        icon: "lock-open-outline" as const,
        iconBg: "#DCFCE7",
        iconColor: "#16A34A",
      };

    case "APPROVE_REQUEST":
      return {
        icon: "check-circle-outline" as const,
        iconBg: "#DCFCE7",
        iconColor: "#16A34A",
      };

    case "REJECT_REQUEST":
      return {
        icon: "close-circle-outline" as const,
        iconBg: "#FEE2E2",
        iconColor: "#DC2626",
      };

    case "UPDATE_SCREEN_TIME":
      return {
        icon: "pencil-circle-outline" as const,
        iconBg: "#EDE9FE",
        iconColor: "#7C3AED",
      };

    case "CHILD_ADDED":
      return {
        icon: "account-plus-outline" as const,
        iconBg: "#DCFCE7",
        iconColor: "#16A34A",
      };

    case "CHILD_DELETED":
      return {
        icon: "account-remove-outline" as const,
        iconBg: "#FEE2E2",
        iconColor: "#DC2626",
      };

    case "CHILD_PROFILE_UPDATED":
      return {
        icon: "account-edit-outline" as const,
        iconBg: "#EDE9FE",
        iconColor: "#7C3AED",
      };

    case "DEVICE_RENAMED":
      return {
        icon: "rename-outline" as const,
        iconBg: "#E0F2FE",
        iconColor: "#0284C7",
      };

    case "DEVICE_DELETED":
      return {
        icon: "cellphone-remove" as const,
        iconBg: "#FEE2E2",
        iconColor: "#DC2626",
      };

    case "DEVICE_ADDED":
      return {
        icon: "cellphone-link" as const,
        iconBg: "#DCFCE7",
        iconColor: "#16A34A",
      };

    default:
      return {
        icon: "history" as const,
        iconBg: "#E5E7EB",
        iconColor: "#4B5563",
      };
  }
}

function getActivityTitle(actionType: AuditActionType) {
  switch (actionType) {
    case "LOCK_DEVICE":
      return "Device locked";
    case "UNLOCK_DEVICE":
      return "Device unlocked";
    case "APPROVE_REQUEST":
      return "Request approved";
    case "REJECT_REQUEST":
      return "Request rejected";
    case "UPDATE_SCREEN_TIME":
      return "Screen time updated";
    case "CHILD_ADDED":
      return "Child added";
    case "CHILD_DELETED":
      return "Child deleted";
    case "CHILD_PROFILE_UPDATED":
      return "Child profile updated";
    case "DEVICE_RENAMED":
      return "Device renamed";
    case "DEVICE_DELETED":
      return "Device deleted";
    case "DEVICE_ADDED":
      return "Device added";
    default:
      return "Activity";
  }
}

function getActivityDescription(
  actionType: AuditActionType,
  childName: string
) {
  switch (actionType) {
    case "LOCK_DEVICE":
      return `${childName}'s device was locked`;
    case "UNLOCK_DEVICE":
      return `${childName}'s device was unlocked`;
    case "APPROVE_REQUEST":
      return `Screen time extension approved for ${childName}`;
    case "REJECT_REQUEST":
      return `Screen time extension request rejected for ${childName}`;
    case "UPDATE_SCREEN_TIME":
      return `Screen time settings updated for ${childName}`;
    case "CHILD_ADDED":
      return `A new child profile was added for ${childName}`;
    case "CHILD_DELETED":
      return `${childName}'s profile was deleted`;
    case "CHILD_PROFILE_UPDATED":
      return `${childName}'s profile details were updated`;
    case "DEVICE_RENAMED":
      return `A device name was updated for ${childName}`;
    case "DEVICE_DELETED":
      return `A device was removed from ${childName}'s profile`;
    case "DEVICE_ADDED":
      return `A device was linked to ${childName}`;
    default:
      return `A new activity was recorded for ${childName}`;
  }
}

function formatTime(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });
}

export default function ActivityHistoryScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { width } = useWindowDimensions();

  const isTablet = width >= 900;

  const {
    childrenList,
    isLoading: childrenLoading,
    error: childrenError,
  } = useSelector((state: RootState) => state.children);

  const [selectedChildId, setSelectedChildId] = useState<string>(
    ALL_CHILDREN_FILTER_ID
  );
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>("all");

  const auditLogs = useSelector((state: RootState) => {
    if (selectedChildId === ALL_CHILDREN_FILTER_ID) {
      return state.audit.logsByChildId[ALL_CHILDREN_FILTER_ID] ?? [];
    }

    return state.audit.logsByChildId[selectedChildId] ?? [];
  });

  const auditStatus = useSelector((state: RootState) => {
    if (selectedChildId === ALL_CHILDREN_FILTER_ID) {
      return state.audit.statusByChildId[ALL_CHILDREN_FILTER_ID] ?? "idle";
    }

    return state.audit.statusByChildId[selectedChildId] ?? "idle";
  });

  const auditError = useSelector((state: RootState) => {
    if (selectedChildId === ALL_CHILDREN_FILTER_ID) {
      return state.audit.errorByChildId[ALL_CHILDREN_FILTER_ID];
    }

    return state.audit.errorByChildId[selectedChildId];
  });

  useEffect(() => {
    dispatch(getMyChildrenThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAuditLogsThunk(selectedChildId));
  }, [dispatch, selectedChildId]);

  const filteredActivities = useMemo(() => {
    return auditLogs.filter((item) => {
      if (selectedFilter === "all") return true;

      if (selectedFilter === "locks") {
        return ["LOCK_DEVICE", "UNLOCK_DEVICE"].includes(item.actionType);
      }

      if (selectedFilter === "extensions") {
        return ["APPROVE_REQUEST", "REJECT_REQUEST"].includes(item.actionType);
      }

      if (selectedFilter === "updates") {
        return item.actionType === "UPDATE_SCREEN_TIME";
      }

      return true;
    });
  }, [auditLogs, selectedFilter]);

  const todayCount = filteredActivities.length;

  const lockCount = filteredActivities.filter((item) =>
    ["LOCK_DEVICE", "UNLOCK_DEVICE"].includes(item.actionType)
  ).length;

  const extensionCount = filteredActivities.filter((item) =>
    ["APPROVE_REQUEST", "REJECT_REQUEST"].includes(item.actionType)
  ).length;

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "locks", label: "Locks" },
    { key: "extensions", label: "Extensions" },
    { key: "updates", label: "Updates" },
  ];

  const hasChildren = childrenList.length > 0;
  const selectorChildId =
    selectedChildId === ALL_CHILDREN_FILTER_ID
      ? String(childrenList[0]?._id ?? "")
      : selectedChildId;

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroTitleBlock}>
                <AppText weight="extraBold" style={styles.heroTitle}>
                  Activity History
                </AppText>

                <AppText weight="medium" style={styles.heroSubtitle}>
                  A clean and professional view of recent actions across your
                  children
                </AppText>
              </View>

              <View style={styles.heroIconWrap}>
                <MaterialCommunityIcons
                  name="history"
                  size={26}
                  color="#FFFFFF"
                />
              </View>
            </View>

            <View
              style={[
                styles.summaryGrid,
                isTablet ? styles.summaryGridTablet : null,
              ]}
            >
              <View style={styles.summaryCard}>
                <AppText weight="medium" style={styles.summaryLabel}>
                  Today's events
                </AppText>

                <AppText weight="extraBold" style={styles.summaryValue}>
                  {todayCount}
                </AppText>
              </View>

              <View style={styles.summaryCard}>
                <AppText weight="medium" style={styles.summaryLabel}>
                  Locks
                </AppText>

                <AppText weight="extraBold" style={styles.summaryValue}>
                  {lockCount}
                </AppText>
              </View>

              <View style={styles.summaryCard}>
                <AppText weight="medium" style={styles.summaryLabel}>
                  Extensions
                </AppText>

                <AppText weight="extraBold" style={styles.summaryValue}>
                  {extensionCount}
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.selectorSection}>
            <AppText weight="bold" style={styles.sectionTitle}>
              Choose child
            </AppText>

            <View style={styles.filtersSection}>
              <View style={styles.filtersRow}>
                <Pressable
                  onPress={() => setSelectedChildId(ALL_CHILDREN_FILTER_ID)}
                  accessibilityRole="button"
                  accessibilityLabel="Show activity for all children"
                  style={({ pressed }) => [
                    styles.filterChip,
                    selectedChildId === ALL_CHILDREN_FILTER_ID
                      ? styles.filterChipActive
                      : null,
                    pressed ? styles.pressed : null,
                  ]}
                >
                  <AppText
                    weight={
                      selectedChildId === ALL_CHILDREN_FILTER_ID
                        ? "bold"
                        : "medium"
                    }
                    style={[
                      styles.filterChipText,
                      selectedChildId === ALL_CHILDREN_FILTER_ID
                        ? styles.filterChipTextActive
                        : null,
                    ]}
                  >
                    All children
                  </AppText>
                </Pressable>
              </View>
            </View>

            {childrenLoading ? (
              <View style={styles.emptyState}>
                <AppText weight="medium" style={styles.emptySubtitle}>
                  Loading...
                </AppText>
              </View>
            ) : childrenError ? (
              <View style={styles.emptyState}>
                <AppText weight="medium" style={styles.emptySubtitle}>
                  {childrenError}
                </AppText>
              </View>
            ) : hasChildren ? (
              <ChildDeviceSelector
                selectedChildId={selectorChildId}
                onSelectChild={(childId) => setSelectedChildId(childId)}
                showDevices={false}
              />
            ) : (
              <EmptyStateCard
                icon="account-child-outline"
                title="No children yet"
                subtitle="There are no children linked to this account yet."
              />
            )}
          </View>

          <View style={styles.filtersSection}>
            <AppText weight="bold" style={styles.sectionTitle}>
              Filter activity
            </AppText>

            <View style={styles.filtersRow}>
              {filters.map((filter) => {
                const active = filter.key === selectedFilter;

                return (
                  <Pressable
                    key={filter.key}
                    onPress={() => setSelectedFilter(filter.key)}
                    accessibilityRole="button"
                    accessibilityLabel={`Filter by ${filter.label}`}
                    style={({ pressed }) => [
                      styles.filterChip,
                      active ? styles.filterChipActive : null,
                      pressed ? styles.pressed : null,
                    ]}
                  >
                    <AppText
                      weight={active ? "bold" : "medium"}
                      style={[
                        styles.filterChipText,
                        active ? styles.filterChipTextActive : null,
                      ]}
                    >
                      {filter.label}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.listSection}>
            <View style={styles.listHeaderRow}>
              <AppText weight="bold" style={styles.sectionTitle}>
                Recent activity
              </AppText>

              <AppText weight="medium" style={styles.resultCount}>
                {filteredActivities.length} results
              </AppText>
            </View>

            {auditStatus === "loading" ? (
              <View style={styles.emptyState}>
                <AppText weight="medium" style={styles.emptySubtitle}>
                  Loading...
                </AppText>
              </View>
            ) : auditError ? (
              <View style={styles.emptyState}>
                <AppText weight="medium" style={styles.emptySubtitle}>
                  {auditError}
                </AppText>
              </View>
            ) : filteredActivities.length === 0 ? (
              <EmptyStateCard
                icon="clipboard-text-clock-outline"
                title="No activity yet"
                subtitle="Try selecting another child or changing the filter."
              />
            ) : (
              filteredActivities.map((item) => {
                const child = childrenList.find(
                  (c) => String(c._id) === String(item.childId)
                );

                const childName = child?.name ?? "Child";
                const meta = getActivityMeta(item.actionType);
                const title = getActivityTitle(item.actionType);
                const description = getActivityDescription(
                  item.actionType,
                  childName
                );
                const time = formatTime(item.createdAt);
                const date = formatDate(item.createdAt);
                return (
                  <Pressable
                    key={item._id}
                    accessibilityRole="button"
                    accessibilityLabel={`${title}, child: ${childName}, time: ${time}`}
                    style={({ pressed }) => [
                      styles.activityCard,
                      pressed ? styles.pressed : null,
                    ]}
                  >
                    <View style={styles.activityTopRow}>
                      <View style={styles.activityMainContent}>
                        <View
                          style={[
                            styles.activityTitleRow,
                            styles.activityTitleRowSpacing,
                          ]}
                        >
                          <View
                            style={[
                              styles.activityIconCircle,
                              { backgroundColor: meta.iconBg },
                            ]}
                          >
                            <MaterialCommunityIcons
                              name={meta.icon}
                              size={22}
                              color={meta.iconColor}
                            />
                          </View>

                          <View style={styles.activityTextWrap}>
                            <AppText
                              weight="bold"
                              style={styles.activityTitle}
                            >
                              {title}
                            </AppText>

                            <AppText
                              weight="medium"
                              style={styles.activityDescription}
                            >
                              {description}
                            </AppText>
                          </View>
                        </View>
                      </View>

                      <View style={styles.timeWrap}>
                        <AppText weight="bold" style={styles.timeText}>
                          {time}
                        </AppText>

                        <AppText weight="medium" style={styles.timeText}>
                          {date}
                        </AppText>
                      </View>
                    </View>
                  </Pressable>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}