import * as SecureStore from "expo-secure-store";

const PARENT_TOKEN_KEY = "parent_token";
const CHILD_TOKEN_KEY = "child_token";

export type ParentAuthData = {
  token: string;
  parentId: string;
};

export type ChildAuthData = {
  childToken: string;
  childId: string;
  parentId: string;
  deviceId: string;
  physicalId?: string;
};

export async function getParentToken(): Promise<ParentAuthData | null> {
  const data = await SecureStore.getItemAsync(PARENT_TOKEN_KEY);
  return data ? JSON.parse(data) : null;
}

export async function setParentToken(parentAuthData: ParentAuthData): Promise<void> {
  await SecureStore.setItemAsync(PARENT_TOKEN_KEY, JSON.stringify(parentAuthData));
}

export async function removeParentToken(): Promise<void> {
  await SecureStore.deleteItemAsync(PARENT_TOKEN_KEY);
}

// Child Auth Storage

export async function getChildToken(): Promise<ChildAuthData | null> {
  const data = await SecureStore.getItemAsync(CHILD_TOKEN_KEY);
  return data ? JSON.parse(data) : null;
}

export async function setChildToken(childAuthData: ChildAuthData): Promise<void> {
  await SecureStore.setItemAsync(CHILD_TOKEN_KEY, JSON.stringify(childAuthData));
}

export async function removeChildToken(): Promise<void> {
  await SecureStore.deleteItemAsync(CHILD_TOKEN_KEY);
}
