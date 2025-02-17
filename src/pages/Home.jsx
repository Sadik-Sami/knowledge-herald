import Hero from '@/components/Home/Hero';
import CategorySection from '@/components/Home/CategorySection';
import TrendingArticles from '@/components/Home/TrendingArticles';
import StatsSection from '@/components/Home/StatsSection';
import TestimonialsSection from '@/components/Home/TestimonialsSection';
import FeaturedPublishers from '@/components/Home/FeaturedPublisher';
import PlansSection from '@/components/Home/PlansSection';
import AwardsSection from '@/components/Home/AwardsSection';
import PartnersSection from '@/components/Home/PartnersSection';
import FAQSection from '@/components/Home/FAQSection';
import SubscriptionAd from '@/components/Home/SubscriptionAd';

const Home = () => {
	return (
		<div className='flex flex-col'>
			{/* Initial Impact & Value Proposition */}
			<Hero />
			<div className='bg-background'>
				<CategorySection />
			</div>

			{/* Content Value */}
			<div className='bg-muted/30'>
				<TrendingArticles />
			</div>

			{/* Social Proof & Credibility */}
			<div className='bg-background'>
				<StatsSection />
			</div>
			<div className='bg-muted/30'>
				<TestimonialsSection />
			</div>
			<div className='bg-background'>
				<FeaturedPublishers />
			</div>

			{/* Conversion Focus */}
			<div className='bg-muted/30'>
				<PlansSection />
			</div>

			{/* Additional Social Proof */}
			<div className='bg-background'>
				<AwardsSection />
			</div>
			<div className='bg-muted/30'>
				<PartnersSection />
			</div>

			{/* Trust Building & Final CTA */}
			<div className='bg-background'>
				<FAQSection />
			</div>
			<div className='bg-primary/5'>
				<SubscriptionAd />
			</div>
		</div>
	);
};

export default Home;
