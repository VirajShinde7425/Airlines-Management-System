
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth.js";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="bg-blue-900 p-4 text-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                <Link to="/" className="text-2xl font-bold">
                    ✈ Airline Management System
                </Link>

                <div className="flex items-center gap-5">
                    <Link to="/" className="hover:text-blue-200">
                        Home
                    </Link>

                    {user ? (
                        <>
                            {user.role === "PASSENGER" && (
                                <Link
                                    to="/my-bookings"
                                    className="hover:text-blue-200"
                                >
                                    My Bookings
                                </Link>
                            )}

                            <span className="font-medium">
                                Welcome, {user.fullName}
                            </span>

                            <button
                                onClick={handleLogout}
                                className="rounded-lg bg-white px-4 py-2 font-semibold text-blue-900 hover:bg-blue-100"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="rounded-lg bg-white px-4 py-2 font-semibold text-blue-900 hover:bg-blue-100"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
