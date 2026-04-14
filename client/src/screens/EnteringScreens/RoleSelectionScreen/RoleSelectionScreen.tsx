import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { RoleCard } from "../RoleCardScreen/RoleCardScreen";
import { styles } from "./roleSelection.styles";
import { COLORS } from "../../../../constants/theme";

export const RoleSelectionScreen: React.FC = () => {
  const router = useRouter();

  const handleParentSelect = () => {
    router.push("/Entering/loginParent" as any);
  };

  const handleChildSelect = () => {
    router.push("/Entering/linkChild" as any);
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <AppText weight="extraBold" style={styles.title}>
          Welcome
        </AppText>


        <AppText style={styles.subtitle}>
          Choose who is using the app
        </AppText>

        <View style={styles.cardsContainer}>
          <RoleCard
            title="Child"
            imageSource={require("../../../../assets/images/childrens.webp")}
            description="Use the device with limits set by your parent"
            onPress={handleChildSelect}
            backgroundColor={COLORS.light.secondary}
            avatarCircleBackground={COLORS.light.tint}
          />

          <RoleCard
            title="Parent"
            imageSource={require("../../../../assets/images/parents.webp")}
            description="Manage limits, monitor usage and approve requests"
            onPress={handleParentSelect}
            backgroundColor={COLORS.light.tint}
            avatarCircleBackground={COLORS.light.secondary}
          />
        </View>
      </View>
    </ScreenLayout>
  );
};