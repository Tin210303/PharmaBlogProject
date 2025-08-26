import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "../App";
import type { FC } from "react";
import { MasterLayout } from "../layouts/MasterLayout";
import Home from "../pages/Home";
import Blog from "../pages/Blog";
import About from "../pages/About";
import ScrollToTop from "../service/ScrollToTop";
import BlogDetail from "../pages/BlogDetail";

const AppRoutes: FC = () => {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route element={<App />}>
                    <Route element={<MasterLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="blog" element={<Blog />} />
                        <Route path="about" element={<About />} />
                        <Route path="posts/:slug" element={<BlogDetail />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export { AppRoutes };