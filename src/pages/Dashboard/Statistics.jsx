import { useQuery } from '@tanstack/react-query';
import { Chart } from 'react-google-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, NewspaperIcon, Crown, Building2, TrendingUp, Eye, MessageSquare, Star } from 'lucide-react';
import useAxiosSecure from '@/hooks/use-AxiosSecure';

const Statistics = () => {
	const axiosSecure = useAxiosSecure();

	const { data: stats = {}, isLoading: statsLoading } = useQuery({
		queryKey: ['admin-stats'],
		queryFn: async () => {
			const { data } = await axiosSecure.get('/admin/stats');
			return data.data;
		},
	});

	if (statsLoading) {
		return (
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
				{[...Array(6)].map((_, i) => (
					<Skeleton key={i} className='h-[300px]' />
				))}
			</div>
		);
	}

	// Prepare data for publication distribution pie chart
	const publicationData = [
		['Publisher', 'Articles'],
		...stats.publicationDistribution.map((item) => [item.name, item.count]),
	];

	// Prepare data for monthly articles line chart
	const monthlyData = [
		['Month', 'Free Articles', 'Premium Articles'],
		...stats.monthlyArticles.map((item) => [item.month, item.freeArticles, item.premiumArticles]),
	];

	// Prepare data for user engagement bar chart
	const engagementData = [
		['Metric', 'Count', { role: 'style' }],
		['Views', stats.totalViews, '#4CAF50'],
		['Comments', stats.totalComments, '#2196F3'],
		['Ratings', stats.totalRatings, '#FFC107'],
	];

	return (
		<div className='space-y-6'>
			{/* Quick Stats */}
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center gap-4'>
							<div className='p-2 bg-primary/10 rounded-lg'>
								<Users className='h-6 w-6 text-primary' />
							</div>
							<div>
								<p className='text-sm text-muted-foreground'>Total Users</p>
								<h3 className='text-2xl font-bold'>{stats.totalUsers}</h3>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center gap-4'>
							<div className='p-2 bg-green-500/10 rounded-lg'>
								<NewspaperIcon className='h-6 w-6 text-green-500' />
							</div>
							<div>
								<p className='text-sm text-muted-foreground'>Total Articles</p>
								<h3 className='text-2xl font-bold'>{stats.totalArticles}</h3>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center gap-4'>
							<div className='p-2 bg-yellow-500/10 rounded-lg'>
								<Crown className='h-6 w-6 text-yellow-500' />
							</div>
							<div>
								<p className='text-sm text-muted-foreground'>Premium Articles</p>
								<h3 className='text-2xl font-bold'>{stats.premiumArticles}</h3>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center gap-4'>
							<div className='p-2 bg-blue-500/10 rounded-lg'>
								<Building2 className='h-6 w-6 text-blue-500' />
							</div>
							<div>
								<p className='text-sm text-muted-foreground'>Publishers</p>
								<h3 className='text-2xl font-bold'>{stats.totalPublishers}</h3>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Charts */}
			<div className='grid gap-6 md:grid-cols-2'>
				{/* Publication Distribution */}
				<Card>
					<CardHeader>
						<CardTitle>Publication Distribution</CardTitle>
					</CardHeader>
					<CardContent>
						<Chart
							chartType='PieChart'
							data={publicationData}
							options={{
								pieHole: 0.4,
								colors: ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF5722'],
								legend: { position: 'bottom' },
								chartArea: { width: '100%', height: '70%' },
							}}
							width='100%'
							height='300px'
						/>
					</CardContent>
				</Card>
				{/* User Engagement */}
				<Card className=''>
					<CardHeader>
						<CardTitle>User Engagement</CardTitle>
					</CardHeader>
					<CardContent>
						<Chart
							chartType='ColumnChart'
							data={engagementData}
							options={{
								legend: { position: 'none' },
								chartArea: { width: '100%', height: '70%' },
								vAxis: { minValue: 0 },
								animation: {
									startup: false,
									easing: 'out',
									duration: 1000,
								},
							}}
							width='100%'
							height='300px'
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Statistics;
