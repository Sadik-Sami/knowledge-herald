import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import useAxiosSecure from '@/hooks/use-AxiosSecure';
import { cn } from '@/lib/utils';

const PlansSection = () => {
	const navigate = useNavigate();
	const axiosSecure = useAxiosSecure();

	const { data: plans = [], isLoading } = useQuery({
		queryKey: ['plans'],
		queryFn: async () => {
			const { data } = await axiosSecure.get('/plans');
			return data.data.sort((a, b) => a.order - b.order);
		},
	});

	const formatDuration = (duration, unit) => {
		if (unit === 'minute') return `${duration} minute${duration > 1 ? 's' : ''}`;
		if (unit === 'days') return `${duration} day${duration > 1 ? 's' : ''}`;
		if (unit === 'months') return `${duration} month${duration > 1 ? 's' : ''}`;
		return `${duration} ${unit}`;
	};

	if (isLoading) {
		return (
			<div className='min-h-[40vh] grid place-items-center'>
				<Loader2 className='h-8 w-8 animate-spin' />
			</div>
		);
	}

	return (
		<section className='py-20 bg-muted/30'>
			<div className='px-4 md:px-6 max-w-7xl mx-auto'>
				<div className='text-center mb-12'>
					<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>Choose Your Plan</h2>
					<p className='mt-4 text-muted-foreground md:text-lg'>Select a plan that suits your needs</p>
				</div>

				<div className='grid md:grid-cols-3 min-w-full gap-8 mx-auto'>
					{plans.map((plan) => (
						<motion.div
							key={plan._id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
							whileHover={{ scale: 1.02 }}
							className='relative'>
							{plan.popular && (
								<div className='absolute -top-4 left-0 right-0 flex justify-center'>
									<span className='bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full z-10'>
										Most Popular
									</span>
								</div>
							)}
							<Card
								className={cn(
									'relative overflow-hidden transition-shadow hover:shadow-lg h-[32rem]',
									plan.popular && 'border-primary shadow-lg bg-primary/5'
								)}>
								<CardHeader>
									<CardTitle>{plan.name}</CardTitle>
									<CardDescription>{plan.description}</CardDescription>
								</CardHeader>
								<CardContent>
									<div className='text-3xl font-bold'>${plan.price.toFixed(2)}</div>
									<p className='text-sm text-muted-foreground mt-2'>
										{formatDuration(plan.duration, plan.durationUnit)} access
									</p>
									<ul className='mt-4 space-y-2'>
										{plan.features.map((feature) => (
											<li key={feature} className='flex items-center gap-2'>
												<Check className={cn('h-4 w-4', plan.popular ? 'text-primary' : 'text-muted-foreground')} />
												<span className='text-sm'>{feature}</span>
											</li>
										))}
									</ul>
								</CardContent>
								<CardFooter>
									<Button
										className={cn('w-full', plan.popular && 'bg-primary hover:bg-primary/90')}
										onClick={() => navigate('/subscription')}>
										Get Started
									</Button>
								</CardFooter>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default PlansSection;
