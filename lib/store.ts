import { create } from 'zustand';
import { User } from '@/app/types';

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
  isAdmin: boolean;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user, isAdmin: user?.is_admin || false }),
  isAdmin: false,
}));