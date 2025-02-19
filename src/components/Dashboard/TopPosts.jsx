import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, Star } from 'lucide-react';

const TopPosts = ({ posts }) => {
	const { addToast } = useToast();
	console.log(posts);

	const handlePostAction = (postId) => {
		try {
			// Post action logic
			addToast('Post updated successfully', 'success');
		} catch (error) {
			addToast('Failed to update post', 'error');
		}
	};

	if (!posts?.length) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Top Performing Posts</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-8'>
					{posts.map((post) => (
						<div key={post._id} className='flex items-start space-x-4'>
							<div className='relative h-24 w-24 flex-shrink-0'>
								<img
									src={post.image || '/placeholder.svg?height=96&width=96'}
									alt={post.title}
									className='rounded-md object-cover w-full h-full'
								/>
								<div
									className={`absolute top-0 right-0 px-2 py-1 text-xs rounded-bl-md rounded-tr-md ${
										post.status === 'approved'
											? 'bg-green-500'
											: post.status === 'pending'
											? 'bg-yellow-500'
											: 'bg-red-500'
									} text-white`}>
									{post.status}
								</div>
							</div>
							<div className='flex-1 space-y-2'>
								<h3 className='font-semibold line-clamp-2'>{post.title}</h3>
								<div className='flex items-center space-x-4 text-sm text-muted-foreground'>
									<span className='flex items-center'>
										<Eye className='mr-1 h-4 w-4' />
										{post.views}
									</span>
									{post.averageRating > 0 && (
										<span className='flex items-center'>
											<Star className='mr-1 h-4 w-4' />
											{post.averageRating.toFixed(1)}
										</span>
									)}
								</div>
								<p className='text-xs text-muted-foreground'>
									Published on {new Date(post.createdAt).toLocaleDateString()}
								</p>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default TopPosts;
