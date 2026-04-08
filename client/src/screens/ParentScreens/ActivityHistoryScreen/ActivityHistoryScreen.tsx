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
import ChildDeviceSelector from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import { styles } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

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

    default:
      return {
        icon: "history" as const,
        iconBg: "#E5E7EB",
        iconColor: "#4B5563",
      };
  }
}

function getActivityTitleKey(actionType: AuditActionType) {
  switch (actionType) {
    case "LOCK_DEVICE":
      return "activityHistory.items.lockDevice.title";
    case "UNLOCK_DEVICE":
      return "activityHistory.items.unlockDevice.title";
    case "APPROVE_REQUEST":
      return "activityHistory.items.approveRequest.title";
    case "REJECT_REQUEST":
      return "activityHistory.items.rejectRequest.title";
    case "UPDATE_SCREEN_TIME":
      return "activityHistory.items.updateScreenTime.title";
    default:
      return "activityHistory.items.default.title";
  }
}

function getActivityDescriptionKey(actionType: AuditActionType) {
  switch (actionType) {
    case "LOCK_DEVICE":
      return "activityHistory.items.lockDevice.description";
    case "UNLOCK_DEVICE":
      return "activityHistory.items.unlockDevice.description";
    case "APPROVE_REQUEST":
      return "activityHistory.items.approveRequest.description";
    case "REJECT_REQUEST":
      return "activityHistory.items.rejectRequest.description";
    case "UPDATE_SCREEN_TIME":
      return "activityHistory.items.updateScreenTime.description";
    default:
      return "activityHistory.items.default.description";
  }
}

function formatTime(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ActivityHistoryScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { row, text, isRTL } = useLocaleLayout();

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

  const auditLogs = useSelector(
    (state: RootState) => state.audit.logsByChildId[selectedChildId] ?? []
  );

  const auditStatus = useSelector(
    (state: RootState) =>
      state.audit.statusByChildId[selectedChildId] ?? "idle"
  );

  const auditError = useSelector(
    (state: RootState) => state.audit.errorByChildId[selectedChildId]
  );

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
        return ["UPDATE_SCREEN_TIME"].includes(item.actionType);
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

  const filters: { key: FilterKey; labelKey: string }[] = [
    { key: "all", labelKey: "activityHistory.filters.all" },
    { key: "locks", labelKey: "activityHistory.filters.locks" },
    { key: "extensions", labelKey: "activityHistory.filters.extensions" },
    { key: "updates", labelKey: "activityHistory.filters.updates" },
  ];

  const hasChildren = childrenList.length > 0;
  const shouldShowChildSelector =
    hasChildren && selectedChildId !== ALL_CHILDREN_FILTER_ID;

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.heroCard}>
            <View style={[styles.heroTopRow, row]}>
              <View style={styles.heroTitleBlock}>
                <AppText weight="extraBold" style={[styles.heroTitle, text]}>
                  {t("activityHistory.heading")}
                </AppText>

                <AppText weight="medium" style={[styles.heroSubtitle, text]}>
                  {t("activityHistory.subtitle")}
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
                <AppText weight="medium" style={[styles.summaryLabel, text]}>
                  {t("activityHistory.summary.today")}
                </AppText>

                <AppText weight="extraBold" style={[styles.summaryValue, text]}>
                  {todayCount}
                </AppText>
              </View>

              <View style={styles.summaryCard}>
                <AppText weight="medium" style={[styles.summaryLabel, text]}>
                  {t("activityHistory.summary.locks")}
                </AppText>

                <AppText weight="extraBold" style={[styles.summaryValue, text]}>
                  {lockCount}
                </AppText>
              </View>

              <View style={styles.summaryCard}>
                <AppText weight="medium" style={[styles.summaryLabel, text]}>
                  {t("activityHistory.summary.extensions")}
                </AppText>

                <AppText weight="extraBold" style={[styles.summaryValue, text]}>
                  {extensionCount}
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.selectorSection}>
            <AppText weight="bold" style={[styles.sectionTitle, text]}>
              {t("activityHistory.childSectionTitle", "Children")}
            </AppText>

            <View style={styles.filtersSection}>
              <View
                style={[
                  styles.filtersRow,
                  isRTL ? styles.filtersRowRtl : styles.filtersRowLtr,
                ]}
              >
                <Pressable
                  onPress={() => setSelectedChildId(ALL_CHILDREN_FILTER_ID)}
                  accessibilityRole="button"
                  accessibilityLabel={t(
                    "activityHistory.allChildren",
                    "All children"
                  )}
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
                      text,
                      selectedChildId === ALL_CHILDREN_FILTER_ID
                        ? styles.filterChipTextActive
                        : null,
                    ]}
                  >
                    {t("activityHistory.allChildren", "All children")}
                  </AppText>
                </Pressable>
              </View>
            </View>

            {childrenLoading ? (
              <View style={styles.emptyState}>
                <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                  {t("common.loading", "Loading...")}
                </AppText>
              </View>
            ) : childrenError ? (
              <View style={styles.emptyState}>
                <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                  {t(childrenError, childrenError)}
                </AppText>
              </View>
            ) : hasChildren ? (
              <ChildDeviceSelector
                selectedChildId={
                  shouldShowChildSelector
                    ? selectedChildId
                    : String(childrenList[0]?._id ?? "")
                }
                onSelectChild={(childId) => setSelectedChildId(childId)}
                showDevices={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconWrap}>
                  <MaterialCommunityIcons
                    name="account-child-outline"
                    size={26}
                    color="#4F46E5"
                  />
                </View>

                <AppText weight="bold" style={[styles.emptyTitle, text]}>
                  {t(
                    "activityHistory.empty.noChildrenTitle",
                    "No children found"
                  )}
                </AppText>

                <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                  {t(
                    "activityHistory.empty.noChildrenSubtitle",
                    "There are no children linked to this account yet."
                  )}
                </AppText>
              </View>
            )}
          </View>

          <View style={styles.filtersSection}>
            <AppText weight="bold" style={[styles.sectionTitle, text]}>
              {t("activityHistory.filterTitle")}
            </AppText>

            <View
              style={[
                styles.filtersRow,
                isRTL ? styles.filtersRowRtl : styles.filtersRowLtr,
              ]}
            >
              {filters.map((filter) => {
                const active = filter.key === selectedFilter;

                return (
                  <Pressable
                    key={filter.key}
                    onPress={() => setSelectedFilter(filter.key)}
                    accessibilityRole="button"
                    accessibilityLabel={t(filter.labelKey)}
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
                        text,
                        active ? styles.filterChipTextActive : null,
                      ]}
                    >
                      {t(filter.labelKey)}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.listSection}>
            <View style={[styles.listHeaderRow, row]}>
              <AppText weight="bold" style={[styles.sectionTitle, text]}>
                {t("activityHistory.activityListTitle")}
              </AppText>

              <AppText weight="medium" style={[styles.resultCount, text]}>
                {t("activityHistory.resultCount", {
                  count: filteredActivities.length,
                })}
              </AppText>
            </View>

            {auditStatus === "loading" ? (
              <View style={styles.emptyState}>
                <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                  {t("common.loading", "Loading...")}
                </AppText>
              </View>
            ) : auditError ? (
              <View style={styles.emptyState}>
                <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                  {t(auditError, auditError)}
                </AppText>
              </View>
            ) : filteredActivities.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconWrap}>
                  <MaterialCommunityIcons
                    name="clipboard-text-clock-outline"
                    size={26}
                    color="#4F46E5"
                  />
                </View>

                <AppText weight="bold" style={[styles.emptyTitle, text]}>
                  {t("activityHistory.empty.title")}
                </AppText>

                <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                  {t("activityHistory.empty.subtitle")}
                </AppText>
              </View>
            ) : (
              filteredActivities.map((item) => {
                const child = childrenList.find(
                  (c) => String(c._id) === String(item.childId)
                );
                const meta = getActivityMeta(item.actionType);
                const titleKey = getActivityTitleKey(item.actionType);
                const descriptionKey = getActivityDescriptionKey(
                  item.actionType
                );
                const time = formatTime(item.createdAt);

                return (
                  <Pressable
                    key={item._id}
                    accessibilityRole="button"
                    accessibilityLabel={t("activityHistory.activityCardA11y", {
                      title: t(titleKey),
                      childName: child?.name ?? "",
                      time,
                    })}
                    style={({ pressed }) => [
                      styles.activityCard,
                      pressed ? styles.pressed : null,
                    ]}
                  >
                    <View style={[styles.activityTopRow, row]}>
                      <View style={styles.activityMainContent}>
                        <View
                          style={[
                            styles.activityTitleRow,
                            row,
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
                              style={[styles.activityTitle, text]}
                            >
                              {t(titleKey)}
                            </AppText>

                            <AppText
                              weight="medium"
                              style={[styles.activityDescription, text]}
                            >
                              {t(descriptionKey, {
                                childName: child?.name ?? "",
                              })}
                            </AppText>
                          </View>
                        </View>
                      </View>

                      <View style={styles.timeWrap}>
                        <AppText weight="bold" style={styles.timeText}>
                          {time}
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