import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './use-AxiosSecure';

const useArticles = (page = 1, search = '', publisher = null, tags = []) => {
	const axiosSecure = useAxiosSecure();

	return useQuery({
		queryKey: ['articles', page, search, publisher, tags],
		queryFn: async () => {
			const searchParams = new URLSearchParams({
				page: page.toString(),
				limit: '10',
				...(search && { search }),
				...(publisher && { publisher: publisher.value }),
				...(tags.length && { tags: tags.map((t) => t.value).join(',') }),
			});

			const { data } = await axiosSecure.get(`/articles?${searchParams}`);
			return data;
		},
	});
};

export default useArticles;
