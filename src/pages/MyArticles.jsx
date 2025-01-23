import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Pencil, Trash2, AlertCircle, ChevronLeft, ChevronRight, Loader2, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/use-AuthContext';
import useAxiosSecure from '@/hooks/use-AxiosSecure';
import useConfirmation from '@/hooks/use-confirmation';

const MyArticles = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { addToast } = useToast();
	const axiosSecure = useAxiosSecure();
	const queryClient = useQueryClient();
	const { showConfirmation } = useConfirmation();
	const [page, setPage] = useState(1);
	const [selectedReason, setSelectedReason] = useState(null);
	const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);

	// Fetch user's articles
	const { data: articlesData = {}, isLoading } = useQuery({
		queryKey: ['my-articles', user?.email, page],
		queryFn: async () => {
			const { data } = await axiosSecure.get(`/articles/my-articles/${user.email}?page=${page}&limit=10`);
			console.log(data.data);
			return data.data;
		},
		enabled: !!user?.email,
	});

	const { articles = [], total = 0, totalPages = 1 } = articlesData;

	// Delete article mutation
	const { mutate: deleteArticle, isLoading: isDeleting } = useMutation({
		mutationFn: async (id) => {
			return await axiosSecure.delete(`/articles/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['my-articles']);
			addToast('Article deleted successfully', 'success');
		},
		onError: (error) => {
			addToast(error.message || 'Failed to delete article', 'error');
		},
	});

	const handleDelete = async (id) => {
		const confirmed = await showConfirmation({
			title: 'Delete Article',
			message: 'Are you sure you want to delete this article? This action cannot be undone.',
			confirmText: 'Delete',
			cancelText: 'Cancel',
			variant: 'destructive',
		});

		if (confirmed) {
			deleteArticle(id);
		}
	};

	const getStatusBadge = (status) => {
		const variants = {
			pending: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
			approved: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
			declined: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
		};

		return (
			<Badge variant='outline' className={variants[status]}>
				{status.charAt(0).toUpperCase() + status.slice(1)}
			</Badge>
		);
	};

	if (isLoading) {
		return (
			<div className='min-h-screen grid place-items-center'>
				<Loader2 className='h-8 w-8 animate-spin' />
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 md:px-6 py-12'>
			<div className='space-y-8'>
				<div>
					<h1 className='text-3xl font-bold'>My Articles</h1>
					<p className='text-muted-foreground'>Manage your articles and track their status</p>
				</div>

				{articles.length === 0 ? (
					<div className='text-center py-12 space-y-4'>
						<AlertCircle className='h-12 w-12 mx-auto text-muted-foreground' />
						<h2 className='text-xl font-semibold'>No articles found</h2>
						<p className='text-muted-foreground'>You haven't published any articles yet.</p>
						<Button onClick={() => navigate('/add-article')}>Write Your First Article</Button>
					</div>
				) : (
					<>
						<div className='rounded-lg border'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className='w-12'>No.</TableHead>
										<TableHead>Title</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Premium</TableHead>
										<TableHead className='text-right'>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{articles.map((article, index) => (
										<TableRow key={article._id}>
											<TableCell>{(page - 1) * 10 + index + 1}</TableCell>
											<TableCell className='font-medium'>{article.title}</TableCell>
											<TableCell>
												<div className='flex items-center gap-2'>
													{getStatusBadge(article.status)}
													{article.status === 'declined' && (
														<Button
															variant='ghost'
															size='icon'
															onClick={() => {
																setSelectedReason(article.declined_reason);
																setIsReasonModalOpen(true);
															}}>
															<Info className='h-4 w-4' />
														</Button>
													)}
												</div>
											</TableCell>
											<TableCell>
												<Badge variant={article.isPremium ? 'default' : 'secondary'}>
													{article.isPremium ? 'Yes' : 'No'}
												</Badge>
											</TableCell>
											<TableCell className='text-right'>
												<div className='flex items-center justify-end gap-2'>
													<Button variant='ghost' size='icon' onClick={() => navigate(`/articles/${article._id}`)}>
														<Eye className='h-4 w-4' />
													</Button>
													<Button variant='ghost' size='icon' onClick={() => navigate(`/edit-article/${article._id}`)}>
														<Pencil className='h-4 w-4' />
													</Button>
													<Button
														variant='ghost'
														size='icon'
														onClick={() => handleDelete(article._id)}
														disabled={isDeleting}>
														<Trash2 className='h-4 w-4 text-destructive' />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className='flex items-center justify-between'>
								<p className='text-sm text-muted-foreground'>
									Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} articles
								</p>
								<div className='flex items-center gap-2'>
									<Button
										variant='outline'
										size='icon'
										onClick={() => setPage((p) => Math.max(1, p - 1))}
										disabled={page === 1}>
										<ChevronLeft className='h-4 w-4' />
									</Button>
									<Button
										variant='outline'
										size='icon'
										onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
										disabled={page === totalPages}>
										<ChevronRight className='h-4 w-4' />
									</Button>
								</div>
							</div>
						)}
					</>
				)}
			</div>

			{/* Decline Reason Modal */}
			<Dialog open={isReasonModalOpen} onOpenChange={setIsReasonModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Decline Reason</DialogTitle>
						<DialogDescription>{selectedReason}</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default MyArticles;
