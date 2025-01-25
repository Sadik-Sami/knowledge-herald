import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import Select from 'react-select';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { PenLine, ImagePlus, Tags, Building2, Loader2, Upload, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/use-AuthContext';
import useAxiosSecure from '@/hooks/use-AxiosSecure';
import useImageUpload from '@/hooks/use-image-upload';
import useSubscription from '@/hooks/use-Subscription';
import articleImage from '../assets/images/article.jpg';
import { techTags } from '@/data/tags';
import { useNavigate } from 'react-router-dom';
import useUserArticles from '@/hooks/use-UserArticles';

const AddArticle = () => {
	const [loading, setLoading] = useState(false);
	const { addToast } = useToast();
	const axiosSecure = useAxiosSecure();
	const { uploadImage, uploading } = useImageUpload();
	const navigate = useNavigate();
	const { user } = useAuth();
	const { hasSubscription } = useSubscription();

	// Check if user has already published an article
	const userArticles = useUserArticles(user?.email);
	const { data: articles = [], isLoading: checkingArticles, refetch } = userArticles;

	const canPublish = hasSubscription || articles.length === 0;

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm();

	// Fetch publishers
	const { data: publishers = [], isLoading: publishersLoading } = useQuery({
		queryKey: ['publishers'],
		queryFn: async () => {
			const { data } = await axiosSecure.get('/publishers');
			return data.data;
		},
	});

	const onSubmit = async (data) => {
		if (!canPublish) {
			addToast('Please subscribe to publish more articles', 'error');
			navigate('/subscription');
			return;
		}

		try {
			setLoading(true);
			// Upload image
			const imageUrl = await uploadImage(data.image[0]);
			const articleData = {
				title: data.title,
				image: imageUrl,
				publisher: data.publisher.value,
				publisherName: data.publisher.label,
				tags: data.tags.map((tag) => ({ value: tag.value, label: tag.label })),
				description: data.description,
				content: data.content,
				authorEmail: user.email,
				authorName: user.displayName,
				authorImage: user.photoURL,
				status: 'pending',
				isPremium: false,
				views: 0,
				ratings: [],
				averageRating: 0,
				createdAt: new Date(),
			};
			const { data: response } = await axiosSecure.post('/articles', articleData);
			if (response.success) {
				addToast('Article submitted successfully!', 'success');
				reset();
				navigate('/my-articles');
			} else {
				addToast(response.message || 'Failed to submit article', 'error');
			}
		} catch (error) {
			addToast(error.response?.data?.message || 'Failed to submit article', 'error');
			if (error.response?.status === 403) {
				navigate('/subscription');
			}
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		refetch();
	}, []);
	if (checkingArticles) {
		return (
			<div className='min-h-screen grid place-items-center'>
				<Loader2 className='h-8 w-8 animate-spin' />
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-background'>
			{/* Banner with overlapping form */}
			<div
				className='relative h-[60vh] bg-cover bg-no-repeat bg-top'
				style={{
					backgroundImage: `url(${articleImage})`,
				}}>
				<div className='absolute inset-0 bg-gradient-to-r from-primary/60 via-primary/40 to-primary/60' />
				<div className='absolute inset-0 bg-grid-white/10' />
				<div className='relative container h-full flex items-center justify-center text-primary-foreground mx-auto'>
					<div className='text-center'>
						<h1 className='text-4xl font-bold mb-4'>Share Your Knowledge</h1>
						<p className='text-lg text-primary-foreground/90'>Write an article and reach millions of readers</p>
						{!canPublish && (
							<div className='mt-4 flex items-center justify-center gap-2 text-yellow-300'>
								<Crown className='h-5 w-5' />
								<span>Subscribe to publish more articles</span>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Form Card */}
			<div className='container px-4 md:px-6 mx-auto'>
				<motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
					<Card className='max-w-4xl mx-auto -mt-20 relative z-10 shadow-xl p-6'>
						{!canPublish ? (
							<div className='text-center py-8'>
								<Crown className='h-12 w-12 mx-auto text-primary mb-4' />
								<h2 className='text-2xl font-bold mb-2'>Subscribe to Publish More</h2>
								<p className='text-muted-foreground mb-6'>
									You've reached the limit for free articles. Subscribe to continue sharing your knowledge.
								</p>
								<Button onClick={() => navigate('/subscription')}>View Subscription Plans</Button>
							</div>
						) : (
							<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
								<div className='space-y-2'>
									<Label htmlFor='title'>Article Title</Label>
									<div className='relative'>
										<PenLine className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
										<Input
											id='title'
											className='pl-10'
											placeholder='Enter article title'
											{...register('title', { required: 'Title is required' })}
										/>
									</div>
									{errors.title && <p className='text-sm text-red-500'>{errors.title.message}</p>}
								</div>

								<div className='space-y-2'>
									<Label htmlFor='image'>Article Image</Label>
									<div className='relative'>
										<ImagePlus className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
										<Input
											id='image'
											type='file'
											accept='image/*'
											className='pl-10'
											{...register('image', { required: 'Image is required' })}
										/>
									</div>
									{errors.image && <p className='text-sm text-red-500'>{errors.image.message}</p>}
								</div>

								<div className='space-y-2'>
									<Label htmlFor='publisher'>Publisher</Label>
									<div className='relative'>
										<Building2 className='absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10' />
										<Controller
											name='publisher'
											control={control}
											rules={{ required: 'Publisher is required' }}
											render={({ field }) => (
												<Select
													{...field}
													options={publishers.map((pub) => ({
														value: pub._id,
														label: pub.name,
													}))}
													isLoading={publishersLoading}
													className='pl-10 text-black/80'
													classNamePrefix='select'
													placeholder='Select publisher'
												/>
											)}
										/>
									</div>
									{errors.publisher && <p className='text-sm text-red-500'>{errors.publisher.message}</p>}
								</div>

								<div className='space-y-2'>
									<Label htmlFor='tags'>Tags</Label>
									<div className='relative'>
										<Tags className='absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10' />
										<Controller
											name='tags'
											control={control}
											rules={{ required: 'At least one tag is required' }}
											render={({ field }) => (
												<Select
													{...field}
													isMulti
													options={techTags}
													className='pl-10 text-black/90'
													classNamePrefix='select'
													placeholder='Select tags'
												/>
											)}
										/>
									</div>
									{errors.tags && <p className='text-sm text-red-500'>{errors.tags.message}</p>}
								</div>

								<div className='space-y-2'>
									<Label htmlFor='description'>Short Description</Label>
									<Textarea
										id='description'
										placeholder='Enter a short description'
										className='h-20'
										{...register('description', { required: 'Description is required' })}
									/>
									{errors.description && <p className='text-sm text-red-500'>{errors.description.message}</p>}
								</div>

								<div className='space-y-2'>
									<Label htmlFor='content'>Article Content</Label>
									<Textarea
										id='content'
										placeholder='Write your article content'
										className='h-40'
										{...register('content', { required: 'Content is required' })}
									/>
									{errors.content && <p className='text-sm text-red-500'>{errors.content.message}</p>}
								</div>

								<Button type='submit' className='w-full' disabled={loading || uploading}>
									{loading || uploading ? (
										<>
											<Loader2 className='mr-2 h-4 w-4 animate-spin' />
											Submitting...
										</>
									) : (
										<>
											<Upload className='mr-2 h-4 w-4' />
											Submit Article
										</>
									)}
								</Button>
							</form>
						)}
					</Card>
				</motion.div>
			</div>
		</div>
	);
};

export default AddArticle;
