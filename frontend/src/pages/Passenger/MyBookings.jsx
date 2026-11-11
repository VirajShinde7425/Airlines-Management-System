
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaPlane,
    FaTicketAlt,
    FaCalendarAlt
} from "react-icons/fa";

import { useAuth } from "../../context/useAuth.js";
import api from "../../services/api";

function MyBookings() {
    const { user } = useAuth();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState(null);

    // Fetch bookings belonging to the logged-in passenger
    useEffect(() => {
        if (!user) {
            return;
        }

        let ignore = false;

        const loadBookings = async () => {
            try {
                setError("");

                const response = await api.get("/bookings/my");

                if (!ignore) {
                    setBookings(response.data);
                }
            } catch (err) {
                if (!ignore) {
                    setError(
                        err.response?.data?.message ||
                        "Unable to load your bookings."
                    );
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadBookings();

        return () => {
            ignore = true;
        };
    }, [user]);

    // Cancel a booking
    const handleCancel = async (bookingId) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setCancellingId(bookingId);
            setError("");

            const response = await api.delete(
                `/bookings/${bookingId}`
            );

            // Update the cancelled booking in the existing list
            setBookings((previousBookings) =>
                previousBookings.map((booking) =>
                    booking.id === bookingId
                        ? response.data
                        : booking
                )
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to cancel this booking."
            );
        } finally {
            setCancellingId(null);
        }
    };

    // User must log in before viewing bookings
    if (!user) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
                <h2 className="text-2xl font-bold text-blue-900">
                    Please Login
                </h2>

                <p className="mt-2 text-gray-500">
                    Login to view your bookings.
                </p>

                <Link
                    to="/login"
                    className="mt-5 rounded-xl bg-blue-900 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                    Login
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-12">
            <div className="mx-auto max-w-6xl">

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-blue-900">
                        My Bookings
                    </h1>

                    <p className="mt-2 text-gray-500">
                        View and manage your flight bookings.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
                        {error}
                    </div>
                )}

                {/* Loading and Booking List */}
                {loading ? (
                    <div className="py-16 text-center text-gray-600">
                        Loading your bookings...
                    </div>
                ) : bookings.length === 0 ? (
                    /* No Bookings */
                    <div className="rounded-2xl bg-white p-10 text-center shadow">
                        <FaPlane className="mx-auto text-5xl text-blue-900" />

                        <h2 className="mt-5 text-xl font-bold text-slate-800">
                            No Bookings Found
                        </h2>

                        <p className="mt-2 text-gray-500">
                            You haven't booked any flights yet.
                        </p>

                        <Link
                            to="/"
                            className="mt-6 inline-block rounded-xl bg-blue-900 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            Search Flights
                        </Link>
                    </div>
                ) : (
                    /* Booking Cards */
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg"
                            >
                                {/* Booking Header */}
                                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
                                    <div>
                                        <p className="text-lg font-bold text-blue-900">
                                            {booking.flight.airline}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Flight: {booking.flight.flightNumber}
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-full px-4 py-2 text-sm font-semibold ${booking.status === "CONFIRMED"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {booking.status}
                                    </span>
                                </div>

                                {/* Flight Details */}
                                <div className="grid gap-6 py-6 md:grid-cols-3">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Route
                                        </p>

                                        <p className="mt-1 font-semibold text-slate-800">
                                            {booking.flight.source} → {booking.flight.destination}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Departure
                                        </p>

                                        <p className="mt-1 font-semibold text-slate-800">
                                            <FaCalendarAlt className="mr-2 inline text-blue-900" />

                                            {new Date(
                                                booking.flight.departureTime
                                            ).toLocaleString("en-IN")}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Passengers
                                        </p>

                                        <p className="mt-1 font-semibold text-slate-800">
                                            {booking.numberOfSeats}
                                        </p>
                                    </div>
                                </div>

                                {/* Booking Information */}
                                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-5">
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            <FaTicketAlt className="mr-2 inline text-blue-900" />
                                            PNR: <strong>{booking.pnr}</strong>
                                        </p>

                                        <p className="text-sm text-gray-600">
                                            Booking ID: {booking.id}
                                        </p>

                                        <p className="text-sm text-gray-600">
                                            Total Amount:{" "}
                                            <strong className="text-blue-900">
                                                ₹{Number(
                                                    booking.totalAmount
                                                ).toLocaleString("en-IN")}
                                            </strong>
                                        </p>
                                    </div>

                                    {/* Cancel Button */}
                                    {booking.status === "CONFIRMED" && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCancel(booking.id)
                                            }
                                            disabled={
                                                cancellingId === booking.id
                                            }
                                            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {cancellingId === booking.id
                                                ? "Cancelling..."
                                                : "Cancel Booking"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyBookings;
