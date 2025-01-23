import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Eye, MessageSquare, Star, Clock, Send, Loader2, ThumbsUp, Share2, Bookmark, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/use-AuthContext';
import useAxiosSecure from '@/hooks/use-AxiosSecure';
import useSubscription from '@/hooks/use-Subscription';

const ArticleDetails = () => {
	const { id } = useParams();
	const { user } = useAuth();
	const { hasSubscription } = useSubscription();
	const { addToast } = useToast();
	const axiosSecure = useAxiosSecure();
	const queryClient = useQueryClient();
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState('');

	// Fetch article details
	const {
		data: article,
		isLoading: articleLoading,
		refetch: refetchArticle,
	} = useQuery({
		queryKey: ['article', id],
		queryFn: async () => {
			const { data } = await axiosSecure.get(`/articles/${id}`);
			return data.data;
		},
		onSuccess: (data) => {
			// Increment view count
		},
	});

	// Fetch comments
	const { data: comments = [], isLoading: commentsLoading } = useQuery({
		queryKey: ['comments', id],
		queryFn: async () => {
			const { data } = await axiosSecure.get(`/articles/${id}/comments`);
			return data.data;
		},
	});

	// Add comment mutation
	const { mutate: addComment, isLoading: commentSubmitting } = useMutation({
		mutationFn: async () => {
			return await axiosSecure.post(`/articles/${id}/comments`, {
				comment,
				rating,
				articleId: id,
				userEmail: user.email,
				userName: user.displayName,
				userImage: user.photoURL,
			});
		},
		onSuccess: () => {
			setComment('');
			setRating(0);
			queryClient.invalidateQueries(['comments', id]);
			queryClient.invalidateQueries(['article', id]);
			addToast('Comment added successfully', 'success');
		},
		onError: (error) => {
			addToast(error.message || 'Failed to add comment', 'error');
		},
	});

	// View increment mutation
	const [viewIncremented, setViewIncremented] = useState(false);
	const { mutate: incrementView } = useMutation({
		mutationFn: async () => {
			return await axiosSecure.post(`/articles/${id}/view`);
		},
	});

	useEffect(() => {
		refetchArticle();
		if (article && !viewIncremented) {
			incrementView();
			setViewIncremented(true);
		}
	}, [article]);

	if (articleLoading) {
		return (
			<div className='min-h-screen grid place-items-center'>
				<Loader2 className='h-8 w-8 animate-spin' />
			</div>
		);
	}

	if (!article) {
		return (
			<div className='min-h-screen grid place-items-center'>
				<div className='text-center space-y-4'>
					<AlertCircle className='h-12 w-12 mx-auto text-muted-foreground' />
					<h1 className='text-2xl font-bold'>Article not found</h1>
				</div>
			</div>
		);
	}

	// Check if premium content is accessible
	if (article.isPremium && !hasSubscription) {
		return (
			<div className='min-h-screen grid place-items-center'>
				<div className='text-center space-y-4'>
					<AlertCircle className='h-12 w-12 mx-auto text-muted-foreground' />
					<h1 className='text-2xl font-bold'>Premium Content</h1>
					<p className='text-muted-foreground'>Please subscribe to access this article</p>
					<Button onClick={() => navigate('/subscription')}>Subscribe Now</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen pb-12'>
			{/* Article Header */}
			<div
				className='relative h-[60vh] bg-cover bg-top'
				style={{
					backgroundImage: `url(${article.image})`,
				}}>
				<div className='absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20' />
				<div className='absolute inset-0 flex items-end'>
					<div className='container mx-auto px-4 md:px-6 pb-12'>
						<div className='space-y-4'>
							{article.isPremium && (
								<span className='inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm'>
									Premium
								</span>
							)}
							<h1 className='text-4xl md:text-5xl font-bold text-white'>{article.title}</h1>
							<div className='flex items-center gap-4 text-white/90'>
								<div className='flex items-center gap-2'>
									<Avatar className='h-8 w-8'>
										<AvatarImage src={article.authorImage} />
										<AvatarFallback>{article.authorName[0]}</AvatarFallback>
									</Avatar>
									<span>{article.authorName}</span>
								</div>
								<span>•</span>
								<div className='flex items-center gap-2'>
									<Clock className='h-4 w-4' />
									<span>{format(new Date(article.createdAt), 'MMM d, yyyy')}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='container mx-auto px-4 md:px-6 py-12'>
				<div className='grid md:grid-cols-[1fr_300px] gap-8'>
					{/* Main Content */}
					<div className='space-y-8'>
						{/* Article Stats */}
						<div className='flex items-center gap-6 text-muted-foreground'>
							<div className='flex items-center gap-2'>
								<Eye className='h-4 w-4' />
								<span>{article.views} views</span>
							</div>
							<div className='flex items-center gap-2'>
								<MessageSquare className='h-4 w-4' />
								<span>{comments.length} comments</span>
							</div>
							<div className='flex items-center gap-2'>
								<Star className='h-4 w-4' />
								<span>{article.averageRating.toFixed(1)} rating</span>
							</div>
						</div>

						{/* Article Content */}
						<div className='prose prose-lg dark:prose-invert max-w-none'>
							<p className='lead'>{article.description}</p>
							{article.content.split('\n').map((paragraph, index) => (
								<p key={index}>{paragraph}</p>
							))}
						</div>

						{/* Tags */}
						<div className='flex flex-wrap gap-2'>
							{article.tags.map((tag) => (
								<span key={tag.value} className='bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm'>
									{tag.label}
								</span>
							))}
						</div>

						{/* Action Buttons */}
						<div className='flex items-center gap-4'>
							<Button variant='outline' size='sm'>
								<ThumbsUp className='h-4 w-4 mr-2' />
								Like
							</Button>
							<Button variant='outline' size='sm'>
								<Share2 className='h-4 w-4 mr-2' />
								Share
							</Button>
							<Button variant='outline' size='sm'>
								<Bookmark className='h-4 w-4 mr-2' />
								Save
							</Button>
						</div>

						{/* Comments Section */}
						<div className='space-y-6'>
							<h2 className='text-2xl font-bold'>Comments</h2>

							{/* Add Comment */}
							{user ? (
								<Card>
									<CardContent className='p-4 space-y-4'>
										<div className='flex items-center gap-4'>
											<Avatar>
												<AvatarImage src={user.photoURL} />
												<AvatarFallback>{user.displayName[0]}</AvatarFallback>
											</Avatar>
											<div className='flex-1'>
												<p className='font-medium'>{user.displayName}</p>
												<div className='flex items-center gap-1'>
													{[1, 2, 3, 4, 5].map((star) => (
														<button key={star} onClick={() => setRating(star)} className='focus:outline-none'>
															<Star
																className={`h-5 w-5 ${
																	star <= rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'
																}`}
															/>
														</button>
													))}
												</div>
											</div>
										</div>
										<Textarea
											placeholder='Write a comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										/>
										<Button
											onClick={() => addComment()}
											disabled={!comment || !rating || commentSubmitting}
											className='ml-auto'>
											{commentSubmitting ? (
												<>
													<Loader2 className='h-4 w-4 mr-2 animate-spin' />
													Posting...
												</>
											) : (
												<>
													<Send className='h-4 w-4 mr-2' />
													Post Comment
												</>
											)}
										</Button>
									</CardContent>
								</Card>
							) : (
								<Card>
									<CardContent className='p-4 text-center'>
										<p>Please login to comment</p>
										<Button variant='link' onClick={() => navigate('/login')}>
											Login
										</Button>
									</CardContent>
								</Card>
							)}

							{/* Comments List */}
							<AnimatePresence>
								{commentsLoading ? (
									<div className='space-y-4'>
										{[1, 2, 3].map((i) => (
											<Card key={i} className='animate-pulse'>
												<CardContent className='p-4'>
													<div className='flex items-center gap-4'>
														<div className='h-10 w-10 rounded-full bg-muted' />
														<div className='flex-1 space-y-2'>
															<div className='h-4 bg-muted rounded w-1/4' />
															<div className='h-4 bg-muted rounded w-3/4' />
														</div>
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								) : (
									<div className='space-y-4'>
										{comments.map((comment) => (
											<motion.div
												key={comment._id}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -20 }}>
												<Card>
													<CardContent className='p-4 space-y-2'>
														<div className='flex items-center gap-4'>
															<Avatar>
																<AvatarImage src={comment.userImage} />
																<AvatarFallback>{comment.userName[0]}</AvatarFallback>
															</Avatar>
															<div>
																<p className='font-medium'>{comment.userName}</p>
																<div className='flex items-center gap-2 text-sm text-muted-foreground'>
																	<div className='flex'>
																		{[...Array(5)].map((_, i) => (
																			<Star
																				key={i}
																				className={`h-4 w-4 ${
																					i < comment.rating ? 'text-yellow-400 fill-current' : 'text-muted'
																				}`}
																			/>
																		))}
																	</div>
																	<span>•</span>
																	<span>{format(new Date(comment.createdAt), 'MMM d, yyyy')}</span>
																</div>
															</div>
														</div>
														<p className='text-muted-foreground'>{comment.comment}</p>
													</CardContent>
												</Card>
											</motion.div>
										))}
									</div>
								)}
							</AnimatePresence>
						</div>
					</div>

					{/* Sidebar */}
					<div className='space-y-6'>
						{/* Publisher Info */}
						<Card>
							<CardContent className='p-4 space-y-4'>
								<div className='flex items-center gap-4'>
									<img
										src={article.authorImage || '/placeholder.svg'}
										alt={article.publisherName}
										className='h-12 w-12 object-contain'
									/>
									<div>
										<h3 className='font-medium'>{article.publisherName}</h3>
										<p className='text-sm text-muted-foreground'>Publisher</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Related Articles */}
						{/* Add related articles component here */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ArticleDetails;
