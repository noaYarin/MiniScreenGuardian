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
    key: "requests",
    labelKey: "homeMenu.items.requests",
    icon: "message-outline",
    route: "/Parent/extensionRequests" as Href,
  },
  {
    key: "activities",
    labelKey: "homeMenu.items.activities",
    icon: "star-four-points-outline",
  },
  {
    key: "rewards",
    labelKey: "homeMenu.items.rewards",
    icon: "gift-outline",
  },
  {
    key: "chatbot",
    labelKey: "homeMenu.items.chatbot",
    icon: "emoticon-outline",
  },
  {
    key: "history",
    labelKey: "homeMenu.items.history",
    icon: "history",
    route: "/Parent/activityHistory" as Href,
  },
];
