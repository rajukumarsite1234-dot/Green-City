import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthUser } from "../types/auth";

const USER_KEY = "@app_user";

export async function saveUser(user: AuthUser) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser(): Promise<AuthUser | null> {
  const data = await AsyncStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export async function removeUser() {
  await AsyncStorage.removeItem(USER_KEY);
}
