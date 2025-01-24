import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Star, ArrowRight } from 'lucide-react';
import useAxiosSecure from '@/hooks/use-AxiosSecure';
import 'swiper/css';
import 'swiper/css/effect-fade';

const TrendingArticles = () => {
	const navigate = useNavigate();
	const axiosSecure = useAxiosSecure();

	const { data: articles = [], isLoading } = useQuery({
		queryKey: ['trending-articles'],
		queryFn: async () => {
			const { data } = await axiosSecure.get('/articles/trending');
			return data.data;
		},
	});

	if (isLoading) {
		return <div className='h-[400px] bg-muted/20 animate-pulse rounded-lg'></div>;
	}

	return (
		<section className='py-20'>
			<div className='container mx-auto px-4 md:px-6'>
				<div className='flex items-center justify-between mb-8'>
					<div>
						<h2 className='text-3xl font-bold tracking-tight'>Trending Articles</h2>
						<p className='text-muted-foreground mt-2'>Stay updated with the most popular tech stories</p>
					</div>
					<Button variant='link' onClick={() => navigate('/articles')} className='hidden sm:flex'>
						View All Articles <ArrowRight className='ml-2 h-4 w-4' />
					</Button>
				</div>
					<Swiper
						spaceBetween={20}
						centeredSlides={true}
						loop={true}
						observer={true}
						observeParents={true}
						pagination={{
							clickable: true,
						}}
						autoplay={{
							delay: 3000,
							disableOnInteraction: false,
						}}
						breakpoints={{
							640: {
								slidesPerView: 1,
								spaceBetween: 10,
							},
							768: {
								slidesPerView: 2,
								spaceBetween: 20,
							},
							1024: {
								slidesPerView: 4,
								spaceBetween: 30,
							},
						}}
						modules={[Autoplay]}
						className='p-5 rounded-lg shadow-md'>
						{articles.map((article) => (
							<SwiperSlide key={article._id}>
								<Card
									className='relative h-96 overflow-hidden group cursor-pointer'
									onClick={() => navigate(`/articles/${article._id}`)}>
									<div className='absolute inset-0'>
										<img
											src={article.image || '/placeholder.svg'}
											alt={article.title}
											className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
										/>
										<div className='absolute inset-0 bg-gradient-to-t dark:from-background from-slate-800 dark:via-background/60 via-slate-800/60 to-transparent dark:to-transparent' />
									</div>
									<CardContent className='relative h-full flex flex-col justify-end p-6'>
										<div className='space-y-4'>
											<div className='space-y-2'>
												{article.isPremium && (
													<Badge variant='secondary' className='bg-primary text-primary-foreground'>
														Premium
													</Badge>
												)}
												<h3 className='text-2xl sm:text-3xl font-bold text-white'>{article.title}</h3>
												<p className='text-white/90 line-clamp-2'>{article.description}</p>
											</div>
											<div className='flex items-center gap-4 text-white/80'>
												<span className='flex items-center gap-1'>
													<Eye className='h-4 w-4' />
													{article.views}
												</span>
												<span className='flex items-center gap-1'>
													<Star className='h-4 w-4' />
													{article.averageRating.toFixed(1)}
												</span>
											</div>
										</div>
									</CardContent>
								</Card>
							</SwiperSlide>
						))}
					</Swiper>
				
			</div>
		</section>
	);
};

export default TrendingArticles;
