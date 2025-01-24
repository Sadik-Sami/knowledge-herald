import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './use-AxiosSecure';

const useArticles = (
	page = 1,
	search = '',
	publisher = null,
	tags = [],
	status = 'approved' // Can be 'approved', 'pending', 'declined', or an array like ['approved', 'pending', 'declined']
) => {
	const axiosSecure = useAxiosSecure();

	const {
		data = {},
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ['articles', page, search, publisher, tags, status],
		queryFn: async () => {
			const searchParams = new URLSearchParams({
				page: page.toString(),
				limit: '10',
				...(search && { search }),
				...(publisher && { publisher: publisher.value }),
				...(tags.length && { tags: tags.map((t) => t.value).join(',') }),
			});

			// Handle multiple statuses
			if (Array.isArray(status)) {
				status.forEach((s) => searchParams.append('status', s));
			} else if (status) {
				searchParams.append('status', status);
			}

			const { data } = await axiosSecure.get(`/articles?${searchParams}`);
			return data;
		},
	});

	return {
		data,
		isLoading,
		refetch,
	};
};

export default useArticles;
