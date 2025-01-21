import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

const getSystemTheme = () => {
	if (typeof window === 'undefined') return 'light';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export function ThemeProvider({ children }) {
	const [theme, setTheme] = useState(() => {
		if (typeof window !== 'undefined') {
			return localStorage.getItem('theme') || 'system';
		}
		return 'system';
	});

	const [resolvedTheme, setResolvedTheme] = useState(() => {
		if (theme === 'system') return getSystemTheme();
		return theme;
	});

	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove('light', 'dark');

		if (theme === 'system') {
			const systemTheme = getSystemTheme();
			root.classList.add(systemTheme);
			setResolvedTheme(systemTheme);
		} else {
			root.classList.add(theme);
			setResolvedTheme(theme);
		}

		localStorage.setItem('theme', theme);
	}, [theme]);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		const handleChange = () => {
			if (theme === 'system') {
				const systemTheme = getSystemTheme();
				const root = window.document.documentElement;
				root.classList.remove('light', 'dark');
				root.classList.add(systemTheme);
				setResolvedTheme(systemTheme);
			}
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [theme]);

	const value = {
		theme,
		resolvedTheme,
		setTheme: (newTheme) => {
			setTheme(newTheme);
		},
	};

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};
