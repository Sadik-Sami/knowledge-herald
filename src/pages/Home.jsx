import CategorySection from '@/components/Home/CategorySection';
import Hero from '@/components/Home/Hero';
import PlansSection from '@/components/Home/PlansSection';
import StatsSection from '@/components/Home/StatsSection';
import SubscriptionAd from '@/components/Home/SubscriptionAd';
import TestimonialsSection from '@/components/Home/TestimonialsSection';
import TrendingArticles from '@/components/Home/TrendingArticles';
import React from 'react';

const Home = () => {
	return (
		<div>
			<Hero />
			<CategorySection />
			<PlansSection />
			<TrendingArticles />
			<StatsSection />
			<TestimonialsSection />
			<SubscriptionAd />
		</div>
	);
};

export default Home;
