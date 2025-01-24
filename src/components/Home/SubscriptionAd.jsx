import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, X } from 'lucide-react';
import useSubscription from '@/hooks/use-Subscription';

const SubscriptionAd = () => {
	const navigate = useNavigate();
	const { hasSubscription } = useSubscription();
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (!hasSubscription) {
			const timer = setTimeout(() => {
				setIsVisible(true);
			}, 30000); // 30 seconds

			return () => clearTimeout(timer);
		}
	}, [hasSubscription]);

	if (hasSubscription || !isVisible) return null;

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.95 }}
				className='fixed bottom-4 right-4 z-50'>
				<Card className='w-[300px] md:w-[400px] shadow-lg border-primary/20'>
					<CardContent className='p-6'>
						<button
							onClick={() => setIsVisible(false)}
							className='absolute top-2 right-2 text-muted-foreground hover:text-foreground'>
							<X className='h-4 w-4' />
						</button>
						<div className='flex items-center gap-4'>
							<div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center'>
								<Crown className='h-6 w-6 text-primary' />
							</div>
							<div>
								<h3 className='font-semibold'>Unlock Premium Content</h3>
								<p className='text-sm text-muted-foreground'>Get unlimited access to all premium articles</p>
							</div>
						</div>
						<Button className='w-full mt-4' onClick={() => navigate('/subscription')}>
							Subscribe Now
						</Button>
					</CardContent>
				</Card>
			</motion.div>
		</AnimatePresence>
	);
};

export default SubscriptionAd;
