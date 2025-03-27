import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
interface PrivateRouteProps {
  element: React.ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Element }) => {
    const { user } = useAuth();
  // Replace with your actual authentication logic
  const isAuthenticated = user !== null;
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return <Element />;
};

export default PrivateRoute; 