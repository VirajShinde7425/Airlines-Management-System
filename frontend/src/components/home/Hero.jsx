import heroImage from "../../assets/images/hero.jpg";

function Hero() {
  return (
    <section
      className="relative h-[80vh] bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="text-center text-white px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Fly Smarter, Travel Better
          </h1>

          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Search flights, book tickets, and manage your journey with ease.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-lg font-semibold transition">
              Search Flights
            </button>

            <button className="bg-white text-blue-900 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition">
              Explore Destinations
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;