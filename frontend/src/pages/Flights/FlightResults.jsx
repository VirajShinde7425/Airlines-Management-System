
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    FaPlane,
    FaClock,
    FaUsers,
    FaArrowRight,
    FaArrowLeft,
    FaCalendarAlt,
} from "react-icons/fa";
import api from "../../services/api";


function FlightResults() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const source = searchParams.get("source") || "";
    const destination = searchParams.get("destination") || "";
    const departureDate = searchParams.get("departureDate") || "";
    const requestedPassengers = Number(searchParams.get("passengers") || 1);

    const passengers =
        Number.isInteger(requestedPassengers) &&
            requestedPassengers >= 1 &&
            requestedPassengers <= 6
            ? requestedPassengers
            : 1;

    const validSearch =
        source &&
        destination &&
        source !== destination &&
        departureDate &&
        Number.isInteger(requestedPassengers) &&
        requestedPassengers >= 1 &&
        requestedPassengers <= 6;

    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!validSearch) return;

        let ignore = false;

        const loadFlights = async () => {
            try {
                const response = await api.get("/flights/search", {
                    params: { source, destination },
                });

                if (!ignore) {
                    const now = new Date();

                    const matchingFlights = response.data.filter((flight) => {
                        const flightDate = flight.departureTime.slice(0, 10);
                        const departure = new Date(flight.departureTime);

                        return (
                            flightDate === departureDate &&
                            departure > now &&
                            flight.availableSeats >= passengers
                        );
                    });

                    setFlights(matchingFlights);
                }
            } catch (err) {
                if (!ignore) {
                    setError(
                        err.response?.status === 403
                            ? "You do not have permission to search flights."
                            : "Unable to load flights. Please try again."
                    );
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadFlights();

        return () => {
            ignore = true;
        };
    }, [source, destination, departureDate, passengers, validSearch]);

    const formatTime = (value) =>
        new Date(value).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

    const formatDate = (value) =>
        new Date(value).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

    const formatPrice = (value) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(Number(value));

    const handleBooking = (flight) => {
        const params = new URLSearchParams({
            flightId: String(flight.id),
            passengers: String(passengers),
        });

        navigate(`/booking/review?${params.toString()}`);
    };

    if (!validSearch) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-5">
                <div className="max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Invalid flight search
                    </h2>
                    <p className="mt-3 text-slate-500">
                        Please return to the homepage and enter valid flight search details.
                    </p>
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

    return (
        <div className="min-h-screen bg-slate-50 px-5 py-12">
            <div className="mx-auto max-w-6xl">

                {/* Page heading */}
                <button
                    onClick={() => navigate("/")}
                    className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-blue-800 transition hover:text-blue-600"
                >
                    <FaArrowLeft />
                    Modify Search
                </button>

                <div className="mb-9 rounded-3xl bg-gradient-to-r from-[#071B35] to-blue-900 p-7 text-white shadow-xl md:p-9">
                    <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
                        Available flights
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                        <h1 className="text-3xl font-extrabold md:text-4xl">
                            {source}
                        </h1>
                        <FaPlane className="text-2xl text-amber-400" />
                        <h1 className="text-3xl font-extrabold md:text-4xl">
                            {destination}
                        </h1>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-6 text-sm text-blue-100">
                        <span className="flex items-center gap-2">
                            <FaCalendarAlt />
                            {formatDate(`${departureDate}T00:00:00`)}
                        </span>
                        <span className="flex items-center gap-2">
                            <FaUsers />
                            {passengers} {passengers === 1 ? "Passenger" : "Passengers"}
                        </span>
                    </div>
                </div>

                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900">
                            Choose your flight
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Compare timings and fares before booking.
                        </p>
                    </div>

                    {!loading && (
                        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800">
                            {flights.length} {flights.length === 1 ? "Flight" : "Flights"} found
                        </span>
                    )}
                </div>

                {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-800" />
                        <p className="mt-4 font-medium text-slate-500">
                            Finding the best available flights...
                        </p>
                    </div>
                ) : flights.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                        <FaPlane className="mx-auto text-4xl text-slate-300" />
                        <h3 className="mt-5 text-xl font-bold text-slate-800">
                            No flights available
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            We couldn't find flights for this route and date with enough available seats.
                            Try another date or modify your search.
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="mt-6 rounded-xl bg-blue-900 px-7 py-3 font-bold text-white transition hover:bg-blue-800"
                        >
                            Search Again
                        </button>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {flights.map((flight) => {
                            const totalFare =
                                Number(flight.price) * passengers;

                            return (
                                <article
                                    key={flight.id}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="grid gap-6 p-6 md:grid-cols-[1fr_1.5fr_1fr] md:items-center md:p-7">

                                        {/* Airline details */}
                                        <div>
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-900">
                                                <FaPlane />
                                            </div>
                                            <h3 className="mt-3 text-lg font-extrabold text-slate-900">
                                                {flight.airline}
                                            </h3>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {flight.flightNumber}
                                            </p>
                                        </div>

                                        {/* Journey details */}
                                        <div>
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="text-2xl font-extrabold text-slate-900">
                                                        {formatTime(flight.departureTime)}
                                                    </p>
                                                    <p className="mt-1 text-sm font-semibold text-slate-600">
                                                        {flight.source}
                                                    </p>
                                                </div>

                                                <div className="flex flex-1 flex-col items-center px-2">
                                                    <FaPlane className="text-blue-700" />
                                                    <div className="mt-2 h-px w-full bg-slate-300" />
                                                    <span className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                                                        <FaClock />
                                                        Direct
                                                    </span>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-2xl font-extrabold text-slate-900">
                                                        {formatTime(flight.arrivalTime)}
                                                    </p>
                                                    <p className="mt-1 text-sm font-semibold text-slate-600">
                                                        {flight.destination}
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="mt-4 text-xs text-slate-400">
                                                Arrival: {formatDate(flight.arrivalTime)}
                                            </p>
                                        </div>

                                        {/* Fare and booking */}
                                        <div className="border-t border-slate-100 pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                                            <p className="text-sm text-slate-500">
                                                Price per passenger
                                            </p>
                                            <p className="mt-1 text-xl font-bold text-slate-800">
                                                {formatPrice(flight.price)}
                                            </p>

                                            <p className="mt-3 text-sm font-semibold text-emerald-700">
                                                {flight.availableSeats} seats available
                                            </p>

                                            <div className="mt-3 border-t border-dashed border-slate-200 pt-3">
                                                <p className="text-xs text-slate-500">
                                                    Total for {passengers} {passengers === 1 ? "passenger" : "passengers"}
                                                </p>
                                                <p className="mt-1 text-2xl font-extrabold text-blue-900">
                                                    {formatPrice(totalFare)}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleBooking(flight)}
                                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-3 font-bold text-white transition hover:bg-blue-800"
                                            >
                                                Book Flight
                                                <FaArrowRight />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FlightResults;
