
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaPlaneDeparture,
    FaPlaneArrival,
    FaCalendarAlt,
    FaUsers,
    FaSearch,
} from "react-icons/fa";
import api from "../../services/api";

function FlightSearch() {
    const navigate = useNavigate();

    const [availableFlights, setAvailableFlights] = useState([]);
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [passengers, setPassengers] = useState("1");

    const [loadingRoutes, setLoadingRoutes] = useState(true);
    const [error, setError] = useState("");

    const today = new Date().toLocaleDateString("en-CA");

    // Load available routes from the backend
    useEffect(() => {
        let ignore = false;

        const loadFlights = async () => {
            try {
                const response = await api.get("/flights");

                if (!ignore) {
                    setAvailableFlights(response.data);
                }
            } catch {
                if (!ignore) {
                    setError("Unable to load available flight routes.");
                }
            } finally {
                if (!ignore) {
                    setLoadingRoutes(false);
                }
            }
        };

        loadFlights();

        return () => {
            ignore = true;
        };
    }, []);

    // Get unique departure cities
    const sources = [
        ...new Set(availableFlights.map((flight) => flight.source)),
    ].sort();

    // Get destinations based on selected departure city
    const destinations = [
        ...new Set(
            availableFlights
                .filter((flight) => flight.source === source)
                .map((flight) => flight.destination)
        ),
    ].sort();

    const handleSearch = (e) => {
        e.preventDefault();
        setError("");

        const passengerCount = Number(passengers);

        if (
            !Number.isInteger(passengerCount) ||
            passengerCount < 1 ||
            passengerCount > 10
        ) {
            setError("Please enter a number of tickets between 1 and 10.");
            return;
        }

        if (!source || !destination || !departureDate) {
            setError("Please select your route and departure date.");
            return;
        }

        if (source === destination) {
            setError("Departure and destination cannot be the same.");
            return;
        }

        const searchParams = new URLSearchParams({
            source,
            destination,
            departureDate,
            passengers,
        });

        navigate(`/flights/results?${searchParams.toString()}`);
    };

    return (
        <section
            id="flight-search"
            className="relative z-20 -mt-20 scroll-mt-24 px-5 pb-20"
        >
            <div className="mx-auto max-w-6xl rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl shadow-slate-900/10 md:p-9">

                <div className="mb-7">
                    <span className="text-sm font-bold uppercase tracking-widest text-blue-700">
                        Find your journey
                    </span>

                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                        Where would you like to go?
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Search available flights and find the best option for your trip.
                    </p>
                </div>

                <form onSubmit={handleSearch}>
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

                        {/* Departure city */}
                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                From
                            </label>

                            <div className="relative">
                                <FaPlaneDeparture className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-800" />

                                <select
                                    value={source}
                                    onChange={(e) => {
                                        setSource(e.target.value);
                                        setDestination("");
                                    }}
                                    required
                                    disabled={loadingRoutes}
                                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-4 pl-11 pr-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
                                >
                                    <option value="">
                                        {loadingRoutes ? "Loading cities..." : "Select departure"}
                                    </option>

                                    {sources.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Destination city */}
                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                To
                            </label>

                            <div className="relative">
                                <FaPlaneArrival className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-800" />

                                <select
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    required
                                    disabled={!source}
                                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-4 pl-11 pr-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <option value="">Select destination</option>

                                    {destinations.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Departure date */}
                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                Departure Date
                            </label>

                            <div className="relative">
                                <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-800" />

                                <input
                                    type="date"
                                    min={today}
                                    value={departureDate}
                                    onChange={(e) => setDepartureDate(e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-4 pl-11 pr-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                />
                            </div>
                        </div>

                        {/* Passenger count */}
                        <div>
                            <label
                                htmlFor="passengers"
                                className="mb-2 block text-sm font-bold text-slate-700"
                            >
                                Number of Tickets
                            </label>

                            <div className="relative">
                                <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-800" />

                                <input
                                    id="passengers"
                                    type="number"
                                    min="1"
                                    max="10"
                                    step="1"
                                    value={passengers}
                                    onChange={(e) => setPassengers(e.target.value)}
                                    required
                                    placeholder="Enter tickets"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-4 pl-11 pr-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                />
                            </div>

                            <p className="mt-2 text-xs text-slate-500">
                                You can book 1 to 10 tickets at a time.
                            </p>
                        </div>

                    </div>

                    {error && (
                        <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
                            {error}
                        </p>
                    )}

                    {!loadingRoutes && availableFlights.length === 0 && (
                        <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                            No flights are currently available. Please check back later.
                        </p>
                    )}

                    <div className="mt-7 flex justify-end">
                        <button
                            type="submit"
                            disabled={loadingRoutes || availableFlights.length === 0}
                            className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-900 px-9 py-4 font-bold text-white shadow-lg shadow-blue-900/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                            <FaSearch />
                            Search Flights
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default FlightSearch;
