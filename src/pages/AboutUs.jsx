import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Target, Shield, Newspaper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
	const navigate = useNavigate();

	const features = [
		{
			icon: Users,
			title: 'Community-Driven',
			description: 'Join a thriving community of tech enthusiasts and professionals sharing knowledge.',
		},
		{
			icon: Target,
			title: 'Expert Content',
			description: 'Access high-quality articles written by industry experts and thought leaders.',
		},
		{
			icon: Shield,
			title: 'Trusted Source',
			description: 'Rely on our rigorous editorial process ensuring accurate and reliable information.',
		},
		{
			icon: Newspaper,
			title: 'Latest Updates',
			description: 'Stay informed with the most recent developments in technology and innovation.',
		},
	];

	const team = [
		{
			name: 'Sadik AL Sami',
			role: 'Founder & CEO',
			image: 'https://i.ibb.co.com/ss46grJ/sami.jpg',
		},
		{
			name: 'Kazi Aishikuzzaman',
			role: 'Chief Editor',
			image: 'https://i.ibb.co.com/QYzkcrF/kazi.png',
		},
		{
			name: 'Tanjid Karim Shafin',
			role: 'Tech Lead',
			image: 'https://i.ibb.co.com/YTcssr4/shafin.png',
		},
	];

	return (
		<div className='min-h-screen bg-background'>
			{/* Hero Section */}
			<section className='relative py-20 overflow-hidden'>
				<div className='absolute inset-0 bg-gradient-to-r from-primary to-primary/80' />
				<div className='absolute inset-0 bg-grid-white/10' />
				<div className='relative container mx-auto px-4 md:px-6'>
					<div className='flex flex-col items-center text-center space-y-4'>
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className='text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl'>
							About KnowledgeHerald
						</motion.h1>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.1 }}
							className='max-w-[600px] text-white/90 md:text-xl'>
							Your trusted source for the latest technology news and insights
						</motion.p>
					</div>
				</div>
			</section>

			{/* Mission Section */}
			<section className='py-20'>
				<div className='container mx-auto px-4 md:px-6'>
					<div className='grid gap-12 lg:grid-cols-2 lg:gap-20 items-center'>
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5 }}
							viewport={{ once: true }}>
							<h2 className='text-3xl font-bold tracking-tight mb-4'>Our Mission</h2>
							<p className='text-muted-foreground mb-4'>
								At TechNews Daily, we believe in making technology news accessible, understandable, and relevant to
								everyone. Our mission is to bridge the gap between complex technological advancements and our readers'
								understanding.
							</p>
							<p className='text-muted-foreground mb-6'>
								We strive to deliver accurate, timely, and insightful coverage of the tech industry, helping our readers
								stay informed and make better decisions in the fast-paced digital world.
							</p>
							<Button onClick={() => navigate('/subscription')}>
								Join Us Today <ArrowRight className='ml-2 h-4 w-4' />
							</Button>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5 }}
							viewport={{ once: true }}
							className='relative'>
							<div className='aspect-video rounded-xl overflow-hidden'>
								<img
									src='https://i.ibb.co.com/y4Nwv1V/our-vision.png'
									alt='Our Mission'
									className='w-full h-full object-cover'
								/>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className='py-20 bg-muted/30'>
				<div className='container mx-auto px-4 md:px-6'>
					<div className='text-center max-w-3xl mx-auto mb-12'>
						<h2 className='text-3xl font-bold tracking-tight mb-4'>Why Choose Us</h2>
						<p className='text-muted-foreground'>Discover what makes TechNews Daily stand out from the crowd</p>
					</div>

					<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
						{features.map((feature, index) => (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								viewport={{ once: true }}>
								<Card>
									<CardContent className='p-6'>
										<feature.icon className='h-12 w-12 text-primary mb-4' />
										<h3 className='font-semibold mb-2'>{feature.title}</h3>
										<p className='text-sm text-muted-foreground'>{feature.description}</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Team Section */}
			<section className='py-20'>
				<div className='container mx-auto px-4 md:px-6'>
					<div className='text-center max-w-3xl mx-auto mb-12'>
						<h2 className='text-3xl font-bold tracking-tight mb-4'>Meet Our Team</h2>
						<p className='text-muted-foreground'>The people behind TechNews Daily</p>
					</div>

					<div className='grid md:grid-cols-3 gap-8'>
						{team.map((member, index) => (
							<motion.div
								key={member.name}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								viewport={{ once: true }}
								className='text-center'>
								<div className='relative w-48 h-48 mx-auto mb-4'>
									<img
										src={member.image || '/placeholder.svg'}
										alt={member.name}
										className='rounded-full object-cover w-full h-full'
									/>
								</div>
								<h3 className='font-semibold'>{member.name}</h3>
								<p className='text-sm text-muted-foreground'>{member.role}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
};

export default AboutUs;
