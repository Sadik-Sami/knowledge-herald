import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export function usePageTitle(title) {
	useEffect(() => {
		document.title = `${title} | TechNews`;
	}, [title]);

	return (
		<Helmet>
			<title>{title} | TechNews</title>
			<meta name='description' content={`TechNews - ${title}`} />
		</Helmet>
	);
}
