import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { Href, Stack, useRouter, useSegments } from "expo-router";
import { Provider as ReduxProvider, useDispatch, useSelector } from "react-redux";
import { showInfoToast } from "@/src/utils/appToast";
import { RootSiblingParent } from "react-native-root-siblings";

import store from "../src/redux/store";
import { COLORS } from "@/constants/theme";
import Initializer from "../src/components/Initializer";
import { showToastFromSocketNotification } from "@/src/utils/socketNotificationToast";
import { connectSocket, onEvent, disconnectSocket } from "@/src/services/socket";
import { LOCATION_LIVE_UPDATE, FORCE_CHILD_LOGOUT, NOTIFICATION_CREATED, DEVICE_STATUS_UPDATED } from "@/src/constants/socketEvents";
import { clearAllDevices, updateDeviceFromSocket, updateDeviceStatusFromSocket } from "@/src/redux/slices/device-slice";

import { logoutChildReducer } from "@/src/redux/slices/auth-slice";
import { removeChildToken } from "@/src/services/authStorage";
import { clearChildrenList } from "@/src/redux/slices/children-slice";
import { addNotificationFromSocket } from "@/src/redux/slices/notification-slice";
import { updateChildSummaryFromSocket } from "@/src/redux/slices/parentHome-slice";
import { bumpPendingRequestsRefreshKey } from "@/src/redux/slices/requests-slice";

function AppStack() {
  const dispatch = useDispatch();
  const router = useRouter();
  const segments = useSegments() as string[];

  const { token, childToken, parentId, activeChildId } = useSelector(
    (state: any) => state.auth
  );
  const myCurrentDeviceId = useSelector((state: any) => state.auth.deviceId);

  useEffect(() => {

    if (!childToken || !activeChildId) return;

    connectSocket(
      String(activeChildId),
      "child",
      parentId ? { parentId: String(parentId) } : undefined
    );

    const unsubscribeForceLogout = onEvent(
      FORCE_CHILD_LOGOUT,
      async (data: any) => {
        const targetDeviceId = data?.deviceId;

        if (targetDeviceId && targetDeviceId !== myCurrentDeviceId) {
          console.log("Logout event received for a different device. Ignoring.");
          return;
        }

        showInfoToast(
          "The device has been disconnected by the parent",
          "System message"
        );

        dispatch(logoutChildReducer());
        dispatch(clearAllDevices());
        dispatch(clearChildrenList());

        await removeChildToken();
        disconnectSocket();
        router.replace("/" as Href);
      }
    );

    return () => {
      if (unsubscribeForceLogout) unsubscribeForceLogout();
    };
  }, [childToken, activeChildId, parentId, myCurrentDeviceId, dispatch, router]);

  useEffect(() => {
    const isInsideParentScreens = segments.includes("Parent");

    if (isInsideParentScreens && parentId) {
      connectSocket(String(parentId), "parent");

      const unsubscribeLocation = onEvent(LOCATION_LIVE_UPDATE, (data: any) => {
        dispatch(updateDeviceFromSocket(data));
      });


      const unsubscribeDeviceStatus = onEvent(DEVICE_STATUS_UPDATED, (data: any) => {
        dispatch(updateDeviceStatusFromSocket(data));
        dispatch(updateChildSummaryFromSocket(data));

      });

      const unsubscribeNotifications = onEvent(NOTIFICATION_CREATED, (data: any) => {
        dispatch(addNotificationFromSocket(data));

        const isExtensionRequestCreated =
          data?.type === "EXTENSION_REQUEST_CREATED";

        if (isExtensionRequestCreated) {
          dispatch(bumpPendingRequestsRefreshKey());
        }

        showToastFromSocketNotification(data);
      });

      return () => {
        if (unsubscribeLocation) unsubscribeLocation();
        if (unsubscribeDeviceStatus) unsubscribeDeviceStatus();
        if (unsubscribeNotifications) unsubscribeNotifications();
      };
    }

  }, [segments, token, parentId, dispatch]);

  useEffect(() => {
    const isIndexRoute =
      segments.length === 0 || segments[segments.length - 1] === "index";

    if (!isIndexRoute) return;

    if (childToken) {
      router.replace("/Child" as Href);
    } else if (token) {
      router.replace("/Parent" as Href);
    }
  }, [childToken, token, segments, router]);

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: COLORS.light.background },
        headerStyle: { backgroundColor: COLORS.light.tint },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="Parent"
        options={{
          headerShown: false,
          title: "",
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ReduxProvider store={store}>
      <RootSiblingParent>
        <Initializer>
          <AppStack />
        </Initializer>
      </RootSiblingParent>
    </ReduxProvider>
  );
}