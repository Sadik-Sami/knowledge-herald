import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Router';
import { ThemeProvider } from './providers/theme-provider';

createRoot(document.getElementById('root')).render(
	<ThemeProvider>
		<RouterProvider router={router} />
	</ThemeProvider>
);
