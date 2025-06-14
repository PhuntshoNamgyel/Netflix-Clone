"use client";

import React from "react";
import Link from "next/link";
import styles from "./NavBar.module.css";
import { useAuthStore } from "../store/auth"; // <-- import zustand auth store

const NavBar = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search Query:", searchQuery); // Replace with actual search logic
  };

  const handleLogout = () => {
    logout();
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
  };

  return (
    <div className={styles.navbar}>
      <h1 className={styles.logo}>Netflix</h1>
      <ul className={styles.navLinks}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            🔍
          </button>
        </form>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/tvshows">TV Shows</Link>
        </li>
        <li>
          <Link href="/movies">Movies</Link>
        </li>
        <li>
          <Link href="/mylist">My List</Link>
        </li>
        {user ? (
          <>
            <li>
              <span style={{ cursor: "default", color: "#fff" }}>
                {user.name ? `Hi, ${user.name}` : user.email}
              </span>
            </li>
            <li>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/signup">Signup</Link>
            </li>
            <li>
              <Link href="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
     
      <DarkModeToggle />
    </div>
  );
};

export default NavBar;