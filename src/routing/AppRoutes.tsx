import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "../App";
import type { FC } from "react";
import { MasterLayout } from "../layouts/MasterLayout";
import Home from "../pages/Home";

const AppRoutes: FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<App />}>
                    <Route element={<MasterLayout />}>
                        <Route path="home" element={<Home />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export { AppRoutes };