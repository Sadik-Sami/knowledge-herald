import useAdmin from '@/hooks/use-Admin';
import useAuth from '@/hooks/use-AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRoutes = ({ children }) => {
	const { user, loading } = useAuth();
	const { isAdmin, isPending, isLoading} = useAdmin();
	const location = useLocation();
	if (loading || isPending || isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<span className='loading loading-infinity w-20 md:w-40 text-warning'></span>
			</div>
		);
	}
	if (user && isAdmin) {
		return children;
	}
	return <Navigate to='/dashboard' state={location?.pathname} replace />;
};

export default AdminRoutes;
