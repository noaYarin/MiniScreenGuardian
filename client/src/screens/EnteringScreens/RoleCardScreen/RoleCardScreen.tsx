import React, { useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

import AppText from "../../../components/AppText/AppText";
import { roleCardStyles as styles } from "./rolecard.styles";

type RoleCardProps = {
  title: string;
  imageSource: ImageSourcePropType;
  onPress: () => void;
  backgroundColor: string;
  avatarCircleBackground: string;
  containerStyle?: StyleProp<ViewStyle>;
  description: string;
};

export const RoleCard: React.FC<RoleCardProps> = ({
  title,
  imageSource,
  onPress,
  backgroundColor,
  avatarCircleBackground,
  containerStyle,
  description,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const [pressed, setPressed] = useState(false);

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      friction: 6,
      tension: 80,
    }).start();
  };

  const handlePressIn = () => {
    setPressed(true);
    animateTo(0.95);
  };

  const handlePressOut = () => {
    animateTo(1);
    setPressed(false);
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={description}
    >
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor,
            borderWidth: 0,
            transform: [{ scale }],
            opacity: pressed ? 0.96 : 1,
          },
          containerStyle,
        ]}
      >
        <View
          style={[
            styles.imageContainer,
            { backgroundColor: avatarCircleBackground },
          ]}
        >
          <Image source={imageSource} style={styles.image} />
        </View>

        <AppText weight="extraBold" style={styles.title}>
          {title}
        </AppText>

        <AppText weight="regular" style={styles.description}>
          {description}
        </AppText>
      </Animated.View>
    </Pressable>
  );
};