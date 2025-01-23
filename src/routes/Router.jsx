import AdminLayout from '@/layout/AdminLayout';
import UserLayout from '@/layout/UserLayout';
import AddArticle from '@/pages/AddArticle';
import AddPublisher from '@/pages/Dashboard/AddPublisher';
import AllArticles from '@/pages/AllArticles';
import ArticleDetails from '@/pages/ArticleDetails';
import Home from '@/pages/Home';
import LoginPage from '@/pages/LoginPage';
import MyArticles from '@/pages/MyArticles';
import PaymentSuccessPage from '@/pages/PaymentSuccessPage';
import RegisterPage from '@/pages/RegisterPage';
import SubscriptionPage from '@/pages/SubsciptionPage';
import { createBrowserRouter } from 'react-router-dom';
import EditArticle from '@/pages/EditArticle';

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
			{
				path: '/articles/:id',
				element: <ArticleDetails />,
			},
			{
				path: '/my-articles',
				element: <MyArticles />,
			},
			{
				path: '/edit-article/:id',
				element: <EditArticle />,
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
