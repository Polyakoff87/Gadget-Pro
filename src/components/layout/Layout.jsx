import { Outlet } from "react-router-dom";
import Nav from "../nav/Nav";
import Header from "../header/Header";
import Footer from "../footer/Footer";

export default function Layout() {
  return (
    <div className="App">
      <Nav />
      <Header />
      <div className="content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
