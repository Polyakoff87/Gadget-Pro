import React, { useEffect } from "react";
import styles from "./CustomPopup.module.css";

export default function CustomPopup({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.popup} ${styles[type]}`}>
      <span>{message}</span>
      <button className={styles.closeButton} onClick={onClose}>
        &times;
      </button>
    </div>
  );
}
