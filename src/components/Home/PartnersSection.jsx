import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

const partners = [
	{
		name: 'TechCorp International',
		logo: '/partners/techcorp.svg',
		description: 'Global Technology Solutions',
	},
	{
		name: 'InnovateHub',
		logo: '/partners/innovatehub.svg',
		description: 'Innovation & Research',
	},
	{
		name: 'Digital Dynamics',
		logo: '/partners/digitaldynamics.svg',
		description: 'Digital Transformation',
	},
	{
		name: 'Future Systems',
		logo: '/partners/futuresystems.svg',
		description: 'Future Technologies',
	},
	{
		name: 'Tech Ventures',
		logo: '/partners/techventures.svg',
		description: 'Technology Investment',
	},
	{
		name: 'Smart Solutions',
		logo: '/partners/smartsolutions.svg',
		description: 'Smart Technology',
	},
];

const PartnersSection = () => {
	return (
		<section className='py-20 bg-muted/30'>
			<div className='container px-4 md:px-6'>
				<div className='text-center max-w-3xl mx-auto mb-12'>
					<div className='flex items-center justify-center mb-4'>
						<Building2 className='h-8 w-8 text-primary' />
					</div>
					<h2 className='text-3xl font-bold tracking-tight mb-4'>Our Partners</h2>
					<p className='text-muted-foreground'>
						Working with industry leaders to bring you the best in technology news and insights
					</p>
				</div>

				<div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
					{partners.map((partner, index) => (
						<motion.div
							key={partner.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
							viewport={{ once: true }}>
							<Card className='hover:shadow-lg transition-shadow'>
								<CardContent className='p-6 flex flex-col items-center text-center'>
									<div className='w-20 h-20 mb-4 flex items-center justify-center'>
										<img
											src={partner.logo || '/placeholder.svg?height=80&width=80'}
											alt={partner.name}
											className='w-full h-full object-contain'
										/>
									</div>
									<h3 className='font-semibold mb-2'>{partner.name}</h3>
									<p className='text-sm text-muted-foreground'>{partner.description}</p>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default PartnersSection;
