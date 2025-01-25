import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, ArrowRight } from 'lucide-react';
import useAxiosSecure from '@/hooks/use-AxiosSecure';
import { useNavigate } from 'react-router-dom';

const FeaturedPublishers = () => {
	const navigate = useNavigate();
	const axiosSecure = useAxiosSecure();

	const { data: publishers = [], isLoading } = useQuery({
		queryKey: ['featured-publishers'],
		queryFn: async () => {
			const { data } = await axiosSecure.get('/publishers');
			return data.data;
		},
	});

	if (isLoading) {
		return (
			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
				{[...Array(4)].map((_, i) => (
					<Card key={i} className='animate-pulse'>
						<CardContent className='p-6'>
							<div className='h-16 w-16 rounded-full bg-muted mx-auto mb-4' />
							<div className='h-4 bg-muted rounded w-3/4 mx-auto' />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	return (
		<section className='py-20 bg-muted/30'>
			<div className='container mx-auto px-4 md:px-6'>
				<div className='flex items-center justify-between mb-8'>
					<div>
						<h2 className='text-3xl font-bold tracking-tight'>Featured Publishers</h2>
						<p className='text-muted-foreground mt-2'>Leading voices in technology journalism</p>
					</div>
					<Button variant='link' onClick={() => navigate('/article')} className='hidden sm:flex'>
						View Their Works <ArrowRight className='ml-2 h-4 w-4' />
					</Button>
				</div>

				<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
					{publishers.map((publisher, index) => (
						<motion.div
							key={publisher._id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
							viewport={{ once: true }}>
							<Card className='group hover:shadow-lg transition-shadow'>
								<CardContent className='p-6 text-center'>
									<div className='mb-4 relative'>
										<div className='w-20 h-20 rounded-full mx-auto overflow-hidden'>
											<img
												src={publisher.logo || '/placeholder.svg'}
												alt={publisher.name}
												className='w-full h-full object-cover transition-transform group-hover:scale-110'
											/>
										</div>
										<div className='absolute inset-0 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity' />
									</div>
									<h3 className='font-semibold mb-2'>{publisher.name}</h3>
									<Button variant='outline' size='sm' className='w-full' onClick={() => navigate(`/articles`)}>
										View Articles
									</Button>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default FeaturedPublishers;
