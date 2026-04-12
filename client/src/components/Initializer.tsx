import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";

import { COLORS } from "@/constants/theme";
import {
  hydrateChildSession,
  hydrateParentSession,
} from "../redux/slices/auth-slice";
import { getChildToken, getParentToken } from "../services/authStorage";

export default function Initializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [parent, child] = await Promise.all([
          getParentToken(),
          getChildToken(),
        ]);

        if (parent) {
          dispatch(
            hydrateParentSession({
              token: parent.token,
              parentId: parent.parentId,
            })
          );
        }

        if (child) {
          dispatch(
            hydrateChildSession({
              childToken: child.childToken,
              parentId: child.parentId,
              childId: child.childId,
              deviceId: child.deviceId,
              physicalId: child.physicalId,
            })
          );
        }
      } catch (error) {
        console.error("Initialization failed:", error);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, [dispatch]);

  if (!isLoaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.light.tint} />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: COLORS.light.background,
    alignItems: "center",
    justifyContent: "center",
  },
});