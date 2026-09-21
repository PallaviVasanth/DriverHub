import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoadingState } from '../components/ui/Feedback';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ roles }) {
  const { initializing, isAuthenticated, user } = useAuth();
  const location = useLocation();
  if (initializing) return <LoadingState />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to={`/${user.role}/dashboard`} replace />;
  return <Outlet />;
}
