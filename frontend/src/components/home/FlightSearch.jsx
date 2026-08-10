import { useState } from "react";
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaCalendarAlt,
  FaUsers,
  FaSearch,
} from "react-icons/fa";

function FlightSearch() {
  const [tripType, setTripType] = useState("roundTrip");

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

              <select className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100">
                <option value="">Select departure</option>
                <option>Mumbai (BOM)</option>
                <option>Delhi (DEL)</option>
                <option>Bangalore (BLR)</option>
                <option>Hyderabad (HYD)</option>
                <option>Pune (PNQ)</option>
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

              <select className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100">
                <option value="">Select destination</option>
                <option>Dubai (DXB)</option>
                <option>Paris (CDG)</option>
                <option>New York (JFK)</option>
                <option>Bali (DPS)</option>
                <option>Singapore (SIN)</option>
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
                className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                  tripType === "oneWay"
                    ? "text-gray-400"
                    : "text-blue-900"
                }`}
              />

              <input
                type="date"
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

              <select className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100">
                <option>1 Passenger</option>
                <option>2 Passengers</option>
                <option>3 Passengers</option>
                <option>4 Passengers</option>
                <option>5+ Passengers</option>
              </select>
            </div>
          </div>

          {/* Cabin Class */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Cabin Class
            </label>

            <select className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100">
              <option>Economy</option>
              <option>Premium Economy</option>
              <option>Business</option>
              <option>First Class</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-900 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
            >
              <FaSearch />
              Search Flights
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FlightSearch;