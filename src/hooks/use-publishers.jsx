import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './use-AxiosSecure';

const usePublishers = () => {
	const axiosSecure = useAxiosSecure();

	return useQuery({
		queryKey: ['publishers'],
		queryFn: async () => {
			const { data } = await axiosSecure.get('/publishers');
			return data.data;
		},
	});
};

export default usePublishers;
