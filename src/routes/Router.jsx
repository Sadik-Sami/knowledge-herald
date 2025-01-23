import AdminLayout from '@/layout/AdminLayout';
import UserLayout from '@/layout/UserLayout';
import AddArticle from '@/pages/AddArticle';
import AddPublisher from '@/pages/AddPublisher';
import AllArticles from '@/pages/AllArticles';
import Home from '@/pages/Home';
import LoginPage from '@/pages/LoginPage';
import PaymentSuccessPage from '@/pages/PaymentSuccessPage';
import RegisterPage from '@/pages/RegisterPage';
import SubscriptionPage from '@/pages/SubsciptionPage';
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
			{
				path: '/subscription',
				element: <SubscriptionPage />,
			},
			{
				path: '/payment/success',
				element: <PaymentSuccessPage />,
			},
			{
				path: '/add-article',
				element: <AddArticle />,
			},
			{
				path: '/articles',
				element: <AllArticles />,
			},
		],
	},
	{
		path: '/dashboard',
		element: <AdminLayout />,
		errorElement: <></>,
		children: [
			{
				path: 'add-publisher',
				element: <AddPublisher />,
			},
		],
	},
]);
