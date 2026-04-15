import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

import { getAgeInFullYearsFromBirthDate } from "../../../../hooks/use-child-profile-labels";
import { parseRouteParam } from "../ChildDetailsScreen/childDetailsRouteParams";
import type { AppDispatch, RootState } from "@/src/redux/store/types";
import {
  deleteChildThunk,
  updateChildProfileImageThunk,
} from "@/src/redux/thunks/childrenThunks";
import ConfirmDialog from "@/src/components/ConfirmDialog/ConfirmDialog";
import { showErrorToast, showSuccessToast } from "@/src/utils/appToast";
import { getChildProfileImageUri } from "@/src/utils/childProfileImage";

type ActionCard = {
  key: string;
  title: string;
  subtitle: string;
  accessibilityLabel: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  route: string;
};

const ACTIONS: ActionCard[] = [
  {
    key: "limits",
    title: "Screen Time Limits",
    subtitle: "View limits",
    accessibilityLabel: "Go to screen time limits screen",
    icon: "clock-outline",
    route: "/Parent/limits",
  },
  {
    key: "location",
    title: "Location",
    subtitle: "Track location",
    accessibilityLabel: "Go to child location screen",
    icon: "map-marker-outline",
    route: "/Parent/childLocation",
  },
  {
    key: "requests",
    title: "Extension Requests",
    subtitle: "Manage requests",
    accessibilityLabel: "Go to extension requests screen",
    icon: "message-outline",
    route: "/Parent/extensionRequests",
  },
];

export default function ChildProfileScreen() {
  const { width } = useWindowDimensions();
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

  const displayName = (child?.name && child.name.trim()) || nameFromRoute || "Child";

  const ageYears = useMemo(
    () => getAgeInFullYearsFromBirthDate(child?.birthDate),
    [child?.birthDate]
  );

  const isTablet = width >= 900;
  const contentMaxWidth = width >= 1200 ? 980 : width >= 900 ? 840 : undefined;

  const avatarUri = useMemo(() => getChildProfileImageUri(child?.img), [child?.img]);

  const launchAvatarPicker = useCallback(
    async (mode: "camera" | "library") => {
      if (!childId || uploadingAvatar) return;

      try {
        if (mode === "camera") {
          const cam = await ImagePicker.requestCameraPermissionsAsync();
          if (cam.status !== "granted") {
            showErrorToast(
              "Permission is required to use the camera or photo library.",
              "Error"
            );
            return;
          }
        } else {
          const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (lib.status !== "granted") {
            showErrorToast(
              "Permission is required to use the camera or photo library.",
              "Error"
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

        const result =
          mode === "camera"
            ? await ImagePicker.launchCameraAsync(options)
            : await ImagePicker.launchImageLibraryAsync(options);

        if (result.canceled || !result.assets?.[0]) return;

        const asset = result.assets[0];
        const mime = asset.mimeType ?? "image/jpeg";

        if (!asset.base64) {
          showErrorToast("Could not read the image. Try another photo.", "Error"); return;
        }

        const dataUrl = `data:${mime};base64,${asset.base64}`;

        setUploadingAvatar(true);
        await dispatch(updateChildProfileImageThunk({ childId, img: dataUrl })).unwrap();
        showSuccessToast("Profile photo updated successfully.");
      } catch (err: unknown) {
        const rejected =
          typeof err === "string"
            ? err
            : err instanceof Error
              ? err.message
              : "";

        const message =
          rejected === "children.profile_image_update_failed"
            ? "Could not update the profile photo."
            : "Could not upload the photo";

        showErrorToast(message, "Error");
      } finally {
        setUploadingAvatar(false);
      }
    },
    [childId, uploadingAvatar, dispatch]
  );

  const onPressChangeAvatar = useCallback(() => {
    if (!childId || uploadingAvatar) return;

    Alert.alert("Profile photo", "Choose how to add a photo", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Take photo",
        onPress: () => {
          void launchAvatarPicker("camera");
        },
      },
      {
        text: "Choose from library",
        onPress: () => {
          void launchAvatarPicker("library");
        },
      },
    ]);
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
      showErrorToast(
        error?.message || "To delete this child, please remove their devices first.",
        "Error"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ConfirmDialog
        visible={deleteConfirmVisible}
        title="Delete child"
        message="Are you sure you want to delete this child? This action cannot be undone."
        cancelLabel="Cancel"
        confirmLabel="Delete"
        destructive
        onCancel={() => setDeleteConfirmVisible(false)}
        onConfirm={confirmDeleteChild}
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
                accessibilityLabel="Change profile photo"
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

                <View style={styles.avatarEditBadge} pointerEvents="none">
                  <MaterialCommunityIcons name="pencil" size={18} color="#FFFFFF" />
                </View>
              </Pressable>

              <AppText weight="extraBold" style={styles.childName}>
                {displayName}
              </AppText>

              {ageYears != null ? (
                <AppText weight="medium" style={styles.childMeta}>
                  {`Age ${ageYears}`}
                </AppText>
              ) : null}

              <View style={styles.profileActionsRow}>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/Parent/editChildProfile",
                      params: { childId: childId },
                    } as never)
                  }
                  accessibilityRole="button"
                  accessibilityLabel="Edit child details"
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
                      Edit Details
                    </AppText>
                  </View>
                </Pressable>

                <Pressable
                  onPress={onPressDeleteChild}
                  disabled={isDeleting}
                  accessibilityRole="button"
                  accessibilityLabel="Delete child"
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
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AppText>
                  </View>
                </Pressable>
              </View>
            </View>

            <View style={[styles.cardsGrid, isTablet && styles.cardsGridTablet]}>
              {ACTIONS.map((item) => (
                <Pressable
                  key={item.key}
                  onPress={() =>
                    router.push({
                      pathname: item.route as never,
                      params: { childId, id: childId, name: displayName },
                    })
                  }
                  accessibilityRole="button"
                  accessibilityLabel={item.accessibilityLabel}
                  style={({ pressed }) => [
                    styles.actionCard,
                    isTablet && styles.actionCardTablet,
                    pressed && styles.pressedCard,
                  ]}
                >
                  <View style={styles.actionContent}>
                    <View style={styles.iconBubble}>
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={24}
                        color="#4F93D2"
                      />
                    </View>

                    <View style={styles.actionTextWrap}>
                      <AppText weight="extraBold" style={styles.actionTitle}>
                        {item.title}
                      </AppText>

                      <AppText weight="medium" style={styles.actionSubtitle}>
                        {item.subtitle}
                      </AppText>
                    </View>

                    <View style={styles.chevronWrap}>
                      <MaterialCommunityIcons
                        name="chevron-right"
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