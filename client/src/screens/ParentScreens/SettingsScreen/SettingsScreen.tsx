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

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";
import { logoutParent } from "@/src/redux/thunks/authThunks";
import {
  logoutParentReducer,
  setAuthLoading,
} from "../../../redux/slices/auth-slice";
import { useDispatch, useSelector } from "react-redux";
import { disconnectSocket, emitEvent } from "../../../services/socket";
import { PARENT_LOGOUT } from "@/src/constants/socketEvents";
import { removeParentToken } from "@/src/services/authStorage";
import { showAppToast } from "@/src/utils/appToast";
import { getAppInviteDownloadUrl } from "@/src/constants/appLinks";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { row, text, isRTL } = useLocaleLayout();
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
      showAppToast(t("settings.deviceApp.openFailed"));
    }
  };

  const onPressInviteFriend = async () => {
    const url = getAppInviteDownloadUrl();
    if (!url) {
      showAppToast(t("settings.inviteFriend.noLink"));
      return;
    }
    const message = t("settings.inviteFriend.shareMessage", { url });
    try {
      await Share.share(
        Platform.OS === "android"
          ? { message, title: t("settings.inviteFriend.shareTitle") }
          : { message }
      );
    } catch {
      showAppToast(t("settings.inviteFriend.shareFailed"));
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
      const message = (error as Error)?.message ?? "settings.logout.failed";
      showAppToast(t(message));
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
            accessibilityLabel={t("settings.heading")}
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
            accessibilityLabel={t("settings.deviceApp.a11y")}
            accessibilityHint={t("settings.deviceApp.subtitle")}
            style={({ pressed }) => [
              styles.deviceAppButton,
              pressed && styles.deviceAppButtonPressed,
            ]}
          >
            <View style={[styles.deviceAppButtonContent, row]}>
              <View style={[styles.deviceAppButtonMain, row]}>
                <View style={styles.deviceAppIconWrap}>
                  <MaterialCommunityIcons
                    name="cellphone-cog"
                    size={22}
                    color="#FFFFFF"
                  />
                </View>
                <View style={styles.deviceAppTexts}>
                  <AppText
                    weight="bold"
                    style={[styles.deviceAppTitle, text]}
                  >
                    {t("settings.deviceApp.button")}
                  </AppText>
                  <AppText
                    weight="medium"
                    style={[styles.deviceAppSubtitle, text]}
                  >
                    {t("settings.deviceApp.subtitle")}
                  </AppText>
                </View>
              </View>
              <MaterialCommunityIcons
                name={isRTL ? "chevron-left" : "chevron-right"}
                size={24}
                color="#7A8599"
              />
            </View>
          </Pressable>

          <Pressable
            onPress={onPressInviteFriend}
            accessibilityRole="button"
            accessibilityLabel={t("settings.inviteFriend.a11y")}
            accessibilityHint={t("settings.inviteFriend.subtitle")}
            style={({ pressed }) => [
              styles.deviceAppButton,
              pressed && styles.deviceAppButtonPressed,
            ]}
          >
            <View style={[styles.deviceAppButtonContent, row]}>
              <View style={[styles.deviceAppButtonMain, row]}>
                <View style={styles.deviceAppIconWrap}>
                  <MaterialCommunityIcons
                    name="account-plus-outline"
                    size={22}
                    color="#FFFFFF"
                  />
                </View>
                <View style={styles.deviceAppTexts}>
                  <AppText
                    weight="bold"
                    style={[styles.deviceAppTitle, text]}
                  >
                    {t("settings.inviteFriend.button")}
                  </AppText>
                  <AppText
                    weight="medium"
                    style={[styles.deviceAppSubtitle, text]}
                  >
                    {t("settings.inviteFriend.subtitle")}
                  </AppText>
                </View>
              </View>
              <MaterialCommunityIcons
                name={isRTL ? "chevron-left" : "chevron-right"}
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
          accessibilityLabel={t("settings.logout.a11y")}
          style={({ pressed }) => [
            styles.logoutButton,
            !isLoggingOut && pressed && styles.logoutPressed,
            isLoggingOut ? { opacity: 0.7 } : null,
          ]}
        >
          <View style={[styles.logoutContent, row]}>
            <MaterialCommunityIcons name="logout" size={22} color="#FFFFFF" />
            <AppText weight="bold" style={styles.logoutText}>
              {t("settings.logout.button")}
            </AppText>
          </View>
        </Pressable>
      </View>
    </ScreenLayout>
  );
}
