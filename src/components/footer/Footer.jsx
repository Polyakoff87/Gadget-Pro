import style from "./Footer.module.css";
import vk_icon from "../../pictures/vk.svg";
import useResponsiveWidth from "../../hooks/useResponsiveWidth";

export default function Footer() {
  const { width } = useResponsiveWidth();
  const styles = {
    container: {
      width: `${width}`,
      display: "flex",
      flexWrap: "wrap",
      backgroundColor: "rgba(102, 107, 103, 0.5)",
      color: "#d77505",
      fontFamily: "Arial, Helvetica, sans-serif",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      padding: "0px 15% 0px 15%",
      height: "120px",
      marginTop: "80px",
    },
  };

  return (
    <div style={styles.container}>
      <p className={style.p}> Gadget Pro ©</p>
      <p className={style.p}>634045 г. Томск, ул. Тверская, 88, офис 102</p>
      <div>
        <p className={style.p}>gadgetpro@gmail.ru</p>
      </div>
      <div>
        <p className={style.p}>Тел. 66-51-42</p>
      </div>
      <div>
        <div>
          <a href="https://vk.com/gadget_pro_spb?from=search" target="_blank" rel="noreferrer">
            <img className={style.vk_img} src={vk_icon} alt="" />
          </a>
        </div>
      </div>
    </div>
  );
}
