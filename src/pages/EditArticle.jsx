import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import Select from 'react-select';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { PenLine, ImagePlus, Tags, Building2, Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/use-AuthContext';
import useAxiosSecure from '@/hooks/use-AxiosSecure';
import useImageUpload from '@/hooks/use-image-upload';
import usePublishers from '@/hooks/use-publishers';
import { techTags } from '@/data/tags';

const EditArticle = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const { user } = useAuth();
	const { addToast } = useToast();
	const axiosSecure = useAxiosSecure();
	const { uploadImage, uploading } = useImageUpload();
	const { data: publishers = [], isLoading: publishersLoading } = usePublishers();

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm();

	// Fetch article data
	const { data: article, isLoading: articleLoading } = useQuery({
		queryKey: ['article', id],
		queryFn: async () => {
			const { data } = await axiosSecure.get(`/articles/${id}`);
			return data.data;
		},
		onSuccess: (data) => {
			// Pre-populate form with article data
			console.log('Prepopulating form with:', {
				...data,
				publisher: {
					value: data.publisher,
					label: data.publisherName,
				},
				tags: data.tags,
			});
			reset({
				title: data.title,
				description: data.description,
				content: data.content,
				publisher: {
					value: data.publisher,
					label: data.publisherName,
				},
				tags: data.tags,
			});
		},
	});

	const onSubmit = async (data) => {
		try {
			setLoading(true);

			// Upload new image if provided
			let imageUrl = article.image;
			if (data.image?.[0]) {
				imageUrl = await uploadImage(data.image[0]);
			}

			const articleData = {
				title: data.title,
				image: imageUrl,
				publisher: data.publisher.value,
				publisherName: data.publisher.label,
				tags: data.tags.map((tag) => ({ value: tag.value, label: tag.label })),
				description: data.description,
				content: data.content,
				updatedAt: new Date(),
			};

			const { data: response } = await axiosSecure.patch(`/articles/${id}`, articleData);

			if (response.success) {
				addToast('Article updated successfully!', 'success');
				navigate(`/articles/${id}`);
			}
		} catch (error) {
			addToast(error.message || 'Failed to update article', 'error');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (article) {
			reset({
				title: article.title,
				description: article.description,
				content: article.content,
				publisher: {
					value: article.publisher,
					label: article.publisherName,
				},
				tags: article.tags,
			});
		}
	}, [article, reset]);
	if (articleLoading) {
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
				className='relative h-[40vh] bg-cover bg-center'
				style={{
					backgroundImage: "url('/src/assets/edit-article-bg.jpg')",
				}}>
				<div className='absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/70 to-primary/80 backdrop-blur-sm' />
				<div className='absolute inset-0 bg-grid-white/10' />
				<div className='relative container h-full flex items-center justify-center text-white'>
					<div className='text-center'>
						<h1 className='text-4xl font-bold mb-4'>Edit Your Article</h1>
						<p className='text-lg text-white/90'>Update and improve your content</p>
					</div>
				</div>
			</div>

			{/* Form Card */}
			<div className='container px-4 md:px-6'>
				<motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
					<Card className='max-w-4xl mx-auto -mt-20 relative z-10 shadow-xl p-6'>
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
									<Input id='image' type='file' accept='image/*' className='pl-10' {...register('image')} />
								</div>
								{article?.image && (
									<div className='mt-2'>
										<img
											src={article.image || '/placeholder.svg'}
											alt='Current article image'
											className='h-32 w-auto object-cover rounded-lg'
										/>
									</div>
								)}
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
												className='pl-10'
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
												className='pl-10'
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
										Updating...
									</>
								) : (
									<>
										<Upload className='mr-2 h-4 w-4' />
										Update Article
									</>
								)}
							</Button>
						</form>
					</Card>
				</motion.div>
			</div>
		</div>
	);
};

export default EditArticle;
