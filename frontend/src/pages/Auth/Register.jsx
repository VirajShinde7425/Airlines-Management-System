
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlane, FaEye, FaEyeSlash, FaUserPlus } from "react-icons/fa";
import api from "../../services/api";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            await api.post("/auth/register", {
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                password: formData.password,
                phone: formData.phone.trim(),
            });

            navigate("/login", {
                state: {
                    registered: true,
                    email: formData.email.trim(),
                },
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.detail ||
                "Registration failed. Please check your details and try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100";

    return (
        <div className="flex min-h-[85vh] items-center justify-center bg-slate-100 px-4 py-12">
            <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-900/10">

                <div className="bg-gradient-to-br from-blue-950 to-blue-800 px-8 py-8 text-center text-white">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl text-amber-400">
                        <FaPlane />
                    </div>

                    <h1 className="mt-4 text-3xl font-extrabold">
                        Join SkyWings
                    </h1>

                    <p className="mt-2 text-sm text-blue-100">
                        Create your passenger account and start your journey.
                    </p>
                </div>

                <div className="p-8 sm:p-10">
                    <div className="mb-7">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Create Account
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Enter your details to get started.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-slate-700">
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                                maxLength={100}
                                autoComplete="name"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                autoComplete="email"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-700">
                                Phone Number <span className="font-normal text-slate-400">(Optional)</span>
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                autoComplete="tel"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Minimum 8 characters"
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    className={`${inputClass} pr-12`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-800"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-slate-700">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter your password"
                                    required
                                    autoComplete="new-password"
                                    className={`${inputClass} pr-12`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-800"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-950 py-4 font-bold text-white shadow-lg shadow-blue-950/15 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <FaUserPlus />
                            {loading ? "Creating Account..." : "Create Passenger Account"}
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-bold text-blue-800 hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
