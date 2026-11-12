
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function ProtectedRoute({ children, allowedRoles = [] }) {
    const { user } = useAuth();
    const location = useLocation();

    // Redirect unauthenticated users to login
    if (!user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    // Normalize role (ADMIN and ROLE_ADMIN)
    const userRole = user.role
        ?.toUpperCase()
        .replace("ROLE_", "");

    // Check authorization
    if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(userRole)
    ) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
