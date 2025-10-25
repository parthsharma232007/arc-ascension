import { UserProfile } from "@/types";

const STORAGE_KEY = "myarc_user_profile";

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
};

export const getUserProfile = (): UserProfile | null => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const clearUserProfile = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
