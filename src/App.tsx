import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cart from "./pages/Cart";

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="sticky-top bg-white shadow-sm">
        <Header />
        <CategoryNav />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>

      <Footer />
    </div>
  );
}