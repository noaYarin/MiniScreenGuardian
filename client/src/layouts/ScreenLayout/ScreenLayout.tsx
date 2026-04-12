import React from "react";
import { ScrollView, View } from "react-native";
import { styles } from "./styles";

interface ScreenLayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

export default function ScreenLayout({
  children,
  scrollable = true,
}: ScreenLayoutProps) {
  
  if (!scrollable) {
    return <View style={[{ flex: 1 }, styles.inner]}>{children}</View>;
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.inner}>{children}</View>
    </ScrollView>
  );
}