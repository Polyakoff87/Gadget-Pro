import React, { useState, useMemo, useEffect } from "react";
import styles from "./SearchResults.module.css";
import { useSearchParams, Link } from "react-router-dom";
import {
  useGetSearchResultsQuery,
  useUpdateInFavoritesStatusMutation,
  useUpdateInBasketStatusMutation,
} from "../../../api/rtkApi";
import CustomPopup from "../../popups/CustomPopup";
import { useUserContext } from "../../../context/UserContext";

export default function SearchResults() {
  const { userId } = useUserContext();
  const [searchParams] = useSearchParams();
  const tags = useMemo(() => {
    return searchParams.get("tags")
      ? decodeURIComponent(searchParams.get("tags")).toLowerCase().split(",")
      : [];
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useGetSearchResultsQuery("");

  const [checked, setChecked] = useState(true);
  const [filteredByStock, setFilteredByStock] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortByPrice, setSortByPrice] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [updateInFavoritesStatus] = useUpdateInFavoritesStatusMutation();
  const [updateInBasketStatus] = useUpdateInBasketStatusMutation();
  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });

  const filteredResults = useMemo(() => {
    if (!products || tags.length === 0) return [];

    let filtered = products;

    filtered = filtered.filter((product) =>
      tags.some((tag) => product.tags?.includes(tag))
    );

    if (filteredByStock) {
      filtered = filtered.filter((product) => product.inStock === true);
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    filtered = sortByPrice
      ? filtered.sort((a, b) => a.price - b.price)
      : filtered.sort((a, b) => b.price - a.price);

    return filtered;
  }, [products, tags, filteredByStock, selectedBrands, sortByPrice]);

  const brands = filteredResults
    ? [...new Set(filteredResults.map((product) => product.brand))]
    : [];

  const handleToggleInFavorites = (productId, currentStatus) => {
    if (userId === "2") {
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
        refetch();
        setRefreshKey((prevKey) => prevKey + 1);
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
    if (userId === "2") {
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
        refetch();
        setRefreshKey((prevKey) => prevKey + 1);
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

  const sortedData = useMemo(() => {
    return filteredResults
      .slice()
      .sort((a, b) => (sortByPrice ? a.price - b.price : b.price - a.price));
  }, [filteredResults, sortByPrice]);

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
    <div key={refreshKey} className={styles.mainWrapper}>
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
          <div>Ничего не найдено</div>
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
