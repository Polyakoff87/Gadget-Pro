import React from "react";
import styles from "./CatalogElement.module.css";
import { useParams, Link, Outlet } from "react-router-dom";
import { useGetSectionsQuery } from "../../../../api/rtkApi";
import { useTheme } from "../../../../context/ThemeContext";

export default function CatalogElement() {
  const { name } = useParams();
  const { theme } = useTheme();
  const currentName = name?.match(/([a-zа-яё]+)/i)?.[0] || "default";

  const query = `name=${currentName}`;

  const { data, error, isLoading } = useGetSectionsQuery(query);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading sections. Please try again later.</div>;
  }

  const currentData = data && data.length > 0 ? data[0] : undefined;
  return (
    <div className={styles.mainWrapper}>
      <div className={`${styles.catalogElementWrapper} ${styles[theme]}`}>
        {Array.isArray(currentData?.links) &&
          currentData.links.map((el) => (
            <Link key={el.id} to={`/catalog/${currentName}/${el.name}`}>
              <div className={`${styles.catalogElementCard} ${styles[theme]}`}>
                <img
                  className={styles.img}
                  src={el.img || "/path/to/fallback-image.jpg"}
                  alt={el.title}
                />
                <span className={styles.catalogElementTitle}>{el.title}</span>
              </div>
            </Link>
          ))}
      </div>
      <Outlet />
    </div>
  );
}
