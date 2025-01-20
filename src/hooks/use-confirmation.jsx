import { useState } from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const useConfirmation = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [config, setConfig] = useState({
		title: '',
		description: '',
		onConfirm: () => {},
	});

	const [status, setStatus] = useState(null);

	const confirm = ({ title, description, onConfirm }) => {
		return new Promise((resolve) => {
			setConfig({
				title,
				description,
				onConfirm: async () => {
					try {
						const result = await onConfirm();
						if (result?.data?.success) {
							setStatus({
								type: 'success',
								message: result.data.message || 'Operation successful',
							});
						} else {
							throw new Error(result?.data?.message || 'Operation failed');
						}
						resolve(true);
					} catch (error) {
						setStatus({
							type: 'error',
							message: error.message || 'Operation failed',
						});
						resolve(false);
					}
				},
			});
			setIsOpen(true);
		});
	};

	const ConfirmationDialog = () => (
		<>
			<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
				{status ? (
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle className='flex items-center gap-2'>
								{status.type === 'success' ? (
									<CheckCircle2 className='h-5 w-5 text-green-500' />
								) : (
									<XCircle className='h-5 w-5 text-red-500' />
								)}
								{status.type === 'success' ? 'Success' : 'Error'}
							</AlertDialogTitle>
							<AlertDialogDescription>{status.message}</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogAction
								onClick={() => {
									setIsOpen(false);
									setStatus(null);
								}}>
								OK
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				) : (
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle className='flex items-center gap-2'>
								<AlertCircle className='h-5 w-5 text-primary' />
								{config.title}
							</AlertDialogTitle>
							<AlertDialogDescription>{config.description}</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={async () => {
									await config.onConfirm();
								}}>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				)}
			</AlertDialog>
		</>
	);

	return {
		confirm,
		ConfirmationDialog,
	};
};

export default useConfirmation;
