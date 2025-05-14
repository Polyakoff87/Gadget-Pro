import React from "react";
import styles from "./FavoritesButton.module.css";
import { useNavigate } from "react-router-dom";
import { useGetGoodsQuery } from "../../../api/rtkApi";

export default function Favorites() {
  const navigate = useNavigate();

  const { data: goods, isLoading } = useGetGoodsQuery("");

  const favoritesCount = goods?.filter((el) => el.inFavorites).length || 0;

  const handleFavoritesSubmit = (event) => {
    event.preventDefault();
    navigate(`/favoritesResults`);
  };

  return (
    <div className={styles.favorites_wrapper}>
      <button
        title={"Список избранного"}
        className={styles.favorites_button}
        onClick={handleFavoritesSubmit}
      ></button>
      <output className={styles.favorites_output}>
        {isLoading ? "..." : favoritesCount}
      </output>
    </div>
  );
}
