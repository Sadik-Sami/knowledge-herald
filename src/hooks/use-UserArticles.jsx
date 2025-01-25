import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './use-AxiosSecure';
import useAuth from './use-AuthContext';

const useUserArticles = () => {
	const axiosSecure = useAxiosSecure();
	const { user } = useAuth();
	return useQuery({
		queryKey: ['user-articles', user?.email],
		queryFn: async () => {
			const { data } = await axiosSecure.get(`/articles/user/${user.email}`);
			console.log(data);
			return data.data;
		},
		enabled: !!user.email, // Only run query if email exists
	});
};

export default useUserArticles;
