export type ChildOption = {
  id: string;
  name: string;
  initial: string;
  accent: string;
  subtitleKey?: string;
};

export type ChildLocationItem = {
  childId: string;
  cityKey: string;
  areaKey: string;
  addressKey: string;
  updatedAtKey: string;
};

export type DeviceLocationSnapshot = {
  latitude: number;
  longitude: number;
  lastUpdated: string | number | Date;
};