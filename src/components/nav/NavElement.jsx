import { useEffect, useMemo } from "react";
import style from "./Nav.module.css";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useActiveLink } from "../../context/ActiveLinkContext";

export default function NavElement({ el }) {
  const { theme } = useTheme();
  const { activeLink, setActiveLink } = useActiveLink();
  const location = useLocation();
  const navRoutes = useMemo(() => ["/catalog", "/promo", "/about"], []);

  useEffect(() => {
    if (location.pathname === el.to) {
      setActiveLink(el.to);
    } else if (!navRoutes.includes(location.pathname)) {
      setActiveLink(null);
    }
  }, [location, el.to, navRoutes, setActiveLink]);

  const handleClick = () => {
    setActiveLink(el.to);
  };

  return (
    <li key={el.id}>
      <NavLink
        to={el.to}
        className={`${style.nav_link} ${style[theme]} ${
          activeLink === el.to ? style.active : ""
        }`}
        onClick={handleClick}
      >
        {el.name}
      </NavLink>
    </li>
  );
}
