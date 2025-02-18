import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-AuthContext';
import { useToast } from '@/components/ui/use-toast';
import DashboardStats from '@/components/dashboard/DashboardStats';
import TopPosts from '@/components/dashboard/TopPosts';
import useAxiosSecure from '@/hooks/useAxiosSecure';

const Dashboard = () => {
	const { user } = useAuth();
	const { toast } = useToast();
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
		staleTime: 1000 * 60 * 5, // Considering data fresh for 5 minutes
		retry: 2,
		onError: (error) => {
			toast({
				title: 'Error',
				description: error.response?.data?.message || 'Failed to fetch dashboard data',
				variant: 'destructive',
			});
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
			<div className='space-y-6'>
				<DashboardStats stats={dashboardData?.stats} />
				<TopPosts posts={dashboardData?.topPosts} />
			</div>
		</div>
	);
};

export default Dashboard;
