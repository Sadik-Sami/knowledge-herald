import { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '@/hooks/use-AuthContext';
import RegisterForm from '@/components/auth/registerForm';

const RegisterPage = () => {
	const { user } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();
	const from = location.state?.from?.pathname || '/';

	useEffect(() => {
		if (user) {
			navigate(from, { replace: true });
		}
	}, [user, navigate, from]);

	if (user) {
		return <Navigate to={from} replace />;
	}

	return (
		<div className='min-h-screen grid place-items-center bg-muted/30'>
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='w-full'>
				<RegisterForm />
			</motion.div>
		</div>
	);
};

export default RegisterPage;
