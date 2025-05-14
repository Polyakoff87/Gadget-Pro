import React, { useState, useMemo } from "react";
import styles from "./FavoritesResults.module.css";
import {
  useGetGoodsQuery,
  useUpdateInFavoritesStatusMutation,
  useUpdateInBasketStatusMutation,
} from "../../../api/rtkApi";
import { Link } from "react-router-dom";
import CustomPopup from "../../popups/CustomPopup";
import { useUserContext } from "../../../context/UserContext";

export default function FavoritesResults() {
  const { data: goods, error, isLoading } = useGetGoodsQuery("");
  const { userId } = useUserContext();
  const [updateInFavoritesStatus] = useUpdateInFavoritesStatusMutation();
  const [updateInBasketStatus] = useUpdateInBasketStatusMutation();

  const filteredFavorites = useMemo(() => {
    return goods?.filter((el) => el.inFavorites) || [];
  }, [goods]);

  const totalQuantity = useMemo(() => {
    return filteredFavorites.length;
  }, [filteredFavorites]);

  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });

  const handleRemoveFromFavorites = (productId, currentStatus) => {
    updateInFavoritesStatus({ userId, productId, inFavorites: !currentStatus })
      .unwrap()
      .then(() => {
        setPopup({
          visible: true,
          message: "Товар удален из избранного",
          type: "success",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        setPopup({
          visible: true,
          message: "Ошибка, попробуйте снова позже",
          type: "error",
        });
      });
  };

  const handleToggleInBasket = (productId, currentStatus) => {
    updateInBasketStatus({ userId, productId, inBasket: !currentStatus })
      .unwrap()
      .then(() => {
        setPopup({
          visible: true,
          message: currentStatus
            ? "Товар удален из корзины"
            : "Товар добавлен в корзину",
          type: "success",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        setPopup({
          visible: true,
          message: "Ошибка, попробуйте снова позже",
          type: "error",
        });
      });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data. Please try again later.</div>;
  }

  return (
    <div className={styles.mainWrapper}>
      <h2 className={styles.title}>Ваше избранное</h2>
      <div className={styles.summary}>
        <p style={{ marginRight: "10px" }}>
          Количество товаров:{" "}
          <span style={{ marginLeft: "5px" }}>{totalQuantity}</span>
        </p>
      </div>

      {filteredFavorites.length > 0 ? (
        filteredFavorites.map((product) => (
          <div key={product.id} className={styles.cardList}>
            <Link
              to={`/goods/${product.brand}/${product.model}`}
              className={styles.cardLink}
            >
              <div className={styles.cardImageWrapper}>
                <img
                  className={styles.cardImage}
                  src={product.images?.[0] || "/path/to/fallback-image.jpg"}
                  alt={product.title || "No image available"}
                />
              </div>
            </Link>
            <div className={styles.cardContent}>
              <Link
                to={`/goods/${product.brand}/${product.model}`}
                className={styles.cardLink}
              >
                <h3 className={styles.cardTitle}>
                  {product.brand} {product.model}
                </h3>
              </Link>

              <p className={styles.cardPrice}>
                {product.price.toLocaleString()} руб.
              </p>
              <p className={styles.cardDescription}>
                {product.description?.slice(0, 100)}...
              </p>
            </div>

            <div className={styles.cardActions}>
              <button
                className={`${styles.cardButton} ${
                  product.inFavorites ? styles.inFavorites : ""
                }`}
                onClick={() =>
                  handleRemoveFromFavorites(product.id, product.inFavorites)
                }
              >
                Удалить из избанного
              </button>
              <button
                className={`${styles.cardButton} ${
                  product.inBasket ? styles.inBasket : ""
                }`}
                onClick={() =>
                  handleToggleInBasket(product.id, product.inBasket)
                }
              >
                {product.inBasket ? "Удалить из корзины" : "Добавить в корзину"}
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className={styles.emptyMessage}>Товары отсутствуют</div>
      )}
      {popup.visible && (
        <CustomPopup
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup({ visible: false, message: "", type: "" })}
        />
      )}
    </div>
  );
}
