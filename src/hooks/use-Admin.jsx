import { useQuery } from '@tanstack/react-query';
import useAuth from './use-AuthContext';
import useAxiosSecure from './use-AxiosSecure';

const useAdmin = () => {
	const { user } = useAuth();
	const axiosSecure = useAxiosSecure();

	const {
		data: adminData,
		isPending,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ['admin', user?.email],
		queryFn: async () => {
			if (!user?.email) return { isAdmin: false };
			const { data } = await axiosSecure.get(`/users/admin/${user.email}`);
			return data;
		},
		enabled: !!user?.email,
		retry: 1,
	});

	return {
		isAdmin: adminData?.isAdmin || false,
		isPending,
		isLoading,
		isError,
		refetch,
	};
};

export default useAdmin;
