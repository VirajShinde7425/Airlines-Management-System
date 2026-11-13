
import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import MyBookings from "../pages/Passenger/MyBookings";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminFlights from "../pages/Admin/AdminFlights";
import FlightResults from "../pages/Flights/FlightResults";
import BookingReview from "../pages/Passenger/BookingReview";
import Register from "../pages/Auth/Register";

import ProtectedRoute from "../components/common/ProtectedRoute";

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

            {/* Admin Dashboard */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <MainLayout>
                            <AdminDashboard />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            {/* Admin Flight Management */}
            <Route
                path="/admin/flights"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <MainLayout>
                            <AdminFlights />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/flights/results"
                element={
                    <MainLayout>
                        <FlightResults />
                    </MainLayout>
                }
            />

            <Route
                path="/booking/review"
                element={
                    <ProtectedRoute allowedRoles={["PASSENGER"]}>
                        <MainLayout>
                            <BookingReview />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/register"
                element={
                    <MainLayout>
                        <Register />
                    </MainLayout>
                }
            />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
    );
}

export default AppRoutes;
