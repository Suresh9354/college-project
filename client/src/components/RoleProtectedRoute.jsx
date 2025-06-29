import { Navigate, Outlet } from 'react-router-dom';

const RoleProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) return <Navigate to="/" />;

  // Check if user's role is allowed
  return allowedRoles.includes(user.role) ? <Outlet /> : <Navigate to="/" />;
};

export default RoleProtectedRoute;
