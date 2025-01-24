import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';

const testimonials = [
	{
		name: 'Sarah Johnson',
		role: 'Software Engineer',
		image: '/testimonials/sarah.jpg',
		quote: "The quality of tech articles here is outstanding. I've learned so much about emerging technologies.",
	},
	{
		name: 'Michael Chen',
		role: 'Tech Lead',
		image: '/testimonials/michael.jpg',
		quote: 'Premium content is worth every penny. The in-depth analysis helps me stay ahead in my field.',
	},
	{
		name: 'Emily Rodriguez',
		role: 'Product Manager',
		image: '/testimonials/emily.jpg',
		quote: 'The variety of topics and expert insights make this my go-to source for tech news.',
	},
];

const TestimonialsSection = () => {
	return (
		<section className='py-20'>
			<div className='container mx-auto px-4 md:px-6'>
				<div className='text-center max-w-3xl mx-auto mb-12'>
					<h2 className='text-3xl font-bold tracking-tight mb-4'>What Our Readers Say</h2>
					<p className='text-muted-foreground'>Join thousands of tech professionals who trust our platform</p>
				</div>

				<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={testimonial.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							viewport={{ once: true }}>
							<Card className='h-full'>
								<CardContent className='p-6'>
									<Quote className='h-8 w-8 text-primary mb-4' />
									<p className='text-muted-foreground mb-6'>"{testimonial.quote}"</p>
									<div className='flex items-center gap-4'>
										<Avatar>
											<AvatarImage src={testimonial.image} />
											<AvatarFallback>
												{testimonial.name
													.split(' ')
													.map((n) => n[0])
													.join('')}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className='font-semibold'>{testimonial.name}</p>
											<p className='text-sm text-muted-foreground'>{testimonial.role}</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default TestimonialsSection;
