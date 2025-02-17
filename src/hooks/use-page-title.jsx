import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export function usePageTitle(title) {
	useEffect(() => {
		document.title = `${title} | Herald`;
	}, [title]);

	return (
		<Helmet>
			<title>{title} | Herald</title>
			<meta name='description' content={`Herald - ${title}`} />
		</Helmet>
	);
}
