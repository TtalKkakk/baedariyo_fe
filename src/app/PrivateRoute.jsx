import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, redirectTo = '/login' }) {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to={redirectTo} replace />;
}

export default PrivateRoute;
