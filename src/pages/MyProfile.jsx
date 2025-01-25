import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Upload, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/use-AuthContext';
import useAxiosSecure from '@/hooks/use-AxiosSecure';
import useImageUpload from '@/hooks/use-image-upload';
import useSubscription from '@/hooks/use-Subscription';

const MyProfile = () => {
	const { user, updateUserProfile } = useAuth();
	const { addToast } = useToast();
	const axiosSecure = useAxiosSecure();
	const { uploadImage, uploading } = useImageUpload();
	const [loading, setLoading] = useState(false);
	const { hasSubscription, subscriptionEnd } = useSubscription();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: user?.displayName || '',
			email: user?.email || '',
		},
	});

	const onSubmit = async (data) => {
		try {
			setLoading(true);

			// Upload new image if provided
			let photoURL = user?.photoURL;
			if (data.photo?.[0]) {
				photoURL = await uploadImage(data.photo[0]);
			}

			// Update Firebase profile
			await updateUserProfile(data.name, photoURL);

			// Update MongoDB user
			const { data: response } = await axiosSecure.patch('/users/profile', {
				name: data.name,
				photo: photoURL,
			});

			if (response.success) {
				addToast('Profile updated successfully!', 'success');
			}
		} catch (error) {
			addToast(error.message || 'Failed to update profile', 'error');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-background py-12'>
			<div className='container mx-auto px-4 md:px-6'>
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
					<Card className='max-w-2xl mx-auto'>
						<CardHeader>
							<CardTitle>My Profile</CardTitle>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
								{/* Profile Picture */}
								<div className='flex flex-col items-center space-y-4'>
									<Avatar className='h-24 w-24'>
										<AvatarImage src={user?.photoURL} alt={user?.displayName} />
										<AvatarFallback>
											<User className='h-12 w-12' />
										</AvatarFallback>
									</Avatar>
									<div>
										<Label htmlFor='photo' className='cursor-pointer'>
											<div className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'>
												<Upload className='h-4 w-4' />
												Change Profile Picture
											</div>
										</Label>
										<Input id='photo' type='file' accept='image/*' className='hidden' {...register('photo')} />
									</div>
								</div>

								<Separator />

								{/* Name */}
								<div className='space-y-2'>
									<Label htmlFor='name'>Full Name</Label>
									<Input id='name' {...register('name', { required: 'Name is required' })} />
									{errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
								</div>

								{/* Email */}
								<div className='space-y-2'>
									<Label htmlFor='email'>Email</Label>
									<Input id='email' disabled value={user?.email} />
									<p className='text-sm text-muted-foreground'>Email cannot be changed</p>
								</div>

								{/* Subscription Status */}
								<div className='p-4 bg-muted rounded-lg'>
									<h3 className='font-semibold mb-2'>Subscription Status</h3>
									<p className='text-sm text-muted-foreground'>
										{hasSubscription ? (
											<>Your subscription is active until {new Date(subscriptionEnd).toLocaleDateString()}</>
										) : (
											"You don't have an active subscription"
										)}
									</p>
								</div>

								<Button type='submit' className='w-full' disabled={loading || uploading}>
									{loading || uploading ? (
										<>
											<Loader2 className='mr-2 h-4 w-4 animate-spin' />
											Updating...
										</>
									) : (
										'Update Profile'
									)}
								</Button>
							</form>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
};

export default MyProfile;
