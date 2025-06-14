"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./NavBar.module.css";

const NavBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search Query:", searchQuery); // Replace with actual search logic
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
        <li>
          <Link href="/signup">Signup</Link>
        </li>
        <li>
          <Link href="/login">Login</Link>
        </li>
      </ul>
    </div>
  );
};

export default NavBar;