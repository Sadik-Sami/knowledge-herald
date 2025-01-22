import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/use-AuthContext';
import useAxiosSecure from '@/hooks/use-AxiosSecure';
import useSubscription from '@/hooks/use-Subscription';
import { cn } from '@/lib/utils';

const SubscriptionPage = () => {
	const [loading, setLoading] = useState(false);
	const { user } = useAuth();
	const { addToast } = useToast();
	const axiosSecure = useAxiosSecure();
	const { hasSubscription, subscriptionEnd } = useSubscription();

	// Fetch plans from the database
	const { data: plans = [], isLoading: plansLoading } = useQuery({
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

	const handleSubscribe = async (plan) => {
		if (!user) {
			addToast('Please login to subscribe', 'error');
			return;
		}

		try {
			setLoading(true);
			const { data } = await axiosSecure.post('/create-payment-intent', {
				planId: plan._id, // Changed from plan.id to plan._id
				email: user.email,
			});

			if (!data.success) {
				throw new Error(data.message);
			}
      console.log(import.meta.env.VITE_STRIPE_PK);
			const stripe = await window.loadStripe(import.meta.env.VITE_STRIPE_PK);
			await stripe.redirectToCheckout({
				sessionId: data.sessionId,
			});
		} catch (error) {
			console.error('Subscription Error:', error);
			addToast(error.message || 'Failed to process payment', 'error');
		} finally {
			setLoading(false);
		}
	};

	if (plansLoading) {
		return (
			<div className='min-h-[calc(100vh-4rem)] grid place-items-center'>
				<Loader2 className='h-8 w-8 animate-spin' />
			</div>
		);
	}

	return (
		<div className='min-h-[calc(100vh-4rem)] bg-muted/30 py-16'>
			<div className='container px-4 md:px-6'>
				<div className='text-center mb-12'>
					<h1 className='text-4xl font-bold tracking-tighter sm:text-5xl'>Choose Your Premium Access</h1>
					<p className='mt-4 text-muted-foreground md:text-lg'>Select the duration that works best for you</p>
					{hasSubscription && (
						<div className='mt-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary'>
							Your subscription is active until {new Date(subscriptionEnd).toLocaleDateString()}
						</div>
					)}
				</div>

				<div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
					{plans.map((plan) => (
						<motion.div key={plan._id} whileHover={{ scale: 1.02 }} className='relative'>
							{plan.popular && (
								<div className='absolute -top-4 left-0 right-0 flex justify-center'>
									<span className='bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full'>
										Most Popular
									</span>
								</div>
							)}
							<Card className={cn('relative overflow-hidden', plan.popular && 'border-primary shadow-lg')}>
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
												<Check className='h-4 w-4 text-primary' />
												<span className='text-sm'>{feature}</span>
											</li>
										))}
									</ul>
								</CardContent>
								<CardFooter>
									<Button
										className='w-full'
										onClick={() => handleSubscribe(plan)}
										disabled={loading || hasSubscription}>
										{loading ? (
											<>
												<Loader2 className='mr-2 h-4 w-4 animate-spin' />
												Processing...
											</>
										) : hasSubscription ? (
											'Already Subscribed'
										) : (
											'Subscribe Now'
										)}
									</Button>
								</CardFooter>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
};

export default SubscriptionPage;
