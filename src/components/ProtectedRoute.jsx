import { useLocation, Navigate, Outlet } from "react-router-dom";

// custom hooks
import { useAuthContext } from "../hooks/useAuthContext";

const ProtectedRoute = () => {
  const { user } = useAuthContext();
  const location = useLocation();

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
