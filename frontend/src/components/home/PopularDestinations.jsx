
import {
    FaSearch,
    FaTicketAlt,
    FaPlaneDeparture,
    FaArrowRight,
} from "react-icons/fa";

const steps = [
    {
        number: "01",
        title: "Search Flights",
        description:
            "Enter your departure city, destination and travel date to discover available flights.",
        icon: FaSearch,
        color: "bg-blue-50 text-blue-700",
    },
    {
        number: "02",
        title: "Book Your Flight",
        description:
            "Review flight details, check seat availability and confirm your reservation securely.",
        icon: FaTicketAlt,
        color: "bg-amber-50 text-amber-600",
    },
    {
        number: "03",
        title: "Manage Your Journey",
        description:
            "Access your booking reference, view your reservations and print your e-ticket anytime.",
        icon: FaPlaneDeparture,
        color: "bg-emerald-50 text-emerald-600",
    },
];

function PopularDestinations() {
    const scrollToSearch = () => {
        document.getElementById("flight-search")?.scrollIntoView({
            behavior: "smooth",
        });
    };

    return (
        <section
            id="destinations"
            className="bg-white py-20 scroll-mt-24"
        >
            <div className="mx-auto max-w-7xl px-6">

                {/* Section heading */}
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
                        Simple. Convenient. Reliable.
                    </span>

                    <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
                        Your Journey, Simplified
                    </h2>

                    <p className="mt-4 leading-relaxed text-slate-500">
                        From finding your flight to receiving your e-ticket,
                        enjoy a smooth booking experience with SkyWings.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid gap-7 md:grid-cols-3">
                    {steps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <div
                                key={step.number}
                                className="group relative rounded-2xl border border-slate-200 bg-white p-8 transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
                            >
                                <div className="flex items-center justify-between">
                                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${step.color}`}>
                                        <Icon />
                                    </div>

                                    <span className="text-4xl font-extrabold text-slate-100 transition group-hover:text-blue-100">
                                        {step.number}
                                    </span>
                                </div>

                                <h3 className="mt-7 text-xl font-extrabold text-slate-900">
                                    {step.title}
                                </h3>

                                <p className="mt-3 min-h-20 leading-relaxed text-slate-500">
                                    {step.description}
                                </p>

                                {index !== steps.length - 1 && (
                                    <div className="absolute -right-5 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 text-blue-700 shadow-sm md:block">
                                        <FaArrowRight />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Call to action */}
                <div className="mt-12 text-center">
                    <button
                        onClick={scrollToSearch}
                        className="inline-flex items-center gap-3 rounded-xl bg-blue-950 px-8 py-4 font-bold text-white shadow-lg shadow-blue-950/15 transition hover:bg-blue-800"
                    >
                        Find Your Flight
                        <FaArrowRight />
                    </button>
                </div>

            </div>
        </section>
    );
}

export default PopularDestinations;
