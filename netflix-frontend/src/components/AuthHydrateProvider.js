"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/auth";

export default function AuthHydrateProvider({ children }) {
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (token && !user) {
      fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && (data.email || data.name)) {
            setUser(data);
          }
        })
        .catch(() => {
          localStorage.removeItem("accessToken");
        });
    }
    // eslint-disable-next-line
  }, [setUser, user]);

  return children;
}