
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaPlane,
    FaTicketAlt,
    FaCalendarAlt,
    FaUsers,
    FaWallet,
    FaCheckCircle,
    FaTimesCircle,
    FaArrowRight,
    FaPlaneDeparture,
    FaPlaneArrival,
} from "react-icons/fa";

import { useAuth } from "../../context/useAuth.js";
import api from "../../services/api";

function formatDateTime(value) {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatCurrency(value) {
    return Number(value || 0).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
    });
}

function MyBookings() {
    const { user } = useAuth();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState(null);

    // Fetch passenger bookings
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

    // Cancel booking
    const handleCancel = async (bookingId) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmed) return;

        try {
            setCancellingId(bookingId);
            setError("");

            const response = await api.delete(`/bookings/${bookingId}`);

            setBookings((previousBookings) =>
                previousBookings.map((booking) =>
                    booking.id === bookingId ? response.data : booking
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

    // Login check
    if (!user) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center bg-slate-50 px-4">
                <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
                    <FaPlane className="mx-auto text-5xl text-blue-900" />

                    <h2 className="mt-5 text-2xl font-bold text-slate-900">
                        Please Login
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Login to view and manage your bookings.
                    </p>

                    <Link
                        to="/login"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
                    >
                        Login Now <FaArrowRight />
                    </Link>
                </div>
            </div>
        );
    }

    const confirmedBookings = bookings.filter(
        (booking) => booking.status === "CONFIRMED"
    );

    const cancelledBookings = bookings.filter(
        (booking) => booking.status === "CANCELLED"
    );

    const totalSpent = confirmedBookings.reduce(
        (total, booking) => total + Number(booking.totalAmount || 0),
        0
    );

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">

                {/* Page Heading */}
                <div className="mb-9">
                    <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
                        Your Travel Dashboard
                    </p>

                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        My Bookings
                    </h1>

                    <p className="mt-3 max-w-xl text-slate-500">
                        All your journeys in one place. View your tickets,
                        track booking status and manage your reservations.
                    </p>
                </div>

                {/* Booking Summary */}
                {!loading && bookings.length > 0 && (
                    <div className="mb-9 grid gap-4 sm:grid-cols-3">

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Total Bookings
                                    </p>
                                    <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                                        {bookings.length}
                                    </h2>
                                </div>

                                <div className="rounded-xl bg-blue-50 p-3 text-blue-800">
                                    <FaTicketAlt className="text-xl" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Confirmed
                                    </p>
                                    <h2 className="mt-2 text-3xl font-extrabold text-green-700">
                                        {confirmedBookings.length}
                                    </h2>
                                </div>

                                <div className="rounded-xl bg-green-50 p-3 text-green-700">
                                    <FaCheckCircle className="text-xl" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Confirmed Booking Value
                                    </p>
                                    <h2 className="mt-2 text-2xl font-extrabold text-blue-900">
                                        ₹{formatCurrency(totalSpent)}
                                    </h2>
                                </div>

                                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                                    <FaWallet className="text-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                        {error}
                    </div>
                )}

                {/* Loading / Empty / Bookings */}
                {loading ? (
                    <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-900" />

                        <p className="mt-5 font-medium text-slate-500">
                            Loading your bookings...
                        </p>
                    </div>
                ) : bookings.length === 0 ? (

                    /* Empty State */
                    <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                            <FaPlane className="text-4xl text-blue-900" />
                        </div>

                        <h2 className="mt-6 text-2xl font-bold text-slate-900">
                            No Bookings Yet
                        </h2>

                        <p className="mx-auto mt-3 max-w-md text-slate-500">
                            Your next adventure is waiting. Explore available
                            flights and book your first journey with SkyWings.
                        </p>

                        <Link
                            to="/"
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-900 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-800"
                        >
                            Explore Flights <FaArrowRight />
                        </Link>
                    </div>
                ) : (

                    /* Booking List */
                    <div>
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-xl font-bold text-slate-900">
                                Your Reservations
                            </h2>

                            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
                                {bookings.length} booking(s)
                            </span>
                        </div>

                        <div className="space-y-6">
                            {bookings.map((booking) => {
                                const flight = booking.flight;
                                const isConfirmed = booking.status === "CONFIRMED";
                                const isCancelling = cancellingId === booking.id;

                                return (
                                    <div
                                        key={booking.id}
                                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                                    >
                                        {/* Card Header */}
                                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-7">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900 text-white">
                                                    <FaPlane className="text-xl" />
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900">
                                                        {flight.airline}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        Flight {flight.flightNumber}
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold tracking-wide ${isConfirmed
                                                        ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                                                        : "bg-red-50 text-red-700 ring-1 ring-red-200"
                                                    }`}
                                            >
                                                {isConfirmed ? (
                                                    <FaCheckCircle />
                                                ) : (
                                                    <FaTimesCircle />
                                                )}
                                                {booking.status}
                                            </span>
                                        </div>

                                        {/* Flight Route */}
                                        <div className="px-5 py-7 sm:px-7">
                                            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                        From
                                                    </p>

                                                    <h3 className="mt-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
                                                        {flight.source}
                                                    </h3>

                                                    <p className="mt-2 text-xs text-slate-500">
                                                        <FaPlaneDeparture className="mr-1 inline" />
                                                        Departure
                                                    </p>
                                                </div>

                                                <div className="flex flex-col items-center px-1">
                                                    <FaPlane className="text-xl text-blue-800" />
                                                    <div className="my-2 h-px w-12 border-t-2 border-dashed border-blue-200 sm:w-24" />
                                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                        Route
                                                    </span>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                        To
                                                    </p>

                                                    <h3 className="mt-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
                                                        {flight.destination}
                                                    </h3>

                                                    <p className="mt-2 text-xs text-slate-500">
                                                        <FaPlaneArrival className="mr-1 inline" />
                                                        Arrival
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Travel Information */}
                                            <div className="mt-7 grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-3 sm:p-5">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                        Departure
                                                    </p>
                                                    <p className="mt-2 text-sm font-semibold text-slate-800">
                                                        <FaCalendarAlt className="mr-2 inline text-blue-800" />
                                                        {formatDateTime(flight.departureTime)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                        Arrival
                                                    </p>
                                                    <p className="mt-2 text-sm font-semibold text-slate-800">
                                                        <FaCalendarAlt className="mr-2 inline text-blue-800" />
                                                        {formatDateTime(flight.arrivalTime)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                        Passengers
                                                    </p>
                                                    <p className="mt-2 text-sm font-semibold text-slate-800">
                                                        <FaUsers className="mr-2 inline text-blue-800" />
                                                        {booking.numberOfSeats}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Booking Footer */}
                                        <div className="flex flex-col gap-5 border-t border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                                            <div className="grid gap-4 sm:grid-cols-2 sm:gap-8">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                        Booking Reference
                                                    </p>

                                                    <p className="mt-1.5 flex items-center gap-2 text-lg font-extrabold tracking-wider text-blue-900">
                                                        <FaTicketAlt className="text-sm" />
                                                        {booking.pnr}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        Booking ID: {booking.id}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                        Total Amount
                                                    </p>

                                                    <p className="mt-1.5 text-xl font-extrabold text-slate-900">
                                                        ₹{formatCurrency(booking.totalAmount)}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {booking.numberOfSeats} passenger(s)
                                                    </p>
                                                </div>
                                            </div>

                                            {isConfirmed && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleCancel(booking.id)}
                                                    disabled={isCancelling}
                                                    className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {isCancelling
                                                        ? "Cancelling..."
                                                        : "Cancel Booking"}
                                                </button>
                                            )}

                                            {!isConfirmed && (
                                                <span className="text-sm font-medium text-slate-400">
                                                    This booking has been cancelled.
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Cancelled Booking Count */}
                {!loading && cancelledBookings.length > 0 && (
                    <p className="mt-6 text-right text-sm text-slate-500">
                        Cancelled bookings: {cancelledBookings.length}
                    </p>
                )}
            </div>
        </div>
    );
}

export default MyBookings;
