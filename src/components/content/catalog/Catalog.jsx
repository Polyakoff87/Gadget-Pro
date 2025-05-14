import styles from "./Catalog.module.css";
import { Link } from "react-router-dom";
import { useGetCatalogQuery } from "../../../api/rtkApi";
import { useTheme } from "../../../context/ThemeContext";

export default function Catalog() {
  const { data } = useGetCatalogQuery();
  const { theme } = useTheme();

  return (
    <div className={styles.mainWrapper}>
      {data?.map((el) => {
        return (
          <Link className={styles.link} key={el.id} to={`/catalog/${el.name}`}>
            <div className={`${styles.catalogCard} ${styles[theme]}`}>
              <img className={styles.img} src={el.img} alt={el.title} />
              <span style={{ marginTop: "10px" }}>{el.title}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
