import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../redux/auth/authSlice';

export const PublicRouter = ({ children, restricted = false }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
 
  return <>{isLoggedIn ? <Navigate to="/profile" /> : children}</>;
};