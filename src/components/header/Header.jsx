import Logo from "./logo/Logo";
import Search from "./search/Search";
import PrivateButton from "./private/PrivateButton";
import FavoritesButton from "./favorites/FavoritesButton";
import BasketButton from "./basket/BasketButton";
import ThemeSwitcher from "./themeSwitcher/ThemeSwitcher";
import { useTheme } from "../../context/ThemeContext";
import styles from "./Header.module.css";

export default function Header() {
  const { theme } = useTheme();

  return (
    <div className={`${styles.header} ${styles[theme]}`}>
      <Logo></Logo>
      <Search></Search>
      <FavoritesButton></FavoritesButton>
      <BasketButton></BasketButton>
      <PrivateButton></PrivateButton>
      <ThemeSwitcher></ThemeSwitcher>
    </div>
  );
}
