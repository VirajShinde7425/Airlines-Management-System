
import { useEffect, useState } from "react";
import api from "../../services/api";

const emptyFlight = {
    flightNumber: "",
    airline: "",
    source: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    totalSeats: "",
    price: "",
};

function AdminFlights() {
    const [flights, setFlights] = useState([]);
    const [formData, setFormData] = useState(emptyFlight);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchFlights = async () => {
        try {
            const response = await api.get("/flights");
            setFlights(response.data);
        } catch (err) {
            setError(
                err.response?.status === 401
                    ? "Your session has expired. Please log in again."
                    : err.response?.status === 403
                        ? "You do not have permission to view flights."
                        : "Unable to load flights."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let ignore = false;

        const loadFlights = async () => {
            try {
                const response = await api.get("/flights");

                if (!ignore) {
                    setFlights(response.data);
                }
            } catch (err) {
                if (!ignore) {
                    setError(
                        err.response?.status === 401
                            ? "Your session has expired. Please log in again."
                            : err.response?.status === 403
                                ? "You do not have permission to view flights."
                                : "Unable to load flights."
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
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData(emptyFlight);
        setEditingId(null);
        setShowForm(false);
    };

    const handleAdd = () => {
        setError("");
        setSuccess("");
        setFormData(emptyFlight);
        setEditingId(null);
        setShowForm(true);
    };

    const handleEdit = (flight) => {
        setError("");
        setSuccess("");

        setFormData({
            flightNumber: flight.flightNumber,
            airline: flight.airline,
            source: flight.source,
            destination: flight.destination,
            departureTime: flight.departureTime.slice(0, 16),
            arrivalTime: flight.arrivalTime.slice(0, 16),
            totalSeats: String(flight.totalSeats),
            price: String(flight.price),
        });

        setEditingId(flight.id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const departure = new Date(formData.departureTime);
        const arrival = new Date(formData.arrivalTime);

        if (arrival <= departure) {
            setError("Arrival time must be later than departure time.");
            return;
        }

        if (
            !Number.isInteger(Number(formData.totalSeats)) ||
            Number(formData.totalSeats) <= 0
        ) {
            setError("Total seats must be a positive whole number.");
            return;
        }

        if (!Number.isFinite(Number(formData.price)) ||
            Number(formData.price) <= 0) {
            setError("Ticket price must be greater than zero.");
            return;
        }

        const payload = {
            flightNumber: formData.flightNumber.trim(),
            airline: formData.airline.trim(),
            source: formData.source.trim(),
            destination: formData.destination.trim(),
            departureTime: formData.departureTime,
            arrivalTime: formData.arrivalTime,
            totalSeats: Number(formData.totalSeats),
            price: Number(formData.price),
        };

        try {
            setSaving(true);

            if (editingId) {
                await api.put(`/flights/${editingId}`, payload);
                setSuccess("Flight updated successfully.");
            } else {
                await api.post("/flights", payload);
                setSuccess("Flight added successfully.");
            }

            resetForm();
            await fetchFlights();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                (err.response?.status === 403
                    ? "You do not have admin permission."
                    : "Unable to save flight. Please try again.")
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (flight) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete flight ${flight.flightNumber}?`
        );

        if (!confirmed) return;

        setError("");
        setSuccess("");

        try {
            await api.delete(`/flights/${flight.id}`);
            setSuccess(
                `Flight ${flight.flightNumber} deleted successfully.`
            );
            await fetchFlights();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                (err.response?.status === 409
                    ? "Cannot delete this flight because booking records exist."
                    : err.response?.status === 403
                        ? "You do not have admin permission."
                        : "Unable to delete flight.")
            );
        }
    };

    const formatDateTime = (value) =>
        new Date(value).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });

    const formatPrice = (value) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(Number(value));

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Flight Management
                        </h1>
                        <p className="mt-2 text-gray-500">
                            Add, update, view and manage airline flights.
                        </p>
                    </div>

                    <button
                        onClick={handleAdd}
                        className="rounded-lg bg-blue-900 px-5 py-3 font-semibold text-white hover:bg-blue-800"
                    >
                        + Add New Flight
                    </button>
                </div>

                {error && (
                    <div className="mb-5 rounded-lg bg-red-100 p-4 text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-5 rounded-lg bg-green-100 p-4 text-green-700">
                        {success}
                    </div>
                )}

                {showForm && (
                    <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-6 text-xl font-bold text-gray-800">
                            {editingId ? "Edit Flight" : "Add New Flight"}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                                {[
                                    ["flightNumber", "Flight Number"],
                                    ["airline", "Airline"],
                                    ["source", "Source"],
                                    ["destination", "Destination"],
                                ].map(([name, label]) => (
                                    <div key={name}>
                                        <label className="mb-2 block font-medium text-gray-700">
                                            {label}
                                        </label>
                                        <input
                                            type="text"
                                            name={name}
                                            value={formData[name]}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-700"
                                        />
                                    </div>
                                ))}

                                <div>
                                    <label className="mb-2 block font-medium text-gray-700">
                                        Departure Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="departureTime"
                                        value={formData.departureTime}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-gray-300 p-3"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block font-medium text-gray-700">
                                        Arrival Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="arrivalTime"
                                        value={formData.arrivalTime}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-gray-300 p-3"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block font-medium text-gray-700">
                                        Total Seats
                                    </label>
                                    <input
                                        type="number"
                                        name="totalSeats"
                                        min="1"
                                        value={formData.totalSeats}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-gray-300 p-3"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block font-medium text-gray-700">
                                        Ticket Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        min="0.01"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-gray-300 p-3"
                                    />
                                </div>
                            </div>

                            <p className="mt-4 text-sm text-gray-500">
                                Available seats are calculated automatically by the backend.
                            </p>

                            <div className="mt-6 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-blue-900 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Update Flight"
                                            : "Add Flight"}
                                </button>

                                <button
                                    type="button"
                                    onClick={resetForm}
                                    disabled={saving}
                                    className="rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="border-b p-5">
                        <h2 className="text-xl font-bold text-gray-800">
                            All Flights
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Total flights: {flights.length}
                        </p>
                    </div>

                    {loading ? (
                        <p className="p-8 text-center text-gray-500">
                            Loading flights...
                        </p>
                    ) : flights.length === 0 ? (
                        <p className="p-8 text-center text-gray-500">
                            No flights found.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        {[
                                            "Flight",
                                            "Airline",
                                            "Route",
                                            "Departure",
                                            "Arrival",
                                            "Seats",
                                            "Price",
                                            "Actions",
                                        ].map((heading) => (
                                            <th
                                                key={heading}
                                                className="whitespace-nowrap px-5 py-4 font-semibold"
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {flights.map((flight) => (
                                        <tr key={flight.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-800">
                                                {flight.flightNumber}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4">
                                                {flight.airline}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4">
                                                {flight.source} → {flight.destination}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4">
                                                {formatDateTime(flight.departureTime)}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4">
                                                {formatDateTime(flight.arrivalTime)}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4">
                                                {flight.availableSeats}/{flight.totalSeats}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4">
                                                {formatPrice(flight.price)}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(flight)}
                                                        className="rounded bg-blue-100 px-3 py-2 font-medium text-blue-800 hover:bg-blue-200"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(flight)}
                                                        className="rounded bg-red-100 px-3 py-2 font-medium text-red-700 hover:bg-red-200"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminFlights;
