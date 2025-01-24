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
import PremiumArticles from '@/pages/PremiumArticles';
import AllUsers from '@/pages/Dashboard/AllUsers';
import AllArticlesDashboard from '@/pages/Dashboard/AllArticlesDashboard';
import Statistics from '@/pages/Dashboard/Statistics';

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
			{
				path: '/premium',
				element: <PremiumArticles />,
			},
		],
	},
	{
		path: '/dashboard',
		element: <AdminLayout />,
		errorElement: <></>,
		children: [
			{
				path: '/dashboard',
				element: <Statistics />,
			},
			{
				path: '/dashboard/users',
				element: <AllUsers />,
			},
			{
				path: '/dashboard/articles',
				element: <AllArticlesDashboard />,
			},
			{
				path: '/dashboard/add-publisher',
				element: <AddPublisher />,
			},
		],
	},
]);
