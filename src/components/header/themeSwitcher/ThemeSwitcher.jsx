import * as React from "react";
import { useTheme } from "../../../context/ThemeContext";
import styles from "./ThemeSwitcher.module.css";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  const toggleDarkMode = () => {
    toggleTheme();
  };

  return (
    <div className={styles.themeSwitcher_wrapper}>
      <button
        title={"Переключить тему"}
        className={`${styles.themeSwitcher_button} ${styles[theme]}`}
        onClick={toggleDarkMode}
      ></button>
    </div>
  );
}
