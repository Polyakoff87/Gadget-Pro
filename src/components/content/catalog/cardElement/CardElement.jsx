import styles from "./CardElement.module.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useGetGoodsQuery,
  useUpdateInBasketStatusMutation,
  useUpdateInFavoritesStatusMutation,
} from "../../../../api/rtkApi";
import { Image } from "antd";
import CustomPopup from "../../../popups/CustomPopup";
import { useUserContext } from "../../../../context/UserContext";
import { useTheme } from "../../../../context/ThemeContext";
import useResponsiveWidth from "../../../../hooks/useResponsiveWidth";

export default function CardElement() {
  const { userId } = useUserContext();
  const { link, model } = useParams();
  const currentModel = model;
  const { theme } = useTheme();

  const query = `${link}?&model=${currentModel}`;
  const { data, error, isLoading } = useGetGoodsQuery(query);
  const currentData = data ? data[0] : undefined;

  const [updateInBasketStatus] = useUpdateInBasketStatusMutation();
  const [updateInFavoritesStatus] = useUpdateInFavoritesStatusMutation();
  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });

  const [activeImage, setActiveImage] = useState("/path/to/fallback-image.jpg");
  const currentWidth = useResponsiveWidth();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (currentData?.images?.length > 0) {
      setActiveImage(currentData.images[0]);
    }
  }, [currentData]);

  const handleToggleInFavorites = (productId, currentStatus) => {
    if (!userId) {
      setPopup({
        visible: true,
        message: "Пользователь не авторизован",
        type: "error",
      });
      return;
    }
    updateInFavoritesStatus({ userId, productId, inFavorites: !currentStatus })
      .unwrap()
      .then(() => {
        setPopup({
          visible: true,
          message: currentStatus
            ? "Товар удален из избранного"
            : "Товар добавлен в избранное",
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
    if (!userId) {
      setPopup({
        visible: true,
        message: "Пользователь не авторизован",
        type: "error",
      });
      return;
    }
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

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка загрузки данных. Попробуйте позже.</p>;

  return (
    <div className={styles.mainWrapper}>
      <div className={`${styles.cardWrapper} ${styles[theme]}`}>
        <div className={styles.imageSection}>
          <Image
            src={activeImage}
            alt={currentData?.title}
            width={`${currentWidth / 3}`}
            style={{ objectFit: "cover", borderRadius: "8px" }}
          />
          <div className={styles.thumbnailWrapper}>
            {currentData?.images?.map((el, index) => (
              <img
                key={index}
                src={el}
                alt={`Thumbnail ${index + 1}`}
                className={`${styles.thumbnail} ${
                  activeImage === el ? styles.activeThumbnail : ""
                }`}
                onClick={() => setActiveImage(el)}
              />
            ))}
          </div>
        </div>
        <div className={styles.detailsSection}>
          <div className={styles.cardTitle}>
            {currentData?.brand} {currentData?.model}
          </div>
          <div className={styles.cardDescription}>
            {currentData?.description}
          </div>
          <div className={styles.cardPrice}>
            Цена: {currentData?.price?.toLocaleString() || "N/A"} руб.
          </div>
          <div className={styles.cardActions}>
            <button
              className={`${styles.button} ${
                currentData?.inFavorites ? styles.inFavorites : ""
              }`}
              onClick={() =>
                handleToggleInFavorites(
                  currentData?.id,
                  currentData?.inFavorites
                )
              }
            >
              {currentData?.inFavorites
                ? "Удалить из избранного"
                : "Добавить в избранное"}
            </button>
            <button
              className={`${styles.button} ${
                currentData?.inBasket ? styles.inBasket : ""
              }`}
              onClick={() =>
                handleToggleInBasket(currentData?.id, currentData?.inBasket)
              }
            >
              {currentData?.inBasket
                ? "Удалить из корзины"
                : "Добавить в корзину"}
            </button>
          </div>
        </div>
      </div>
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
