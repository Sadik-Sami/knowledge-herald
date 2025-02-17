import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Award } from 'lucide-react';

const awards = [
	{
		title: 'Best Tech News Platform',
		organization: 'Digital Media Awards',
		year: '2024',
		icon: '🏆',
	},
	{
		title: 'Excellence in Tech Journalism',
		organization: 'Tech Writers Association',
		year: '2023',
		icon: '🎯',
	},
	{
		title: 'Most Innovative News Platform',
		organization: 'Innovation Awards',
		year: '2023',
		icon: '💡',
	},
	{
		title: 'Outstanding Content Quality',
		organization: 'Content Excellence Awards',
		year: '2023',
		icon: '⭐',
	},
];

const AwardsSection = () => {
	return (
		<section className='py-20'>
			<div className='container mx-auto px-4 md:px-6'>
				<div className='text-center max-w-3xl mx-auto mb-12'>
					<div className='flex items-center justify-center mb-4'>
						<Award className='h-8 w-8 text-primary' />
					</div>
					<h2 className='text-3xl font-bold tracking-tight mb-4'>Awards & Recognition</h2>
					<p className='text-muted-foreground'>Recognized for excellence in technology journalism and digital media</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					{awards.map((award, index) => (
						<motion.div
							key={award.title}
							initial={{ opacity: 0, scale: 0.95 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
							viewport={{ once: true }}>
							<Card className='h-full hover:shadow-lg transition-shadow'>
								<CardContent className='p-6 flex flex-col items-center text-center'>
									<span className='text-4xl mb-4' role='img' aria-label='award icon'>
										{award.icon}
									</span>
									<h3 className='font-semibold mb-2'>{award.title}</h3>
									<p className='text-sm text-muted-foreground mb-1'>{award.organization}</p>
									<p className='text-sm font-medium text-primary'>{award.year}</p>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>

				{/* Achievements Banner */}
				<div className='mt-12 grid grid-cols-2 md:grid-cols-4 gap-6'>
					{[
						{ label: 'Articles Published', value: '10,000+' },
						{ label: 'Monthly Readers', value: '1M+' },
						{ label: 'Expert Contributors', value: '500+' },
						{ label: 'Countries Reached', value: '150+' },
					].map((stat, index) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
							viewport={{ once: true }}
							className='text-center'>
							<div className='text-2xl font-bold text-primary mb-2'>{stat.value}</div>
							<div className='text-sm text-muted-foreground'>{stat.label}</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default AwardsSection;
