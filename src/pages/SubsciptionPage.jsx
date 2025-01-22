import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, CreditCard, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/use-AuthContext';
import useAxiosSecure from '@/hooks/use-AxiosSecure';
import useSubscription from '@/hooks/use-Subscription';
import { cn } from '@/lib/utils';

const SubscriptionPage = () => {
	const [loading, setLoading] = useState(false);
	const [selectedPlan, setSelectedPlan] = useState(null);
	const { user } = useAuth();
	const { addToast } = useToast();
	const axiosSecure = useAxiosSecure();
	const { hasSubscription, subscriptionEnd } = useSubscription();

	const { data: plans = [], isLoading: plansLoading } = useQuery({
		queryKey: ['plans'],
		queryFn: async () => {
			const { data } = await axiosSecure.get('/plans');
			return data.data.sort((a, b) => a.order - b.order);
		},
	});

	const handleSubscribe = async () => {
		if (!user) {
			addToast('Please login to subscribe', 'error');
			return;
		}

		if (!selectedPlan) {
			addToast('Please select a plan', 'error');
			return;
		}

		try {
			setLoading(true);
			const { data } = await axiosSecure.post('/create-payment-intent', {
				planId: selectedPlan._id,
				email: user.email,
			});

			if (!data.success) {
				throw new Error(data.message);
			}

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
		<div className='min-h-[calc(100vh-4rem)]'>
			{/* Premium Banner */}
			<div className='relative bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 py-20 '>
				<div className='absolute inset-0 bg-grid-white/10' />
				<div className='relative container px-4 md:px-6 max-w-7xl mx-auto'>
					<div className='flex flex-col items-center text-center space-y-4'>
						<Sparkles className='h-12 w-12 text-primary animate-pulse' />
						<h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl'>Unlock Premium Access</h1>
						<p className='max-w-[600px] text-muted-foreground md:text-xl'>
							Get unlimited access to all premium articles and exclusive content
						</p>
						{hasSubscription && (
							<div className='mt-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary'>
								Your subscription is active until {new Date(subscriptionEnd).toLocaleDateString()}
							</div>
						)}
					</div>
				</div>
			</div>

			<div className='px-4 md:px-6 py-12 max-w-7xl mx-auto'>
				<Card className='max-w-2xl mx-auto'>
					<CardHeader>
						<CardTitle>Choose Your Plan</CardTitle>
						<CardDescription>Select a subscription period that suits you best</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<Select onValueChange={(value) => setSelectedPlan(plans.find((p) => p._id === value))}>
							<SelectTrigger>
								<SelectValue placeholder='Select a subscription period' />
							</SelectTrigger>
							<SelectContent>
								{plans.map((plan) => (
									<SelectItem key={plan._id} value={plan._id}>
										{plan.name} - ${plan.price.toFixed(2)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{selectedPlan && (
							<div className='rounded-lg border p-4 space-y-3'>
								<div className='flex justify-between items-center'>
									<h3 className='font-medium'>{selectedPlan.name}</h3>
									<span className='text-2xl font-bold'>${selectedPlan.price.toFixed(2)}</span>
								</div>
								<p className='text-sm text-muted-foreground'>{selectedPlan.description}</p>
								<ul className='space-y-2'>
									{selectedPlan.features.map((feature) => (
										<li key={feature} className='flex items-center gap-2 text-sm'>
											<Check className='h-4 w-4 text-primary' />
											{feature}
										</li>
									))}
								</ul>
							</div>
						)}
					</CardContent>
					<CardFooter>
						<Button
							className='w-full'
							size='lg'
							onClick={handleSubscribe}
							disabled={loading || hasSubscription || !selectedPlan}>
							{loading ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									Processing...
								</>
							) : hasSubscription ? (
								'Already Subscribed'
							) : (
								<>
									<CreditCard className='mr-2 h-4 w-4' />
									Subscribe Now
								</>
							)}
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};

export default SubscriptionPage;
