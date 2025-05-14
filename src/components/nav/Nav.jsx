import React from "react";
import style from "./Nav.module.css";
import { useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import NavElement from "./NavElement";

export default function Nav() {
  const select = useSelector((state) => state.nav);
  const { theme } = useTheme();

  return (
    <div className={`${style.menu} ${style[theme]}`}>
      {select.map((el) => {
        return <NavElement key={el.id} el={el} />;
      })}
    </div>
  );
}
