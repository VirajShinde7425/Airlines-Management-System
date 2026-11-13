
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaPlane, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/useAuth.js";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const role = user?.role?.toUpperCase().replace("ROLE_", "");

    const navLinks = [
        { label: "Home", path: "/", show: true },
        {
            label: "My Bookings",
            path: "/my-bookings",
            show: role === "PASSENGER",
        },
        {
            label: "Dashboard",
            path: "/admin/dashboard",
            show: role === "ADMIN",
        },
        {
            label: "Manage Flights",
            path: "/admin/flights",
            show: role === "ADMIN",
        },
    ].filter((link) => link.show);

    const linkClass = ({ isActive }) =>
        `block rounded-lg px-4 py-2.5 text-sm font-semibold transition ${isActive
            ? "bg-blue-50 text-blue-700"
            : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
        }`;

    const handleLogout = () => {
        setMenuOpen(false);
        logout();
        navigate("/");
    };

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
                {/* Brand */}
                <Link
                    to="/"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3"
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-900 text-xl text-white shadow-md">
                        <FaPlane />
                    </div>

                    <div>
                        <span className="block text-xl font-extrabold tracking-tight text-slate-900">
                            Sky<span className="text-blue-700">Wings</span>
                        </span>
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Airline Management
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-2 md:flex">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={linkClass}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>

                {/* Desktop User Actions */}
                <div className="hidden items-center gap-4 md:flex">
                    {user ? (
                        <>
                            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                                <FaUserCircle className="text-2xl text-blue-800" />
                                <div>
                                    <p className="max-w-32 truncate text-sm font-bold text-slate-800">
                                        {user.fullName}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {role === "ADMIN" ? "Administrator" : "Passenger"}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="rounded-lg bg-blue-900 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800"
                        >
                            Login / Sign Up
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="rounded-lg p-2 text-2xl text-slate-800 hover:bg-slate-100 md:hidden"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </nav>

            {/* Mobile Navigation */}
            {menuOpen && (
                <div className="border-t border-slate-200 bg-white px-5 py-4 shadow-lg md:hidden">
                    <div className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setMenuOpen(false)}
                                className={linkClass}
                            >
                                {link.label}
                            </NavLink>
                        ))}

                        {user ? (
                            <div className="mt-3 border-t border-slate-200 pt-4">
                                <p className="mb-3 text-sm font-semibold text-slate-700">
                                    Welcome, {user.fullName}
                                </p>
                                <button
                                    onClick={handleLogout}
                                    className="w-full rounded-lg bg-blue-900 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setMenuOpen(false)}
                                className="mt-2 rounded-lg bg-blue-900 px-5 py-3 text-center text-sm font-bold text-white hover:bg-blue-800"
                            >
                                Login / Sign Up
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;
