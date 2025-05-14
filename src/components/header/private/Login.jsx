import React, { useState } from "react";
import {
  useLoginMutation,
  useUpdateUserIsCurrentMutation,
  useResetAllUsersIsCurrentMutation,
  useSyncFavoritesOnLoginMutation,
  useSyncBasketOnLoginMutation,
} from "../../../api/rtkApi";
import styles from "./Login.module.css";
import CustomPopup from "../../../components/popups/CustomPopup";
import { useTheme } from "../../../context/ThemeContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();
  const [updateUserIsCurrent] = useUpdateUserIsCurrentMutation();
  const [resetAllUsersIsCurrent] = useResetAllUsersIsCurrentMutation();
  const [syncFavoritesOnLogin] = useSyncFavoritesOnLoginMutation();
  const [syncBasketOnLogin] = useSyncBasketOnLoginMutation();
  const { theme } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setPopupMessage("Необходимо заполнить все поля.");
      return;
    }
    try {
      const user = await login({ username, password }).unwrap();

      if (!user || !user.id) {
        setPopupMessage("Недействительные учетные данные.");
        return;
      }
      await resetAllUsersIsCurrent().unwrap();
      await updateUserIsCurrent({ id: user.id, isCurrent: true }).unwrap();

      try {
        await syncFavoritesOnLogin(user.id).unwrap();
        await syncBasketOnLogin(user.id).unwrap();
      } catch (err) {
        console.error("Error syncing favorites:", err);
        setPopupMessage("Ошибка синхронизации избранного.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      if (err.data?.message) {
        setPopupMessage(`Ошибка входа: ${err.data.message}`);
      } else {
        setPopupMessage("Ошибка входа, попробуйте еще раз.");
      }
    }
  };

  return (
    <div className={styles.login_wrapper}>
      <div className={`${styles.login_card} ${styles[theme]}`}>
        <h2>Войти на сайт</h2>
        <form onSubmit={handleLogin}>
          <input
            className={`${styles.input} ${styles[theme]}`}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
          />
          <input
            className={`${styles.input} ${styles[theme]}`}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
          />
          <button
            className={styles.login_button}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Производится вход..." : "Войти"}
          </button>
        </form>
      </div>
      {error && (
        <p className={styles.error}>Ошибка входа. Попробуйте еще раз.</p>
      )}

      {popupMessage && (
        <CustomPopup
          message={popupMessage}
          onClose={() => setPopupMessage("")}
        />
      )}
    </div>
  );
}
