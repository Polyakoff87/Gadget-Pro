import { UserProvider } from "./context/UserContext";
import { OrdersProvider } from "./context/OrdersContext";
import { BrandsProvider } from "./context/BrandsContext";
import { useTheme } from "./context/ThemeContext";
import { ActiveLinkProvider } from "./context/ActiveLinkContext";
import Layout from "./components/layout/Layout";
import { Routes, Route } from "react-router-dom";
import styles from "./App.module.css";
import Main from "./components/content/main/Main";
import Catalog from "./components/content/catalog/Catalog";
import Promo from "./components/content/promo/Promo";
import About from "./components/content/about/About";
import CatalogElement from "./components/content/catalog/catalogElement/CatalogElement";
import SectionElement from "./components/content/catalog/sectionElement/SectionElement";
import CardElement from "./components/content/catalog/cardElement/CardElement";
import SearchResults from "./components/content/searchResults/SearchResults";
import FavoritesResults from "./components/content/favoritesResults/FavoritesResults";
import BasketResults from "./components/content/basketResults/BasketResults";
import Login from "./components/header/private/Login";
import Register from "./components/header/private/Register";
import PrivateCabinet from "./components/header/private/PrivateCabinet";
import AdminPanel from "./components/header/private/AdminPanel";
import AuthPage from "./components/header/private/AuthPage";

export default function App() {
  const { theme } = useTheme();
  return (
    <div className={`${styles.App} ${styles[theme]}`}>
      <UserProvider>
        <OrdersProvider>
          <BrandsProvider>
            <ActiveLinkProvider>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route path="/authPage" element={<AuthPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/privateCabinet" element={<PrivateCabinet />} />
                  <Route path="/adminPanel" element={<AdminPanel />} />
                  <Route index element={<Main />} />
                  <Route path="catalog" element={<Catalog />} />
                  <Route path="catalog/:name" element={<CatalogElement />}>
                    <Route path=":link" element={<SectionElement />} />
                  </Route>
                  <Route path="goods/:link/:model" element={<CardElement />} />
                  <Route path="promo" element={<Promo />} />
                  <Route path="about" element={<About />} />
                  <Route path="searchResults" element={<SearchResults />} />
                  <Route
                    path="favoritesResults"
                    element={<FavoritesResults />}
                  />
                  <Route path="basketResults" element={<BasketResults />} />
                </Route>
              </Routes>
            </ActiveLinkProvider>
          </BrandsProvider>
        </OrdersProvider>
      </UserProvider>
    </div>
  );
}
