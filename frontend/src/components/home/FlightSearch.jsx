import { useState } from "react";
import {
    FaPlaneDeparture,
    FaPlaneArrival,
    FaCalendarAlt,
    FaUsers,
    FaSearch,
} from "react-icons/fa";
import api from "../../services/api";

function FlightSearch() {
    const [tripType, setTripType] = useState("roundTrip");
    const [source, setSource] = useState("Mumbai");
    const [destination, setDestination] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [passengers, setPassengers] = useState("1");
    const [cabinClass, setCabinClass] = useState("Economy");

    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searched, setSearched] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(null);
    const [bookingError, setBookingError] = useState("");

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toLocaleDateString("en-CA");

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!source || !destination || !departureDate) {
            setError("Please select departure city, destination and departure date.");
            return;
        }

        if (source === destination) {
            setError("Departure and destination cities cannot be the same.");
            return;
        }

        if (tripType === "roundTrip" && returnDate && returnDate < departureDate) {
            setError("Return date cannot be before departure date.");
            return;
        }

        setLoading(true);
        setError("");
        setFlights([]);
        setSearched(false);

        try {
            const response = await api.get("/flights/search", {
                params: {
                    source,
                    destination,
                },
            });

            // Filter flights by selected date and passenger availability
            const matchingFlights = response.data.filter((flight) => {
                const flightDate = flight.departureTime.substring(0, 10);

                return (
                    flightDate === departureDate &&
                    new Date(flight.departureTime) > new Date() &&
                    flight.availableSeats >= Number(passengers)
                );
            });

            setFlights(matchingFlights);
            setSearched(true);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to search flights. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (flightId) => {
        setBookingLoading(flightId);
        setBookingError("");
        setBookingId(null);

        try {
            const response = await api.post("/bookings", {
                flightId,
                numberOfSeats: Number(passengers),
            });

            setBookingId(response.data);
        } catch (err) {
            setBookingError(
                err.response?.data?.message || "Booking failed. Please try again."
            );
        } finally {
            setBookingLoading(null);
        }
    };

    return (
        <section className="relative z-20 -mt-20 px-6 pb-20">
            <div className="mx-auto max-w-6xl rounded-2xl bg-white p-6 shadow-2xl md:p-8">

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-slate-800">
                        Search Your Flight
                    </h2>

                    <p className="mt-1 text-gray-500">
                        Find the perfect flight for your journey.
                    </p>
                </div>

                <form onSubmit={handleSearch}>

                    {/* Trip Type */}
                    <div className="mb-6 flex gap-6">
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="radio"
                                name="tripType"
                                value="roundTrip"
                                checked={tripType === "roundTrip"}
                                onChange={() => setTripType("roundTrip")}
                                className="h-4 w-4 accent-blue-900"
                            />

                            <span className="font-medium text-slate-700">
                                Round Trip
                            </span>
                        </label>

                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="radio"
                                name="tripType"
                                value="oneWay"
                                checked={tripType === "oneWay"}
                                onChange={() => setTripType("oneWay")}
                                className="h-4 w-4 accent-blue-900"
                            />

                            <span className="font-medium text-slate-700">
                                One Way
                            </span>
                        </label>
                    </div>

                    {/* Main Search Fields */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                        {/* From */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                From
                            </label>

                            <div className="relative">
                                <FaPlaneDeparture className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-900" />

                                <select
                                    value={source}
                                    onChange={(e) => setSource(e.target.value)}
                                    required
                                    className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="Mumbai">Mumbai (BOM)</option>
                                </select>
                            </div>
                        </div>

                        {/* To */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                To
                            </label>

                            <div className="relative">
                                <FaPlaneArrival className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-900" />

                                <select
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    required
                                    className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">Select destination</option>
                                    <option value="Delhi">Delhi (DEL)</option>
                                    <option value="SHARJAH">Sharjah (SHJ)</option>
                                    <option value="USA">USA</option>
                                </select>
                            </div>
                        </div>

                        {/* Departure */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Departure
                            </label>

                            <div className="relative">
                                <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-900" />

                                <input
                                    type="date"
                                    min={today}
                                    value={departureDate}
                                    onChange={(e) => {
                                        setDepartureDate(e.target.value);
                                        setReturnDate("");
                                    }}
                                    required
                                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                        </div>

                        {/* Return */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Return
                            </label>

                            <div className="relative">
                                <FaCalendarAlt
                                    className={`absolute left-4 top-1/2 -translate-y-1/2 ${tripType === "oneWay"
                                            ? "text-gray-400"
                                            : "text-blue-900"
                                        }`}
                                />

                                <input
                                    type="date"
                                    min={departureDate || today}
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    disabled={tripType === "oneWay"}
                                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="mt-5 grid gap-4 md:grid-cols-3">

                        {/* Passengers */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Passengers
                            </label>

                            <div className="relative">
                                <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-900" />

                                <select
                                    value={passengers}
                                    onChange={(e) => setPassengers(e.target.value)}
                                    className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="1">1 Passenger</option>
                                    <option value="2">2 Passengers</option>
                                    <option value="3">3 Passengers</option>
                                    <option value="4">4 Passengers</option>
                                    <option value="5">5 Passengers</option>
                                </select>
                            </div>
                        </div>

                        {/* Cabin Class */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Cabin Class
                            </label>

                            <select
                                value={cabinClass}
                                onChange={(e) => setCabinClass(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                            >
                                <option>Economy</option>
                                <option>Premium Economy</option>
                                <option>Business</option>
                                <option>First Class</option>
                            </select>
                        </div>

                        {/* Search Button */}
                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-900 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <FaSearch />
                                {loading ? "Searching..." : "Search Flights"}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Error Message */}
                {error && (
                    <p className="mt-5 rounded-lg bg-red-100 p-3 text-sm text-red-700">
                        {error}
                    </p>
                )}

                {/* Search Results */}
                {searched && (
                    <div className="mt-8 border-t border-gray-200 pt-6">
                        <h3 className="mb-4 text-2xl font-bold text-slate-800">
                            Available Flights
                        </h3>

                        {flights.length === 0 ? (
                            <p className="rounded-lg bg-slate-100 p-4 text-slate-600">
                                No flights found for your selected route, date and passenger count.
                                Please try another date or destination.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {flights.map((flight) => (
                                    <div
                                        key={flight.id}
                                        className="rounded-xl border border-gray-200 p-5 shadow-sm transition hover:shadow-md"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div>
                                                <p className="text-lg font-bold text-blue-900">
                                                    {flight.airline}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {flight.flightNumber}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="font-semibold text-slate-800">
                                                    {flight.source} → {flight.destination}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(flight.departureTime).toLocaleString()}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-lg font-bold text-blue-900">
                                                    ₹{flight.price.toLocaleString("en-IN")}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {flight.availableSeats} seats available
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-5 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => handleBooking(flight.id)}
                                                disabled={bookingLoading === flight.id}
                                                className="rounded-xl bg-blue-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {bookingLoading === flight.id
                                                    ? "Booking..."
                                                    : "Book Now"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Booking Error */}
                        {bookingError && (
                            <p className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
                                {bookingError}
                            </p>
                        )}

                        {/* Booking Confirmation */}
                        {bookingId && (
                            <div className="mt-4 rounded-lg bg-green-100 p-4 text-green-800">
                                <h3 className="font-bold">
                                    Booking Successful!
                                </h3>

                                <pre className="mt-2 whitespace-pre-wrap text-sm">
                                    {JSON.stringify(bookingId, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </section>
    );
}

export default FlightSearch;