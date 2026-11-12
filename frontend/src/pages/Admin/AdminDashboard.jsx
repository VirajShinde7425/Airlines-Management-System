
import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const response = await api.get("/admin/dashboard/stats");
                setStats(response.data);
            } catch (err) {
                setError(
                    err.response?.status === 403
                        ? "You do not have admin permission."
                        : err.response?.status === 401
                            ? "Your session has expired. Please log in again."
                            : "Unable to load dashboard statistics."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    const formatRevenue = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(Number(amount || 0));
    };

    const dashboardCards = stats
        ? [
            {
                title: "Total Flights",
                value: stats.totalFlights,
                description: "Flights registered in the system",
            },
            {
                title: "Total Bookings",
                value: stats.totalBookings,
                description: "Total booking records",
            },
            {
                title: "Total Passengers",
                value: stats.totalPassengers,
                description: "Registered passengers",
            },
            {
                title: "Total Revenue",
                value: formatRevenue(stats.totalRevenue),
                description: "Revenue from confirmed bookings",
            },
        ]
        : [];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-8 text-gray-600">
                Loading admin dashboard...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800">
                Admin Dashboard
            </h1>

            <p className="mt-2 mb-8 text-gray-500">
                Welcome to Airline Management System administration.
            </p>

            {error ? (
                <div className="rounded-lg bg-red-100 p-4 text-red-700">
                    {error}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {dashboardCards.map((card) => (
                        <div
                            key={card.title}
                            className="rounded-xl bg-white p-6 shadow-sm"
                        >
                            <h2 className="font-semibold text-gray-600">
                                {card.title}
                            </h2>

                            <p className="mt-3 text-2xl font-bold text-gray-800">
                                {card.value}
                            </p>

                            <p className="mt-2 text-sm text-gray-500">
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
