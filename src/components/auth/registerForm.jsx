import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff, FiUser } from 'react-icons/fi';
import Lottie from 'lottie-react';
import registerAnimation from '@/assets/register-animation.json';
import useImageUpload from '@/hooks/use-image-upload';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import useAuth from '@/hooks/use-AuthContext';
import useAxiosPublic from '@/hooks/use-AxiosPublic';

const PasswordStrengthBar = ({ password = '' }) => {
	const getStrength = () => {
		let score = 0;
		if (password.length >= 6) score += 25;
		if (/[A-Z]/.test(password)) score += 25;
		if (/[0-9]/.test(password)) score += 25;
		if (/[^A-Za-z0-9]/.test(password)) score += 25;
		return score;
	};

	const strength = getStrength();

	return (
		<div className='space-y-2'>
			<div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
				<motion.div
					className={`h-full transition-all ${
						strength <= 25
							? 'bg-red-500'
							: strength <= 50
							? 'bg-orange-500'
							: strength <= 75
							? 'bg-yellow-500'
							: 'bg-green-500'
					}`}
					initial={{ width: 0 }}
					animate={{ width: `${strength}%` }}
				/>
			</div>
		</div>
	);
};

const RegisterForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [avatarPreview, setAvatarPreview] = useState(null);
	const fileInputRef = useRef(null);

	const { signUp, googleLogin, updateUserProfile, loading, user } = useAuth();
	const { uploadImage, uploading } = useImageUpload();
	const { addToast } = useToast();
	const axiosPublic = useAxiosPublic();
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		setError,
		setValue,
	} = useForm({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
			avatar: undefined, // Changed from null to undefined
		},
	});

	const password = watch('password', '');

	const handleImageClick = () => {
		fileInputRef.current?.click();
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 2000000) {
				addToast('Image size should be less than 2MB', 'error');
				return;
			}
			const reader = new FileReader();
			reader.onloadend = () => {
				setAvatarPreview(reader.result); // Update preview
			};
			reader.readAsDataURL(file);

			// Update the form's state for the avatar field
			setValue('avatar', file, { shouldValidate: true });
		}
	};

	const onSubmit = async (data) => {
		try {
			if (data.password !== data.confirmPassword) {
				setError('confirmPassword', {
					type: 'manual',
					message: "Passwords don't match",
				});
				return;
			}

			let imageUrl = null;
			if (data.avatar) {
				imageUrl = await uploadImage(data.avatar);
			}
			const result = await signUp(data.email, data.password);
			if (result.user) {
				await updateUserProfile(data.name, imageUrl);
				const userInfo = {
					name: data.name,
					email: data.email,
					photo: imageUrl,
				};
				const response = await axiosPublic.post('/users', userInfo);
				if (!response.data.success) {
					console.error('failed to add user', response.data?.message);
				} else {
					console.error('User added successfully', response.data?.message);
				}
			}
			addToast(`Welcome to KnowledgeHerald ${user ? user.displayName : ''}`, 'success');
		} catch (error) {
			addToast(error.message, 'error');
		}
	};

	const handleGoogleLogin = async () => {
		try {
			const result = await googleLogin();
			const { displayName, email, photoURL } = result.user;

			const userInfo = {
				name: displayName,
				email: email,
				photo: photoURL,
			};

			const response = await axiosPublic.post('/users', userInfo);
			if (response.data.success) {
				console.log(response.data.message);
			} else {
				return console.log(response.data.message);
			}
			addToast(`Welcome to KnowledgeHerald ${user ? user.displayName : ''}`, 'success');
		} catch (error) {
			addToast(error.message, 'error');
		}
	};

	return (
		<div className='grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto p-4'>
			<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className='hidden md:block'>
				<Lottie animationData={registerAnimation} loop={true} className='w-full max-w-md' />
			</motion.div>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-6'>
				<div className='space-y-2 text-center'>
					<h1 className='text-3xl font-bold'>Create an Account</h1>
					<p className='text-muted-foreground'>Enter your details below to create your account</p>
				</div>

				<div
					onClick={handleImageClick}
					className='mx-auto w-24 h-24 rounded-full border-2 border-dashed border-gray-300 hover:border-primary cursor-pointer flex items-center justify-center overflow-hidden'>
					{avatarPreview ? (
						<img
							src={avatarPreview || '/placeholder.svg'}
							alt='Avatar preview'
							className='w-full h-full object-cover'
						/>
					) : (
						<FiUser className='w-12 h-12 text-gray-400' />
					)}
					<input
						type='file'
						accept='image/*'
						className='hidden'
						ref={(e) => {
							fileInputRef.current = e;
							register('avatar').ref(e); // Ensure react-hook-form manages this input
						}}
						onChange={handleImageChange} // Attach your custom handler
					/>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					<div className='space-y-2'>
						<Input placeholder='Full Name' {...register('name', { required: 'Name is required' })} />
						{errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
					</div>

					<div className='space-y-2'>
						<Input
							type='email'
							placeholder='Email'
							{...register('email', {
								required: 'Email is required',
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
									message: 'Invalid email address',
								},
							})}
						/>
						{errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
					</div>

					<div className='space-y-2'>
						<div className='relative'>
							<Input
								type={showPassword ? 'text' : 'password'}
								placeholder='Password'
								{...register('password', {
									required: 'Password is required',
									minLength: {
										value: 6,
										message: 'Password must be at least 6 characters',
									},
									pattern: {
										value: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/,
										message: 'Password must contain uppercase, number, and special character',
									},
								})}
							/>
							<button
								type='button'
								onClick={() => setShowPassword(!showPassword)}
								className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'>
								{showPassword ? <FiEyeOff className='w-4 h-4' /> : <FiEye className='w-4 h-4' />}
							</button>
						</div>
						{errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}
						<PasswordStrengthBar password={password} />
					</div>

					<div className='space-y-2'>
						<Input
							type={showPassword ? 'text' : 'password'}
							placeholder='Confirm Password'
							{...register('confirmPassword', {
								required: 'Please confirm your password',
								validate: (value) => value === password || "Passwords don't match",
							})}
						/>
						{errors.confirmPassword && <p className='text-sm text-red-500'>{errors.confirmPassword.message}</p>}
					</div>

					<Button type='submit' className='w-full' disabled={loading || uploading}>
						{loading || uploading ? (
							<>
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								Creating account...
							</>
						) : (
							'Create account'
						)}
					</Button>
				</form>

				<div className='relative'>
					<div className='absolute inset-0 flex items-center'>
						<div className='w-full border-t'></div>
					</div>
					<div className='relative flex justify-center text-xs uppercase'>
						<span className='bg-background px-2 text-muted-foreground'>Or continue with</span>
					</div>
				</div>

				<Button type='button' variant='outline' className='w-full' onClick={handleGoogleLogin} disabled={loading}>
					<FcGoogle className='mr-2 h-4 w-4' />
					Google
				</Button>
			</motion.div>
		</div>
	);
};

export default RegisterForm;
