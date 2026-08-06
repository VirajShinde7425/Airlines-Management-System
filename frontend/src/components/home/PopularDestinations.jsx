import DestinationCard from "./DestinationCard";
import destinations from "../../data/destinations";

function PopularDestinations() {
  return (
    <section className="bg-slate-100 py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-slate-800">
            Popular Destinations
          </h2>

          <p className="mt-3 text-gray-600">
            Discover our most loved travel destinations.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default PopularDestinations;