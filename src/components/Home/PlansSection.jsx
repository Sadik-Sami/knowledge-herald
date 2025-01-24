import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CreditCard, Loader2 } from 'lucide-react';
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
			<div className='px-4 md:px-6'>
				<div className='text-center mb-12'>
					<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>Choose Your Plan</h2>
					<p className='mt-4 text-muted-foreground md:text-lg'>Select a plan that suits your needs</p>
				</div>

				<div className='grid md:grid-cols-3 gap-8 container mx-auto'>
					{plans.map((plan) => (
						<motion.div
							key={plan._id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
							whileHover={{ scale: 1.02 }}
							className='relative h-full'>
							{plan.popular && (
								<div className='absolute -top-4 left-0 right-0 flex justify-center z-10'>
									<span className='bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full'>
										Most Popular
									</span>
								</div>
							)}
							<Card
								className={cn(
									'relative h-full flex flex-col',
									plan.popular && 'border-primary shadow-lg bg-primary/5'
								)}>
								<CardHeader>
									<CardTitle>{plan.name}</CardTitle>
									<CardDescription>{plan.description}</CardDescription>
								</CardHeader>
								<CardContent className='flex-grow'>
									<div className='text-3xl font-bold mb-2'>${plan.price.toFixed(2)}</div>
									<p className='text-sm text-muted-foreground mb-4'>
										{formatDuration(plan.duration, plan.durationUnit)} access
									</p>
									<ul className='space-y-2'>
										{plan.features.map((feature) => (
											<li key={feature} className='flex items-center gap-2'>
												<Check className={cn('h-4 w-4', plan.popular ? 'text-primary' : 'text-muted-foreground')} />
												<span className='text-sm'>{feature}</span>
											</li>
										))}
									</ul>
								</CardContent>
								<CardFooter className='mt-auto pt-6'>
									<Button
										className={cn('w-full', plan.popular && 'bg-primary hover:bg-primary/90')}
										onClick={() => navigate('/subscription', { state: { selectedPlan: plan } })}>
										<CreditCard className='mr-2 h-4 w-4' />
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
