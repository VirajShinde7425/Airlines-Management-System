import {
  FaShieldAlt,
  FaTag,
  FaBolt,
  FaHeadset,
} from "react-icons/fa";

import FeatureCard from "./FeatureCard";

const features = [
  {
    id: 1,
    icon: <FaShieldAlt />,
    title: "Safe & Reliable",
    description:
      "Travel with confidence with a secure and reliable flight booking experience.",
  },
  {
    id: 2,
    icon: <FaTag />,
    title: "Best Prices",
    description:
      "Find competitive fares and great deals for your next journey.",
  },
  {
    id: 3,
    icon: <FaBolt />,
    title: "Easy Booking",
    description:
      "Search and book your flights quickly through a simple and intuitive interface.",
  },
  {
    id: 4,
    icon: <FaHeadset />,
    title: "24/7 Support",
    description:
      "Get assistance whenever you need it throughout your travel journey.",
  },
];

function Features() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        {/* Section Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 font-semibold uppercase tracking-wider text-blue-700">
            Why Choose Us
          </p>

          <h2 className="text-4xl font-bold text-slate-800">
            Your Journey, Our Priority
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            We make your travel experience simple, secure, and convenient
            from booking to boarding.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default Features;