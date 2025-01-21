import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Router';
import { ThemeProvider } from './providers/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './hooks/use-toast';
import AuthProvider from './context/AuthProvider';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			retry: 1,
		},
	},
});
createRoot(document.getElementById('root')).render(
	<QueryClientProvider client={queryClient}>
		<AuthProvider>
			<ThemeProvider>
				<ToastProvider>
					<RouterProvider router={router} />
				</ToastProvider>
			</ThemeProvider>
		</AuthProvider>
	</QueryClientProvider>
);
