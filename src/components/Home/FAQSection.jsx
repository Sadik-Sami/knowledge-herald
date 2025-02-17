import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import faqAnimation from '@/assets/faq-animation.json'; // You'll need to add this JSON file

const faqs = [
	{
		question: 'What is Knowledge Herald?',
		answer:
			'Knowledge Herald is your premier source for technology news, insights, and analysis. We provide comprehensive coverage of the latest developments in tech, featuring both free and premium content from expert contributors.',
	},
	{
		question: 'How does the premium subscription work?',
		answer:
			'Our premium subscription gives you unlimited access to exclusive in-depth articles, analysis, and expert insights. You can choose between monthly or annual plans, with the ability to cancel at any time.',
	},
	{
		question: 'Can I contribute articles?',
		answer:
			"Yes! We welcome contributions from technology experts and enthusiasts. You'll need to create an account and submit your articles for review. Our editorial team ensures all content meets our quality standards.",
	},
	{
		question: 'How do I access premium content?',
		answer:
			"Premium content is marked with a crown icon. To access it, you'll need an active subscription. Once subscribed, you can read all premium articles across the platform.",
	},
	{
		question: 'What payment methods do you accept?',
		answer:
			'We accept all major credit cards, PayPal, and various digital payment methods. All payments are processed securely through our payment partner, Stripe.',
	},
];

const FAQSection = () => {
	return (
		<section className='py-20'>
			<div className='container mx-auto px-4 md:px-6'>
				<div className='text-center max-w-3xl mx-auto mb-12'>
					<div className='flex items-center justify-center mb-4'>
						<HelpCircle className='h-8 w-8 text-primary' />
					</div>
					<h2 className='text-3xl font-bold tracking-tight mb-4'>Frequently Asked Questions</h2>
					<p className='text-muted-foreground'>Find answers to common questions about our platform and services</p>
				</div>

				<div className='grid md:grid-cols-2 gap-8 items-center'>
					<Card>
						<CardContent className='p-8'>
							<Accordion type='single' collapsible className='w-full'>
								{faqs.map((faq, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3, delay: index * 0.1 }}
										viewport={{ once: true }}>
										<AccordionItem value={`item-${index}`}>
											<AccordionTrigger className='text-left'>{faq.question}</AccordionTrigger>
											<AccordionContent className='text-muted-foreground'>{faq.answer}</AccordionContent>
										</AccordionItem>
									</motion.div>
								))}
							</Accordion>
						</CardContent>
					</Card>
					<div className='hidden md:block'>
						<Lottie animationData={faqAnimation} loop={true} className='w-full max-w-md mx-auto' />
					</div>
				</div>
			</div>
		</section>
	);
};

export default FAQSection;
