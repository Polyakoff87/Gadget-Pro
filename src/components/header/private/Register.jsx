import { useState } from "react";
import { useRegisterMutation } from "../../../api/rtkApi";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import CustomPopup from "../../../components/popups/CustomPopup";
import { useTheme } from "../../../context/ThemeContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const [popupMessage, setPopupMessage] = useState("");
  const { theme } = useTheme();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setPopupMessage("Заполните все поля.");
      return;
    }
    if (password.length < 6) {
      setPopupMessage("Пароль должен быть не короче 6 символов.");
      return;
    }
    try {
      await register({ username, password, role: "user" }).unwrap();
      setPopupMessage("Вы успешно зарегистрированы!");
      setTimeout(() => {
        setPopupMessage("");
        navigate("/login");
      }, 3000);
    } catch (err) {
      if (err.data?.message) {
        setPopupMessage(`Ошибка регистрации: ${err.data.message}`);
      } else {
        setPopupMessage("Ошибка регистрации. Попробуйте позже.");
      }
    }
  };

  return (
    <div className={styles.register_wrapper}>
      <div className={`${styles.register_card} ${styles[theme]}`}>
        <h2>Регистрация</h2>
        <form onSubmit={handleRegister}>
          <input
            className={`${styles.input} ${styles[theme]}`}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className={`${styles.input} ${styles[theme]}`}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className={styles.register_button}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
      {popupMessage && (
        <CustomPopup
          message={popupMessage}
          onClose={() => setPopupMessage("")}
        />
      )}
    </div>
  );
}
