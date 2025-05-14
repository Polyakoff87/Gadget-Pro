import styles from "./Promo.module.css";
import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";

export default function PromoCard({ product }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useTheme();
  const handleToggleDescription = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className={`${styles.cardList} ${styles[theme]}`}>
      <div className={styles.cardLink}>
        <div className={styles.cardImageWrapper}>
          <img
            className={styles.cardImage}
            src={product.img || "/path/to/fallback-image.jpg"}
            alt={product.title || "No image available"}
          />
        </div>
      </div>
      <div className={styles.cardContent}>
        <p
          className={styles.cardDescription}
          onClick={handleToggleDescription}
          title={!isExpanded ? "Раскрыть описание" : ""}
          style={{ cursor: "pointer" }}
        >
          {isExpanded
            ? product.description
            : `${product.description?.slice(0, 150)}...`}
        </p>
      </div>
    </div>
  );
}
