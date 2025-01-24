import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Star, Eye, Clock, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import useSubscription from '@/hooks/use-Subscription';
import { techTags } from '@/data/tags';
import usePublishers from '@/hooks/use-publishers';
import useArticles from '@/hooks/use-articles';
import { Select as UISelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AllArticles = () => {
	const navigate = useNavigate();
	const { hasSubscription } = useSubscription();
	const searchTimeout = useRef(null);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [search, setSearch] = useState('');
	const [selectedPublisher, setSelectedPublisher] = useState(null);
	const [selectedTags, setSelectedTags] = useState([]);

	const { data: publishers = [] } = usePublishers();
	const {
		data: articlesData = {},
		isLoading,
		refetch,
	} = useArticles(page, limit, search, selectedPublisher, selectedTags, 'approved');

	const { data: articles = [], totalPages = 1 } = articlesData;

	// Handle search with debounce
	const handleSearch = (value) => {
		if (searchTimeout.current) {
			clearTimeout(searchTimeout.current);
		}

		searchTimeout.current = setTimeout(() => {
			setSearch(value);
			setPage(1); // Reset to first page when searching
		}, 300);
	};
	useEffect(() => {
		refetch();
	}, []);
	// Reset page when filters change
	useEffect(() => {
		setPage(1);
	}, [selectedPublisher, selectedTags]);

	// Cleanup timeout
	useEffect(() => {
		return () => {
			if (searchTimeout.current) {
				clearTimeout(searchTimeout.current);
			}
		};
	}, []);

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<div className='min-h-screen'>
			{/* Banner */}
			<div className='bg-primary/10 py-12'>
				<div className='max-w-7xl px-4 md:px-6 mx-auto'>
					<h1 className='text-4xl font-bold text-center mb-8'>Explore Articles</h1>

					{/* Search and Filters */}
					<div className='max-w-4xl mx-auto space-y-4'>
						<div className='relative'>
							<Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
							<Input
								type='search'
								placeholder='Search articles...'
								className='pl-10'
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
							<Select
								placeholder='Filter by publisher'
								options={publishers.map((pub) => ({
									value: pub._id,
									label: pub.name,
								}))}
								value={selectedPublisher}
								onChange={(value) => {
									setSelectedPublisher(value);
									refetch();
								}}
								isClearable
								className='w-full text-black/70'
							/>

							<Select
								isMulti
								placeholder='Filter by tags'
								options={techTags}
								value={selectedTags}
								onChange={(value) => {
									setSelectedTags(value);
									refetch();
								}}
								className='w-full text-black/75'
							/>
							<UISelect value={limit.toString()} onValueChange={(v) => setLimit(Number(v))}>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Select Items per page' />
								</SelectTrigger>
								<SelectContent>
									{[5, 10, 15, 20].map((value) => (
										<SelectItem key={value} value={value.toString()}>
											{value} Items
										</SelectItem>
									))}
								</SelectContent>
							</UISelect>
						</div>
					</div>
				</div>
			</div>

			{/* Articles Grid */}
			<div className='max-w-7xl mx-auto px-4 md:px-6 py-12'>
				{isLoading ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{[...Array(9)].map((_, i) => (
							<Card key={i} className='animate-pulse'>
								<div className='h-48 bg-muted rounded-t-lg' />
								<CardContent className='p-4'>
									<div className='h-4 bg-muted rounded w-3/4 mb-4' />
									<div className='h-4 bg-muted rounded w-1/2' />
								</CardContent>
							</Card>
						))}
					</div>
				) : articles.length === 0 ? (
					<div className='text-center py-12'>
						<p className='text-muted-foreground'>No articles found</p>
					</div>
				) : (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{articles.map((article, index) => (
							<motion.div
								key={article._id}
								variants={cardVariants}
								initial='hidden'
								animate='visible'
								transition={{ delay: index * 0.1 }}>
								<Card className={`h-full flex flex-col ${article.isPremium ? 'border-primary' : ''}`}>
									<div className='relative h-48'>
										<img
											src={article.image || '/placeholder.svg'}
											alt={article.title}
											className='w-full h-full object-cover rounded-t-lg'
										/>
										{article.isPremium && (
											<div className='absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-sm'>
												Premium
											</div>
										)}
									</div>

									<CardHeader>
										<CardTitle className='line-clamp-2'>{article.title}</CardTitle>
										<div className='flex items-center gap-4 text-sm text-muted-foreground'>
											<span className='flex items-center gap-1'>
												<Eye className='h-4 w-4' />
												{article.views}
											</span>
											<span className='flex items-center gap-1'>
												<Star className='h-4 w-4' />
												{article.averageRating.toFixed(1)}
											</span>
											<span className='flex items-center gap-1'>
												<Clock className='h-4 w-4' />
												{new Date(article.createdAt).toLocaleDateString()}
											</span>
										</div>
									</CardHeader>

									<CardContent>
										<p className='text-muted-foreground line-clamp-3'>{article.description}</p>
										<div className='flex flex-wrap gap-2 mt-4'>
											{article.tags.slice(0, 3).map((tag) => (
												<span key={tag.value} className='bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs'>
													{tag.label}
												</span>
											))}
										</div>
									</CardContent>

									<CardFooter className='mt-auto pt-4'>
										<Button
											className='w-full'
											variant={article.isPremium ? 'default' : 'outline'}
											disabled={article.isPremium && !hasSubscription}
											onClick={() => navigate(`/articles/${article._id}`)}>
											{article.isPremium && !hasSubscription ? 'Subscribe to Read' : 'Read More'}
										</Button>
									</CardFooter>
								</Card>
							</motion.div>
						))}
					</div>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<div className='flex justify-center items-center gap-2 mt-8'>
						<Button
							variant='outline'
							size='icon'
							onClick={() => {
								setPage((p) => Math.max(1, p - 1));
								refetch();
							}}
							disabled={page === 1}>
							<ChevronLeft className='h-4 w-4' />
						</Button>

						<span className='text-sm text-muted-foreground'>
							Page {page} of {totalPages}
						</span>

						<Button
							variant='outline'
							size='icon'
							onClick={() => {
								setPage((p) => Math.min(totalPages, p + 1));
								refetch();
							}}
							disabled={page === totalPages}>
							<ChevronRight className='h-4 w-4' />
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default AllArticles;
