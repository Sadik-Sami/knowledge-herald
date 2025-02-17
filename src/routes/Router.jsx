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
import PrivateRoutes from './PrivateRoutes';
import AdminRoutes from './AdminRoutes';
import MyProfile from '@/pages/MyProfile';
import AboutUs from '@/pages/AboutUs';
import Error from '@/pages/Error';
import ContactUs from '../pages/ContactUs';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <UserLayout />,
		errorElement: <Error />,
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
				path: '/profile',
				element: <MyProfile />,
			},
			{
				path: '/contact',
				element: <ContactUs />,
			},
			{
				path: '/about',
				element: <AboutUs />,
			},
			{
				path: '/subscription',
				element: (
					<PrivateRoutes>
						<SubscriptionPage />
					</PrivateRoutes>
				),
			},
			{
				path: '/payment/success',
				element: <PaymentSuccessPage />,
			},
			{
				path: '/add-article',
				element: (
					<PrivateRoutes>
						<AddArticle />
					</PrivateRoutes>
				),
			},
			{
				path: '/articles',
				element: <AllArticles />,
			},
			{
				path: '/articles/:id',
				element: (
					<PrivateRoutes>
						<ArticleDetails />
					</PrivateRoutes>
				),
			},
			{
				path: '/my-articles',
				element: (
					<PrivateRoutes>
						<MyArticles />
					</PrivateRoutes>
				),
			},
			{
				path: '/edit-article/:id',
				element: <EditArticle />,
			},
			{
				path: '/premium',
				element: (
					<PrivateRoutes>
						<PremiumArticles />
					</PrivateRoutes>
				),
			},
		],
	},
	{
		path: '/dashboard',
		element: <AdminLayout />,
		errorElement: <Error />,
		children: [
			{
				path: '/dashboard',
				element: (
					<AdminRoutes>
						<Statistics />
					</AdminRoutes>
				),
			},
			{
				path: '/dashboard/users',
				element: (
					<AdminRoutes>
						<AllUsers />
					</AdminRoutes>
				),
			},
			{
				path: '/dashboard/articles',
				element: (
					<AdminRoutes>
						<AllArticlesDashboard />
					</AdminRoutes>
				),
			},
			{
				path: '/dashboard/add-publisher',
				element: (
					<AdminRoutes>
						<AddPublisher />
					</AdminRoutes>
				),
			},
		],
	},
]);
