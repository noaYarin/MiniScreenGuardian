import React, { useMemo, useState } from "react";
import { View, ScrollView, Pressable, useWindowDimensions } from "react-native";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import ChildDeviceSelector, {
  type ChildOption,
} from "../../../components/ChildDeviceSelector/ChildDeviceSelector";

import { styles } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

type RoutineBlock = {
  id: string;
  dayKey:
    | "sunday"
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday";
  startHour: number;
  endHour: number;
  titleKey: string;
};

type PresetChip = {
  id: string;
  labelKey: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
};

const STATIC_CHILDREN: ChildOption[] = [
  {
    id: "noa",
    name: "נועה",
    initial: "נ",
    accent: "#19C2A0",
    devices: [
      {
        id: "phone",
        type: "phone",
        name: "iPhone 14",
        icon: "cellphone",
      },
      {
        id: "tablet",
        type: "tablet",
        name: "iPad Air",
        icon: "tablet-dashboard",
      },
    ],
  },
  {
    id: "yonatan",
    name: "יונתן",
    initial: "י",
    accent: "#7A97FF",
    devices: [
      {
        id: "phone",
        type: "phone",
        name: "Galaxy S23",
        icon: "cellphone",
      },
    ],
  },
  {
    id: "tamar",
    name: "תמר",
    initial: "ת",
    accent: "#D96AD9",
    devices: [
      {
        id: "tablet",
        type: "tablet",
        name: "Lenovo Tab",
        icon: "tablet-dashboard",
      },
    ],
  },
];

const DAYS: Array<{
  key: RoutineBlock["dayKey"];
  shortKey: string;
}> = [
  { key: "sunday", shortKey: "routineLimits.daysShort.sunday" },
  { key: "monday", shortKey: "routineLimits.daysShort.monday" },
  { key: "tuesday", shortKey: "routineLimits.daysShort.tuesday" },
  { key: "wednesday", shortKey: "routineLimits.daysShort.wednesday" },
  { key: "thursday", shortKey: "routineLimits.daysShort.thursday" },
  { key: "friday", shortKey: "routineLimits.daysShort.friday" },
  { key: "saturday", shortKey: "routineLimits.daysShort.saturday" },
];

const TIME_SLOTS = [8, 12, 16, 20];

const STATIC_BLOCKS: RoutineBlock[] = [
  {
    id: "1",
    dayKey: "sunday",
    startHour: 8,
    endHour: 12,
    titleKey: "routineLimits.blockTitles.schoolMorning",
  },
  {
    id: "2",
    dayKey: "sunday",
    startHour: 16,
    endHour: 20,
    titleKey: "routineLimits.blockTitles.afternoonLock",
  },
  {
    id: "3",
    dayKey: "monday",
    startHour: 20,
    endHour: 24,
    titleKey: "routineLimits.blockTitles.sleepTime",
  },
  {
    id: "4",
    dayKey: "tuesday",
    startHour: 8,
    endHour: 12,
    titleKey: "routineLimits.blockTitles.studyWindow",
  },
  {
    id: "5",
    dayKey: "thursday",
    startHour: 8,
    endHour: 12,
    titleKey: "routineLimits.blockTitles.schoolMorning",
  },
  {
    id: "6",
    dayKey: "friday",
    startHour: 12,
    endHour: 16,
    titleKey: "routineLimits.blockTitles.familyTime",
  },
  {
    id: "7",
    dayKey: "saturday",
    startHour: 16,
    endHour: 20,
    titleKey: "routineLimits.blockTitles.familyTime",
  },
];

const PRESET_CHIPS: PresetChip[] = [
  {
    id: "school",
    labelKey: "routineLimits.presets.schoolHours",
    icon: "school-outline",
  },
  {
    id: "sleep",
    labelKey: "routineLimits.presets.sleep",
    icon: "sleep",
  },
  {
    id: "homework",
    labelKey: "routineLimits.presets.homework",
    icon: "book-open-page-variant-outline",
  },
  {
    id: "family",
    labelKey: "routineLimits.presets.family",
    icon: "account-group-outline",
  },
];

export default function routineLimitsScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
const { isRTL, row, text } = useLocaleLayout();
  const isTablet = width >= 900;

  const [selectedChildId, setSelectedChildId] = useState("noa");
  const [selectedDeviceId, setSelectedDeviceId] = useState("phone");
  const [selectedPresetId, setSelectedPresetId] = useState("sleep");

  const selectedChild = useMemo(() => {
    return STATIC_CHILDREN.find((child) => child.id === selectedChildId) ?? STATIC_CHILDREN[0];
  }, [selectedChildId]);

  const selectedDevice = useMemo(() => {
    return (
      selectedChild?.devices.find((device) => device.id === selectedDeviceId) ??
      selectedChild?.devices[0]
    );
  }, [selectedChild, selectedDeviceId]);

  const stats = useMemo(() => {
    const totalLockedHours = STATIC_BLOCKS.reduce(
      (sum, block) => sum + (block.endHour - block.startHour),
      0
    );

    const activeDays = new Set(STATIC_BLOCKS.map((block) => block.dayKey)).size;

    return {
      totalLockedHours,
      activeDays,
      totalRules: STATIC_BLOCKS.length,
    };
  }, []);

  const onSelectChild = (childId: string) => {
    setSelectedChildId(childId);

    const nextChild = STATIC_CHILDREN.find((child) => child.id === childId);
    const firstDeviceId = nextChild?.devices[0]?.id ?? "";
    setSelectedDeviceId(firstDeviceId);

    // SERVER INTEGRATION:
    // Fetch weekly routine data for the selected child and its default device.
    // Example:
    // dispatch(getroutineLimitsThunk({ childId, deviceId: firstDeviceId }));
  };

  const onSelectDevice = (deviceId: string) => {
    setSelectedDeviceId(deviceId);

    // SERVER INTEGRATION:
    // Fetch weekly routine data for the selected child and selected device.
    // Example:
    // dispatch(getroutineLimitsThunk({ childId: selectedChildId, deviceId }));
  };

  const renderCell = (
    dayKey: RoutineBlock["dayKey"],
    slotHour: number,
    dayIndex: number
  ) => {
    const block = STATIC_BLOCKS.find(
      (item) =>
        item.dayKey === dayKey &&
        slotHour >= item.startHour &&
        slotHour < item.endHour
    );

    const isActive = block !== undefined;

    return (
      <Pressable
        key={`${dayKey}-${slotHour}`}
        accessibilityRole="button"
        accessibilityLabel={t("routineLimits.a11y.gridCell", {
          day: t(DAYS[dayIndex].shortKey),
          time: `${slotHour}:00`,
          state: isActive
            ? t("routineLimits.legend.locked")
            : t("routineLimits.legend.open"),
        })}
        style={[
          styles.gridCell,
          isActive ? styles.gridCellActive : styles.gridCellInactive,
          isTablet && styles.gridCellTablet,
        ]}
        onPress={() => {
          // STATIC DEMO:
          // This is static for now.

          // SERVER INTEGRATION:
          // Open create/edit flow for this day and time slot.
        }}
      >
        {block ? (
          <View style={styles.gridCellInner}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={16}
              color="#FFFFFF"
            />
            <AppText weight="bold" style={styles.gridCellText}>
              {t(block.titleKey)}
            </AppText>
          </View>
        ) : null}
      </Pressable>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t("routineLimits.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />

      <ScreenLayout>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <LinearGradient
              colors={["#4C6FFF", "#65B7FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              <View style={[styles.heroTopRow, row]}>
                <View style={styles.heroTextWrap}>
                  <AppText weight="extraBold" style={[styles.heroTitle, text]}>
                    {t("routineLimits.hero.title")}
                  </AppText>

                  <AppText weight="medium" style={[styles.heroSubtitle, text]}>
                    {t("routineLimits.hero.subtitle")}
                  </AppText>
                </View>

                <View style={styles.heroIconBadge}>
                  <MaterialCommunityIcons
                    name="calendar-lock-outline"
                    size={28}
                    color="#FFFFFF"
                  />
                </View>
              </View>
            </LinearGradient>

            <ChildDeviceSelector
              childrenOptions={STATIC_CHILDREN}
              selectedChildId={selectedChildId}
              selectedDeviceId={selectedDeviceId}
              onSelectChild={onSelectChild}
              onSelectDevice={onSelectDevice}
              childCardWidth={isTablet ? 170 : 138}
            />

            <View style={styles.sectionCard}>
              <View style={[styles.sectionHeaderRow, row]}>
                <View style={styles.sectionTitleWrap}>
                  <AppText weight="extraBold" style={[styles.sectionTitle, text]}>
                    {t("routineLimits.overview.title")}
                  </AppText>

                  <AppText weight="medium" style={[styles.sectionSubtitle, text]}>
                    {t("routineLimits.overview.subtitle", {
                      childName: selectedChild?.name ?? "",
                      deviceName: selectedDevice?.name ?? "",
                    })}
                  </AppText>
                </View>

                <View style={styles.sectionIcon}>
                  <MaterialCommunityIcons
                    name="timeline-clock-outline"
                    size={22}
                    color="#4C6FFF"
                  />
                </View>
              </View>

              <View style={[styles.statsRow, isTablet && styles.statsRowTablet]}>
                <View style={styles.statCard}>
                  <AppText weight="medium" style={[styles.statLabel, text]}>
                    {t("routineLimits.stats.rules")}
                  </AppText>
                  <AppText weight="extraBold" style={[styles.statValue, text]}>
                    {stats.totalRules}
                  </AppText>
                </View>

                <View style={styles.statCard}>
                  <AppText weight="medium" style={[styles.statLabel, text]}>
                    {t("routineLimits.stats.lockedHours")}
                  </AppText>
                  <AppText weight="extraBold" style={[styles.statValue, text]}>
                    {stats.totalLockedHours}
                  </AppText>
                </View>

                <View style={styles.statCard}>
                  <AppText weight="medium" style={[styles.statLabel, text]}>
                    {t("routineLimits.stats.activeDays")}
                  </AppText>
                  <AppText weight="extraBold" style={[styles.statValue, text]}>
                    {stats.activeDays}
                  </AppText>
                </View>
              </View>
            </View>

            <View style={styles.sectionCard}>
              <View style={[styles.sectionHeaderRow, row]}>
                <View style={styles.sectionTitleWrap}>
                  <AppText weight="extraBold" style={[styles.sectionTitle, text]}>
                    {t("routineLimits.scheduler.title")}
                  </AppText>

                  <AppText weight="medium" style={[styles.sectionSubtitle, text]}>
                    {t("routineLimits.scheduler.subtitle")}
                  </AppText>
                </View>

                <View style={styles.sectionIcon}>
                  <MaterialCommunityIcons
                    name="calendar-week-outline"
                    size={22}
                    color="#4C6FFF"
                  />
                </View>
              </View>

              <View style={styles.legendRow}>
                <View style={[styles.legendItem, row]}>
                  <View style={[styles.legendDot, styles.legendDotActive]} />
                  <AppText weight="medium" style={[styles.legendText, text]}>
                    {t("routineLimits.legend.locked")}
                  </AppText>
                </View>

                <View style={[styles.legendItem, row]}>
                  <View style={[styles.legendDot, styles.legendDotInactive]} />
                  <AppText weight="medium" style={[styles.legendText, text]}>
                    {t("routineLimits.legend.open")}
                  </AppText>
                </View>
              </View>

              <View style={styles.gridShell}>
                <View style={[styles.gridHeaderRow, row]}>
                  {DAYS.map((day) => (
                    <View key={day.key} style={styles.dayHeaderCell}>
                      <AppText weight="bold" style={[styles.dayHeaderText, text]}>
                        {t(day.shortKey)}
                      </AppText>
                    </View>
                  ))}

                  <View style={styles.timeAxisSpacer} />
                </View>

                {TIME_SLOTS.map((slotHour) => (
                  <View
                    key={slotHour}
                    style={[styles.gridRow, row, isTablet && styles.gridRowTablet]}
                  >
                    {DAYS.map((day, dayIndex) =>
                      renderCell(day.key, slotHour, dayIndex)
                    )}

                    <View style={styles.timeAxisCell}>
                      <AppText weight="bold" style={styles.timeAxisText}>
                        {`${slotHour}:00`}
                      </AppText>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.sectionCard}>
              <View style={[styles.sectionHeaderRow, row]}>
                <View style={styles.sectionTitleWrap}>
                  <AppText weight="extraBold" style={[styles.sectionTitle, text]}>
                    {t("routineLimits.presetsSection.title")}
                  </AppText>

                  <AppText weight="medium" style={[styles.sectionSubtitle, text]}>
                    {t("routineLimits.presetsSection.subtitle")}
                  </AppText>
                </View>

                <View style={styles.sectionIcon}>
                  <MaterialCommunityIcons
                    name="creation-outline"
                    size={22}
                    color="#4C6FFF"
                  />
                </View>
              </View>

<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={[
    styles.presetsScrollContent,
    isRTL ? styles.presetsScrollContentRtl : styles.presetsScrollContentLtr,
  ]}
>
  {PRESET_CHIPS.map((chip) => {
    const isSelected = chip.id === selectedPresetId;

    return (
      <Pressable
        key={chip.id}
        accessibilityRole="button"
        accessibilityLabel={t("routineLimits.a11y.selectPreset", {
          name: t(chip.labelKey),
        })}
        style={({ pressed }) => [
          styles.presetChip,
          row,
          isSelected && styles.presetChipSelected,
          pressed ? styles.pressed : null,
        ]}
        onPress={() => {
          setSelectedPresetId(chip.id);

          // STATIC DEMO:
          // Only the selected preset UI changes for now.

          // SERVER INTEGRATION:
          // Later this can prefill the routine form.
        }}
      >
        <View
          style={[
            styles.presetIconWrap,
            isSelected && styles.presetIconWrapSelected,
          ]}
        >
          <MaterialCommunityIcons
            name={chip.icon}
            size={18}
            color={isSelected ? "#FFFFFF" : "#3D6BF2"}
          />
        </View>

        <View style={styles.presetTextWrap}>
          <AppText
            weight={isSelected ? "bold" : "medium"}
            style={[
              styles.presetChipText,
              text,
              isSelected && styles.presetChipTextSelected,
            ]}
          >
            {t(chip.labelKey)}
          </AppText>
        </View>
      </Pressable>
    );
  })}
</ScrollView>
            </View>

            <View style={styles.sectionCard}>
              <View style={[styles.sectionHeaderRow, row]}>
                <View style={styles.sectionTitleWrap}>
                  <AppText weight="extraBold" style={[styles.sectionTitle, text]}>
                    {t("routineLimits.form.title")}
                  </AppText>

                  <AppText weight="medium" style={[styles.sectionSubtitle, text]}>
                    {t("routineLimits.form.subtitle")}
                  </AppText>
                </View>

                <View style={styles.sectionIcon}>
                  <MaterialCommunityIcons
                    name="playlist-plus"
                    size={22}
                    color="#4C6FFF"
                  />
                </View>
              </View>

              <View style={styles.formCard}>
                <View style={styles.inputMock}>
                  <AppText weight="medium" style={[styles.inputLabel, text]}>
                    {t("routineLimits.form.ruleName")}
                  </AppText>
                  <AppText weight="bold" style={[styles.inputValue, text]}>
                    {t("routineLimits.formValues.sleepRoutine")}
                  </AppText>
                </View>

                <View style={[styles.inlineTwoCols, isTablet && styles.inlineTwoColsTablet]}>
                  <View style={styles.inputMock}>
                    <AppText weight="medium" style={[styles.inputLabel, text]}>
                      {t("routineLimits.form.start")}
                    </AppText>
                    <AppText weight="bold" style={[styles.inputValue, text]}>
                      {t("routineLimits.formValues.startValue")}
                    </AppText>
                  </View>

                  <View style={styles.inputMock}>
                    <AppText weight="medium" style={[styles.inputLabel, text]}>
                      {t("routineLimits.form.end")}
                    </AppText>
                    <AppText weight="bold" style={[styles.inputValue, text]}>
                      {t("routineLimits.formValues.endValue")}
                    </AppText>
                  </View>
                </View>

                <View style={styles.inputMock}>
                  <AppText weight="medium" style={[styles.inputLabel, text]}>
                    {t("routineLimits.form.repeat")}
                  </AppText>
                  <AppText weight="bold" style={[styles.inputValue, text]}>
                    {t("routineLimits.formValues.weekdays")}
                  </AppText>
                </View>

                <View style={styles.infoBanner}>
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={18}
                    color="#4C6FFF"
                  />
                  <AppText weight="medium" style={[styles.infoBannerText, text]}>
                    {t("routineLimits.form.hint")}
                  </AppText>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t("routineLimits.a11y.addRoutine")}
                  style={styles.primaryButton}
                  onPress={() => {
                    // STATIC DEMO:
                    // No real submit yet.

                    // SERVER INTEGRATION:
                    // Send create routine request here.
                    // Example payload:
                    // {
                    //   childId: selectedChildId,
                    //   deviceId: selectedDeviceId,
                    //   name: "...",
                    //   days: [...],
                    //   startHour: ...,
                    //   endHour: ...,
                    // }
                  }}
                >
                  <MaterialCommunityIcons
                    name="plus-circle-outline"
                    size={18}
                    color="#FFFFFF"
                  />
                  <AppText weight="extraBold" style={styles.primaryButtonText}>
                    {t("routineLimits.form.addButton")}
                  </AppText>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </ScreenLayout>
    </>
  );
}