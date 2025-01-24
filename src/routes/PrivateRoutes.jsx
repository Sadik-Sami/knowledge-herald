import useAuth from '@/hooks/use-AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoutes = ({ children }) => {
	const { user, loading } = useAuth();
	const location = useLocation();
	console.log(location);
	// While loading, display a loader
	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<span className='loading loading-infinity w-20 md:w-40 text-warning'></span>
			</div>
		);
	}

	// If user is authenticated, render children
	if (user) {
		return children;
	}

	// If not authenticated, redirect to login with pathname and search (query parameters)
	return <Navigate to='/login' state={{ from: location }} replace />;
};

export default PrivateRoutes;
