import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare, Loader2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import useAxiosSecure from '@/hooks/use-AxiosSecure';

const ContactUs = () => {
	const [loading, setLoading] = useState(false);
	const { addToast } = useToast();
	const axiosSecure = useAxiosSecure();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	const onSubmit = async (data) => {
		try {
			setLoading(true);
			const response = await axiosSecure.post('/contact', data);

			if (response.data.success) {
				addToast('Message sent successfully!', 'success');
				reset(); // Reset form
			}
		} catch (error) {
			addToast(error.response?.data?.message || 'Failed to send message', 'error');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-background'>
			{/* Hero Section */}
			<section className='relative py-20 overflow-hidden'>
				<div className='absolute inset-0 bg-gradient-to-r from-primary to-primary/80' />
				<div className='absolute inset-0 bg-grid-white/10' />
				<div className='relative container mx-auto px-4 md:px-6'>
					<div className='flex flex-col items-center text-center space-y-4'>
						<div className='p-3 rounded-full bg-white/10 backdrop-blur-sm'>
							<MessageSquare className='h-6 w-6 text-white' />
						</div>
						<h1 className='text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl'>Get in Touch</h1>
						<p className='max-w-[600px] text-white/90 md:text-xl'>
							We're here to help and answer any question you might have
						</p>
					</div>
				</div>
			</section>

			<section className='py-20'>
				<div className='container mx-auto px-4 md:px-6'>
					<div className='grid gap-12 lg:grid-cols-2'>
						{/* Contact Form */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5 }}
							viewport={{ once: true }}>
							<Card>
								<CardHeader>
									<CardTitle>Send us a Message</CardTitle>
								</CardHeader>
								<CardContent>
									<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
										<div className='space-y-2'>
											<Label htmlFor='name'>Name</Label>
											<Input
												id='name'
												{...register('name', { required: 'Name is required' })}
												aria-invalid={errors.name ? 'true' : 'false'}
											/>
											{errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
										</div>

										<div className='space-y-2'>
											<Label htmlFor='email'>Email</Label>
											<Input
												id='email'
												type='email'
												{...register('email', {
													required: 'Email is required',
													pattern: {
														value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
														message: 'Invalid email address',
													},
												})}
												aria-invalid={errors.email ? 'true' : 'false'}
											/>
											{errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
										</div>

										<div className='space-y-2'>
											<Label htmlFor='subject'>Subject</Label>
											<Input
												id='subject'
												{...register('subject', { required: 'Subject is required' })}
												aria-invalid={errors.subject ? 'true' : 'false'}
											/>
											{errors.subject && <p className='text-sm text-red-500'>{errors.subject.message}</p>}
										</div>

										<div className='space-y-2'>
											<Label htmlFor='message'>Message</Label>
											<Textarea
												id='message'
												className='min-h-[150px]'
												{...register('message', { required: 'Message is required' })}
												aria-invalid={errors.message ? 'true' : 'false'}
											/>
											{errors.message && <p className='text-sm text-red-500'>{errors.message.message}</p>}
										</div>

										<Button type='submit' className='w-full' disabled={loading}>
											{loading ? (
												<>
													<Loader2 className='mr-2 h-4 w-4 animate-spin' />
													Sending...
												</>
											) : (
												'Send Message'
											)}
										</Button>
									</form>
								</CardContent>
							</Card>
						</motion.div>
						{/* Contact Information */}
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5 }}
							viewport={{ once: true }}
							className='space-y-8'>
							<div>
								<h3 className='text-2xl font-bold tracking-tight mb-4'>Contact Information</h3>
								<div className='space-y-4'>
									<div className='flex items-center gap-4'>
										<div className='h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center'>
											<Mail className='h-5 w-5 text-primary' />
										</div>
										<div>
											<p className='font-medium'>Email</p>
											<a href='mailto:contact@technews.com' className='text-muted-foreground hover:text-primary'>
												contact@technews.com
											</a>
										</div>
									</div>

									<div className='flex items-center gap-4'>
										<div className='h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center'>
											<Phone className='h-5 w-5 text-primary' />
										</div>
										<div>
											<p className='font-medium'>Phone</p>
											<a href='tel:+15551234567' className='text-muted-foreground hover:text-primary'>
												+1 (555) 123-4567
											</a>
										</div>
									</div>

									<div className='flex items-center gap-4'>
										<div className='h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center'>
											<MapPin className='h-5 w-5 text-primary' />
										</div>
										<div>
											<p className='font-medium'>Address</p>
											<address className='text-muted-foreground not-italic'>
												123 Tech Street, Silicon Valley
												<br />
												CA 94025, United States
											</address>
										</div>
									</div>
								</div>
							</div>

							<div>
								<h3 className='text-2xl font-bold tracking-tight mb-4'>Follow Us</h3>
								<div className='flex gap-4'>
									<Button variant='outline' size='icon' asChild>
										<a href='https://facebook.com/technews' target='_blank' rel='noopener noreferrer'>
											<Facebook className='h-5 w-5' />
											<span className='sr-only'>Facebook</span>
										</a>
									</Button>
									<Button variant='outline' size='icon' asChild>
										<a href='https://twitter.com/technews' target='_blank' rel='noopener noreferrer'>
											<Twitter className='h-5 w-5' />
											<span className='sr-only'>Twitter</span>
										</a>
									</Button>
									<Button variant='outline' size='icon' asChild>
										<a href='https://instagram.com/technews' target='_blank' rel='noopener noreferrer'>
											<Instagram className='h-5 w-5' />
											<span className='sr-only'>Instagram</span>
										</a>
									</Button>
									<Button variant='outline' size='icon' asChild>
										<a href='https://linkedin.com/company/technews' target='_blank' rel='noopener noreferrer'>
											<Linkedin className='h-5 w-5' />
											<span className='sr-only'>LinkedIn</span>
										</a>
									</Button>
								</div>
							</div>

							<div>
								<h3 className='text-2xl font-bold tracking-tight mb-4'>Office Hours</h3>
								<div className='space-y-2'>
									<div className='flex justify-between'>
										<span className='text-muted-foreground'>Monday - Friday</span>
										<span>9:00 AM - 6:00 PM</span>
									</div>
									<div className='flex justify-between'>
										<span className='text-muted-foreground'>Saturday</span>
										<span>10:00 AM - 4:00 PM</span>
									</div>
									<div className='flex justify-between'>
										<span className='text-muted-foreground'>Sunday</span>
										<span>Closed</span>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default ContactUs;
