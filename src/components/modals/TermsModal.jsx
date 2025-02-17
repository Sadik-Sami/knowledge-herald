import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const TermsModal = ({ children }) => {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Terms of Service</DialogTitle>
					<DialogDescription>Last updated: February 2024</DialogDescription>
				</DialogHeader>
				<ScrollArea className='max-h-[60vh] pr-4'>
					<div className='space-y-6 text-sm'>
						<section>
							<h3 className='font-semibold mb-2'>1. Acceptance of Terms</h3>
							<p className='text-muted-foreground'>
								By accessing and using Knowledge Herald, you accept and agree to be bound by the terms and provision of
								this agreement.
							</p>
						</section>

						<section>
							<h3 className='font-semibold mb-2'>2. User Accounts</h3>
							<p className='text-muted-foreground'>
								To access certain features of the Service, you must register for an account. You agree to provide
								accurate, current, and complete information during the registration process and to update such
								information to keep it accurate, current, and complete.
							</p>
						</section>

						{/* Additional sections remain the same */}
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};

export default TermsModal;
