import type { ComponentProps } from "react";
import type { Href } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type HomeMenuItem = {
  key: string;
  labelKey: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  route?: Href;
};

export const MENU_ITEMS: HomeMenuItem[] = [
  {
    key: "location",
    labelKey: "homeMenu.items.location",
    icon: "map-marker",
    route: "/Parent/childLocation" as Href,
  },
  {
    key: "history",
    labelKey: "homeMenu.items.history",
    icon: "history",
    route: "/Parent/activityHistory" as Href,
  },
];
