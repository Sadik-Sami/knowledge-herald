import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Loader2 } from 'lucide-react';
import Lottie from 'lottie-react';
import loginAnimation from '@/assets/login-animation.json';
import useAuth from '@/hooks/use-AuthContext';
import { useToast } from '@/hooks/use-toast';

const LoginForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const { signIn, googleLogin, loading } = useAuth();
	const { addToast } = useToast();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (data) => {
		try {
			await signIn(data.email, data.password);
			addToast('Signed in successfully!', 'success');
		} catch (error) {
			addToast('Invalid email or password', 'error');
		}
	};

	const handleGoogleLogin = async () => {
		try {
			await googleLogin();
			addToast('Signed in with Google successfully!', 'success');
		} catch (error) {
			addToast('Could not sign in with Google', 'error');
		}
	};

	return (
		<div className='grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto p-4'>
			<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className='hidden md:block'>
				<Lottie animationData={loginAnimation} loop={true} className='w-full max-w-md' />
			</motion.div>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-6'>
				<div className='space-y-2 text-center'>
					<h1 className='text-3xl font-bold'>Welcome Back</h1>
					<p className='text-muted-foreground'>Enter your email to sign in to your account</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
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
					</div>

					<Button type='submit' className='w-full' disabled={loading}>
						{loading ? (
							<>
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								Signing in...
							</>
						) : (
							'Sign in'
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

export default LoginForm;
