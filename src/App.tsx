import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import Home from "./pages/Home";
import Cart from "./pages/Cart";

export default function App() {
    return (
        <>
            <Header />
            <CategoryNav />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
        </>
    );
}
