"use client";
import React, { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  // Load dark mode preference from localStorage on initial render
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDark(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Update dark mode class and save preference to localStorage
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [dark]);

  return (
    <div className="flex items-center space-x-4">
      {/* Dark Mode Toggle Button */}
      <button
        className="px-3 py-1 rounded bg-gray-800 text-white dark:bg-gray-200 dark:text-black"
        onClick={() => setDark((d) => !d)}
        aria-label="Toggle dark mode"
      >
        {/* {dark ? "🌙" : "☀️"} */}
      </button>
    </div>
  );
}