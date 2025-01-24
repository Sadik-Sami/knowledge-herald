import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Code2, Cpu, Globe, Shield, Smartphone, Cloud, Brain, Database } from 'lucide-react';

const categories = [
	{
		icon: Code2,
		name: 'Web Development',
		description: 'Latest in web technologies and frameworks',
		color: 'text-blue-500',
		bgColor: 'bg-blue-500/10',
	},
	{
		icon: Cpu,
		name: 'AI & Machine Learning',
		description: 'Breakthroughs in artificial intelligence',
		color: 'text-purple-500',
		bgColor: 'bg-purple-500/10',
	},
	{
		icon: Shield,
		name: 'Cybersecurity',
		description: 'Security trends and best practices',
		color: 'text-red-500',
		bgColor: 'bg-red-500/10',
	},
	{
		icon: Cloud,
		name: 'Cloud Computing',
		description: 'Cloud platforms and services',
		color: 'text-sky-500',
		bgColor: 'bg-sky-500/10',
	},
	{
		icon: Smartphone,
		name: 'Mobile Development',
		description: 'Mobile app development insights',
		color: 'text-green-500',
		bgColor: 'bg-green-500/10',
	},
	{
		icon: Database,
		name: 'Big Data',
		description: 'Data analytics and insights',
		color: 'text-yellow-500',
		bgColor: 'bg-yellow-500/10',
	},
	{
		icon: Globe,
		name: 'DevOps',
		description: 'Development operations and tools',
		color: 'text-indigo-500',
		bgColor: 'bg-indigo-500/10',
	},
	{
		icon: Brain,
		name: 'Blockchain',
		description: 'Cryptocurrency and blockchain tech',
		color: 'text-pink-500',
		bgColor: 'bg-pink-500/10',
	},
];

const CategorySection = () => {
	const navigate = useNavigate();

	return (
		<section className='py-20'>
			<div className='container mx-auto px-4 md:px-6'>
				<div className='text-center max-w-3xl mx-auto mb-12'>
					<h2 className='text-3xl font-bold tracking-tight mb-4'>Explore Categories</h2>
					<p className='text-muted-foreground'>Discover articles across various technology domains</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					{categories.map((category, index) => (
						<motion.div
							key={category.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
							viewport={{ once: true }}>
							<Card className='cursor-pointer group hover:shadow-lg transition-all'>
								<CardContent className='p-6'>
									<div
										className={`w-12 h-12 rounded-lg ${category.bgColor} ${category.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
										<category.icon className='h-6 w-6' />
									</div>
									<h3 className='font-semibold mb-2'>{category.name}</h3>
									<p className='text-sm text-muted-foreground'>{category.description}</p>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default CategorySection;
