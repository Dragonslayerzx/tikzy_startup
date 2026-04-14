import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

import {
  AuthUser,
  getMe,
  loginUser,
  registerUser,
  updateMe,
} from "@/src/services/auth.service";

const AUTH_TOKEN_KEY = "tikzy_auth_token";
const AUTH_USER_KEY = "tikzy_auth_user";

type RegisterInput = {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type UpdateProfileInput = {
  full_name: string;
  phone?: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;

  hydrate: () => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isHydrated: false,
  isLoading: false,
  error: null,

  hydrate: async () => {
    try {
      const [token, userJson] = await Promise.all([
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        AsyncStorage.getItem(AUTH_USER_KEY),
      ]);

      const user = userJson ? JSON.parse(userJson) : null;

      set({
        token,
        user,
        isHydrated: true,
      });

      if (token) {
        try {
          const freshUser = await getMe(token);
          await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(freshUser));
          set({ user: freshUser });
        } catch {
          await Promise.all([
            AsyncStorage.removeItem(AUTH_TOKEN_KEY),
            AsyncStorage.removeItem(AUTH_USER_KEY),
          ]);
          set({ token: null, user: null });
        }
      }
    } catch {
      set({ isHydrated: true });
    }
  },

  login: async (input) => {
    set({ isLoading: true, error: null });

    try {
      const result = await loginUser(input);

      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, result.access_token),
        AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(result.user)),
      ]);

      set({
        token: result.access_token,
        user: result.user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed",
      });
      throw error;
    }
  },

  register: async (input) => {
    set({ isLoading: true, error: null });

    try {
      const result = await registerUser(input);

      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, result.access_token),
        AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(result.user)),
      ]);

      set({
        token: result.access_token,
        user: result.user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Register failed",
      });
      throw error;
    }
  },

  logout: async () => {
    await Promise.all([
      AsyncStorage.removeItem(AUTH_TOKEN_KEY),
      AsyncStorage.removeItem(AUTH_USER_KEY),
    ]);

    set({
      token: null,
      user: null,
      error: null,
    });
  },

  refreshMe: async () => {
    const { token } = get();
    if (!token) return;

    const user = await getMe(token);
    await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    set({ user });
  },

  updateProfile: async (input) => {
    const { token } = get();

    if (!token) {
      throw new Error("No authenticated user");
    }

    set({ isLoading: true, error: null });

    try {
      const updatedUser = await updateMe(input, token);

      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));

      set({
        user: updatedUser,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Update failed",
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));