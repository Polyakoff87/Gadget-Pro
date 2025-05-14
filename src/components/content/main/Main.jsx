import React, { useEffect, useMemo } from "react";
import styles from "./Main.module.css";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useGetSectionsQuery } from "../../../api/rtkApi";
import { useBrandContext } from "../../../context/BrandsContext";
import { useTheme } from "../../../context/ThemeContext";

export default function Main() {
  const navigate = useNavigate();
  const { name } = useParams();
  const { theme } = useTheme();

  const currentName = name?.match(/([a-zа-яё]+)/i)?.[0] || "default";

  const { data, error, isLoading } = useGetSectionsQuery();
  const { brands } = useBrandContext();

  const sections = useMemo(() => {
    return data?.map((item) => item.links).flat() || [];
  }, [data]);

  const handleBrandClick = (brandId) => {
    if (brandId) {
      navigate(`/searchResults?tags=${brandId}`);
    }
  };

  const handleSectionClick = (section) => {
    if (section) {
      navigate(`/catalog/${currentName}/${section}`);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [name]);

  const brand_settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 4000,
    rows: 1,
  };

  const section_settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 4000,
    rows: 1,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading sections. Please try again later.</div>;
  }
  return (
    <div className={styles.main_container}>
      <div className={`${styles.section_wrapper} ${styles[theme]}`}>
        <section className={styles.section}>
          <div className={styles.hero}></div>
          <div className={styles.description}>
            <p className={styles.main_text}>
              Добро пожаловать в Gadget Pro – ваш главный пункт назначения
              электроники!
            </p>
            <p className={styles.text}>
              Откройте для себя новейшие и самые лучшие передовые технологии в
              Gadget Pro.
            </p>
            <p className={styles.text}>
              От мощных ноутбуков и стильных смартфонов до инновационного
              игрового оборудования и качественной акустики – мы представляем
              вам лучшие гаджеты от ведущих мировых брендов.
            </p>
            <p className={styles.text}>
              Изучите наши тщательно отобранные категории, чтобы найти идеальные
              технические решения для работы, игр и всего остального.
            </p>
          </div>
        </section>
      </div>

      <div className={`${styles.section_wrapper_categories} ${styles[theme]}`}>
        <h2 className={styles.carousel_title}>
          Выбирайте среди популярных категорий
        </h2>
        <section className={styles.section}>
          <Slider {...section_settings} className={styles.carousel}>
            {sections?.map((section) => (
              <div
                key={`${section.id}-${section.name}`}
                className={`${styles.section_card} ${styles[theme]}`}
                onClick={() => handleSectionClick(section.name)}
              >
                <img
                  src={section.img}
                  alt={section.title || "Section image"}
                  className={styles.section_image}
                />
                <p className={styles.section_name}>{section.title}</p>
              </div>
            ))}
          </Slider>
        </section>
      </div>

      <div className={`${styles.section_wrapper} ${styles[theme]}`}>
        <section className={styles.section}>
          <div className={styles.promo_asus}></div>
          <div className={styles.description}>
            <p className={styles.main_text}>Специальное предложение!</p>
            <p className={styles.text}>Только до конца месяца!</p>
            <p className={styles.text}>
              Успейте воспользоваться действительно выгодным предложением!{" "}
            </p>
            <p className={styles.text}>
              При покупке видеокарты от ASUS - cкидка 5% на мыши и клавиатуры
              этого бренда!
            </p>
            <p className={styles.text}>
              ASUS - вместе к киберспортивным победам!
            </p>
            <div className={styles.btn_actions}>
              <button
                className={styles.button}
                onClick={() => navigate("/promo")}
              >
                Узнать больше
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className={`${styles.section_wrapper_brands} ${styles[theme]}`}>
        <h2 className={styles.carousel_title}>Исследуйте лучшие бренды</h2>
        <section className={styles.section}>
          <Slider {...brand_settings} className={styles.carousel}>
            {brands.map((brand) => (
              <div
                key={brand.id}
                className={`${styles.brand_card} ${styles[theme]}`}
                onClick={() => handleBrandClick(brand.id)}
              >
                <img
                  src={brand.img}
                  alt={brand.name}
                  className={styles.brand_image}
                />
              </div>
            ))}
          </Slider>
        </section>
      </div>

      <div className={`${styles.section_wrapper} ${styles[theme]}`}>
        <section className={styles.section}>
          <div className={styles.promo_sony}></div>
          <div className={styles.description}>
            <p className={styles.main_text}>Слышать как никогда раньше!</p>
            <p className={styles.text}>
              Откройте для себя любимые треки заново с Bluetooth-гарнитурой Sony
              WH-1000XM5.
            </p>
            <p className={styles.text}>
              Обретите свободу от проводов и насладитесь качеством звука,
              которое вы заслуживаете.
            </p>
            <p className={styles.text}>
              Для повышения разрешения сжатых файлов реализована технология DSEE
              Extreme. Распознавая жанры, музыкальные инструменты, она
              восстанавливает детали, которых композиции лишились после сжатия.
            </p>{" "}
            <div className={styles.btn_actions}>
              {" "}
              <button
                className={styles.button}
                onClick={() => navigate("goods/Sony/WH-1000XM5")}
              >
                На страницу товара
              </button>
              <a
                className={styles.review}
                target="_blank"
                rel="noreferrer"
                href="https://doctorhead.ru/blog/obzor-naushnikov-sony-wh-1000xm5-novyy-korol-shumopodavleniya/?srsltid=AfmBOoo1f8wO5ID0UPc-TnR6fSYCywOd1b0FPQtacB2ucxoLQJoF-fiW"
              >
                Обзор
              </a>
            </div>
          </div>
        </section>
      </div>

      <div className={`${styles.section_wrapper} ${styles[theme]}`}>
        <section className={styles.section}>
          <div className={styles.bottom}></div>
          <div className={styles.description}>
            <div className={styles.text_bottom}>
              <p className={styles.text}>
                Независимо от того, являетесь ли вы энтузиастом технологий,
                геймером или просто ищете идеальный подарок, в Gadget Pro
                найдется что-то для каждого.
              </p>
              <p className={styles.text}>
                Покупайте с уверенностью и наслаждайтесь эксклюзивными
                предложениями, быстрой доставкой и исключительным обслуживанием
                клиентов.
              </p>
              <p className={styles.text}>
                Обновите свою техническую игру сегодня с Gadget Pro — где
                инновации встречаются с удобством!
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
