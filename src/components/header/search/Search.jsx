import React, { useState } from "react";
import styles from "./Search.module.css";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!searchQuery.trim()) {
      navigate(`/searchResults?tags=`);
      return;
    }

    const tags = searchQuery
      .split(/[\s,]+/)
      .map((tag) => tag.trim())
      .filter(Boolean);

    const encodedTags = encodeURIComponent(tags.join(","));

    navigate(`/searchResults?tags=${encodedTags}`);
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSearchSubmit}>
        <input
          className={`${styles.input} ${styles[theme]}`}
          type="search"
          placeholder="Поиск по сайту"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button className={styles.button} type="submit" />
      </form>
    </div>
  );
}
