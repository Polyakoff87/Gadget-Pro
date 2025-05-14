import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthPage.module.css";
import {
  useGetCurrentUserQuery,
  useResetAllUsersIsCurrentMutation,
  useUpdateUserIsCurrentMutation,
  useResetAllFavoritesMutation,
  useResetAllBasketMutation,
} from "../../../api/rtkApi";
import CustomPopup from "../../../components/popups/CustomPopup";
import { useTheme } from "../../../context/ThemeContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const [resetAllUsersIsCurrent] = useResetAllUsersIsCurrentMutation();
  const [updateUserIsCurrent] = useUpdateUserIsCurrentMutation();
  const [resetAllFavorites] = useResetAllFavoritesMutation();
  const [resetAllBasket] = useResetAllBasketMutation();
  const { data: user, isLoading, error } = useGetCurrentUserQuery();
  const { theme } = useTheme();
  const [popupMessage, setPopupMessage] = useState("");

  if (isLoading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p>Error loading user data. Please try again later.</p>;
  }

  if (!user) {
    return (
      <div className={styles.auth_wrapper}>
        <h2>Пользователь не найден</h2>
        <p>Пожалуйста, войдите в систему.</p>
        <button
          onClick={() => navigate("/login")}
          className={styles.auth_button}
        >
          Войти
        </button>
      </div>
    );
  }

  const handleLogoutClick = async () => {
    try {
      await resetAllUsersIsCurrent().unwrap();
      await updateUserIsCurrent({ id: "2", isCurrent: true }).unwrap();
      await resetAllFavorites().unwrap();
      await resetAllBasket().unwrap();
    } catch (err) {
      setPopupMessage("Не удалось выполнить выход, попробуйте еще раз.");
    }
  };

  const handleRedirect = () => {
    if (user?.role === "admin") {
      navigate("/adminPanel");
    } else if (user?.role === "user") {
      navigate("/privateCabinet");
    }
  };

  return (
    <div className={styles.auth_wrapper}>
      <div className={`${styles.auth_card} ${styles[theme]}`}>
        <h2>
          Добро пожаловать,{" "}
          {user?.role === "guest" ? "Гость (не авторизован)" : user?.username}!
        </h2>
        {user?.role === "guest" ? (
          <p className={styles.auth_message}>
            Пожалуйста, войдите в систему или зарегистрируйтесь, чтобы получить
            возможность оформлять заказы.
          </p>
        ) : (
          ""
        )}
        <div className={styles.auth_buttons}>
          {user?.role === "guest" ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className={styles.auth_button}
              >
                Войти
              </button>
              <button
                onClick={() => navigate("/register")}
                className={styles.auth_button}
              >
                Регистрация
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogoutClick}
                className={styles.auth_button}
              >
                Выйти
              </button>
              <button onClick={handleRedirect} className={styles.auth_button}>
                Перейти в{" "}
                {user?.role === "admin" ? "админ-панель" : "личный кабинет"}
              </button>
            </>
          )}
        </div>

        {popupMessage && (
          <CustomPopup
            message={popupMessage}
            onClose={() => setPopupMessage("")}
          />
        )}
      </div>
    </div>
  );
}
