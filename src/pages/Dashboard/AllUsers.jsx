import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import useConfirmation from '@/hooks/use-confirmation';
import { useToast } from '@/hooks/use-toast';
import useAxiosSecure from '@/hooks/use-AxiosSecure';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AllUsers = () => {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const { confirm, ConfirmationDialog } = useConfirmation();
	const { addToast } = useToast();
	const axiosSecure = useAxiosSecure();

	const {
		data: users = { data: [], total: 0 },
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ['users', page, limit],
		queryFn: async () => {
			const { data } = await axiosSecure.get(`/users?page=${page}&limit=${limit}`);
			return data;
		},
		keepPreviousData: true,
	});
	const totalPages = Math.ceil(users.total / limit);
	const handleMakeAdmin = async (userId) => {
		const confirmed = await confirm({
			title: 'Make Admin',
			description: 'Are you sure you want to make this user an admin?',
			onConfirm: async () => {
				try {
					const response = await axiosSecure.patch(`/make-admin/${userId}`);
					if (response.data.success) {
						refetch();
						return response;
					}
					throw new Error(response.data.message);
				} catch (error) {
					throw new Error(error.response?.data?.message || 'Failed to make admin');
				}
			},
		});

		if (confirmed) {
			addToast('User has been made admin successfully', 'success');
		}
	};
	return (
		<div className='container mx-auto py-6 space-y-4'>
			<div className='flex items-center justify-between'>
				<h1 className='text-3xl font-bold'>All Users</h1>
				<Select value={limit.toString()} onValueChange={(v) => setLimit(Number(v))}>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='Select rows per page' />
					</SelectTrigger>
					<SelectContent>
						{[5, 10, 15, 20].map((value) => (
							<SelectItem key={value} value={value.toString()}>
								{value} rows
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>#</TableHead>
							<TableHead>User</TableHead>
							<TableHead>Details</TableHead>
							<TableHead>Role</TableHead>
							<TableHead className='text-right'>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading
							? Array.from({ length: limit }).map((_, i) => (
									<TableRow key={i}>
										<TableCell>
											<div className='flex items-center gap-4'>
												<div className='h-10 w-10 rounded-full bg-muted animate-pulse' />
												<div className='h-4 w-32 bg-muted animate-pulse rounded' />
											</div>
										</TableCell>
										<TableCell>
											<div className='h-4 w-48 bg-muted animate-pulse rounded' />
										</TableCell>
										<TableCell>
											<div className='h-4 w-20 bg-muted animate-pulse rounded' />
										</TableCell>
										<TableCell>
											<div className='h-9 w-24 bg-muted animate-pulse rounded ml-auto' />
										</TableCell>
									</TableRow>
							  ))
							: users.data?.map((user, index) => (
									<TableRow key={user._id}>
										<TableCell>{index + 1}</TableCell>
										<TableCell>
											<img
												src={user.photo || '/placeholder.svg'}
												alt={user.name || 'Anon'}
												className='h-10 w-10 rounded-full object-cover'
											/>
										</TableCell>
										<TableCell>
											<div className='flex flex-col'>
												<span className='font-medium'>{user.name}</span>
												<span className='font-medium'>{user.email}</span>
											</div>
										</TableCell>
										<TableCell>
											{user.role === 'admin' ? <span className='text-primary font-medium'>Admin</span> : 'User'}
										</TableCell>
										<TableCell className='text-right'>
											{user.role !== 'admin' && (
												<Button variant='outline' size='sm' onClick={() => handleMakeAdmin(user._id)}>
													Make Admin
												</Button>
											)}
											{user.role === 'admin' && (
												<Button variant='outline' disabled size='sm' onClick={() => handleMakeAdmin(user._id)}>
													Make Admin
												</Button>
											)}
										</TableCell>
									</TableRow>
							  ))}
					</TableBody>
				</Table>
			</div>

			<div>
				{totalPages > 1 && (
					<div className='flex justify-center items-center gap-2 mt-8'>
						<Button
							variant='outline'
							size='icon'
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={page === 1}>
							<ChevronLeft className='h-4 w-4' />
						</Button>

						<span className='text-sm text-muted-foreground'>
							Page {page} of {totalPages}
						</span>

						<Button
							variant='outline'
							size='icon'
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={page === totalPages}>
							<ChevronRight className='h-4 w-4' />
						</Button>
					</div>
				)}
			</div>

			<ConfirmationDialog />
		</div>
	);
};

export default AllUsers;
