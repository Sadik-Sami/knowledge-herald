import { useQuery } from '@tanstack/react-query';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { Users, NewspaperIcon, Crown, Building2, UserCheck } from 'lucide-react';
import useAxiosSecure from '@/hooks/use-AxiosSecure';

const StatsSection = () => {
	const axiosSecure = useAxiosSecure();

	const { data: stats = {}, isLoading } = useQuery({
		queryKey: ['site-stats'],
		queryFn: async () => {
			const { data } = await axiosSecure.get('/stats');
			return data.data;
		},
	});

	const statItems = [
		{
			icon: Users,
			label: 'Total Users',
			value: stats.totalUsers || 0,
			color: 'text-blue-500',
		},
		{
			icon: NewspaperIcon,
			label: 'Free Articles',
			value: stats.freeArticles || 0,
			color: 'text-green-500',
		},
		{
			icon: Crown,
			label: 'Premium Articles',
			value: stats.premiumArticles || 0,
			color: 'text-yellow-500',
		},
		{
			icon: Building2,
			label: 'Publishers',
			value: stats.publishers || 0,
			color: 'text-purple-500',
		},
		{
			icon: UserCheck,
			label: 'Subscribed Users',
			value: stats.subscribedUsers || 0,
			color: 'text-pink-500',
		},
	];

	if (isLoading) {
		return (
			<div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-pulse'>
				{[...Array(5)].map((_, i) => (
					<div key={i} className='h-32 bg-muted rounded-lg'></div>
				))}
			</div>
		);
	}

	return (
		<section className='py-20 bg-muted/30'>
			<div className='container mx-auto px-4 md:px-6'>
				<h2 className='text-3xl font-bold text-center mb-12'>Our Growing Community</h2>
				<div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'>
					{statItems.map((item, index) => (
						<motion.div
							key={item.label}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							viewport={{ once: true }}
							className='bg-background rounded-lg p-6 text-center shadow-sm'>
							<item.icon className={`h-8 w-8 mx-auto mb-4 ${item.color}`} />
							<CountUp end={item.value} duration={2.5} separator=',' className='text-3xl font-bold' />
							<p className='text-sm text-muted-foreground mt-2'>{item.label}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default StatsSection;
