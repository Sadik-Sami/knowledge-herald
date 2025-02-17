import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const resources = [
	{
		title: 'Getting Started with Tech Journalism',
		description: 'Learn the fundamentals of technology journalism and how to write compelling tech articles.',
		category: 'Guide',
		readTime: '10 min read',
	},
	{
		title: 'Tech Writing Style Guide',
		description: 'Our comprehensive guide to writing technology articles that engage and inform readers.',
		category: 'Documentation',
		readTime: '15 min read',
	},
	{
		title: 'Contributor Guidelines',
		description: 'Everything you need to know about contributing articles to TechNews Daily.',
		category: 'Guide',
		readTime: '8 min read',
	},
	{
		title: 'Tech Research Methods',
		description: 'Best practices for researching and fact-checking technology articles.',
		category: 'Tutorial',
		readTime: '12 min read',
	},
];

const ResourcesSection = () => {
	const navigate = useNavigate();

	return (
		<section className='py-20 bg-muted/30'>
			<div className='container mx-auto px-4 md:px-6'>
				<div className='flex items-center justify-between mb-12'>
					<div>
						<div className='flex items-center gap-2 mb-4'>
							<BookOpen className='h-6 w-6 text-primary' />
							<h2 className='text-3xl font-bold tracking-tight'>Resources & Guides</h2>
						</div>
						<p className='text-muted-foreground'>Helpful resources to enhance your tech journalism journey</p>
					</div>
					<Button variant='link' onClick={() => navigate('/resources')} className='hidden sm:flex'>
						View All Resources <ArrowRight className='ml-2 h-4 w-4' />
					</Button>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					{resources.map((resource, index) => (
						<motion.div
							key={resource.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
							viewport={{ once: true }}>
							<Card className='h-full flex flex-col hover:shadow-lg transition-shadow'>
								<CardContent className='p-6 flex-1'>
									<div className='space-y-2'>
										<Badge variant='secondary' className='mb-2'>
											{resource.category}
										</Badge>
										<h3 className='font-semibold line-clamp-2'>{resource.title}</h3>
										<p className='text-sm text-muted-foreground line-clamp-2'>{resource.description}</p>
									</div>
								</CardContent>
								<CardFooter className='p-6 pt-0'>
									<div className='flex items-center justify-between w-full'>
										<span className='text-sm text-muted-foreground'>{resource.readTime}</span>
										<Button variant='ghost' size='sm'>
											Read More
										</Button>
									</div>
								</CardFooter>
							</Card>
						</motion.div>
					))}
				</div>

				<Button className='w-full mt-8 md:hidden' variant='outline' onClick={() => navigate('/resources')}>
					View All Resources
				</Button>
			</div>
		</section>
	);
};

export default ResourcesSection;
