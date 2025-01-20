import UserLayout from '@/layout/UserLayout';
import Home from '@/pages/Home';
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
		],
	},
	// {
	// 	path: '/dashboard',
	// 	element: <></>,
	// 	errorElement: <></>,
	// 	children: [
	// 		{
	// 			path: '/dashboard',
	// 			element: <></>,
	// 		},
	// 	],
	// },
]);
