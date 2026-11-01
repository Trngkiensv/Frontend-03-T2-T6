import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import Home from "./pages/Home";

export default function App() {
    return (
        <>
            <Header />
            <CategoryNav />
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </>
    );
}
