import { create } from "zustand";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  localityId: number;
  points: number;
}

interface UserProfileState {
  profile: UserProfile;
  updateProfile: (newProfile: UserProfile) => void;
}

export const useUserProfile = create<UserProfileState>((set) => ({
  profile: {
    id: "",
    name: "",
    email: "",
    phone: "",
    points: 0,
    localityId: 0,
  },
  updateProfile: (newProfile: UserProfile) => set({ profile: newProfile }),
}));