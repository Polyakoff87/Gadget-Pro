import React from "react";
import styles from "./BasketButton.module.css";
import { useNavigate } from "react-router-dom";
import { useGetGoodsQuery } from "../../../api/rtkApi";

export default function Favorites() {
  const navigate = useNavigate();

  const { data: goods, isLoading } = useGetGoodsQuery("");

  const favoritesCount = goods?.filter((el) => el.inBasket).length || 0;

  const handleBasketSubmit = (event) => {
    event.preventDefault();
    navigate(`/basketResults`);
  };

  return (
    <div className={styles.basket_wrapper}>
      <button
        title={"Ваша корзина"}
        className={styles.basket_button}
        onClick={handleBasketSubmit}
      ></button>
      <output className={styles.basket_output}>
        {isLoading ? "..." : favoritesCount}
      </output>
    </div>
  );
}
