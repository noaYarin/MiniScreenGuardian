import React from "react";
import {
  View,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Linking,
  Platform,
  Share,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

import { logoutParent } from "@/src/redux/thunks/authThunks";
import {
  logoutParentReducer,
  setAuthLoading,
} from "../../../redux/slices/auth-slice";
import { disconnectSocket, emitEvent } from "../../../services/socket";
import { PARENT_LOGOUT } from "@/src/constants/socketEvents";
import { removeParentToken } from "@/src/services/authStorage";
import { showErrorToast, showInfoToast } from "@/src/utils/appToast";
import { getAppInviteDownloadUrl } from "@/src/constants/appLinks";

export default function SettingsScreen() {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();

  const isLoggingOut = useSelector((state: any) => state.auth.isLoading);
  const parentId = useSelector((state: any) => state.auth.parentId);
  const childrenIds = useSelector((state: any) => state.children.childrenList);

  const isTablet = width >= 900;

  const onPressOpenDeviceAppSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {
      showErrorToast("Could not open settings.", "Error");
    }
  };

  const onPressInviteFriend = async () => {
    const url = getAppInviteDownloadUrl();

    if (!url) {
      showInfoToast("The download link is not available right now.", "Unavailable");
      return;
    }

    const message = `Try the app — download: ${url}`;

    try {
      await Share.share(
        Platform.OS === "android"
          ? { message, title: "Invite to the app" }
          : { message }
      );
    } catch {
      showErrorToast("Could not share the invite link.", "Error");
    }
  };

  const onPressLogout = async () => {
    dispatch(setAuthLoading(true));

    try {
      if (childrenIds?.length) {
        emitEvent(PARENT_LOGOUT, {
          parentId: parentId,
          childrenIds: childrenIds.map((child: any) => child._id),
        });
      }

      await (dispatch as any)(logoutParent()).unwrap();
    } catch (error) {
      const message = (error as Error)?.message ?? "Logout failed";
      showErrorToast(
        message === "settings.logout.failed" ? "Logout failed." : message,
        "Error"
      );
    } finally {
      dispatch(logoutParentReducer());
      await removeParentToken();
      disconnectSocket();
      router.replace("/" as Href);
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <ScreenLayout scrollable={false}>
      <View style={[styles.screenRoot, isTablet && styles.containerTablet]}>
        <ScrollView
          style={styles.mainScroll}
          contentContainerStyle={styles.mainScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={styles.heroIconOnly}
            accessibilityRole="image"
            accessibilityLabel="Advanced Settings"
          >
            <View style={styles.heroIconBadge}>
              <MaterialCommunityIcons
                name="cog-outline"
                size={28}
                color="#315AEF"
              />
            </View>
          </View>

          <Pressable
            onPress={onPressOpenDeviceAppSettings}
            accessibilityRole="button"
            accessibilityLabel="Open system settings for this app"
            accessibilityHint="Notifications, permissions and location"
            style={({ pressed }) => [
              styles.deviceAppButton,
              pressed && styles.deviceAppButtonPressed,
            ]}
          >
            <View style={styles.deviceAppButtonContent}>
              <View style={styles.deviceAppButtonMain}>
                <View style={styles.deviceAppIconWrap}>
                  <MaterialCommunityIcons
                    name="cellphone-cog"
                    size={22}
                    color="#FFFFFF"
                  />
                </View>

                <View style={styles.deviceAppTexts}>
                  <AppText weight="bold" style={styles.deviceAppTitle}>
                    App settings on this device
                  </AppText>

                  <AppText weight="medium" style={styles.deviceAppSubtitle}>
                    Notifications, permissions and location
                  </AppText>
                </View>
              </View>

              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#7A8599"
              />
            </View>
          </Pressable>

          <Pressable
            onPress={onPressInviteFriend}
            accessibilityRole="button"
            accessibilityLabel="Share the app invite link"
            accessibilityHint="Share the download link"
            style={({ pressed }) => [
              styles.deviceAppButton,
              pressed && styles.deviceAppButtonPressed,
            ]}
          >
            <View style={styles.deviceAppButtonContent}>
              <View style={styles.deviceAppButtonMain}>
                <View style={styles.deviceAppIconWrap}>
                  <MaterialCommunityIcons
                    name="account-plus-outline"
                    size={22}
                    color="#FFFFFF"
                  />
                </View>

                <View style={styles.deviceAppTexts}>
                  <AppText weight="bold" style={styles.deviceAppTitle}>
                    Invite a friend
                  </AppText>

                  <AppText weight="medium" style={styles.deviceAppSubtitle}>
                    Share the download link
                  </AppText>
                </View>
              </View>

              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#7A8599"
              />
            </View>
          </Pressable>
        </ScrollView>

        <Pressable
          onPress={onPressLogout}
          disabled={isLoggingOut}
          accessibilityRole="button"
          accessibilityLabel="Log out from the account"
          style={({ pressed }) => [
            styles.logoutButton,
            !isLoggingOut && pressed && styles.logoutPressed,
            isLoggingOut ? { opacity: 0.7 } : null,
          ]}
        >
          <View style={styles.logoutContent}>
            <MaterialCommunityIcons name="logout" size={22} color="#FFFFFF" />
            <AppText weight="bold" style={styles.logoutText}>
              {isLoggingOut ? "Logging out..." : "Log Out"}
            </AppText>
          </View>
        </Pressable>
      </View>
    </ScreenLayout>
  );
}