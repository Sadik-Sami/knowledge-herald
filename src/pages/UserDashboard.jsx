import { useQuery } from '@tanstack/react-query';
import TopPosts from '@/components/Dashboard/TopPosts';
import DashboardStats from '@/components/Dashboard/DashboardStats';
import useAxiosSecure from '@/hooks/use-AxiosSecure';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/use-AuthContext';

const UserDashboard = () => {
	const { user } = useAuth();
	const { addToast } = useToast(); // Using custom toast
	const axiosSecure = useAxiosSecure();

	const {
		data: dashboardData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['dashboard', user?.email],
		queryFn: async () => {
			const response = await axiosSecure.get(`/user-stats?email=${user?.email}`);
			return response.data;
		},
		enabled: !!user?.email,
		staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
		retry: 2,
		onError: (error) => {
			// Updated to use custom toast
			addToast(error.response?.data?.message || 'Failed to fetch dashboard data', 'error');
		},
	});
	if (isLoading) {
		return (
			<div className='container mx-auto p-6'>
				<div className='space-y-6'>
					<div className='grid gap-4 md:grid-cols-3'>
						{[1, 2, 3].map((i) => (
							<div key={i} className='h-32 animate-pulse bg-muted rounded-lg' />
						))}
					</div>
					<div className='h-[400px] animate-pulse bg-muted rounded-lg' />
					<div className='h-[600px] animate-pulse bg-muted rounded-lg' />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='container mx-auto p-6'>
				<div className='text-center space-y-4'>
					<h2 className='text-2xl font-bold text-destructive'>Error Loading Dashboard</h2>
					<p className='text-muted-foreground'>
						{error.response?.data?.message || 'Failed to load dashboard data. Please try again later.'}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className='container mx-auto p-6'>
			{dashboardData ? (
				<div className='space-y-6'>
					<DashboardStats stats={dashboardData?.stats} />
					<TopPosts posts={dashboardData?.stats?.articles} />
				</div>
			) : (
				<div className='space-y-6'>
					<div className='grid gap-4 md:grid-cols-3'>
						{[1, 2, 3].map((i) => (
							<div key={i} className='h-32 animate-pulse bg-muted rounded-lg' />
						))}
					</div>
					<div className='h-[400px] animate-pulse bg-muted rounded-lg' />
					<div className='h-[600px] animate-pulse bg-muted rounded-lg' />
				</div>
			)}
		</div>
	);
};

export default UserDashboard;
