
import { FaArrowRight, FaPlane } from "react-icons/fa";
import heroImage from "../../assets/images/hero.jpg";

function Hero() {

    const scrollToSection = (sectionId) => {
        document.getElementById(sectionId)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <section
            className="relative flex min-h-[620px] items-center overflow-hidden bg-cover bg-center md:min-h-[700px]"
            style={{ backgroundImage: `url(${heroImage})` }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#06172f]/90 via-[#06172f]/65 to-[#06172f]/20" />

            {/* Decorative background */}
            <div className="absolute -right-20 top-20 h-80 w-80 rounded-full border border-white/10" />
            <div className="absolute -right-10 top-30 h-64 w-64 rounded-full border border-white/10" />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
                <div className="max-w-3xl text-white">

                    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold backdrop-blur-md">
                        <FaPlane className="text-amber-400" />
                        Your Journey Begins Here
                    </div>

                    <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                        Discover the World.
                        <span className="mt-2 block text-amber-400">
                            Travel Beyond.
                        </span>
                    </h1>

                    <p className="mt-7 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                        Search available flights, reserve your seats, and manage
                        your bookings with a simple and seamless travel experience.
                    </p>

                    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                        <button
                            onClick={() => scrollToSection("flight-search")}
                            className="group inline-flex items-center justify-center gap-3 rounded-xl bg-amber-500 px-8 py-4 font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition duration-300 hover:-translate-y-1 hover:bg-amber-400"
                        >
                            Search Flights
                            <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                        </button>

                        <button
                            onClick={() => scrollToSection("destinations")}
                            className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/50 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-blue-950"
                        >
                            How It Works
                        </button>
                    </div>

                    <div className="mt-14 flex flex-wrap gap-10 border-t border-white/20 pt-7">
                        <div>
                            <p className="text-2xl font-extrabold text-white">Easy</p>
                            <p className="mt-1 text-sm text-slate-300">Flight Booking</p>
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold text-white">Secure</p>
                            <p className="mt-1 text-sm text-slate-300">Reservations</p>
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold text-white">Simple</p>
                            <p className="mt-1 text-sm text-slate-300">Travel Management</p>
                        </div>
                    </div>

                </div>
            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-slate-100 to-transparent" />
        </section>
    );
}

export default Hero;
