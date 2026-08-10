function FeatureCard({ icon, title, description }) {
  return (
    <div className="group rounded-2xl bg-white p-8 text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-900 transition-all duration-300 group-hover:bg-blue-900 group-hover:text-white">
        {icon}
      </div>

      <h3 className="mb-3 text-xl font-bold text-slate-800">
        {title}
      </h3>

      <p className="leading-relaxed text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;