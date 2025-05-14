import React from "react";
import styles from "./Logo.module.css";
import { NavLink } from "react-router-dom";

export default function Logo() {
  return (
    <div className={styles.logo}>
      <NavLink className={styles.link} title = {"Gadget Pro - Ваш проводник в мир актуальной техники и электроники"} to="/">Gadget Pro</NavLink>
    </div>
  );
}
