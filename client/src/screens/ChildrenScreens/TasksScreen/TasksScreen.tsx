import React, { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

const ICON = {
  coin: "cash-multiple",
  check: "check",
  camera: "camera-outline",
} as const;

type Task = {
  id: string;
  title: string;
  coins: number;
  done: boolean;
};

export default function TasksScreen() {
  const { t } = useTranslation();
  const { row, text, isRTL } = useLocaleLayout();

  const [activeTab, setActiveTab] = useState<"done" | "todo">("done");

  const tasks: Task[] = [
    { id: "1", title: t("tasks.clean_room"), coins: 15, done: true },
    { id: "2", title: t("tasks.read_book"), coins: 10, done: true },
    { id: "3", title: t("tasks.tidy_room"), coins: 10, done: false },
    { id: "4", title: t("tasks.walk_dog"), coins: 8, done: false },
    { id: "5", title: t("tasks.help_table"), coins: 12, done: false },
  ];

  const filteredTasks =
    activeTab === "done"
      ? tasks.filter((x) => x.done)
      : tasks.filter((x) => !x.done);

  return (
    <>
      <Stack.Screen
        options={{
          title: t("tasks.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />

      <ScreenLayout>
        <View style={styles.container}>
          <View style={styles.contentMaxWidth}>
            <View style={[styles.tabsWrapper, row]}>
              <Pressable
                style={[
                  styles.tabBtn,
                  activeTab === "todo" ? styles.activeTab : styles.inactiveTab,
                ]}
                onPress={() => setActiveTab("todo")}
                accessibilityRole="button"
                accessibilityLabel={t("tasks.todo_a11y")}
              >
                <AppText weight="extraBold" style={styles.tabText}>
                  {t("tasks.todo")}
                </AppText>
              </Pressable>

              <Pressable
                style={[
                  styles.tabBtn,
                  activeTab === "done" ? styles.activeTab : styles.inactiveTab,
                ]}
                onPress={() => setActiveTab("done")}
                accessibilityRole="button"
                accessibilityLabel={t("tasks.done_a11y")}
              >
                <AppText weight="extraBold" style={styles.tabText}>
                  {t("tasks.done")}
                </AppText>
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            >
              {filteredTasks.map((task) => (
                <View key={task.id} style={styles.card}>
                  <View style={[styles.cardHeader, row]}>
                    <AppText
                      weight="extraBold"
                      style={[styles.taskTitle, text]}
                      numberOfLines={2}
                    >
                      {task.title}
                    </AppText>

                    <View style={[styles.coinsBadge, row]}>
                      <MaterialCommunityIcons
                        name={ICON.coin}
                        size={18}
                        color="#B46B00"
                      />
                      <AppText weight="extraBold" style={styles.coinsText}>
                        {task.coins}
                      </AppText>
                    </View>
                  </View>

                  {task.done ? (
                    <View style={[styles.statusBoxDone, row]}>
                      <View
                        style={[
                          styles.statusIconCircle,
                          styles.statusIconCircleDone,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={ICON.check}
                          size={18}
                          color="#0F8A5F"
                        />
                      </View>

                      <AppText
                        weight="bold"
                        style={[styles.statusTextDone, text]}
                      >
                        {t("tasks.completed")}
                      </AppText>
                    </View>
                  ) : (
                    <View style={styles.todoArea}>
                      <AppText style={[styles.todoHint, text]}>
                        {t("tasks.not_uploaded")}
                      </AppText>

                      <Pressable
                        style={[
                          styles.uploadBtn,
                          isRTL ? styles.uploadBtnRtl : styles.uploadBtnLtr,
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={t("tasks.upload_a11y")}
                      >
                        <View style={[styles.uploadBtnInner, row]}>
                          <View
                            style={[
                              styles.statusIconCircle,
                              styles.statusIconCircleUpload,
                            ]}
                          >
                            <MaterialCommunityIcons
                              name={ICON.camera}
                              size={18}
                              color="#2F6DEB"
                            />
                          </View>

                          <AppText weight="extraBold" style={styles.uploadText}>
                            {t("tasks.upload")}
                          </AppText>
                        </View>
                      </Pressable>
                    </View>
                  )}
                </View>
              ))}

              <View style={styles.weekBox}>
                <View style={[styles.weekInner, row]}>
                  <View style={styles.weekIconCircle}>
                    <MaterialCommunityIcons
                      name={ICON.coin}
                      size={18}
                      color="#B46B00"
                    />
                  </View>

                  <AppText weight="extraBold" style={[styles.weekText, text]}>
                    {t("tasks.week_total", { total: 38 })}
                  </AppText>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </ScreenLayout>
    </>
  );
}