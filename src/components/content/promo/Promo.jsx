import { useEffect } from "react";
import PromoCard from "./PromoCard";
import styles from "./Promo.module.css";
import { useGetPromoQuery } from "../../../api/rtkApi";

export default function Promo() {
  const { data: promo, error, isLoading } = useGetPromoQuery("");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        Error loading data. Please try again later.
      </div>
    );
  }

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.cardContentWrapper}>
        {promo.map((product) => (
          <PromoCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
