
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    FaPlane,
    FaCalendarAlt,
    FaUsers,
    FaCheckCircle,
    FaArrowLeft,
    FaTicketAlt,
    FaShieldAlt,
    FaPrint,
    FaMapMarkerAlt,
    FaClock,
} from "react-icons/fa";
import api from "../../services/api";

function BookingReview() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const flightId = searchParams.get("flightId");
    const requestedPassengers = Number(searchParams.get("passengers") || 1);

    const validSearch =
        flightId &&
        /^\d+$/.test(flightId) &&
        Number.isInteger(requestedPassengers) &&
        requestedPassengers >= 1 &&
        requestedPassengers <= 6;

    const passengers = validSearch ? requestedPassengers : 1;

    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(null);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!validSearch) return;

        let ignore = false;

        const loadFlight = async () => {
            try {
                const response = await api.get(`/flights/${flightId}`);

                if (!ignore) {
                    setFlight(response.data);
                }
            } catch (err) {
                if (!ignore) {
                    setError(
                        err.response?.status === 404
                            ? "The selected flight could not be found."
                            : "Unable to load flight details. Please try again."
                    );
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadFlight();

        return () => {
            ignore = true;
        };
    }, [flightId, validSearch]);

    const formatPrice = (value) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(Number(value));

    const formatDateTime = (value) =>
        new Date(value).toLocaleString("en-IN", {
            dateStyle: "long",
            timeStyle: "short",
        });

    const handleConfirmBooking = async () => {
        setError("");

        if (!flight || flight.availableSeats < passengers) {
            setError("Not enough seats are currently available.");
            return;
        }

        if (new Date(flight.departureTime) <= new Date()) {
            setError("This flight has already departed and cannot be booked.");
            return;
        }

        try {
            setSaving(true);

            const response = await api.post("/bookings", {
                flightId: Number(flightId),
                numberOfSeats: passengers,
            });

            setBooking(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                (err.response?.status === 403
                    ? "You are not authorized to book this flight."
                    : "Booking could not be completed. Seats may no longer be available. Please try again.")
            );
        } finally {
            setSaving(false);
        }
    };

    const handlePrintTicket = () => {
        window.print();
    };

    if (!validSearch) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-5">
                <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Invalid booking request
                    </h2>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-6 rounded-xl bg-blue-900 px-6 py-3 font-bold text-white hover:bg-blue-800"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
                <p className="font-semibold text-slate-500">
                    Loading booking details...
                </p>
            </div>
        );
    }

    if (!flight) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-5">
                <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
                    <p className="font-semibold text-red-600">
                        {error || "Flight details are unavailable."}
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-6 rounded-xl bg-blue-900 px-6 py-3 font-bold text-white"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // Successful booking confirmation and e-ticket
    if (booking) {
        return (
            <div className="min-h-screen bg-slate-50 px-5 py-12 print:bg-white print:p-0">
                <div className="mx-auto max-w-3xl">

                    <div className="mb-8 text-center print:hidden">
                        <FaCheckCircle className="mx-auto text-6xl text-emerald-500" />

                        <p className="mt-5 text-sm font-bold uppercase tracking-widest text-emerald-600">
                            Booking Confirmed
                        </p>

                        <h1 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
                            Your journey is booked!
                        </h1>

                        <p className="mt-3 text-slate-500">
                            Your flight reservation has been successfully created.
                        </p>
                    </div>

                    {/* E-ticket */}
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl print:rounded-none print:border print:shadow-none">

                        {/* Ticket header */}
                        <div className="bg-blue-950 px-7 py-7 text-white md:px-10">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl">
                                        <FaPlane />
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-extrabold tracking-wide">
                                            SkyWings
                                        </h2>
                                        <p className="text-xs text-blue-200">
                                            Electronic Flight Ticket
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className="rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
                                        {booking.status}
                                    </span>
                                    <p className="mt-2 text-xs text-blue-200">
                                        Booking ID: #{booking.id}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* PNR section */}
                        <div className="border-b border-dashed border-slate-300 px-7 py-7 text-center md:px-10">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                                Booking Reference / PNR
                            </p>

                            <p className="mt-3 text-4xl font-extrabold tracking-[0.2em] text-blue-950 md:text-5xl">
                                {booking.pnr}
                            </p>

                            <p className="mt-3 text-sm text-slate-500">
                                Keep this reference number for your records.
                            </p>
                        </div>

                        {/* Route section */}
                        <div className="px-7 py-8 md:px-10">
                            <div className="mb-7 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Airline
                                    </p>
                                    <p className="mt-1 text-lg font-extrabold text-slate-900">
                                        {booking.flight.airline}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {booking.flight.flightNumber}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-blue-50 p-3 text-2xl text-blue-900">
                                    <FaPlane />
                                </div>
                            </div>

                            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-6">
                                <div>
                                    <FaMapMarkerAlt className="mb-3 text-xl text-blue-700" />

                                    <h3 className="text-xl font-extrabold text-slate-900 md:text-3xl">
                                        {booking.flight.source}
                                    </h3>

                                    <p className="mt-2 text-xs font-semibold uppercase text-slate-400">
                                        Departure
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-700">
                                        {formatDateTime(booking.flight.departureTime)}
                                    </p>
                                </div>

                                <div className="flex flex-col items-center">
                                    <span className="mb-2 text-xs text-slate-400">
                                        Flight
                                    </span>
                                    <div className="flex w-16 items-center">
                                        <div className="h-px flex-1 bg-blue-300" />
                                        <FaPlane className="mx-1 -rotate-0 text-blue-700" />
                                        <div className="h-px flex-1 bg-blue-300" />
                                    </div>
                                </div>

                                <div className="text-right">
                                    <FaMapMarkerAlt className="mb-3 ml-auto text-xl text-blue-700" />

                                    <h3 className="text-xl font-extrabold text-slate-900 md:text-3xl">
                                        {booking.flight.destination}
                                    </h3>

                                    <p className="mt-2 text-xs font-semibold uppercase text-slate-400">
                                        Arrival
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-700">
                                        {formatDateTime(booking.flight.arrivalTime)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Ticket information */}
                        <div className="mx-7 border-t border-dashed border-slate-300 md:mx-10" />

                        <div className="grid gap-6 px-7 py-8 sm:grid-cols-2 md:px-10">
                            <div className="flex items-start gap-3">
                                <FaUsers className="mt-1 text-lg text-blue-700" />
                                <div>
                                    <p className="text-xs font-semibold uppercase text-slate-400">
                                        Passengers / Seats
                                    </p>
                                    <p className="mt-1 font-bold text-slate-900">
                                        {booking.numberOfSeats}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FaTicketAlt className="mt-1 text-lg text-blue-700" />
                                <div>
                                    <p className="text-xs font-semibold uppercase text-slate-400">
                                        Booking Date
                                    </p>
                                    <p className="mt-1 font-bold text-slate-900">
                                        {booking.bookingDate
                                            ? formatDateTime(booking.bookingDate)
                                            : "Not available"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FaCalendarAlt className="mt-1 text-lg text-blue-700" />
                                <div>
                                    <p className="text-xs font-semibold uppercase text-slate-400">
                                        Flight Date
                                    </p>
                                    <p className="mt-1 font-bold text-slate-900">
                                        {formatDateTime(booking.flight.departureTime)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FaClock className="mt-1 text-lg text-blue-700" />
                                <div>
                                    <p className="text-xs font-semibold uppercase text-slate-400">
                                        Reservation Status
                                    </p>
                                    <p className="mt-1 font-bold text-emerald-600">
                                        {booking.status}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Fare details */}
                        <div className="bg-slate-50 px-7 py-7 md:px-10 print:bg-white">
                            <h3 className="text-lg font-extrabold text-slate-900">
                                Fare Summary
                            </h3>

                            <div className="mt-5 flex justify-between gap-3 text-sm">
                                <span className="text-slate-500">
                                    Price per passenger
                                </span>
                                <strong className="text-slate-800">
                                    {formatPrice(booking.flight.price)}
                                </strong>
                            </div>

                            <div className="mt-3 flex justify-between gap-3 text-sm">
                                <span className="text-slate-500">
                                    Number of passengers
                                </span>
                                <strong className="text-slate-800">
                                    {booking.numberOfSeats}
                                </strong>
                            </div>

                            <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-5">
                                <span className="font-bold text-slate-900">
                                    Total Amount Paid / Booked
                                </span>
                                <span className="text-2xl font-extrabold text-blue-950">
                                    {formatPrice(booking.totalAmount)}
                                </span>
                            </div>
                        </div>

                        {/* Ticket footer */}
                        <div className="border-t border-slate-200 px-7 py-5 text-center md:px-10">
                            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-emerald-700">
                                <FaShieldAlt />
                                Secure reservation with live seat validation
                            </div>

                            <p className="mt-3 text-xs text-slate-400">
                                Thank you for choosing SkyWings. Have a pleasant journey!
                            </p>
                        </div>
                    </div>

                    {/* Actions - hidden when printing */}
                    <div className="mt-8 grid gap-3 sm:grid-cols-2 print:hidden">
                        <button
                            onClick={handlePrintTicket}
                            className="flex items-center justify-center gap-2 rounded-xl bg-blue-950 px-6 py-4 font-bold text-white transition hover:bg-blue-900"
                        >
                            <FaPrint />
                            Print Ticket
                        </button>

                        <button
                            onClick={() => navigate("/my-bookings")}
                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-4 font-bold text-slate-800 transition hover:bg-slate-100"
                        >
                            <FaTicketAlt />
                            View My Bookings
                        </button>

                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-100 sm:col-span-2"
                        >
                            <FaArrowLeft />
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const totalAmount = Number(flight.price) * passengers;

    return (
        <div className="min-h-screen bg-slate-50 px-5 py-12">
            <div className="mx-auto max-w-5xl">

                <button
                    onClick={() => navigate(-1)}
                    className="mb-7 inline-flex items-center gap-2 font-semibold text-blue-800 hover:text-blue-600"
                >
                    <FaArrowLeft />
                    Back to Flight Results
                </button>

                <div className="mb-8">
                    <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
                        Almost there
                    </p>
                    <h1 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
                        Review Your Booking
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Please verify your flight details before confirming.
                    </p>
                </div>

                <div className="grid gap-7 lg:grid-cols-[1.5fr_1fr]">

                    {/* Flight details */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-900">
                                <FaPlane />
                            </div>
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-900">
                                    {flight.airline}
                                </h2>
                                <p className="text-sm text-slate-500">
                                    {flight.flightNumber}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-8">
                            <div>
                                <p className="text-2xl font-extrabold text-slate-900">
                                    {flight.source}
                                </p>
                                <p className="mt-2 text-sm text-slate-500">
                                    {formatDateTime(flight.departureTime)}
                                </p>
                            </div>

                            <FaPlane className="text-xl text-blue-700" />

                            <div className="text-right">
                                <p className="text-2xl font-extrabold text-slate-900">
                                    {flight.destination}
                                </p>
                                <p className="mt-2 text-sm text-slate-500">
                                    {formatDateTime(flight.arrivalTime)}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
                            <div className="flex items-center gap-3">
                                <FaCalendarAlt className="text-blue-700" />
                                <div>
                                    <p className="text-xs text-slate-400">Departure</p>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {formatDateTime(flight.departureTime)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <FaUsers className="text-blue-700" />
                                <div>
                                    <p className="text-xs text-slate-400">Passengers</p>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {passengers}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                            {flight.availableSeats} seats currently available
                        </div>
                    </div>

                    {/* Fare summary */}
                    <div className="h-fit rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                        <h2 className="text-xl font-extrabold text-slate-900">
                            Fare Summary
                        </h2>

                        <div className="mt-7 space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Price per passenger</span>
                                <strong>{formatPrice(flight.price)}</strong>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Passengers</span>
                                <strong>{passengers}</strong>
                            </div>

                            <div className="border-t border-dashed border-slate-200 pt-5">
                                <div className="flex justify-between gap-3">
                                    <span className="font-bold text-slate-800">
                                        Total Amount
                                    </span>
                                    <span className="text-xl font-extrabold text-blue-900">
                                        {formatPrice(totalAmount)}
                                    </span>
                                </div>
                                <p className="mt-2 text-xs text-slate-400">
                                    Taxes and fees are not separately itemized by the current backend.
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleConfirmBooking}
                            disabled={
                                saving ||
                                flight.availableSeats < passengers ||
                                new Date(flight.departureTime) <= new Date()
                            }
                            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-4 font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <FaTicketAlt />
                            {saving ? "Confirming Booking..." : "Confirm Booking"}
                        </button>

                        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
                            <FaShieldAlt className="text-emerald-600" />
                            Secure reservation with live seat validation
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingReview;
