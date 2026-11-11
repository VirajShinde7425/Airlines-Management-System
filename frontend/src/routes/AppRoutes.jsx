
import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import MyBookings from "../pages/Passenger/MyBookings";

function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <MainLayout>
                        <Home />
                    </MainLayout>
                }
            />

            <Route
                path="/login"
                element={
                    <MainLayout>
                        <Login />
                    </MainLayout>
                }
            />

            <Route
                path="/my-bookings"
                element={
                    <MainLayout>
                        <MyBookings />
                    </MainLayout>
                }
            />

            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
    );
}

export default AppRoutes;
