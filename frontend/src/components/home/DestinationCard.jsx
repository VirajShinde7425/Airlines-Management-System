function DestinationCard({ destination }) {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="overflow-hidden rounded-t-2xl">
        <img
          src={destination.image}
          alt={destination.city}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
        />
      </div>

      <div className="p-5">
        <h3 className="text-2xl font-bold text-slate-800">
          {destination.city}
        </h3>

        <p className="text-gray-500">
          {destination.country}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-900">
            {destination.price}
          </span>

          <button className="rounded-lg bg-amber-500 px-5 py-2 font-semibold text-white transition-all duration-300 hover:bg-amber-600">
    Book Now
</button>
        </div>
      </div>
    </div>
  );
}

export default DestinationCard;