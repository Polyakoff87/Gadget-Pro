import React, { useState, useMemo } from "react";
import styles from "./BasketResults.module.css";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetGoodsQuery,
  useUpdateInBasketStatusMutation,
  useUpdatePlaceOnOrderStatusMutation,
} from "../../../api/rtkApi";
import CustomPopup from "../../popups/CustomPopup";
import { useUserContext } from "../../../context/UserContext";

export default function BasketResults() {
  const { userId } = useUserContext();
  const navigate = useNavigate();
  const { data: goods, error, isLoading } = useGetGoodsQuery("");

  const [updateInBasketStatus] = useUpdateInBasketStatusMutation();
  const [updatePlaceOnOrderStatus] = useUpdatePlaceOnOrderStatusMutation();

  const filteredBasket = useMemo(() => {
    return goods?.filter((el) => el.inBasket) || [];
  }, [goods]);

  const totalQuantity = useMemo(() => {
    return filteredBasket.length;
  }, [filteredBasket]);

  const totalAmount = useMemo(() => {
    return filteredBasket.reduce((sum, product) => sum + product.price, 0);
  }, [filteredBasket]);

  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });

  const handleRemoveFromBasket = (productId) => {
    updateInBasketStatus({ userId, productId, inBasket: false })
      .unwrap()
      .then(() => {
        setPopup({
          visible: true,
          message: "Товар удален из корзины",
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

  const handlePlaceOnOrder = (productId, productName, productImg) => {
    updatePlaceOnOrderStatus({
      userId,
      productId,
      productName,
      productImg,
      inBasket: false,
    })
      .unwrap()
      .then(() => {
        navigate("/privateCabinet");
      })
      .catch((error) => {
        console.error("Error:", error);
        setPopup({
          visible: true,
          message: "Ошибка, попробуйте снова позже",
          type: "error",
        });
      });
    updateInBasketStatus({ userId, productId, inBasket: false })
      .unwrap()
      .then(() => {
        setPopup({
          visible: true,
          message: "Товар удален из корзины",
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
      <h2 className={styles.title}>Корзина</h2>
      <div className={styles.summary}>
        <p style={{ marginRight: "10px" }}>
          Количество товаров:{" "}
          <span style={{ marginLeft: "5px" }}>{totalQuantity}</span>
        </p>
        <p>
          на сумму{" "}
          <span style={{ marginLeft: "5px" }}>
            {totalAmount.toLocaleString()}{" "}
          </span>
          руб.
        </p>
      </div>
      {filteredBasket.length > 0 ? (
        filteredBasket.map((product) => (
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
                  product.inBasket ? styles.inBasket : ""
                }`}
                onClick={() =>
                  handleRemoveFromBasket(product.id, product.inBasket)
                }
              >
                {product.inBasket ? "Удалить из корзины" : "Добавить в корзину"}
              </button>
              <button
                className={styles.cardButton}
                onClick={() => handlePlaceOnOrder(product.id, product.inBasket)}
              >
                Оформить заказ
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className={styles.emptyMessage}>Корзина пуста</div>
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
