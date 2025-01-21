import { useQuery } from '@tanstack/react-query';
import useAuth from './use-auth';
import useAxiosSecure from './use-axios-secure';

const useSubscription = () => {
	const axiosSecure = useAxiosSecure();
	const { user } = useAuth();

	const {
		data: subscriptionData,
		isPending,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ['subscription', user?.email],
		queryFn: async () => {
			if (!user?.email) return { hasSubscription: false };
			const { data } = await axiosSecure.get(`/users/subscription/${user.email}`);
			return data;
		},
		enabled: !!user?.email,
		retry: 1,
	});

	return {
		hasSubscription: subscriptionData?.hasSubscription || false,
		subscriptionEnd: subscriptionData?.subscriptionEnd,
		isPending,
		isLoading,
		isError,
		refetch,
	};
};

export default useSubscription;
