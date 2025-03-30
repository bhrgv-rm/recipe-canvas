import { create } from "zustand";

interface AuthStore {
  user: any;
  isAuthenticated: boolean;
  setUser: (user: any) => void;
  clearUser: () => void;
}

const useStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
}));

export default useStore;
