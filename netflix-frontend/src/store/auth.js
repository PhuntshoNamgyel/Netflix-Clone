import { create } from "zustand";

// Helper function to get token from localStorage on initial load
const getInitialToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: getInitialToken(),

  login: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
    }
    set(() => ({
      user,
      accessToken: token,
    }));
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
    set(() => ({
      user: null,
      accessToken: null,
    }));
  },

  setUser: (user) =>
    set(() => ({
      user,
    })),
}));

