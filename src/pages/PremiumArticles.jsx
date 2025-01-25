import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Select from 'react-select';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Star, Eye, Clock, ChevronLeft, ChevronRight, Loader2, Crown, TrendingUp } from 'lucide-react';
import useAxiosSecure from '@/hooks/use-AxiosSecure';
import useSubscription from '@/hooks/use-Subscription';
import { techTags } from '@/data/tags';
import usePublishers from '@/hooks/use-publishers';

const PremiumArticles = () => {
	const navigate = useNavigate();
	const axiosSecure = useAxiosSecure();
	const { hasSubscription, refetch } = useSubscription();
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState('');
	const [selectedPublisher, setSelectedPublisher] = useState(null);
	const [selectedTags, setSelectedTags] = useState([]);

	const { data: publishers = [] } = usePublishers();

	// Fetch premium articles
	const {
		data: articlesData = {},
		refetch: refetchPremium,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ['premium-articles', page, search, selectedPublisher, selectedTags],
		queryFn: async () => {
			const searchParams = new URLSearchParams({
				page: page.toString(),
				limit: '9',
				...(search && { search }),
				...(selectedPublisher && { publisher: selectedPublisher.value }),
				...(selectedTags.length && { tags: selectedTags.map((t) => t.value).join(',') }),
			});

			const { data } = await axiosSecure.get(`/articles/premium?${searchParams}`);
			return data;
		},
		enabled: hasSubscription, // fetch if user has subscription
	});

	const { data: articles = [], totalPages = 1 } = articlesData;
	useEffect(() => {
		refetch();
		refetchPremium();
	}, []);
	// If user doesn't have subscription
	if (!hasSubscription) {
		return (
			<div className='min-h-screen bg-background'>
				<div className='container px-4 md:px-6 py-24 space-y-8'>
					<div className='max-w-3xl mx-auto text-center space-y-4'>
						<Crown className='h-16 w-16 mx-auto text-primary' />
						<h1 className='text-4xl font-bold tracking-tighter sm:text-5xl'>Premium Content Awaits</h1>
						<p className='text-xl text-muted-foreground'>
							Subscribe to access our premium articles and exclusive content.
						</p>
						<Button size='lg' className='mt-6' onClick={() => navigate('/subscription')}>
							Subscribe Now
						</Button>
					</div>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className='min-h-screen grid place-items-center'>
				<div className='text-center space-y-4'>
					<p className='text-red-500'>Error: {error.message}</p>
					<Button variant='outline' onClick={() => navigate('/')}>
						Go Home
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-background'>
			{/* Hero Section */}
			<section className='relative py-20 overflow-hidden'>
				<div className='absolute inset-0 bg-gradient-to-r from-primary to-primary/80' />
				<div className='absolute inset-0 bg-grid-white/10' />
				<div className='relative container px-4 md:px-6 mx-auto'>
					<div className='flex flex-col items-center text-center space-y-4'>
						<div className='p-3 rounded-full bg-white/10 backdrop-blur-sm'>
							<Crown className='h-6 w-6 text-white' />
						</div>
						<h1 className='text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl'>Premium Articles</h1>
						<p className='max-w-[600px] text-white/90 md:text-xl'>
							Exclusive content curated for our premium subscribers
						</p>
					</div>
				</div>
			</section>

			{/* Filters Section */}
			<section className='py-12 border-b'>
				<div className='container px-4 md:px-6 mx-auto'>
					<div className='max-w-4xl mx-auto space-y-4'>
						<div className='relative'>
							<Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
							<Input
								type='search'
								placeholder='Search premium articles...'
								className='pl-10'
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<Select
								placeholder='Filter by publisher'
								options={publishers.map((pub) => ({
									value: pub._id,
									label: pub.name,
								}))}
								value={selectedPublisher}
								onChange={setSelectedPublisher}
								isClearable
								className='w-full text-black/80'
							/>

							<Select
								isMulti
								placeholder='Filter by tags'
								options={techTags}
								value={selectedTags}
								onChange={setSelectedTags}
								className='w-full text-black/80'
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Articles Grid */}
			<section className='py-12'>
				<div className='container mx-auto px-4 md:px-6'>
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
							<p className='text-muted-foreground'>No premium articles found</p>
						</div>
					) : (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							<AnimatePresence>
								{articles.map((article, index) => (
									<motion.div
										key={article._id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -20 }}
										transition={{ duration: 0.3, delay: index * 0.1 }}>
										<Card className='h-full flex flex-col border-primary'>
											<div className='relative h-48'>
												<img
													src={article.image || '/placeholder.svg'}
													alt={article.title}
													className='w-full h-full object-cover rounded-t-lg'
												/>
												<div className='absolute top-2 right-2 flex items-center gap-2'>
													<span className='bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center gap-1'>
														<Crown className='h-3 w-3' />
														Premium
													</span>
													{article.trending && (
														<span className='bg-yellow-500 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1'>
															<TrendingUp className='h-3 w-3' />
															Trending
														</span>
													)}
												</div>
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
														<span
															key={tag.value}
															className='bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs'>
															{tag.label}
														</span>
													))}
												</div>
											</CardContent>

											<CardFooter className='mt-auto pt-4'>
												<Button className='w-full' onClick={() => navigate(`/articles/${article._id}`)}>
													Read Article
												</Button>
											</CardFooter>
										</Card>
									</motion.div>
								))}
							</AnimatePresence>
						</div>
					)}

					{/* Pagination */}
					{totalPages > 1 && (
						<div className='flex justify-center items-center gap-2 mt-8'>
							<Button
								variant='outline'
								size='icon'
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={page === 1}>
								<ChevronLeft className='h-4 w-4' />
							</Button>

							<span className='text-sm text-muted-foreground'>
								Page {page} of {totalPages}
							</span>

							<Button
								variant='outline'
								size='icon'
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
								disabled={page === totalPages}>
								<ChevronRight className='h-4 w-4' />
							</Button>
						</div>
					)}
				</div>
			</section>
		</div>
	);
};

export default PremiumArticles;
