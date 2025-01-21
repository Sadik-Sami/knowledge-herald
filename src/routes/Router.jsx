import AdminLayout from '@/layout/AdminLayout';
import UserLayout from '@/layout/UserLayout';
import Home from '@/pages/Home';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <UserLayout />,
		errorElement: <></>,
		children: [
			{
				path: '/',
				element: <Home />,
			},
			{
				path: '/login',
				element: <LoginPage />,
			},
			{ path: '/register', element: <RegisterPage /> },
		],
	},
	{
		path: '/dashboard',
		element: <AdminLayout />,
		errorElement: <></>,
		children: [],
	},
]);
