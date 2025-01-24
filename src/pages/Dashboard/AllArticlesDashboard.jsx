import { useEffect, useRef, useState } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { techTags } from '@/data/tags';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select as UISelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Select from 'react-select';
import useConfirmation from '@/hooks/use-confirmation';
import { useToast } from '@/hooks/use-toast';
import useArticles from '@/hooks/use-articles';
import usePublishers from '@/hooks/use-publishers';
import useAxiosSecure from '@/hooks/use-AxiosSecure';
import { ChevronLeft, ChevronRight, MoreHorizontal, Search, Star, Trash2 } from 'lucide-react';
import Lottie from 'lottie-react';
import noDataAnimation from '@/assets/no-data.json';
import Pagination from '@/components/Pagination';

const AllArticlesDashboard = () => {
	const { confirm, ConfirmationDialog } = useConfirmation();
	const { addToast } = useToast();
	const [page, setPage] = useState(1);
	const axiosSecure = useAxiosSecure();
	const searchTimeout = useRef(null);
	const [limit, setLimit] = useState(5);
	const [search, setSearch] = useState('');
	const [selectedPublisher, setSelectedPublisher] = useState(null);
	const [selectedTags, setSelectedTags] = useState([]);
	const [declineDialog, setDeclineDialog] = useState({ open: false, id: null });
	const [declineReason, setDeclineReason] = useState('');

	const { data: publishers = [] } = usePublishers();
	const {
		data: articlesData = {},
		isLoading,
		refetch,
	} = useArticles(page, limit, search, selectedPublisher, selectedTags, ['approved', 'pending', 'declined']);

	const { data: articles = [], totalPages = 1, total } = articlesData;

	// Handle search with debounce
	const handleSearch = (value) => {
		if (searchTimeout.current) {
			clearTimeout(searchTimeout.current);
		}

		searchTimeout.current = setTimeout(() => {
			setSearch(value);
			setPage(1);
		}, 300);
	};

	// Reset page when filters change
	useEffect(() => {
		setPage(1);
	}, [selectedPublisher, selectedTags]);

	// Cleanup timeout
	useEffect(() => {
		return () => {
			if (searchTimeout.current) {
				clearTimeout(searchTimeout.current);
			}
		};
	}, []);

	const handleApprove = async (id) => {
		const confirmed = await confirm({
			title: 'Approve Article',
			description: 'Are you sure you want to approve this article?',
			onConfirm: async () => {
				try {
					const response = await axiosSecure.patch(`/admin/articles/${id}`, {
						status: 'approved',
					});
					if (response.data.success) {
						refetch();
						return response;
					}
					throw new Error(response.data.message);
				} catch (error) {
					throw new Error(error.response?.data?.message || 'Failed to approve article');
				}
			},
		});

		if (confirmed) {
			addToast('Article approved successfully', 'success');
		}
	};

	const handleDecline = async () => {
		try {
			const response = await axiosSecure.patch(`/admin/articles/${declineDialog.id}`, {
				status: 'declined',
				declined_reason: declineReason,
			});

			if (response.data.success) {
				setDeclineDialog({ open: false, id: null });
				setDeclineReason('');
				refetch();
				addToast('Article declined successfully', 'success');
			}
		} catch (error) {
			addToast(error.response?.data?.message || 'Failed to decline article', 'error');
		}
	};

	const handleDelete = async (id) => {
		const confirmed = await confirm({
			title: 'Delete Article',
			description: 'Are you sure you want to delete this article? This action cannot be undone.',
			onConfirm: async () => {
				try {
					const response = await axiosSecure.delete(`/articles/${id}`);
					if (response.data.success) {
						refetch();
						return response;
					}
					throw new Error(response.data.message);
				} catch (error) {
					throw new Error(error.response?.data?.message || 'Failed to delete article');
				}
			},
		});

		if (confirmed) {
			addToast('Article deleted successfully', 'success');
		}
	};

	const handleMakePremium = async (id) => {
		const confirmed = await confirm({
			title: 'Make Premium',
			description: 'Are you sure you want to make this article premium?',
			onConfirm: async () => {
				try {
					const response = await axiosSecure.patch(`/articles/${id}/premium`);
					if (response.data.success) {
						refetch();
						return response;
					}
					throw new Error(response.data.message);
				} catch (error) {
					throw new Error(error.response?.data?.message || 'Failed to make article premium');
				}
			},
		});

		if (confirmed) {
			addToast('Article marked as premium successfully', 'success');
		}
	};

	return (
		<div className='container mx-auto py-6 space-y-4'>
			<h1 className='text-3xl font-bold'>All Articles</h1>
			<div className='max-w-4xl mx-auto space-y-4'>
				<div className='relative'>
					<Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
					<Input
						type='search'
						placeholder='Search articles...'
						className='pl-10'
						onChange={(e) => handleSearch(e.target.value)}
					/>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<Select
						placeholder='Filter by publisher'
						options={publishers.map((pub) => ({
							value: pub._id,
							label: pub.name,
						}))}
						value={selectedPublisher}
						onChange={(value) => {
							setSelectedPublisher(value);
							refetch();
						}}
						isClearable
						className='w-full text-black/70'
					/>

					<Select
						isMulti
						placeholder='Filter by tags'
						options={techTags}
						value={selectedTags}
						onChange={(value) => {
							setSelectedTags(value);
							refetch();
						}}
						className='w-full text-black/75'
					/>

					<UISelect value={limit.toString()} onValueChange={(v) => setLimit(Number(v))}>
						<SelectTrigger className='w-full'>
							<SelectValue placeholder='Select rows per page' />
						</SelectTrigger>
						<SelectContent>
							{[5, 10, 15, 20].map((value) => (
								<SelectItem key={value} value={value.toString()}>
									{value} rows
								</SelectItem>
							))}
						</SelectContent>
					</UISelect>
				</div>
			</div>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Article</TableHead>
							<TableHead>Author</TableHead>
							<TableHead>Publisher</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className='text-right'>Actions</TableHead>
						</TableRow>
					</TableHeader>
					{/* <TableBody>
						{isLoading ? (
							Array.from({ length: limit }).map((_, i) => (
								<TableRow key={i}>
									<TableCell>
										<div className='h-4 w-48 bg-muted animate-pulse rounded' />
									</TableCell>
									<TableCell>
										<div className='flex items-center gap-4'>
											<div className='h-10 w-10 rounded-full bg-muted animate-pulse' />
											<div className='space-y-2'>
												<div className='h-4 w-32 bg-muted animate-pulse rounded' />
												<div className='h-3 w-40 bg-muted animate-pulse rounded' />
												<div className='h-3 w-40 bg-muted animate-pulse rounded' />
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className='h-4 w-32 bg-muted animate-pulse rounded' />
									</TableCell>
									<TableCell>
										<div className='h-6 w-20 bg-muted animate-pulse rounded' />
									</TableCell>
									<TableCell>
										<div className='h-8 w-8 bg-muted animate-pulse rounded ml-auto' />
									</TableCell>
								</TableRow>
							))
						) : articles.length > 0 ? (
							articles?.map((article) => (
								<TableRow key={article._id}>
									<TableCell className='font-medium'>{article.title}</TableCell>
									<TableCell>
										<div className='flex items-center gap-4'>
											<img
												src={article.authorImage || '/placeholder.svg'}
												alt={article.authorName}
												className='h-10 w-10 rounded-full object-cover'
											/>
											<div>
												<div className='font-medium'>{article.authorName.split(' ')[0]}</div>
												<div className='text-sm text-muted-foreground'>{article.authorEmail}</div>
												<div className='text-sm text-muted-foreground'>
													{new Date(article.createdAt).toLocaleDateString()}
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell>{article.publisherName}</TableCell>
									<TableCell>
										<span
											className={cn(
												'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
												article.status === 'pending' && 'bg-yellow-100 text-yellow-800',
												article.status === 'approved' && 'bg-green-100 text-green-800',
												article.status === 'declined' && 'bg-red-100 text-red-800'
											)}>
											{article.status}
										</span>
									</TableCell>
									<TableCell className='text-right'>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant='ghost' size='icon'>
													<MoreHorizontal className='h-4 w-4' />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align='end'>
												{article.status === 'pending' && (
													<>
														<DropdownMenuItem onClick={() => handleApprove(article._id)}>Approve</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() =>
																setDeclineDialog({
																	open: true,
																	id: article._id,
																})
															}>
															Decline
														</DropdownMenuItem>
													</>
												)}
												{(article.status === 'approved' || article.status === 'declined') && (
													<DropdownMenuItem onClick={() => handleDelete(article._id)} className='text-red-600'>
														<Trash2 className='mr-2 h-4 w-4' />
														Delete
													</DropdownMenuItem>
												)}
												{article.status === 'approved' && !article.isPremium && (
													<DropdownMenuItem onClick={() => handleMakePremium(article._id)}>
														<Star className='mr-2 h-4 w-4' />
														Make Premium
													</DropdownMenuItem>
												)}
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell>
									<motion.div
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										className='flex items-center justify-center'>
										<Lottie animationData={noDataAnimation} loop={true} className='w-full max-w-md' />
									</motion.div>
								</TableCell>
							</TableRow>
						)}
					</TableBody> */}
					<TableBody>
						{isLoading ? (
							Array.from({ length: limit }).map((_, i) => (
								<TableRow key={i}>
									<TableCell>
										<div className='h-4 w-48 bg-muted animate-pulse rounded' />
									</TableCell>
									<TableCell>
										<div className='flex items-center gap-4'>
											<div className='h-10 w-10 rounded-full bg-muted animate-pulse' />
											<div className='space-y-2'>
												<div className='h-4 w-32 bg-muted animate-pulse rounded' />
												<div className='h-3 w-40 bg-muted animate-pulse rounded' />
												<div className='h-3 w-40 bg-muted animate-pulse rounded' />
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className='h-4 w-32 bg-muted animate-pulse rounded' />
									</TableCell>
									<TableCell>
										<div className='h-6 w-20 bg-muted animate-pulse rounded' />
									</TableCell>
									<TableCell>
										<div className='h-8 w-8 bg-muted animate-pulse rounded ml-auto' />
									</TableCell>
								</TableRow>
							))
						) : articles.length > 0 ? (
							articles.map((article) => (
								<TableRow key={article._id}>
									<TableCell className='font-medium'>{article.title}</TableCell>
									<TableCell>
										<div className='flex items-center gap-4'>
											<img
												src={article.authorImage || '/placeholder.svg'}
												alt={article.authorName}
												className='h-10 w-10 rounded-full object-cover'
											/>
											<div>
												<div className='font-medium'>{article.authorName.split(' ')[0]}</div>
												<div className='text-sm text-muted-foreground'>{article.authorEmail}</div>
												<div className='text-sm text-muted-foreground'>
													{new Date(article.createdAt).toLocaleDateString()}
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell>{article.publisherName}</TableCell>
									<TableCell>
										<span
											className={cn(
												'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
												article.status === 'pending' && 'bg-yellow-100 text-yellow-800',
												article.status === 'approved' && 'bg-green-100 text-green-800',
												article.status === 'declined' && 'bg-red-100 text-red-800'
											)}>
											{article.status}
										</span>
									</TableCell>
									<TableCell className='text-right'>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant='ghost' size='icon'>
													<MoreHorizontal className='h-4 w-4' />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align='end'>
												{article.status === 'pending' && (
													<>
														<DropdownMenuItem onClick={() => handleApprove(article._id)}>Approve</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() =>
																setDeclineDialog({
																	open: true,
																	id: article._id,
																})
															}>
															Decline
														</DropdownMenuItem>
													</>
												)}
												{(article.status === 'approved' || article.status === 'declined') && (
													<DropdownMenuItem onClick={() => handleDelete(article._id)} className='text-red-600'>
														<Trash2 className='mr-2 h-4 w-4' />
														Delete
													</DropdownMenuItem>
												)}
												{article.status === 'approved' && !article.isPremium && (
													<DropdownMenuItem onClick={() => handleMakePremium(article._id)}>
														<Star className='mr-2 h-4 w-4' />
														Make Premium
													</DropdownMenuItem>
												)}
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						) : (
							<tr>
								<td colSpan={5}>
									<motion.div
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										className='flex items-center justify-center p-6'>
										<Lottie animationData={noDataAnimation} loop={true} className='w-[200px] max-w-md' />
									</motion.div>
								</td>
							</tr>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination Component */}
			{totalPages > 1 && (
				<div className='flex justify-center items-center gap-2 mt-8'>
					<Button
						variant='outline'
						size='icon'
						onClick={() => {
							setPage((p) => Math.max(1, p - 1));
							refetch();
						}}
						disabled={page === 1}>
						<ChevronLeft className='h-4 w-4' />
					</Button>

					<span className='text-sm text-muted-foreground'>
						Page {page} of {totalPages}
					</span>

					<Button
						variant='outline'
						size='icon'
						onClick={() => {
							setPage((p) => Math.min(totalPages, p + 1));
							refetch();
						}}
						disabled={page === totalPages}>
						<ChevronRight className='h-4 w-4' />
					</Button>
				</div>
			)}

			{/* Decline Dialog */}
			<Dialog
				open={declineDialog.open}
				onOpenChange={(open) => {
					setDeclineDialog({ open, id: null });
					setDeclineReason('');
				}}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Decline Article</DialogTitle>
						<DialogDescription>Please provide a reason for declining this article.</DialogDescription>
					</DialogHeader>
					<Textarea
						placeholder='Enter reason for declining...'
						value={declineReason}
						onChange={(e) => setDeclineReason(e.target.value)}
					/>
					<DialogFooter>
						<Button type='button' variant='outline' onClick={() => setDeclineDialog({ open: false, id: null })}>
							Cancel
						</Button>
						<Button type='submit' disabled={!declineReason} onClick={handleDecline}>
							Submit
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<ConfirmationDialog />
		</div>
	);
};

export default AllArticlesDashboard;
