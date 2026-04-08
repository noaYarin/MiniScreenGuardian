import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";
import { getAgeInFullYearsFromBirthDate } from "../../../../hooks/use-child-profile-labels";
import { parseRouteParam } from "../ChildDetailsScreen/childDetailsRouteParams";
import type { AppDispatch, RootState } from "@/src/redux/store/types";
import { deleteChildThunk, updateChildProfileImageThunk } from "@/src/redux/thunks/childrenThunks";
import ConfirmDialog from "@/src/components/ConfirmDialog/ConfirmDialog";
import { showAppToast } from "@/src/utils/appToast";
import { getChildProfileImageUri } from "@/src/utils/childProfileImage";

type ActionCard = {
  key: string;
  titleKey: string;
  subtitleKey: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  route: string;
};

const ACTIONS: ActionCard[] = [
  {
    key: "apps",
    titleKey: "childProfile.actions.apps.title",
    subtitleKey: "childProfile.actions.apps.subtitle",
    icon: "cellphone",
    route: "/Parent/child-apps",
  },
  {
    key: "limits",
    titleKey: "childProfile.actions.limits.title",
    subtitleKey: "childProfile.actions.limits.subtitle",
    icon: "clock-outline",
    route: "/Parent/child-limits",
  },
  {
    key: "reports",
    titleKey: "childProfile.actions.reports.title",
    subtitleKey: "childProfile.actions.reports.subtitle",
    icon: "chart-bar",
    route: "/Parent/child-reports",
  },
  {
    key: "location",
    titleKey: "childProfile.actions.location.title",
    subtitleKey: "childProfile.actions.location.subtitle",
    icon: "map-marker-outline",
    route: "/Parent/childLocation",
  },
  {
    key: "requests",
    titleKey: "childProfile.actions.requests.title",
    subtitleKey: "childProfile.actions.requests.subtitle",
    icon: "message-outline",
    route: "/Parent/extension-requests",
  },
];

export default function ChildProfileScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { isRTL, text } = useLocaleLayout();
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocalSearchParams<{ id?: string; name?: string }>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const childId = useMemo(() => parseRouteParam(params.id), [params.id]);
  const nameFromRoute = useMemo(() => parseRouteParam(params.name), [params.name]);

  const { childrenList } = useSelector((state: RootState) => state.children ?? {});

  const child = useMemo(() => {
    if (!childrenList) return null;
    return childrenList.find((c) => String(c._id) === String(childId)) || null;
  }, [childrenList, childId]);

  const displayName =
    (child?.name && child.name.trim()) ||
    nameFromRoute ||
    t("childProfile.name_fallback");

  const ageYears = useMemo(
    () => getAgeInFullYearsFromBirthDate(child?.birthDate),
    [child?.birthDate]
  );

  const isTablet = width >= 900;
  const contentMaxWidth = width >= 1200 ? 980 : width >= 900 ? 840 : undefined;

  const avatarUri = useMemo(
    () => getChildProfileImageUri(child?.img),
    [child?.img]
  );

  const launchAvatarPicker = useCallback(
    async (mode: "camera" | "library") => {
      if (!childId || uploadingAvatar) return;
      try {
        if (mode === "camera") {
          const cam = await ImagePicker.requestCameraPermissionsAsync();
          if (cam.status !== "granted") {
            showAppToast(
              t("childProfile.photo_permission_denied"),
              t("common.error")
            );
            return;
          }
        } else {
          const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (lib.status !== "granted") {
            showAppToast(
              t("childProfile.photo_permission_denied"),
              t("common.error")
            );
            return;
          }
        }

        const options: ImagePicker.ImagePickerOptions = {
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.1,
          base64: true,
        };

        // Launch the camera or image library
        const result =
          mode === "camera"
            ? await ImagePicker.launchCameraAsync(options)
            : await ImagePicker.launchImageLibraryAsync(options);

        if (result.canceled || !result.assets?.[0]) return;

        const asset = result.assets[0];
        const mime = asset.mimeType ?? "image/jpeg";
        if (!asset.base64) {
          showAppToast(t("childProfile.photo_no_data"), t("common.error"));
          return;
        }

        const dataUrl = `data:${mime};base64,${asset.base64}`;
        setUploadingAvatar(true);
        await dispatch(
          updateChildProfileImageThunk({ childId, img: dataUrl })
        ).unwrap();
        showAppToast(t("childProfile.photo_updated"));
      } catch (err: unknown) {
        const rejected =
          typeof err === "string"
            ? err
            : err instanceof Error
              ? err.message
              : "";
        const toastKey =
          rejected === "children.profile_image_update_failed"
            ? "children.profile_image_update_failed"
            : "childProfile.photo_upload_failed";
        showAppToast(t(toastKey), t("common.error"));
      } finally {
        setUploadingAvatar(false);
      }
    },
    [childId, uploadingAvatar, dispatch, t]
  );

  // Click on the pen to change the avatar
  const onPressChangeAvatar = useCallback(() => {
    if (!childId || uploadingAvatar) return;
    Alert.alert(
      t("childProfile.change_photo"),
      t("childProfile.change_photo_message"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("childProfile.take_photo"),
          onPress: () => {
            void launchAvatarPicker("camera");
          },
        },
        {
          text: t("childProfile.choose_from_library"),
          onPress: () => {
            void launchAvatarPicker("library");
          },
        },
      ]
    );
  }, [childId, uploadingAvatar, launchAvatarPicker]);

  const onPressDeleteChild = () => {
    if (!childId || isDeleting) return;
    setDeleteConfirmVisible(true);
  };

  const confirmDeleteChild = async () => {
    if (!childId || isDeleting) return;
    setDeleteConfirmVisible(false);
    try {
      setIsDeleting(true);
      await dispatch(deleteChildThunk(childId)).unwrap();
      router.replace("/Parent/(tabs)/children");
    } catch (error: any) {
      showAppToast(
        error?.message ||
          t("childProfile.delete_error_message", "Could not delete the child."),
        t("common.error", "Error")
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ConfirmDialog
        visible={deleteConfirmVisible}
        title={t("childProfile.delete_confirm_title", "Delete child")}
        message={t(
          "childProfile.delete_confirm_message",
          "Are you sure you want to delete this child? This action cannot be undone."
        )}
        cancelLabel={t("common.cancel", "Cancel")}
        confirmLabel={t("common.delete", "Delete")}
        destructive
        onCancel={() => setDeleteConfirmVisible(false)}
        onConfirm={confirmDeleteChild}
      />
      <Stack.Screen
        options={{
          title: t("childProfile.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />

      <ScreenLayout>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.inner,
              contentMaxWidth ? { maxWidth: contentMaxWidth } : null,
            ]}
          >
            <View style={styles.heroCard}>
              <Pressable
                onPress={onPressChangeAvatar}
                disabled={!childId || uploadingAvatar}
                accessibilityRole="button"
                accessibilityLabel={t("childProfile.photo_edit_a11y")}
                style={({ pressed }) => [
                  styles.avatarTouchable,
                  pressed && !uploadingAvatar && { opacity: 0.92 },
                ]}
              >
                <View style={styles.avatarCircle}>
                  {avatarUri ? (
                    <Image
                      source={{ uri: avatarUri }}
                      style={styles.avatarImage}
                      contentFit="cover"
                      transition={120}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="account-outline"
                      size={58}
                      color="#4F93D2"
                    />
                  )}
                  {uploadingAvatar ? (
                    <View style={styles.avatarUploadingOverlay}>
                      <ActivityIndicator color="#315AEF" />
                    </View>
                  ) : null}
                </View>
                <View
                  style={[
                    styles.avatarEditBadge,
                    isRTL && styles.avatarEditBadgeRtl,
                  ]}
                  pointerEvents="none"
                >
                  <MaterialCommunityIcons
                    name="pencil"
                    size={18}
                    color="#FFFFFF"
                  />
                </View>
              </Pressable>

              <AppText weight="extraBold" style={[styles.childName, text]}>
                {displayName}
              </AppText>

              {ageYears != null ? (
                <AppText weight="medium" style={[styles.childMeta, text]}>
                  {t("childProfile.age", { age: ageYears })}
                </AppText>
              ) : null}

              <View
                style={[
                  styles.profileActionsRow,
                  isRTL ? styles.profileActionsRowRtl : styles.profileActionsRowLtr,
                ]}
              >
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/Parent/editChildProfile",
                      params: { childId: childId },
                    } as never)
                  }
                  accessibilityRole="button"
                  accessibilityLabel={t("childProfile.edit_a11y")}
                  style={({ pressed }) => [
                    styles.editButton,
                    pressed && styles.pressedSoft,
                  ]}
                >
                  <View style={styles.editButtonContent}>
                    <MaterialCommunityIcons
                      name="pencil-outline"
                      size={18}
                      color="#3B5B7A"
                    />
                    <AppText weight="bold" style={styles.editButtonText}>
                      {t("childProfile.edit")}
                    </AppText>
                  </View>
                </Pressable>

                <Pressable
                  onPress={onPressDeleteChild}
                  disabled={isDeleting}
                  accessibilityRole="button"
                  accessibilityLabel={t(
                    "childProfile.delete_a11y",
                    "Delete child"
                  )}
                  style={({ pressed }) => [
                    styles.deleteButton,
                    pressed && styles.pressedSoft,
                    isDeleting && styles.deleteButtonDisabled,
                  ]}
                >
                  <View style={styles.deleteButtonContent}>
                    <MaterialCommunityIcons
                      name="trash-can-outline"
                      size={18}
                      color="#B42318"
                    />
                    <AppText weight="bold" style={styles.deleteButtonText}>
                      {isDeleting
                        ? t("common.deleting", "Deleting...")
                        : t("common.delete", "Delete")}
                    </AppText>
                  </View>
                </Pressable>
              </View>
            </View>

            <View style={[styles.cardsGrid, isTablet && styles.cardsGridTablet]}>
              {ACTIONS.map((item) => (
                <Pressable
                  key={item.key}
                  onPress={() => router.push(item.route as never)}
                  accessibilityRole="button"
                  accessibilityLabel={t(`childProfile.actions.${item.key}.a11y`)}
                  style={({ pressed }) => [
                    styles.actionCard,
                    isTablet && styles.actionCardTablet,
                    pressed && styles.pressedCard,
                  ]}
                >
                  <View
                    style={[
                      styles.actionContent,
                      isRTL ? styles.actionContentRtl : styles.actionContentLtr,
                    ]}
                  >
                    <View style={styles.iconBubble}>
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={24}
                        color="#4F93D2"
                      />
                    </View>

                    <View style={styles.actionTextWrap}>
                      <AppText weight="extraBold" style={[styles.actionTitle, text]}>
                        {t(item.titleKey)}
                      </AppText>

                      <AppText weight="medium" style={[styles.actionSubtitle, text]}>
                        {t(item.subtitleKey)}
                      </AppText>
                    </View>

                    <View style={styles.chevronWrap}>
                      <MaterialCommunityIcons
                        name={isRTL ? "chevron-left" : "chevron-right"}
                        size={22}
                        color="#A7B3C2"
                      />
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </ScreenLayout>
    </>
  );
}