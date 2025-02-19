import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { FileText, Eye, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DashboardStats = ({ stats }) => {
	const { addToast } = useToast();
	console.log(stats);
	const handleChartError = () => {
		addToast('Failed to load chart data', 'error');
	};

	if (!stats) return null;

	// Chart configuration for theming
	const chartConfig = {
		views: {
			label: 'Views',
			color: 'hsl(var(--primary))',
			theme: {
				light: 'hsl(var(--primary))',
				dark: 'hsl(var(--primary))',
			},
		},
		posts: {
			label: 'Posts',
			color: 'hsl(var(--primary))',
			theme: {
				light: 'hsl(var(--primary))',
				dark: 'hsl(var(--primary))',
			},
		},
	};

	const StatCard = ({ title, value, icon: Icon, growth }) => (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<CardTitle className='text-sm font-medium'>{title}</CardTitle>
				<Icon className='h-4 w-4 text-muted-foreground' />
			</CardHeader>
			<CardContent>
				<div className='text-2xl font-bold'>{value}</div>
				{typeof growth !== 'undefined' && (
					<p className={`text-xs ${growth >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center mt-1`}>
						{growth >= 0 ? <TrendingUp className='h-3 w-3 mr-1' /> : <TrendingDown className='h-3 w-3 mr-1' />}
						{Math.abs(growth)}% from last month
					</p>
				)}
			</CardContent>
		</Card>
	);

	return (
		<div className='space-y-6'>
			<div className='grid gap-4 md:grid-cols-3'>
				<StatCard title='Total Posts' value={stats.totalPosts} icon={FileText} growth={stats.postsGrowth} />
				<StatCard title='Total Views' value={stats.totalViews} icon={Eye} growth={stats.viewsGrowth} />
				<StatCard title='Average Rating' value={stats.averageRating?.toFixed(1) || 'N/A'} icon={Star} />
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Article Views</CardTitle>
				</CardHeader>
				<CardContent>
					<ChartContainer
						config={{
							views: {
								label: 'Views',
								color: 'hsl(var(--primary))',
							},
						}}
						className='w-full aspect-[2/1]'>
						<ResponsiveContainer width='100%' height={350}>
							<BarChart
								data={stats.articles}
								margin={{
									top: 5,
									right: 30,
									left: 20,
									bottom: 5,
								}}>
								<XAxis
									dataKey='title'
									tickFormatter={(value) => value.substring(0, 20) + '...'}
									interval={0}
									angle={-45}
									textAnchor='end'
									height={100}
								/>
								<YAxis />
								<ChartTooltip
									content={
										<ChartTooltipContent
											content={({ active, payload }) => {
												if (active && payload && payload.length) {
													return (
														<div className='rounded-lg border bg-background p-2 shadow-sm'>
															<div className='grid grid-cols-2 gap-2'>
																<div className='flex flex-col'>
																	<span className='text-[0.70rem] uppercase text-muted-foreground'>Title</span>
																	<span className='font-bold text-muted-foreground'>{payload[0].payload.title}</span>
																</div>
																<div className='flex flex-col'>
																	<span className='text-[0.70rem] uppercase text-muted-foreground'>Views</span>
																	<span className='font-bold'>{payload[0].payload.views}</span>
																</div>
															</div>
														</div>
													);
												}
												return null;
											}}
										/>
									}
								/>
								<Bar dataKey='views' fill='hsl(var(--primary))' radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	);
};

export default DashboardStats;
