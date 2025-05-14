import React, { useState, useMemo, useEffect } from "react";
import styles from "./SectionElement.module.css";
import { useParams, Link } from "react-router-dom";
import {
  useGetGoodsQuery,
  useUpdateInFavoritesStatusMutation,
  useUpdateInBasketStatusMutation,
} from "../../../../api/rtkApi";
import CustomPopup from "../../../popups/CustomPopup";
import { useUserContext } from "../../../../context/UserContext";

export default function SectionElement({ item }) {
  const { userId } = useUserContext();
  const { name, link } = useParams();
  const [updateInFavoritesStatus] = useUpdateInFavoritesStatusMutation();
  const [updateInBasketStatus] = useUpdateInBasketStatusMutation();
  const [checked, setChecked] = useState(true);
  const [filteredByStock, setFilteredByStock] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortByPrice, setSortByPrice] = useState(false);
  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentName = link;
  const query = `${name}?&title=${currentName}`;
  const { data, error, isLoading } = useGetGoodsQuery(query);

  const filteredData = useMemo(() => {
    if (!data) return [];
    let filtered = data.filter(
      (product) => !filteredByStock || product.inStock
    );
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }
    return filtered;
  }, [data, filteredByStock, selectedBrands]);

  const sortedData = useMemo(() => {
    return filteredData
      .slice()
      .sort((a, b) => (sortByPrice ? a.price - b.price : b.price - a.price));
  }, [filteredData, sortByPrice]);

  const brands = useMemo(() => {
    return data ? [...new Set(data.map((product) => product.brand))] : [];
  }, [data]);

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

  const renderCard = (product) => (
    <div
      key={product.id}
      className={checked ? styles.cardGrid : styles.cardList}
    >
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
            handleToggleInFavorites(product.id, product.inFavorites)
          }
        >
          {product.inFavorites
            ? "Удалить из избранного"
            : "Добавить в избранное"}
        </button>
        <button
          className={`${styles.cardButton} ${
            product.inBasket ? styles.inBasket : ""
          }`}
          onClick={() => handleToggleInBasket(product.id, product.inBasket)}
        >
          {product.inBasket ? "Удалить из корзины" : "Добавить в корзину"}
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data. Please try again later.</div>;
  }

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.sidebar}>
        <div style={{ margin: "10px auto" }}>Отображение товаров</div>
        <label className={styles.checkbox}>
          <input type="checkbox" onChange={() => setChecked(!checked)} />
          <span className={styles.checkbox_switch}>
            <span
              className={styles.checkbox_feature}
              data-label-on="Список"
              data-label-off="Сетка"
            ></span>
          </span>
        </label>
        <div style={{ margin: "10px auto" }}>Наличие в магазине</div>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            onChange={() => setFilteredByStock(!filteredByStock)}
          />
          <span className={styles.checkbox_switch}>
            <span
              className={styles.checkbox_feature}
              data-label-on="В наличии"
              data-label-off="Все товары"
            ></span>
          </span>
        </label>
        <div style={{ margin: "10px auto" }}>Цена</div>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            onChange={() => setSortByPrice(!sortByPrice)}
          />
          <span className={styles.checkbox_switch}>
            <span
              className={styles.checkbox_feature}
              data-label-on="Дешевле"
              data-label-off="Дороже"
            ></span>
          </span>
        </label>
        <div style={{ margin: "10px auto" }}>Производитель</div>
        {brands.map((brand) => (
          <div key={brand}>
            <input
              type="checkbox"
              className={styles.checkbox}
              onChange={() => {
                const updatedBrands = selectedBrands.includes(brand)
                  ? selectedBrands.filter((b) => b !== brand)
                  : [...selectedBrands, brand];
                setSelectedBrands(updatedBrands);
              }}
            />
            <label style={{ margin: "5px" }}>{brand}</label>
          </div>
        ))}
      </div>
      <div className={styles.sectionWrapper}>
        {sortedData?.length > 0 ? (
          sortedData.map((product) => renderCard(product))
        ) : (
          <div>No items found</div>
        )}
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
